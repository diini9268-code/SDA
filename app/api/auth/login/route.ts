import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth/auth-service";
import {
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/cookies";
import {
  clearFailedLogins,
  isLoginRateLimited,
  registerFailedLogin,
} from "@/lib/auth/rate-limit";
import { createSessionToken } from "@/lib/auth/session";
import { prismaAuthUserRepository } from "@/lib/auth/user-repository";

function getRateLimitIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.trim() || realIp?.trim() || "unknown-login-client";
}

export async function POST(request: Request) {
  const rateLimitIdentifier = getRateLimitIdentifier(request);

  if (isLoginRateLimited(rateLimitIdentifier)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    registerFailedLogin(rateLimitIdentifier);
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const result = await authenticateAdmin(body, prismaAuthUserRepository);

  if (!result.ok) {
    registerFailedLogin(rateLimitIdentifier);
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  const token = createSessionToken({
    sub: result.user.id,
    email: result.user.email,
    fullName: result.user.fullName,
    role: result.user.role,
  });
  const response = NextResponse.json({ user: result.user });

  clearFailedLogins(rateLimitIdentifier);
  response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

  return response;
}
