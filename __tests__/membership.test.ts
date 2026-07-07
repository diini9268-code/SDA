import { describe, expect, it } from "vitest";
import {
  type MembershipApplicationRecord,
  type MembershipRepository,
  submitMembershipApplication,
  updateMembershipApplicationStatus,
} from "@/lib/membership/membership-service";

const now = new Date("2026-07-07T00:00:00.000Z");

function createApplicationRecord(
  overrides: Partial<MembershipApplicationRecord> = {},
): MembershipApplicationRecord {
  return {
    id: "99ef3ab6-7cc8-4706-961d-43c04c84ec93",
    fullName: "Amina Hassan",
    email: "amina@example.com",
    phone: "+252 61 123 4567",
    university: "Somali National University",
    areaOfInterest: "Diplomacy",
    status: "PENDING",
    submittedAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createRepository(): MembershipRepository & {
  applications: MembershipApplicationRecord[];
} {
  return {
    applications: [],
    async listAll() {
      return this.applications;
    },
    async create(data) {
      const application = createApplicationRecord(data);
      this.applications.push(application);
      return application;
    },
    async updateStatus(id, data) {
      const application = this.applications.find((item) => item.id === id);

      if (!application) {
        return null;
      }

      Object.assign(application, data, { updatedAt: now });
      return application;
    },
  };
}

describe("membership applications", () => {
  it("accepts a valid membership application", async () => {
    const repository = createRepository();
    const result = await submitMembershipApplication(
      {
        fullName: " Amina Hassan ",
        email: "AMINA@EXAMPLE.COM",
        phone: "+252 61 123 4567",
        university: "Somali National University",
        areaOfInterest: "Diplomacy",
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        fullName: "Amina Hassan",
        email: "amina@example.com",
        status: "PENDING",
      },
    });
    expect(repository.applications).toHaveLength(1);
  });

  it("rejects invalid membership applications", async () => {
    const repository = createRepository();
    const result = await submitMembershipApplication(
      {
        fullName: "",
        email: "not-an-email",
        phone: "123",
        university: "",
        areaOfInterest: "",
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      error:
        "Membership application requires valid fullName, email, phone, university, and areaOfInterest fields.",
    });
    expect(repository.applications).toHaveLength(0);
  });

  it("updates an application status", async () => {
    const repository = createRepository();
    repository.applications.push(createApplicationRecord());

    const result = await updateMembershipApplicationStatus(
      "99ef3ab6-7cc8-4706-961d-43c04c84ec93",
      { status: "APPROVED" },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        status: "APPROVED",
      },
    });
  });

  it("rejects invalid status updates", async () => {
    const repository = createRepository();
    repository.applications.push(createApplicationRecord());

    const result = await updateMembershipApplicationStatus(
      "99ef3ab6-7cc8-4706-961d-43c04c84ec93",
      { status: "UNKNOWN" },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      error: "Invalid application status.",
    });
  });

  it("returns not found for missing applications", async () => {
    const repository = createRepository();
    const result = await updateMembershipApplicationStatus(
      "missing",
      { status: "REJECTED" },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 404,
      error: "Membership application not found.",
    });
  });
});
