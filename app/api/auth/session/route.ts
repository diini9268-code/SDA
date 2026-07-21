import { NextResponse } from "next/server";
import {
  getExpiredSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/cookies";
import { requireAuthenticatedSession } from "@/lib/auth/require-admin";

export async function GET() {
  const session = await requireAuthenticatedSession();

  if (!session) {
    const response = NextResponse.json({ user: null }, { status: 401 });
    response.cookies.set(
      SESSION_COOKIE_NAME,
      "",
      getExpiredSessionCookieOptions(),
    );
    return response;
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
