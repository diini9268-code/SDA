import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/route";

const prisma = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  getPrismaClient: () => prisma,
}));

describe("health route", () => {
  it("returns ok when the database is reachable", async () => {
    prisma.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body).toMatchObject({
      status: "ok",
      checks: {
        database: "ok",
      },
    });
  });

  it("returns a safe error when the database check fails", async () => {
    prisma.$queryRaw.mockRejectedValue(new Error("database secret detail"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toMatchObject({
      status: "error",
      checks: {
        database: "error",
      },
    });
    expect(JSON.stringify(body)).not.toContain("database secret detail");
  });
});
