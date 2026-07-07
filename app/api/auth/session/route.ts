import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getExpiredSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/cookies";
import { verifySessionToken } from "@/lib/auth/session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const session = verifySessionToken(token);

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
