import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for database access.");
  }

  return databaseUrl;
}

export function getDatabasePoolConfig() {
  return {
    connectionString: getDatabaseUrl(),
    // Vercel creates multiple isolated runtimes. Keeping one connection per
    // runtime prevents a single request from exhausting Supabase's session
    // pool while Prisma queues concurrent queries safely.
    max: 1,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    maxLifetimeSeconds: 60,
    allowExitOnIdle: true,
  };
}

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(getDatabasePoolConfig());

    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}
