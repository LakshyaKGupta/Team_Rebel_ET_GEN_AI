import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | null = null;

const getPrismaClient = (): PrismaClient => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  }
  return prismaInstance;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return getPrismaClient()[prop as keyof PrismaClient];
  },
});

export const getPrisma = getPrismaClient;
