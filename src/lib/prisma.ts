import { PrismaClient } from "@prisma/client";

/**
 * A single PrismaClient per process. Next.js clears the module registry on
 * every hot reload in development, so without the global cache each edit would
 * open a new connection pool against MongoDB.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
