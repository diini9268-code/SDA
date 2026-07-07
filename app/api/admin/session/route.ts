import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    user: {
      id: session.sub,
      email: session.email,
      fullName: session.fullName,
      role: session.role,
    },
  });
}
