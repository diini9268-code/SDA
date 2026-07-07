import type {
  LeadershipCreateData,
  LeadershipUpdateData,
} from "@/lib/leadership/validation";
import { isUniqueConstraintError } from "@/lib/db/prisma-errors";
import {
  parseLeadershipCreateInput,
  parseLeadershipUpdateInput,
} from "@/lib/leadership/validation";

export type LeadershipProfile = {
  id: string;
  fullName: string;
  position: string;
  biography: string;
  photo: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type LeadershipRepository = {
  listPublic(): Promise<LeadershipProfile[]>;
  listAll(): Promise<LeadershipProfile[]>;
  create(data: LeadershipCreateData): Promise<LeadershipProfile>;
  update(
    id: string,
    data: LeadershipUpdateData,
  ): Promise<LeadershipProfile | null>;
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

export async function createLeadershipProfile(
  body: unknown,
  repository: LeadershipRepository,
): Promise<ServiceResult<LeadershipProfile>> {
  const input = parseLeadershipCreateInput(body);

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
        error: "A leadership profile with this name and position already exists.",
      };
    }

    throw error;
  }
}

export async function updateLeadershipProfile(
  id: string,
  body: unknown,
  repository: LeadershipRepository,
): Promise<ServiceResult<LeadershipProfile>> {
  const input = parseLeadershipUpdateInput(body);

  if (!input.ok) {
    return {
      ok: false,
      status: 400,
      error: input.error,
    };
  }

  let profile: LeadershipProfile | null;

  try {
    profile = await repository.update(id, input.data);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        status: 409,
        error: "A leadership profile with this name and position already exists.",
      };
    }

    throw error;
  }

  if (!profile) {
    return {
      ok: false,
      status: 404,
      error: "Leadership profile not found.",
    };
  }

  return {
    ok: true,
    data: profile,
  };
}

export async function deleteLeadershipProfile(
  id: string,
  repository: LeadershipRepository,
): Promise<ServiceResult<{ deleted: true }>> {
  const deleted = await repository.delete(id);

  if (!deleted) {
    return {
      ok: false,
      status: 404,
      error: "Leadership profile not found.",
    };
  }

  return {
    ok: true,
    data: { deleted: true },
  };
}
