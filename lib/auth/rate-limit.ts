type LoginAttempt = {
  count: number;
  firstAttemptAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, LoginAttempt>();

export function isLoginRateLimited(identifier: string): boolean {
  const now = Date.now();
  const attempt = attempts.get(identifier);

  if (!attempt) {
    return false;
  }

  if (now - attempt.firstAttemptAt > WINDOW_MS) {
    attempts.delete(identifier);
    return false;
  }

  return attempt.count >= MAX_ATTEMPTS;
}

export function registerFailedLogin(identifier: string): void {
  const now = Date.now();
  const attempt = attempts.get(identifier);

  if (!attempt || now - attempt.firstAttemptAt > WINDOW_MS) {
    attempts.set(identifier, { count: 1, firstAttemptAt: now });
    return;
  }

  attempts.set(identifier, {
    count: attempt.count + 1,
    firstAttemptAt: attempt.firstAttemptAt,
  });
}

export function clearFailedLogins(identifier: string): void {
  attempts.delete(identifier);
}

export function resetLoginRateLimitForTests(): void {
  attempts.clear();
}
