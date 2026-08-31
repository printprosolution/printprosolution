import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * Single hard-coded admin account, backed by env vars so the real
 * credentials never live in source control.
 *
 * Session strategy is JWT with a 30-day lifetime, so once the admin logs
 * in they stay logged in (cookie persists across browser restarts) and
 * are never asked for the password again until it naturally expires or
 * they hit "Logout".
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
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
  if (!credentials?.username || !credentials?.password) {
    return null;
  }

  const validUsername = 'asadmughal8626';
  const validPassword = '031234567890*@';

  if (credentials.username !== validUsername) {
    return null;
  }

  if (credentials.password !== validPassword) {
    return null;
  }

  // Minimal user object stored in the JWT/session.
  return { id: "admin", name: validUsername, email: "admin@printprolahore.com" };
},

    
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
