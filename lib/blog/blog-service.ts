import { isUniqueConstraintError } from "@/lib/db/prisma-errors";
import type {
  BlogCreateData,
  BlogMediaInput,
  BlogStatusValue,
  BlogUpdateData,
} from "@/lib/blog/validation";
import {
  parseBlogCreateInput,
  parseBlogUpdateInput,
} from "@/lib/blog/validation";
import { hasPermission, type UserRoleValue } from "@/lib/auth/permissions";

export type BlogActor = {
  id: string;
  role: UserRoleValue;
};

export type BlogMediaRecord = BlogMediaInput & {
  id: string;
  blogId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  status: BlogStatusValue;
  authorId: string | null;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  media: BlogMediaRecord[];
};

export type BlogRepository = {
  listPublic(): Promise<BlogRecord[]>;
  listAll(): Promise<BlogRecord[]>;
  listByAuthor(authorId: string): Promise<BlogRecord[]>;
  findById(id: string): Promise<BlogRecord | null>;
  findPublicBySlug(slug: string): Promise<BlogRecord | null>;
  create(data: BlogCreateData & { authorId: string }): Promise<BlogRecord>;
  update(id: string, data: BlogUpdateData): Promise<BlogRecord | null>;
  delete(id: string): Promise<boolean>;
};

type ServiceResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      status: 400 | 403 | 404 | 409;
      error: string;
    };

export async function createBlogPost(
  body: unknown,
  actor: BlogActor,
  repository: BlogRepository,
): Promise<ServiceResult<BlogRecord>> {
  const normalizedBody =
    actor.role === "BLOGGER" && body && typeof body === "object"
      ? { ...body, status: "DRAFT" }
      : body;
  const input = parseBlogCreateInput(normalizedBody);

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
      data: await repository.create({ ...input.data, authorId: actor.id }),
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        status: 409,
        error:
          "A blog post with this generated slug already exists. Use a more specific title.",
      };
    }

    throw error;
  }
}

export async function updateBlogPost(
  id: string,
  body: unknown,
  actor: BlogActor,
  repository: BlogRepository,
): Promise<ServiceResult<BlogRecord>> {
  const current = await repository.findById(id);

  if (!current) {
    return { ok: false, status: 404, error: "Blog post not found." };
  }

  if (
    !hasPermission(actor.role, "blog.manage") &&
    current.authorId !== actor.id
  ) {
    return {
      ok: false,
      status: 403,
      error: "You can only edit your own blog drafts.",
    };
  }

  if (actor.role === "BLOGGER" && current.status !== "DRAFT") {
    return {
      ok: false,
      status: 403,
      error: "Published or archived posts can only be changed by an administrator.",
    };
  }

  const normalizedBody =
    actor.role === "BLOGGER" && body && typeof body === "object"
      ? { ...body, status: "DRAFT" }
      : body;
  const input = parseBlogUpdateInput(normalizedBody);

  if (!input.ok) {
    return {
      ok: false,
      status: 400,
      error: input.error,
    };
  }

  let blog: BlogRecord | null;

  try {
    blog = await repository.update(id, input.data);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        status: 409,
        error:
          "A blog post with this generated slug already exists. Use a more specific title.",
      };
    }

    throw error;
  }

  if (!blog) {
    return {
      ok: false,
      status: 404,
      error: "Blog post not found.",
    };
  }

  return {
    ok: true,
    data: blog,
  };
}

export async function deleteBlogPost(
  id: string,
  actor: BlogActor,
  repository: BlogRepository,
): Promise<ServiceResult<{ deleted: true }>> {
  if (!hasPermission(actor.role, "blog.delete")) {
    return {
      ok: false,
      status: 403,
      error: "Only administrators can delete blog posts.",
    };
  }

  const deleted = await repository.delete(id);

  if (!deleted) {
    return {
      ok: false,
      status: 404,
      error: "Blog post not found.",
    };
  }

  return {
    ok: true,
    data: { deleted: true },
  };
}

export function listBlogPostsForActor(
  actor: BlogActor,
  repository: BlogRepository,
): Promise<BlogRecord[]> {
  return hasPermission(actor.role, "blog.manage")
    ? repository.listAll()
    : repository.listByAuthor(actor.id);
}
