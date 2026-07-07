import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const applications = await prismaMembershipRepository.listAll();

  return NextResponse.json({ applications });
}
