export type ArchiveCreateData = {
  title: string;
  slug: string;
  summary: string;
  activityDate: Date;
  images: string[];
  mediaAssetIds: string[];
};

export type ArchiveUpdateData = Partial<ArchiveCreateData>;

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

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
}

function readActivityDate(source: Record<string, unknown>): Date | null {
  const value = source.activityDate;

  if (typeof value !== "string" && !(value instanceof Date)) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function isValidImageUrl(value: string): boolean {
  return (
    value.length <= 2048 &&
    !value.startsWith("data:") &&
    (/^\//.test(value) || /^https:\/\//.test(value))
  );
}

function readImages(source: Record<string, unknown>): string[] | null {
  const value = source.images;

  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  if (value.length > 20) {
    return null;
  }

  const images = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  if (images.some((image) => !isValidImageUrl(image))) {
    return null;
  }

  return Array.from(new Set(images));
}

function readMediaAssetIds(source: Record<string, unknown>): string[] | null {
  const raw = source.mediaAssetIds;
  const values =
    raw == null
      ? []
      : Array.isArray(raw)
        ? raw
        : typeof raw === "string"
          ? [raw]
          : null;
  if (!values) return null;
  const ids = values
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
  if (
    ids.length > 20 ||
    ids.some(
      (id) =>
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          id,
        ),
    )
  ) {
    return null;
  }
  return Array.from(new Set(ids));
}

export function parseArchiveCreateInput(
  value: unknown,
): ValidationResult<ArchiveCreateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid archive payload.",
    };
  }

  const title = readRequiredString(value, "title", 220);
  const summary = readRequiredString(value, "summary", 5000);
  const activityDate = readActivityDate(value);
  const images = readImages(value);
  const mediaAssetIds = readMediaAssetIds(value);

  if (
    !title ||
    !summary ||
    !activityDate ||
    images === null ||
    mediaAssetIds === null
  ) {
    return {
      ok: false,
      error:
        "Gallery activity requires a valid title, summary, activity date, and media.",
    };
  }

  return {
    ok: true,
    data: {
      title,
      slug: createSlug(title),
      summary,
      activityDate,
      images,
      mediaAssetIds,
    },
  };
}

export function parseArchiveUpdateInput(
  value: unknown,
): ValidationResult<ArchiveUpdateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid archive payload.",
    };
  }

  const data: ArchiveUpdateData = {};

  if ("title" in value) {
    const title = readRequiredString(value, "title", 220);
    if (!title) {
      return { ok: false, error: "Invalid title." };
    }
    data.title = title;
    data.slug = createSlug(title);
  }

  if ("summary" in value) {
    const summary = readRequiredString(value, "summary", 5000);
    if (!summary) {
      return { ok: false, error: "Invalid summary." };
    }
    data.summary = summary;
  }

  if ("activityDate" in value) {
    const activityDate = readActivityDate(value);
    if (!activityDate) {
      return { ok: false, error: "Invalid activityDate." };
    }
    data.activityDate = activityDate;
  }

  if ("images" in value) {
    const images = readImages(value);
    if (images === null) {
      return { ok: false, error: "Invalid legacy gallery images." };
    }
    data.images = images;
  }

  if ("mediaAssetIds" in value) {
    const mediaAssetIds = readMediaAssetIds(value);
    if (mediaAssetIds === null) {
      return { ok: false, error: "Invalid uploaded media." };
    }
    data.mediaAssetIds = mediaAssetIds;
  }

  if (Object.keys(data).length === 0) {
    return {
      ok: false,
      error: "At least one archive field is required.",
    };
  }

  return {
    ok: true,
    data,
  };
}
