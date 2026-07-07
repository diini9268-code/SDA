import type {
  ApplicationStatusValue,
  MembershipApplicationCreateData,
  MembershipApplicationUpdateData,
} from "@/lib/membership/validation";
import {
  parseMembershipApplicationCreateInput,
  parseMembershipApplicationUpdateInput,
} from "@/lib/membership/validation";

export type MembershipApplicationRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  areaOfInterest: string;
  status: ApplicationStatusValue;
  submittedAt: Date;
  updatedAt: Date;
};

export type MembershipRepository = {
  listAll(): Promise<MembershipApplicationRecord[]>;
  create(
    data: MembershipApplicationCreateData,
  ): Promise<MembershipApplicationRecord>;
  updateStatus(
    id: string,
    data: MembershipApplicationUpdateData,
  ): Promise<MembershipApplicationRecord | null>;
};

type ServiceResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      status: 400 | 404;
      error: string;
    };

export async function submitMembershipApplication(
  body: unknown,
  repository: MembershipRepository,
): Promise<ServiceResult<MembershipApplicationRecord>> {
  const input = parseMembershipApplicationCreateInput(body);

  if (!input.ok) {
    return {
      ok: false,
      status: 400,
      error: input.error,
    };
  }

  return {
    ok: true,
    data: await repository.create(input.data),
  };
}

export async function updateMembershipApplicationStatus(
  id: string,
  body: unknown,
  repository: MembershipRepository,
): Promise<ServiceResult<MembershipApplicationRecord>> {
  const input = parseMembershipApplicationUpdateInput(body);

  if (!input.ok) {
    return {
      ok: false,
      status: 400,
      error: input.error,
    };
  }

  const application = await repository.updateStatus(id, input.data);

  if (!application) {
    return {
      ok: false,
      status: 404,
      error: "Membership application not found.",
    };
  }

  return {
    ok: true,
    data: application,
  };
}
