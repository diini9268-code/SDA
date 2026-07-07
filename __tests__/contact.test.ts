import { describe, expect, it } from "vitest";
import {
  type ContactMessageRecord,
  type ContactRepository,
  submitContactMessage,
  updateContactMessageStatus,
} from "@/lib/contact/contact-service";

const now = new Date("2026-07-07T00:00:00.000Z");

function createContactMessageRecord(
  overrides: Partial<ContactMessageRecord> = {},
): ContactMessageRecord {
  return {
    id: "99ef3ab6-7cc8-4706-961d-43c04c84ec93",
    fullName: "Amina Hassan",
    email: "amina@example.com",
    subject: "Partnership inquiry",
    message: "I would like to learn more about SSDU partnerships.",
    status: "UNREAD",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createRepository(): ContactRepository & {
  messages: ContactMessageRecord[];
} {
  return {
    messages: [],
    async listAll() {
      return this.messages;
    },
    async create(data) {
      const message = createContactMessageRecord(data);
      this.messages.push(message);
      return message;
    },
    async updateStatus(id, data) {
      const message = this.messages.find((item) => item.id === id);

      if (!message) {
        return null;
      }

      Object.assign(message, data, { updatedAt: now });
      return message;
    },
  };
}

describe("contact messages", () => {
  it("accepts a valid contact message", async () => {
    const repository = createRepository();
    const result = await submitContactMessage(
      {
        fullName: " Amina Hassan ",
        email: "AMINA@EXAMPLE.COM",
        subject: "Partnership inquiry",
        message: "I would like to learn more about SSDU partnerships.",
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        fullName: "Amina Hassan",
        email: "amina@example.com",
        status: "UNREAD",
      },
    });
    expect(repository.messages).toHaveLength(1);
  });

  it("rejects invalid contact messages", async () => {
    const repository = createRepository();
    const result = await submitContactMessage(
      {
        fullName: "",
        email: "not-an-email",
        subject: "",
        message: "",
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      error:
        "Contact message requires valid fullName, email, subject, and message fields.",
    });
    expect(repository.messages).toHaveLength(0);
  });

  it("updates a contact message status", async () => {
    const repository = createRepository();
    repository.messages.push(createContactMessageRecord());

    const result = await updateContactMessageStatus(
      "99ef3ab6-7cc8-4706-961d-43c04c84ec93",
      { status: "READ" },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        status: "READ",
      },
    });
  });

  it("rejects invalid status updates", async () => {
    const repository = createRepository();
    repository.messages.push(createContactMessageRecord());

    const result = await updateContactMessageStatus(
      "99ef3ab6-7cc8-4706-961d-43c04c84ec93",
      { status: "UNKNOWN" },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      error: "Invalid contact message status.",
    });
  });

  it("returns not found for missing messages", async () => {
    const repository = createRepository();
    const result = await updateContactMessageStatus(
      "missing",
      { status: "ARCHIVED" },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 404,
      error: "Contact message not found.",
    });
  });
});
