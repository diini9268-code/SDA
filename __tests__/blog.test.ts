import { describe, expect, it } from "vitest";
import {
  createBlogPost,
  deleteBlogPost,
  type BlogRecord,
  type BlogRepository,
  updateBlogPost,
} from "@/lib/blog/blog-service";
import { formatPublicationDateInput } from "@/lib/blog/validation";

const now = new Date("2026-07-07T00:00:00.000Z");
const publishedAt = new Date("2026-08-10T15:00:00.000Z");

function createBlogRecord(overrides: Partial<BlogRecord> = {}): BlogRecord {
  const id = "7f4603b4-0a92-4072-95e6-f93844b438d0";

  return {
    id,
    title: "SDA Field Notes",
    slug: "sda-field-notes",
    category: "Updates",
    excerpt: "A short update from SDA.",
    content: "A complete blog post about SDA activities.",
    status: "PUBLISHED",
    publishedAt,
    createdAt: now,
    updatedAt: now,
    media: [],
    ...overrides,
  };
}

function createRepository(): BlogRepository & {
  posts: BlogRecord[];
} {
  return {
    posts: [],
    async listPublic() {
      return this.posts.filter((post) => post.status === "PUBLISHED");
    },
    async listAll() {
      return this.posts;
    },
    async findPublicBySlug(slug) {
      return (
        this.posts.find(
          (post) => post.slug === slug && post.status === "PUBLISHED",
        ) ?? null
      );
    },
    async create(data) {
      const blogId = "7f4603b4-0a92-4072-95e6-f93844b438d0";
      const post = createBlogRecord({
        ...data,
        id: blogId,
        media: data.media.map((media, index) => ({
          ...media,
          id: `media-${index}`,
          blogId,
          createdAt: now,
          updatedAt: now,
        })),
      });
      this.posts.push(post);
      return post;
    },
    async update(id, data) {
      const post = this.posts.find((item) => item.id === id);

      if (!post) {
        return null;
      }

      Object.assign(post, data, { updatedAt: now });

      if (data.media) {
        post.media = data.media.map((media, index) => ({
          ...media,
          id: `updated-media-${index}`,
          blogId: id,
          createdAt: now,
          updatedAt: now,
        }));
      }

      return post;
    },
    async delete(id) {
      const initialLength = this.posts.length;
      this.posts = this.posts.filter((post) => post.id !== id);
      return this.posts.length !== initialLength;
    },
  };
}

describe("blog management", () => {
  it("formats stored publication dates for a date input without a timezone shift", () => {
    expect(
      formatPublicationDateInput(new Date("2026-07-17T23:30:00.000Z")),
    ).toBe("2026-07-17");
  });

  it("creates a draft from a complete date-only form value", async () => {
    const repository = createRepository();
    const result = await createBlogPost(
      {
        title: "Draft field notes",
        category: "Updates",
        content: "A draft blog post.",
        status: "DRAFT",
        publishedAt: "2026-07-17",
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        status: "DRAFT",
        publishedAt: new Date("2026-07-17T00:00:00.000Z"),
      },
    });
  });

  it("creates a blog post with blog-owned media", async () => {
    const repository = createRepository();
    const result = await createBlogPost(
      {
        title: " SDA Field Notes ",
        category: "Updates",
        excerpt: "A short update from SDA.",
        content: "A complete blog post about SDA activities.",
        status: "PUBLISHED",
        publishedAt: "2026-08-10T15:00:00.000Z",
        media: [
          {
            url: "https://example.com/photo.jpg",
            altText: "Students at an SDA program",
            mimeType: "image/jpeg",
            sizeBytes: 250000,
          },
        ],
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        title: "SDA Field Notes",
        slug: "sda-field-notes",
        category: "Updates",
        status: "PUBLISHED",
        media: [
          {
            blogId: "7f4603b4-0a92-4072-95e6-f93844b438d0",
            url: "https://example.com/photo.jpg",
            mimeType: "image/jpeg",
          },
        ],
      },
    });
    expect(repository.posts).toHaveLength(1);
  });

  it("creates a published post from a date-only form value", async () => {
    const repository = createRepository();
    const result = await createBlogPost(
      {
        title: "Published field notes",
        category: "Updates",
        content: "A published blog post.",
        status: "PUBLISHED",
        publishedAt: "2026-07-17",
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        status: "PUBLISHED",
        publishedAt: new Date("2026-07-17T00:00:00.000Z"),
      },
    });
  });

  it("edits a blog post and replaces blog-owned media", async () => {
    const repository = createRepository();
    repository.posts.push(createBlogRecord());

    const result = await updateBlogPost(
      "7f4603b4-0a92-4072-95e6-f93844b438d0",
      {
        title: "Updated SDA Field Notes",
        status: "ARCHIVED",
        media: [
          {
            url: "/blog/updated.pdf",
            altText: "Updated PDF",
            mimeType: "application/pdf",
          },
        ],
      },
      repository,
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        title: "Updated SDA Field Notes",
        slug: "updated-sda-field-notes",
        status: "ARCHIVED",
        media: [
          {
            blogId: "7f4603b4-0a92-4072-95e6-f93844b438d0",
            url: "/blog/updated.pdf",
          },
        ],
      },
    });
    expect(repository.posts[0]?.publishedAt).toEqual(publishedAt);
  });

  it("rejects an empty publication date because the database field is required", async () => {
    const repository = createRepository();
    const result = await createBlogPost(
      {
        title: "Draft without a date",
        category: "Updates",
        content: "A draft blog post.",
        status: "DRAFT",
        publishedAt: "",
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      error:
        "Blog requires valid title, category, content, and publishedAt fields.",
    });
  });

  it("deletes a blog post", async () => {
    const repository = createRepository();
    repository.posts.push(createBlogRecord());

    const result = await deleteBlogPost(
      "7f4603b4-0a92-4072-95e6-f93844b438d0",
      repository,
    );

    expect(result).toEqual({
      ok: true,
      data: { deleted: true },
    });
    expect(repository.posts).toHaveLength(0);
  });

  it("rejects invalid blog media", async () => {
    const repository = createRepository();
    const result = await createBlogPost(
      {
        title: "SDA Field Notes",
        category: "Updates",
        content: "A complete blog post.",
        publishedAt: "2026-08-10T15:00:00.000Z",
        media: [
          {
            url: "data:image/png;base64,unsafe",
            mimeType: "image/png",
          },
        ],
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      error:
        "Blog media requires valid url, mimeType, and optional sizeBytes fields.",
    });
  });

  it("returns a clear conflict for duplicate generated slugs", async () => {
    const repository = createRepository();
    repository.create = async () => {
      throw { code: "P2002" };
    };

    const result = await createBlogPost(
      {
        title: "SDA Field Notes",
        category: "Updates",
        content: "A complete blog post.",
        publishedAt: "2026-08-10T15:00:00.000Z",
      },
      repository,
    );

    expect(result).toEqual({
      ok: false,
      status: 409,
      error:
        "A blog post with this generated slug already exists. Use a more specific title.",
    });
  });
});
