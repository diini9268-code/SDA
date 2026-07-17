import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { authorizeAdminRequest } from "@/lib/auth/authorization";
import { SESSION_COOKIE_NAME } from "@/lib/auth/cookies";
import { createSessionToken } from "@/lib/auth/session";

function createSignedToken(payload: Record<string, unknown>) {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const unsignedToken = `${header}.${body}`;
  const signature = createHmac("sha256", "unit-test-session-secret")
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
}

describe("administrator authorization", () => {
  it("denies protected routes without a session cookie", () => {
    expect(authorizeAdminRequest(null)).toEqual({
      authorized: false,
      reason: "missing_session",
    });
  });

  it("allows protected routes for administrator sessions", () => {
    vi.stubEnv("JWT_SECRET", "unit-test-session-secret");

    const token = createSessionToken({
      sub: "0f1f3e1a-3d10-44fd-8c58-bf222d0cb98f",
      email: "admin@example.com",
      fullName: "SDA Administrator",
      role: "ADMIN",
    });
    const result = authorizeAdminRequest(`${SESSION_COOKIE_NAME}=${token}`);

    expect(result).toMatchObject({
      authorized: true,
      session: {
        sub: "0f1f3e1a-3d10-44fd-8c58-bf222d0cb98f",
        email: "admin@example.com",
        role: "ADMIN",
      },
    });

    vi.unstubAllEnvs();
  });

  it("denies users without the administrator role", () => {
    vi.stubEnv("JWT_SECRET", "unit-test-session-secret");

    const now = Math.floor(Date.now() / 1000);
    const token = createSignedToken({
      sub: "member-user-id",
      email: "member@example.com",
      fullName: "SDA Member",
      role: "MEMBER",
      iat: now,
      exp: now + 3600,
    });

    expect(authorizeAdminRequest(`${SESSION_COOKIE_NAME}=${token}`)).toEqual({
      authorized: false,
      reason: "invalid_session",
    });

    vi.unstubAllEnvs();
  });
});
