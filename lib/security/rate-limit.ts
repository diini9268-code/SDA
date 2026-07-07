type RateLimitAttempt = {
  count: number;
  firstAttemptAt: number;
};

const publicFormAttempts = new Map<string, RateLimitAttempt>();
const PUBLIC_FORM_WINDOW_MS = 10 * 60 * 1000;
const PUBLIC_FORM_MAX_ATTEMPTS = 3;

function isRateLimited(
  attempts: Map<string, RateLimitAttempt>,
  identifier: string,
  maxAttempts: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const attempt = attempts.get(identifier);

  if (!attempt) {
    return false;
  }

  if (now - attempt.firstAttemptAt > windowMs) {
    attempts.delete(identifier);
    return false;
  }

  return attempt.count >= maxAttempts;
}

function registerAttempt(
  attempts: Map<string, RateLimitAttempt>,
  identifier: string,
  windowMs: number,
): void {
  const now = Date.now();
  const attempt = attempts.get(identifier);

  if (!attempt || now - attempt.firstAttemptAt > windowMs) {
    attempts.set(identifier, { count: 1, firstAttemptAt: now });
    return;
  }

  attempts.set(identifier, {
    count: attempt.count + 1,
    firstAttemptAt: attempt.firstAttemptAt,
  });
}

export function getClientIdentifier(headers: Headers, scope: string): string {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  const userAgent = headers.get("user-agent")?.slice(0, 120) ?? "unknown-agent";
  const ip = forwardedFor || realIp || "unknown-client";

  return `${scope}:${ip}:${userAgent}`;
}

export function isPublicFormRateLimited(identifier: string): boolean {
  return isRateLimited(
    publicFormAttempts,
    identifier,
    PUBLIC_FORM_MAX_ATTEMPTS,
    PUBLIC_FORM_WINDOW_MS,
  );
}

export function registerPublicFormSubmission(identifier: string): void {
  registerAttempt(publicFormAttempts, identifier, PUBLIC_FORM_WINDOW_MS);
}

export function resetPublicFormRateLimitForTests(): void {
  publicFormAttempts.clear();
}
