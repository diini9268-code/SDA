import { describe, expect, it, vi } from "vitest";
import nextConfig from "@/next.config";
import {
  getClientIdentifier,
  isPublicFormRateLimited,
  registerPublicFormSubmission,
  resetPublicFormRateLimitForTests,
} from "@/lib/security/rate-limit";
import {
  sanitizeSingleLineTextInput,
  sanitizeTextInput,
} from "@/lib/security/text";
import { validateProductionEnvironment } from "@/lib/security/environment";

describe("security hardening", () => {
  it("sanitizes submitted text", () => {
    expect(sanitizeSingleLineTextInput("  Amina\u0000   Hassan  ")).toBe(
      "Amina Hassan",
    );
    expect(sanitizeTextInput(" hello\r\nworld\u0007 ")).toBe("hello\nworld");
  });

  it("rate limits public form submissions", () => {
    resetPublicFormRateLimitForTests();
    const identifier = getClientIdentifier(
      new Headers({
        "x-forwarded-for": "127.0.0.1",
        "user-agent": "vitest",
      }),
      "contact",
    );

    expect(isPublicFormRateLimited(identifier)).toBe(false);
    registerPublicFormSubmission(identifier);
    registerPublicFormSubmission(identifier);
    registerPublicFormSubmission(identifier);
    expect(isPublicFormRateLimited(identifier)).toBe(true);
  });

  it("requires production security environment values", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("REQUIRE_PRODUCTION_ENV_VALIDATION", "true");
    vi.stubEnv("DATABASE_URL", "not-a-url");
    vi.stubEnv("JWT_SECRET", "replace-with-a-long-random-secret");

    expect(() => validateProductionEnvironment()).toThrow(
      "DATABASE_URL must be a valid URL in production.",
    );

    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@example.com:5432/db");
    expect(() => validateProductionEnvironment()).toThrow(
      "JWT_SECRET must be a real secret with at least 32 characters in production.",
    );

    vi.stubEnv("JWT_SECRET", "0123456789abcdef0123456789abcdef");
    expect(() => validateProductionEnvironment()).not.toThrow();

    vi.unstubAllEnvs();
  });

  it("configures security response headers", async () => {
    const headers = await nextConfig.headers?.();
    const allHeaders = headers?.flatMap((entry) => entry.headers) ?? [];

    expect(allHeaders).toEqual(
      expect.arrayContaining([
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ]),
    );
    expect(
      allHeaders.find((header) => header.key === "Content-Security-Policy")
        ?.value,
    ).toContain("frame-ancestors 'self'");
  });
});
