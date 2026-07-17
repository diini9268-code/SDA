import { describe, expect, it } from "vitest";
import {
  createProgram,
  deleteProgram,
  type ProgramRecord,
  type ProgramRepository,
  updateProgram,
} from "@/lib/programs/program-service";

const now = new Date("2026-07-07T00:00:00.000Z");
const eventDate = new Date("2026-08-10T15:00:00.000Z");

function createProgramRecord(
  overrides: Partial<ProgramRecord> = {},
): ProgramRecord {
  return {
    id: "83d75fcb-7873-4eba-b7f7-df6ef5df0fb4",
    title: "Diplomacy Workshop",
    slug: "diplomacy-workshop",
    description: "A practical workshop for diplomacy skills.",
    eventDate,
    location: "Mogadishu",
    status: "SCHEDULED",
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createRepository(): ProgramRepository & {
  programs: ProgramRecord[];
} {
  return {
    programs: [],
    async listPublic() {
      return this.programs.filter((program) =>
        ["SCHEDULED", "PUBLISHED"].includes(program.status),
      );
    },
    async listAll() {
      return this.programs;
    },
    async findPublicBySlug(slug) {
      return (
        this.programs.find(
          (program) =>
            program.slug === slug &&
            ["SCHEDULED", "PUBLISHED"].includes(program.status),
        ) ?? null
      );
    },
    async create(data) {
      const program = createProgramRecord(data);
      this.programs.push(program);
      return program;
    },
    async update(id, data) {
      const program = this.programs.find((item) => item.id === id);

      if (!program) {
        return null;
      }

      Object.assign(program, data, { updatedAt: now });
      return program;
    },
    async delete(id) {
      const initialLength = this.programs.length;
      this.programs = this.programs.filter((program) => program.id !== id);
      return this.programs.length !== initialLength;
    },
  };
}

describe("program management", () => {
  it("creates a program", async () => {
    const repository = createRepository();
    const result = await createProgram(
      {
        title: " Diplomacy Workshop ",
        description: "A practical workshop for diplomacy skills.",
        eventDate: "2026-08-10T15:00:00.000Z",
        location: "Mogadishu",
        status: "SCHEDULED",
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        title: "Diplomacy Workshop",
        slug: "diplomacy-workshop",
        location: "Mogadishu",
        status: "SCHEDULED",
      },
    });
    expect(repository.programs).toHaveLength(1);
  });

  it("edits a program", async () => {
    const repository = createRepository();
    repository.programs.push(createProgramRecord());

    const result = await updateProgram(
      "83d75fcb-7873-4eba-b7f7-df6ef5df0fb4",
      {
        title: "Updated Diplomacy Workshop",
        status: "PUBLISHED",
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        title: "Updated Diplomacy Workshop",
        slug: "updated-diplomacy-workshop",
        status: "PUBLISHED",
      },
    });
  });

  it("deletes a program", async () => {
    const repository = createRepository();
    repository.programs.push(createProgramRecord());

    const result = await deleteProgram(
      "83d75fcb-7873-4eba-b7f7-df6ef5df0fb4",
      repository,
    );

    expect(result).toEqual({
      ok: true,
      data: { deleted: true },
    });
    expect(repository.programs).toHaveLength(0);
  });

  it("rejects invalid program data", async () => {
    const repository = createRepository();
    const result = await createProgram(
      {
        title: "",
        description: "A practical workshop.",
        eventDate: "not-a-date",
        location: "Mogadishu",
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      error:
        "Program requires valid title, description, eventDate, and location fields.",
    });
  });

  it("returns a clear conflict for duplicate generated slugs", async () => {
    const repository = createRepository();
    repository.create = async () => {
      throw { code: "P2002" };
    };

    const result = await createProgram(
      {
        title: "Diplomacy Workshop",
        description: "A practical workshop.",
        eventDate: "2026-08-10T15:00:00.000Z",
        location: "Mogadishu",
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 409,
      error:
        "A program with this generated slug already exists. Use a more specific title.",
    });
  });
});
