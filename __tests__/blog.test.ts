import { describe, expect, it } from "vitest";
import {
  createBlogPost,
  deleteBlogPost,
  type BlogRecord,
  type BlogRepository,
  updateBlogPost,
} from "@/lib/blog/blog-service";

const now = new Date("2026-07-07T00:00:00.000Z");
const publishedAt = new Date("2026-08-10T15:00:00.000Z");

function createBlogRecord(overrides: Partial<BlogRecord> = {}): BlogRecord {
  const id = "7f4603b4-0a92-4072-95e6-f93844b438d0";

  return {
    id,
    title: "SSDU Field Notes",
    slug: "ssdu-field-notes",
    category: "Updates",
    excerpt: "A short update from SSDU.",
    content: "A complete blog post about SSDU activities.",
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
  it("creates a blog post with blog-owned media", async () => {
    const repository = createRepository();
    const result = await createBlogPost(
      {
        title: " SSDU Field Notes ",
        category: "Updates",
        excerpt: "A short update from SSDU.",
        content: "A complete blog post about SSDU activities.",
        status: "PUBLISHED",
        publishedAt: "2026-08-10T15:00:00.000Z",
        media: [
          {
            url: "https://example.com/photo.jpg",
            altText: "Students at an SSDU program",
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
        title: "SSDU Field Notes",
        slug: "ssdu-field-notes",
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

  it("edits a blog post and replaces blog-owned media", async () => {
    const repository = createRepository();
    repository.posts.push(createBlogRecord());

    const result = await updateBlogPost(
      "7f4603b4-0a92-4072-95e6-f93844b438d0",
      {
        title: "Updated SSDU Field Notes",
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
        title: "Updated SSDU Field Notes",
        slug: "updated-ssdu-field-notes",
        status: "ARCHIVED",
        media: [
          {
            blogId: "7f4603b4-0a92-4072-95e6-f93844b438d0",
            url: "/blog/updated.pdf",
          },
        ],
      },
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
        title: "SSDU Field Notes",
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
        title: "SSDU Field Notes",
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
