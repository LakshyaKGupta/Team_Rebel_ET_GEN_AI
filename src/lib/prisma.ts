import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | null = null;

const getPrismaClient = (): PrismaClient => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || "postgresql://localhost/test",
        },
      },
    });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  }
  return prismaInstance;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    try {
      return getPrismaClient()[prop as keyof PrismaClient];
    } catch (error) {
      console.error("Prisma error:", error);
      return undefined;
    }
  },
});

export const getPrisma = getPrismaClient;

export const isDatabaseConnected = (): boolean => {
  return !!process.env.DATABASE_URL;
};
