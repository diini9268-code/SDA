import type {
  ProgramCreateData,
  ProgramStatusValue,
  ProgramUpdateData,
} from "@/lib/programs/validation";
import { isUniqueConstraintError } from "@/lib/db/prisma-errors";
import {
  parseProgramCreateInput,
  parseProgramUpdateInput,
} from "@/lib/programs/validation";

export type ProgramRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: Date;
  location: string;
  status: ProgramStatusValue;
  coverAssetId?: string | null;
  coverAsset?: {
    id: string;
    url: string;
    originalName: string;
    altText: string | null;
    mimeType: string;
    sizeBytes: number;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProgramRepository = {
  listPublic(): Promise<ProgramRecord[]>;
  listAll(): Promise<ProgramRecord[]>;
  findPublicBySlug(slug: string): Promise<ProgramRecord | null>;
  create(data: ProgramCreateData): Promise<ProgramRecord>;
  update(id: string, data: ProgramUpdateData): Promise<ProgramRecord | null>;
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

export async function createProgram(
  body: unknown,
  repository: ProgramRepository,
): Promise<ServiceResult<ProgramRecord>> {
  const input = parseProgramCreateInput(body);

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
        error: "A program with this generated slug already exists. Use a more specific title.",
      };
    }

    throw error;
  }
}

export async function updateProgram(
  id: string,
  body: unknown,
  repository: ProgramRepository,
): Promise<ServiceResult<ProgramRecord>> {
  const input = parseProgramUpdateInput(body);

  if (!input.ok) {
    return {
      ok: false,
      status: 400,
      error: input.error,
    };
  }

  let program: ProgramRecord | null;

  try {
    program = await repository.update(id, input.data);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        status: 409,
        error: "A program with this generated slug already exists. Use a more specific title.",
      };
    }

    throw error;
  }

  if (!program) {
    return {
      ok: false,
      status: 404,
      error: "Program not found.",
    };
  }

  return {
    ok: true,
    data: program,
  };
}

export async function deleteProgram(
  id: string,
  repository: ProgramRepository,
): Promise<ServiceResult<{ deleted: true }>> {
  const deleted = await repository.delete(id);

  if (!deleted) {
    return {
      ok: false,
      status: 404,
      error: "Program not found.",
    };
  }

  return {
    ok: true,
    data: { deleted: true },
  };
}
