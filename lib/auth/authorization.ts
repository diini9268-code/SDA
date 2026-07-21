import { SESSION_COOKIE_NAME } from "@/lib/auth/cookies";
import type { AdminSession } from "@/lib/auth/session";
import { verifySessionToken } from "@/lib/auth/session";

export type AuthorizationResult =
  | {
      authorized: true;
      session: AdminSession;
    }
  | {
      authorized: false;
      reason: "missing_session" | "invalid_session" | "insufficient_role";
    };

function parseCookieHeader(cookieHeader: string | null): Map<string, string> {
  const cookies = new Map<string, string>();

  if (!cookieHeader) {
    return cookies;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    const name = rawName?.trim();

    if (!name) {
      continue;
    }

    cookies.set(name, decodeURIComponent(rawValue.join("=")));
  }

  return cookies;
}

export function authorizeAdminRequest(
  cookieHeader: string | null,
): AuthorizationResult {
  const token = parseCookieHeader(cookieHeader).get(SESSION_COOKIE_NAME);

  if (!token) {
    return {
      authorized: false,
      reason: "missing_session",
    };
  }

  const session = verifySessionToken(token);

  if (!session) {
    return {
      authorized: false,
      reason: "invalid_session",
    };
  }

  if (session.role !== "ADMIN") {
    return {
      authorized: false,
      reason: "insufficient_role",
    };
  }

  return {
    authorized: true,
    session,
  };
}

export function authorizeAuthenticatedRequest(
  cookieHeader: string | null,
): AuthorizationResult {
  const token = parseCookieHeader(cookieHeader).get(SESSION_COOKIE_NAME);

  if (!token) {
    return { authorized: false, reason: "missing_session" };
  }

  const session = verifySessionToken(token);

  return session
    ? { authorized: true, session }
    : { authorized: false, reason: "invalid_session" };
}
