export type LoginInput = {
  email: string;
  password: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseLoginInput(value: unknown): LoginInput | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const email = typeof candidate.email === "string" ? candidate.email.trim() : "";
  const password =
    typeof candidate.password === "string" ? candidate.password : "";

  if (!emailPattern.test(email) || password.length < 8) {
    return null;
  }

  return {
    email: email.toLowerCase(),
    password,
  };
}
