import { verifyPassword } from "@/lib/auth/password";
import { parseLoginInput } from "@/lib/auth/validation";

export type AdminUserRecord = {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: "ADMIN";
};

export type AuthUserRepository = {
  findAdminByEmail(email: string): Promise<AdminUserRecord | null>;
};

export type AuthenticationResult =
  | {
      ok: true;
      user: Omit<AdminUserRecord, "passwordHash">;
    }
  | {
      ok: false;
      status: 400 | 401;
      error: string;
    };

export async function authenticateAdmin(
  body: unknown,
  repository: AuthUserRepository,
): Promise<AuthenticationResult> {
  const input = parseLoginInput(body);

  if (!input) {
    return {
      ok: false,
      status: 400,
      error: "Invalid email or password.",
    };
  }

  const user = await repository.findAdminByEmail(input.email);

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    return {
      ok: false,
      status: 401,
      error: "Invalid email or password.",
    };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}
