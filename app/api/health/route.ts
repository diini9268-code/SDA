import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

type HealthStatus = "ok" | "error";

function healthResponse(status: HealthStatus, database: HealthStatus) {
  return NextResponse.json(
    {
      status,
      checks: {
        database,
      },
      timestamp: new Date().toISOString(),
    },
    {
      status: status === "ok" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function GET() {
  try {
    await getPrismaClient().$queryRaw`SELECT 1`;

    return healthResponse("ok", "ok");
  } catch {
    return healthResponse("error", "error");
  }
}
