import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "ssdu_admin_session";

export type AdminSession = {
  sub: string;
  email: string;
  fullName: string;
  role: "ADMIN";
  iat: number;
  exp: number;
};

type SessionInput = Omit<AdminSession, "iat" | "exp">;

function base64UrlEncode(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSessionSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (secret) {
    if (
      process.env.NODE_ENV === "production" &&
      (secret.length < 32 || secret === "replace-with-a-long-random-secret")
    ) {
      throw new Error(
        "JWT_SECRET must be a real secret with at least 32 characters in production.",
      );
    }

    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  return "development-only-sda-session-secret";
}

export function getSessionMaxAgeSeconds(): number {
  const configuredValue = process.env.JWT_EXPIRES_IN ?? "8h";
  const match = configuredValue.match(/^(\d+)([smhd])?$/);

  if (!match) {
    return 8 * 60 * 60;
  }

  const amount = Number(match[1]);
  const unit = match[2] ?? "s";
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };

  return amount * multipliers[unit];
}

function signToken(unsignedToken: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(unsignedToken)
    .digest("base64url");
}

export function createSessionToken(input: SessionInput): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: AdminSession = {
    ...input,
    iat: issuedAt,
    exp: issuedAt + getSessionMaxAgeSeconds(),
  };
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${header}.${body}`;

  return `${unsignedToken}.${signToken(unsignedToken)}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [header, body, signature] = parts;
  const unsignedToken = `${header}.${body}`;
  const expectedSignature = signToken(unsignedToken);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(base64UrlDecode(body)) as AdminSession;
    const now = Math.floor(Date.now() / 1000);

    if (session.exp <= now || session.role !== "ADMIN") {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
