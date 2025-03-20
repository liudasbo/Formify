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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
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
          id: existingUser.id.toString(),
          email: existingUser.email,
          name: existingUser.name,
          isAdmin: existingUser.isAdmin,
          isBlocked: existingUser.isBlocked,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked,
        };
      }

      // On token refresh, only check for blocked status if this is a session update
      if (trigger === "update" && token && token.id) {
        try {
          const userId = parseInt(token.id);
          if (!isNaN(userId)) {
            const updatedUser = await db.user.findUnique({
              where: { id: userId },
              select: { isBlocked: true, isAdmin: true },
            });

            if (updatedUser) {
              token.isBlocked = updatedUser.isBlocked;
              token.isAdmin = updatedUser.isAdmin;
            }
          }
        } catch (error) {
          console.error("Error in JWT callback:", error);
          // Continue with current token state on error
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && token.id) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name || session.user.name,
          email: token.email || session.user.email,
          isAdmin: token.isAdmin || false,
          isBlocked: token.isBlocked || false,
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
