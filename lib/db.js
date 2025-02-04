import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis.__prisma || {};

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = { prisma };
}

export const db = prisma;
