import { PrismaClient } from '../node_modules/@prisma/client';

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}