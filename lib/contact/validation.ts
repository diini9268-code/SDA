import {
  sanitizeSingleLineTextInput,
  sanitizeTextInput,
} from "@/lib/security/text";

export type ContactMessageStatusValue = "UNREAD" | "READ" | "ARCHIVED";

export type ContactMessageCreateData = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactMessageUpdateData = {
  status: ContactMessageStatusValue;
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

const validStatuses = new Set<ContactMessageStatusValue>([
  "UNREAD",
  "READ",
  "ARCHIVED",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readRequiredString(
  source: Record<string, unknown>,
  field: string,
  maxLength: number,
  multiline = false,
): string | null {
  const value = source[field];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = multiline
    ? sanitizeTextInput(value)
    : sanitizeSingleLineTextInput(value);

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

export function parseContactMessageCreateInput(
  value: unknown,
): ValidationResult<ContactMessageCreateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid contact message payload.",
    };
  }

  const fullName = readRequiredString(value, "fullName", 160);
  const email = readEmail(value);
  const subject = readRequiredString(value, "subject", 220);
  const message = readRequiredString(value, "message", 5000, true);

  if (!fullName || !email || !subject || !message) {
    return {
      ok: false,
      error:
        "Contact message requires valid fullName, email, subject, and message fields.",
    };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      subject,
      message,
    },
  };
}

export function parseContactMessageUpdateInput(
  value: unknown,
): ValidationResult<ContactMessageUpdateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid contact message payload.",
    };
  }

  const status = value.status;

  if (
    typeof status !== "string" ||
    !validStatuses.has(status as ContactMessageStatusValue)
  ) {
    return {
      ok: false,
      error: "Invalid contact message status.",
    };
  }

  return {
    ok: true,
    data: {
      status: status as ContactMessageStatusValue,
    },
  };
}
