 import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  session: { 
    strategy: "jwt", 
    maxAge: 60 * 60 * 24 * 30 // 30 days
  },
  pages: { 
    signIn: "/admin", 
    error: "/admin" 
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        const validUsername = 'asadmughal8626';
        const validPassword = '031234567890*@';

        if (credentials.username !== validUsername) return null;
        if (credentials.password !== validPassword) return null;

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
      if (session.user) (session.user as any).role = token.role; 
      return session; 
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
