import { isUniqueConstraintError } from "@/lib/db/prisma-errors";
import type {
  ArchiveCreateData,
  ArchiveUpdateData,
} from "@/lib/archive/validation";
import {
  parseArchiveCreateInput,
  parseArchiveUpdateInput,
} from "@/lib/archive/validation";

export type ArchiveRecord = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  activityDate: Date;
  images: string[];
  mediaAssetIds?: string[];
  media?: Array<{
    id: string;
    asset: {
      id: string;
      url: string;
      originalName: string;
      altText: string | null;
      mimeType: string;
      sizeBytes: number;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export type ArchiveRepository = {
  listPublic(): Promise<ArchiveRecord[]>;
  listAll(): Promise<ArchiveRecord[]>;
  findPublicBySlug(slug: string): Promise<ArchiveRecord | null>;
  create(data: ArchiveCreateData): Promise<ArchiveRecord>;
  update(id: string, data: ArchiveUpdateData): Promise<ArchiveRecord | null>;
  delete(id: string): Promise<boolean>;
};

type ServiceResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      status: 400 | 404 | 409;
      error: string;
    };

export async function createArchiveEntry(
  body: unknown,
  repository: ArchiveRepository,
): Promise<ServiceResult<ArchiveRecord>> {
  const input = parseArchiveCreateInput(body);

  if (!input.ok) {
    return {
      ok: false,
      status: 400,
      error: input.error,
    };
  }

  try {
    return {
      ok: true,
      data: await repository.create(input.data),
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        status: 409,
        error:
          "An archive entry with this generated slug already exists. Use a more specific title.",
      };
    }

    throw error;
  }
}

export async function updateArchiveEntry(
  id: string,
  body: unknown,
  repository: ArchiveRepository,
): Promise<ServiceResult<ArchiveRecord>> {
  const input = parseArchiveUpdateInput(body);

  if (!input.ok) {
    return {
      ok: false,
      status: 400,
      error: input.error,
    };
  }

  let archive: ArchiveRecord | null;

  try {
    archive = await repository.update(id, input.data);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        status: 409,
        error:
          "An archive entry with this generated slug already exists. Use a more specific title.",
      };
    }

    throw error;
  }

  if (!archive) {
    return {
      ok: false,
      status: 404,
      error: "Archive entry not found.",
    };
  }

  return {
    ok: true,
    data: archive,
  };
}

export async function deleteArchiveEntry(
  id: string,
  repository: ArchiveRepository,
): Promise<ServiceResult<{ deleted: true }>> {
  const deleted = await repository.delete(id);

  if (!deleted) {
    return {
      ok: false,
      status: 404,
      error: "Archive entry not found.",
    };
  }

  return {
    ok: true,
    data: { deleted: true },
  };
}
