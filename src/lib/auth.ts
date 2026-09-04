import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Two separate login flows share this one NextAuth config:
 *
 * 1. "admin-login" — the single hard-coded admin account (unchanged).
 * 2. "user-login"  — public accounts stored in the User table, gated by
 *    email verification and subject to Ban / Force Logout from the admin
 *    "Online Users" panel.
 *
 * Session strategy is JWT with a 30-day lifetime. For regular users, the
 * jwt/session callbacks stamp an `issuedAt` timestamp so that a Ban or
 * Force Logout (which sets User.forceLogoutAt in the database) can be
 * detected and enforced even though JWTs can't be revoked directly — see
 * heartbeatAndCheckStatus() in src/actions/auth-user.ts.
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const validUsername = "asadmughal8626";
        const validPassword = "031234567890*@";

        if (credentials.username !== validUsername) return null;
        if (credentials.password !== validPassword) return null;

        return { id: "admin", name: validUsername, email: "admin@printprolahore.com" };
      },
    }),
    CredentialsProvider({
      id: "user-login",
      name: "User Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("No account found with this email.");
        }

        const passwordMatches = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!passwordMatches) {
          throw new Error("Incorrect password.");
        }

        if (user.banned) {
          throw new Error("Your account has been banned. Contact support for help.");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email first.");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        });

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        // First sign-in: stamp which provider this session came from and
        // record the issue time so Force Logout / Ban can invalidate it.
        token.role = account.provider === "admin-login" ? "admin" : "user";
        token.issuedAt = Date.now();
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id = token.userId as string;
      }
      (session as unknown as { issuedAt?: number }).issuedAt = token.issuedAt as number;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
