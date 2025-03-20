import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email;", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findFirst({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          return null;
        }

        // Tikrinti, ar vartotojas užblokuotas
        if (existingUser.isBlocked) {
          throw new Error(
            "Your account has been blocked. Please contact an administrator."
          );
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          isAdmin: existingUser.isAdmin,
          isBlocked: existingUser.isBlocked,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.isBlocked = user.isBlocked;
      }

      // Tikrinti, ar vartotojo blokavimo būklė nepasikeitė
      try {
        const updatedUser = await db.user.findUnique({
          where: { id: parseInt(token.id) },
          select: { isBlocked: true },
        });

        if (updatedUser) {
          token.isBlocked = updatedUser.isBlocked;
        }
      } catch (error) {
        console.error("Error checking user blocked status:", error);
      }

      return token;
    },

    async session({ session, token }) {
      try {
        const user = await db.user.findUnique({
          where: { id: parseInt(token.id) },
          select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
            isBlocked: true,
          },
        });

        if (user) {
          session.user = {
            ...session.user,
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked,
          };
        } else {
          session.user = {
            ...session.user,
            id: token.id,
            name: token.name,
            email: token.email,
            isAdmin: token.isAdmin,
            isBlocked: token.isBlocked || false,
          };
        }
      } catch (error) {
        console.error("Error refreshing session data:", error);

        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          isAdmin: token.isAdmin,
          isBlocked: token.isBlocked || false,
        };
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
