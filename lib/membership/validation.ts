import { sanitizeSingleLineTextInput } from "@/lib/security/text";

export type ApplicationStatusValue = "PENDING" | "APPROVED" | "REJECTED";

export type MembershipApplicationCreateData = {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  areaOfInterest: string;
};

export type MembershipApplicationUpdateData = {
  status: ApplicationStatusValue;
};

type ValidationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

const validStatuses = new Set<ApplicationStatusValue>([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readRequiredString(
  source: Record<string, unknown>,
  field: string,
  maxLength: number,
): string | null {
  const value = source[field];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = sanitizeSingleLineTextInput(value);

  if (!trimmedValue || trimmedValue.length > maxLength) {
    return null;
  }

  return trimmedValue;
}

function readEmail(source: Record<string, unknown>): string | null {
  const email = readRequiredString(source, "email", 255);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }

  return email.toLowerCase();
}

function readPhone(source: Record<string, unknown>): string | null {
  const phone = readRequiredString(source, "phone", 40);

  if (!phone || !/^[+()\d\s.-]{7,40}$/.test(phone)) {
    return null;
  }

  return phone;
}

export function parseMembershipApplicationCreateInput(
  value: unknown,
): ValidationResult<MembershipApplicationCreateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid membership application payload.",
    };
  }

  const fullName = readRequiredString(value, "fullName", 160);
  const email = readEmail(value);
  const phone = readPhone(value);
  const university = readRequiredString(value, "university", 180);
  const areaOfInterest = readRequiredString(value, "areaOfInterest", 180);

  if (!fullName || !email || !phone || !university || !areaOfInterest) {
    return {
      ok: false,
      error:
        "Membership application requires valid fullName, email, phone, university, and areaOfInterest fields.",
    };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone,
      university,
      areaOfInterest,
    },
  };
}

export function parseMembershipApplicationUpdateInput(
  value: unknown,
): ValidationResult<MembershipApplicationUpdateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid membership application payload.",
    };
  }

  const status = value.status;

  if (typeof status !== "string" || !validStatuses.has(status as ApplicationStatusValue)) {
    return {
      ok: false,
      error: "Invalid application status.",
    };
  }

  return {
    ok: true,
    data: {
      status: status as ApplicationStatusValue,
    },
  };
}
