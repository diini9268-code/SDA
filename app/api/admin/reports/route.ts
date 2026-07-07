import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaReportsRepository } from "@/lib/reports/report-repository";
import { getReportsSnapshot } from "@/lib/reports/report-service";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const snapshot = await getReportsSnapshot(prismaReportsRepository);

  return NextResponse.json({ snapshot });
}
