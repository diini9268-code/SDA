import { describe, expect, it, vi } from "vitest";
import { authenticateAdmin } from "@/lib/auth/auth-service";
import { hashPassword } from "@/lib/auth/password";
import {
  clearFailedLogins,
  isLoginRateLimited,
  registerFailedLogin,
  resetLoginRateLimitForTests,
} from "@/lib/auth/rate-limit";
import { createSessionToken, verifySessionToken } from "@/lib/auth/session";

describe("administrator authentication", () => {
  it("authenticates a valid administrator login", async () => {
    const passwordHash = await hashPassword("CorrectHorse1!");
    const result = await authenticateAdmin(
      {
        email: "ADMIN@EXAMPLE.COM",
        password: "CorrectHorse1!",
      },
      {
        async findAdminByEmail(email) {
          expect(email).toBe("admin@example.com");

          return {
            id: "0f1f3e1a-3d10-44fd-8c58-bf222d0cb98f",
            email,
            fullName: "SDA Administrator",
            passwordHash,
            role: "ADMIN",
          };
        },
      },
    );

    expect(result).toEqual({
      ok: true,
      user: {
        id: "0f1f3e1a-3d10-44fd-8c58-bf222d0cb98f",
        email: "admin@example.com",
        fullName: "SDA Administrator",
        role: "ADMIN",
      },
    });
  });

  it("rejects invalid credentials", async () => {
    const passwordHash = await hashPassword("CorrectHorse1!");
    const result = await authenticateAdmin(
      {
        email: "admin@example.com",
        password: "WrongHorse1!",
      },
      {
        async findAdminByEmail() {
          return {
            id: "0f1f3e1a-3d10-44fd-8c58-bf222d0cb98f",
            email: "admin@example.com",
            fullName: "SDA Administrator",
            passwordHash,
            role: "ADMIN",
          };
        },
      },
    );

    expect(result).toEqual({
      ok: false,
      status: 401,
      error: "Invalid email or password.",
    });
  });
});

describe("login rate limiting", () => {
  it("limits repeated failed login attempts and can clear on success", () => {
    resetLoginRateLimitForTests();
    const identifier = "127.0.0.1";

    for (let index = 0; index < 5; index += 1) {
      registerFailedLogin(identifier);
    }

    expect(isLoginRateLimited(identifier)).toBe(true);

    clearFailedLogins(identifier);
    expect(isLoginRateLimited(identifier)).toBe(false);
  });
});

describe("administrator sessions", () => {
  it("validates a signed session token", () => {
    vi.stubEnv("JWT_SECRET", "unit-test-session-secret");
    vi.stubEnv("JWT_EXPIRES_IN", "1h");

    const token = createSessionToken({
      sub: "0f1f3e1a-3d10-44fd-8c58-bf222d0cb98f",
      email: "admin@example.com",
      fullName: "SDA Administrator",
      role: "ADMIN",
    });

    expect(verifySessionToken(token)).toMatchObject({
      sub: "0f1f3e1a-3d10-44fd-8c58-bf222d0cb98f",
      email: "admin@example.com",
      fullName: "SDA Administrator",
      role: "ADMIN",
    });

    vi.unstubAllEnvs();
  });

  it("rejects a tampered session token", () => {
    vi.stubEnv("JWT_SECRET", "unit-test-session-secret");

    const token = createSessionToken({
      sub: "0f1f3e1a-3d10-44fd-8c58-bf222d0cb98f",
      email: "admin@example.com",
      fullName: "SDA Administrator",
      role: "ADMIN",
    });

    expect(verifySessionToken(`${token.slice(0, -1)}x`)).toBeNull();

    vi.unstubAllEnvs();
  });
});
