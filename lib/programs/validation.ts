export type ProgramStatusValue =
  | "DRAFT"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED"
  | "CANCELLED";

export type ProgramCreateData = {
  title: string;
  slug: string;
  description: string;
  eventDate: Date;
  location: string;
  status: ProgramStatusValue;
};

export type ProgramUpdateData = Partial<ProgramCreateData>;

type ValidationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

const validStatuses = new Set<ProgramStatusValue>([
  "DRAFT",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
  "CANCELLED",
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

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue.length > maxLength) {
    return null;
  }

  return trimmedValue;
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
}

function readEventDate(source: Record<string, unknown>): Date | null {
  const value = source.eventDate;

  if (typeof value !== "string" && !(value instanceof Date)) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function readStatus(source: Record<string, unknown>): ProgramStatusValue {
  const value = source.status;

  if (typeof value === "string" && validStatuses.has(value as ProgramStatusValue)) {
    return value as ProgramStatusValue;
  }

  return "DRAFT";
}

export function parseProgramCreateInput(
  value: unknown,
): ValidationResult<ProgramCreateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid program payload.",
    };
  }

  const title = readRequiredString(value, "title", 220);
  const description = readRequiredString(value, "description", 5000);
  const location = readRequiredString(value, "location", 220);
  const eventDate = readEventDate(value);

  if (!title || !description || !location || !eventDate) {
    return {
      ok: false,
      error: "Program requires valid title, description, eventDate, and location fields.",
    };
  }

  return {
    ok: true,
    data: {
      title,
      slug: createSlug(title),
      description,
      eventDate,
      location,
      status: readStatus(value),
    },
  };
}

export function parseProgramUpdateInput(
  value: unknown,
): ValidationResult<ProgramUpdateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid program payload.",
    };
  }

  const data: ProgramUpdateData = {};

  if ("title" in value) {
    const title = readRequiredString(value, "title", 220);
    if (!title) {
      return { ok: false, error: "Invalid title." };
    }
    data.title = title;
    data.slug = createSlug(title);
  }

  if ("description" in value) {
    const description = readRequiredString(value, "description", 5000);
    if (!description) {
      return { ok: false, error: "Invalid description." };
    }
    data.description = description;
  }

  if ("eventDate" in value) {
    const eventDate = readEventDate(value);
    if (!eventDate) {
      return { ok: false, error: "Invalid eventDate." };
    }
    data.eventDate = eventDate;
  }

  if ("location" in value) {
    const location = readRequiredString(value, "location", 220);
    if (!location) {
      return { ok: false, error: "Invalid location." };
    }
    data.location = location;
  }

  if ("status" in value) {
    if (
      typeof value.status !== "string" ||
      !validStatuses.has(value.status as ProgramStatusValue)
    ) {
      return { ok: false, error: "Invalid status." };
    }
    data.status = value.status as ProgramStatusValue;
  }

  if (Object.keys(data).length === 0) {
    return {
      ok: false,
      error: "At least one program field is required.",
    };
  }

  return {
    ok: true,
    data,
  };
}
