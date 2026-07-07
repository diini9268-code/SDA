export type LeadershipCreateData = {
  fullName: string;
  position: string;
  biography: string;
  photo: string | null;
  displayOrder: number;
  isActive: boolean;
};

export type LeadershipUpdateData = Partial<LeadershipCreateData>;

type ValidationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

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

function readOptionalPhoto(source: Record<string, unknown>): string | null {
  const value = source.photo;

  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (
    trimmedValue.length > 2048 ||
    trimmedValue.startsWith("data:") ||
    !/^\/|^https:\/\//.test(trimmedValue)
  ) {
    return null;
  }

  return trimmedValue;
}

function readDisplayOrder(source: Record<string, unknown>): number {
  const value = source.displayOrder;

  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return 0;
  }

  return value;
}

function readIsActive(source: Record<string, unknown>): boolean {
  return typeof source.isActive === "boolean" ? source.isActive : true;
}

export function parseLeadershipCreateInput(
  value: unknown,
): ValidationResult<LeadershipCreateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid leadership profile payload.",
    };
  }

  const fullName = readRequiredString(value, "fullName", 160);
  const position = readRequiredString(value, "position", 160);
  const biography = readRequiredString(value, "biography", 5000);
  const photo = readOptionalPhoto(value);

  if (!fullName || !position || !biography || photo === null && value.photo) {
    return {
      ok: false,
      error: "Leadership profile requires valid fullName, position, and biography fields.",
    };
  }

  return {
    ok: true,
    data: {
      fullName,
      position,
      biography,
      photo,
      displayOrder: readDisplayOrder(value),
      isActive: readIsActive(value),
    },
  };
}

export function parseLeadershipUpdateInput(
  value: unknown,
): ValidationResult<LeadershipUpdateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid leadership profile payload.",
    };
  }

  const data: LeadershipUpdateData = {};

  if ("fullName" in value) {
    const fullName = readRequiredString(value, "fullName", 160);
    if (!fullName) {
      return { ok: false, error: "Invalid fullName." };
    }
    data.fullName = fullName;
  }

  if ("position" in value) {
    const position = readRequiredString(value, "position", 160);
    if (!position) {
      return { ok: false, error: "Invalid position." };
    }
    data.position = position;
  }

  if ("biography" in value) {
    const biography = readRequiredString(value, "biography", 5000);
    if (!biography) {
      return { ok: false, error: "Invalid biography." };
    }
    data.biography = biography;
  }

  if ("photo" in value) {
    const photo = readOptionalPhoto(value);
    if (photo === null && value.photo) {
      return { ok: false, error: "Invalid photo." };
    }
    data.photo = photo;
  }

  if ("displayOrder" in value) {
    if (
      typeof value.displayOrder !== "number" ||
      !Number.isInteger(value.displayOrder) ||
      value.displayOrder < 0
    ) {
      return { ok: false, error: "Invalid displayOrder." };
    }
    data.displayOrder = value.displayOrder;
  }

  if ("isActive" in value) {
    if (typeof value.isActive !== "boolean") {
      return { ok: false, error: "Invalid isActive value." };
    }
    data.isActive = value.isActive;
  }

  if (Object.keys(data).length === 0) {
    return {
      ok: false,
      error: "At least one leadership profile field is required.",
    };
  }

  return {
    ok: true,
    data,
  };
}
