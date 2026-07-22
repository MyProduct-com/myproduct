import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// `new PrismaClient()` throws synchronously (at module-import time) if
// DATABASE_URL is missing — which would crash every route that imports this
// module, before any of their own try/catch resilience fallbacks get a
// chance to run. Deferring the failure to first actual use lets those
// existing fallbacks (demo data) handle it instead of a hard server crash.
function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient();
  } catch (err) {
    console.error("[prisma] Failed to initialize PrismaClient — DATABASE_URL is likely missing or invalid:", err);
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error("Database is not configured (DATABASE_URL missing or invalid).");
      },
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
