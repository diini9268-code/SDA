import { describe, expect, it } from "vitest";
import {
  createArchiveEntry,
  deleteArchiveEntry,
  type ArchiveRecord,
  type ArchiveRepository,
  updateArchiveEntry,
} from "@/lib/archive/archive-service";

const now = new Date("2026-07-07T00:00:00.000Z");
const activityDate = new Date("2026-08-10T15:00:00.000Z");

function createArchiveRecord(
  overrides: Partial<ArchiveRecord> = {},
): ArchiveRecord {
  return {
    id: "99ef3ab6-7cc8-4706-961d-43c04c84ec93",
    title: "SSDU Launch Event",
    slug: "ssdu-launch-event",
    summary: "A historical record of the SSDU launch event.",
    activityDate,
    images: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createRepository(): ArchiveRepository & {
  entries: ArchiveRecord[];
} {
  return {
    entries: [],
    async listPublic() {
      return this.entries;
    },
    async listAll() {
      return this.entries;
    },
    async findPublicBySlug(slug) {
      return this.entries.find((entry) => entry.slug === slug) ?? null;
    },
    async create(data) {
      const entry = createArchiveRecord(data);
      this.entries.push(entry);
      return entry;
    },
    async update(id, data) {
      const entry = this.entries.find((item) => item.id === id);

      if (!entry) {
        return null;
      }

      Object.assign(entry, data, { updatedAt: now });
      return entry;
    },
    async delete(id) {
      const initialLength = this.entries.length;
      this.entries = this.entries.filter((entry) => entry.id !== id);
      return this.entries.length !== initialLength;
    },
  };
}

describe("archive management", () => {
  it("creates an archive entry", async () => {
    const repository = createRepository();
    const result = await createArchiveEntry(
      {
        title: " SSDU Launch Event ",
        summary: "A historical record of the SSDU launch event.",
        activityDate: "2026-08-10T15:00:00.000Z",
        images: [
          "https://example.com/archive-photo.jpg",
          "https://example.com/archive-photo.jpg",
          "/images/archive/local.jpg",
        ],
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        title: "SSDU Launch Event",
        slug: "ssdu-launch-event",
        images: [
          "https://example.com/archive-photo.jpg",
          "/images/archive/local.jpg",
        ],
      },
    });
    expect(repository.entries).toHaveLength(1);
  });

  it("edits an archive entry", async () => {
    const repository = createRepository();
    repository.entries.push(createArchiveRecord());

    const result = await updateArchiveEntry(
      "99ef3ab6-7cc8-4706-961d-43c04c84ec93",
      {
        title: "Updated SSDU Launch Event",
        images: ["https://example.com/updated.jpg"],
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        title: "Updated SSDU Launch Event",
        slug: "updated-ssdu-launch-event",
        images: ["https://example.com/updated.jpg"],
      },
    });
  });

  it("deletes an archive entry", async () => {
    const repository = createRepository();
    repository.entries.push(createArchiveRecord());

    const result = await deleteArchiveEntry(
      "99ef3ab6-7cc8-4706-961d-43c04c84ec93",
      repository,
    );

    expect(result).toEqual({
      ok: true,
      data: { deleted: true },
    });
    expect(repository.entries).toHaveLength(0);
  });

  it("rejects invalid image URLs", async () => {
    const repository = createRepository();
    const result = await createArchiveEntry(
      {
        title: "SSDU Launch Event",
        summary: "A historical record.",
        activityDate: "2026-08-10T15:00:00.000Z",
        images: ["data:image/png;base64,unsafe"],
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      error:
        "Archive requires valid title, summary, activityDate, and image URL fields.",
    });
  });

  it("returns a clear conflict for duplicate generated slugs", async () => {
    const repository = createRepository();
    repository.create = async () => {
      throw { code: "P2002" };
    };

    const result = await createArchiveEntry(
      {
        title: "SSDU Launch Event",
        summary: "A historical record.",
        activityDate: "2026-08-10T15:00:00.000Z",
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 409,
      error:
        "An archive entry with this generated slug already exists. Use a more specific title.",
    });
  });
});
