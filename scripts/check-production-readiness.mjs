import { existsSync, readFileSync } from "node:fs";

function loadDotEnv() {
  if (!existsSync(".env")) {
    return;
  }

  const lines = readFileSync(".env", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const requiredVariables = [
  "DATABASE_URL",
  "DIRECT_URL",
  "JWT_SECRET",
  "NEXT_PUBLIC_APP_URL",
];

const placeholderValues = new Set([
  "replace-with-a-long-random-secret",
  "development-only-sda-session-secret",
  "postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public",
  "http://localhost:3000",
]);

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

for (const variable of requiredVariables) {
  const value = process.env[variable]?.trim();

  if (!value) {
    fail(`${variable} is missing.`);
    continue;
  }

  if (placeholderValues.has(value)) {
    fail(`${variable} still uses a placeholder value.`);
    continue;
  }

  if (
    ["DATABASE_URL", "DIRECT_URL", "NEXT_PUBLIC_APP_URL"].includes(variable) &&
    !isValidUrl(value)
  ) {
    fail(`${variable} must be a valid URL.`);
    continue;
  }

  if (variable === "JWT_SECRET" && value.length < 32) {
    fail("JWT_SECRET must be at least 32 characters.");
    continue;
  }

  pass(`${variable} is configured.`);
}

if (process.env.REQUIRE_PRODUCTION_ENV_VALIDATION !== "true") {
  fail("REQUIRE_PRODUCTION_ENV_VALIDATION should be true for production.");
} else {
  pass("REQUIRE_PRODUCTION_ENV_VALIDATION is enabled.");
}

if (process.exitCode) {
  console.error("Production readiness check failed.");
} else {
  console.log("Production readiness check passed.");
}
