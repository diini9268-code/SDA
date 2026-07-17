const weakJwtSecrets = new Set([
  "replace-with-a-long-random-secret",
  "development-only-sda-session-secret",
]);

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required in production.`);
  }

  return value;
}

function requireUrlEnv(name: string): void {
  const value = requireEnv(name);

  try {
    new URL(value);
  } catch {
    throw new Error(`${name} must be a valid URL in production.`);
  }
}

export function validateProductionEnvironment(): void {
  const shouldValidate =
    process.env.NODE_ENV === "production" &&
    (process.env.VERCEL === "1" ||
      process.env.REQUIRE_PRODUCTION_ENV_VALIDATION === "true");

  if (!shouldValidate) {
    return;
  }

  requireUrlEnv("DATABASE_URL");

  const jwtSecret = requireEnv("JWT_SECRET");

  if (jwtSecret.length < 32 || weakJwtSecrets.has(jwtSecret)) {
    throw new Error(
      "JWT_SECRET must be a real secret with at least 32 characters in production.",
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (appUrl) {
    try {
      new URL(appUrl);
    } catch {
      throw new Error("NEXT_PUBLIC_APP_URL must be a valid URL when set.");
    }
  }
}
