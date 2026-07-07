import { describe, expect, it } from "vitest";
import {
  createLeadershipProfile,
  deleteLeadershipProfile,
  type LeadershipProfile,
  type LeadershipRepository,
  updateLeadershipProfile,
} from "@/lib/leadership/leadership-service";

const now = new Date("2026-07-06T00:00:00.000Z");

function createProfile(overrides: Partial<LeadershipProfile> = {}): LeadershipProfile {
  return {
    id: "5d38f82c-8e32-4e64-8a1a-222f8a02d0fa",
    fullName: "Ayan Hassan",
    position: "President",
    biography: "Leads SSDU diplomacy and student engagement programs.",
    photo: null,
    displayOrder: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createRepository(): LeadershipRepository & {
  profiles: LeadershipProfile[];
} {
  return {
    profiles: [],
    async listPublic() {
      return this.profiles.filter((profile) => profile.isActive);
    },
    async listAll() {
      return this.profiles;
    },
    async create(data) {
      const profile = createProfile(data);
      this.profiles.push(profile);
      return profile;
    },
    async update(id, data) {
      const profile = this.profiles.find((item) => item.id === id);

      if (!profile) {
        return null;
      }

      Object.assign(profile, data, { updatedAt: now });
      return profile;
    },
    async delete(id) {
      const initialLength = this.profiles.length;
      this.profiles = this.profiles.filter((profile) => profile.id !== id);
      return this.profiles.length !== initialLength;
    },
  };
}

describe("leadership management", () => {
  it("creates a leadership profile", async () => {
    const repository = createRepository();
    const result = await createLeadershipProfile(
      {
        fullName: " Ayan Hassan ",
        position: "President",
        biography: "Leads SSDU diplomacy and student engagement programs.",
        photo: "/images/leadership/ayan.jpg",
        displayOrder: 2,
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        fullName: "Ayan Hassan",
        position: "President",
        photo: "/images/leadership/ayan.jpg",
        displayOrder: 2,
        isActive: true,
      },
    });
    expect(repository.profiles).toHaveLength(1);
  });

  it("edits a leadership profile", async () => {
    const repository = createRepository();
    repository.profiles.push(createProfile());

    const result = await updateLeadershipProfile(
      "5d38f82c-8e32-4e64-8a1a-222f8a02d0fa",
      {
        position: "Executive President",
        isActive: false,
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        position: "Executive President",
        isActive: false,
      },
    });
  });

  it("deletes a leadership profile", async () => {
    const repository = createRepository();
    repository.profiles.push(createProfile());

    const result = await deleteLeadershipProfile(
      "5d38f82c-8e32-4e64-8a1a-222f8a02d0fa",
      repository,
    );

    expect(result).toEqual({
      ok: true,
      data: { deleted: true },
    });
    expect(repository.profiles).toHaveLength(0);
  });

  it("rejects invalid leadership profile data", async () => {
    const repository = createRepository();
    const result = await createLeadershipProfile(
      {
        fullName: "",
        position: "President",
        biography: "Valid biography.",
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      error:
        "Leadership profile requires valid fullName, position, and biography fields.",
    });
  });

  it("returns a clear conflict for duplicate leadership profiles", async () => {
    const repository = createRepository();
    repository.create = async () => {
      throw { code: "P2002" };
    };

    const result = await createLeadershipProfile(
      {
        fullName: "Ayan Hassan",
        position: "President",
        biography: "Valid biography.",
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 409,
      error: "A leadership profile with this name and position already exists.",
    });
  });
});
