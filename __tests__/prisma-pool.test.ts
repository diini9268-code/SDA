import { afterEach, describe, expect, it, vi } from "vitest";
import { getDatabasePoolConfig } from "@/lib/db/prisma";

describe("Prisma PostgreSQL pool configuration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("limits each serverless runtime to one database connection", () => {
    vi.stubEnv(
      "DATABASE_URL",
      "postgresql://user:password@example.com:5432/database",
    );

    expect(getDatabasePoolConfig()).toEqual({
      connectionString:
        "postgresql://user:password@example.com:5432/database",
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      maxLifetimeSeconds: 60,
      allowExitOnIdle: true,
    });
  });

  it("still requires DATABASE_URL", () => {
    vi.stubEnv("DATABASE_URL", "");

    expect(() => getDatabasePoolConfig()).toThrow(
      "DATABASE_URL is required for database access.",
    );
  });
});
