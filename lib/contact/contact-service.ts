import type {
  ContactMessageCreateData,
  ContactMessageStatusValue,
  ContactMessageUpdateData,
} from "@/lib/contact/validation";
import {
  parseContactMessageCreateInput,
  parseContactMessageUpdateInput,
} from "@/lib/contact/validation";

export type ContactMessageRecord = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatusValue;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactRepository = {
  listAll(): Promise<ContactMessageRecord[]>;
  create(data: ContactMessageCreateData): Promise<ContactMessageRecord>;
  updateStatus(
    id: string,
    data: ContactMessageUpdateData,
  ): Promise<ContactMessageRecord | null>;
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

export async function submitContactMessage(
  body: unknown,
  repository: ContactRepository,
): Promise<ServiceResult<ContactMessageRecord>> {
  const input = parseContactMessageCreateInput(body);

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

export async function updateContactMessageStatus(
  id: string,
  body: unknown,
  repository: ContactRepository,
): Promise<ServiceResult<ContactMessageRecord>> {
  const input = parseContactMessageUpdateInput(body);

  if (!input.ok) {
    return {
      ok: false,
      status: 400,
      error: input.error,
    };
  }

  const message = await repository.updateStatus(id, input.data);

  if (!message) {
    return {
      ok: false,
      status: 404,
      error: "Contact message not found.",
    };
  }

  return {
    ok: true,
    data: message,
  };
}
