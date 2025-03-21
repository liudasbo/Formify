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
    maxAge: 30 * 24 * 60 * 60,
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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.isBlocked = user.isBlocked;
      }

      if (trigger === "update" && token?.id) {
        try {
          const userId =
            typeof token.id === "string" ? parseInt(token.id) : token.id;

          const updatedUser = await db.user.findUnique({
            where: { id: userId },
            select: { isBlocked: true, isAdmin: true },
          });

          if (updatedUser) {
            token.isBlocked = updatedUser.isBlocked;
            token.isAdmin = updatedUser.isAdmin;
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        const userId =
          typeof token.id === "string" ? parseInt(token.id) : token.id;

        session.user = {
          ...session.user,
          id: userId,
          name: token.name,
          email: token.email,
          isAdmin: token.isAdmin,
          isBlocked: token.isBlocked,
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
