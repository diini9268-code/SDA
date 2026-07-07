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
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  media: BlogMediaRecord[];
};

export type BlogRepository = {
  listPublic(): Promise<BlogRecord[]>;
  listAll(): Promise<BlogRecord[]>;
  findPublicBySlug(slug: string): Promise<BlogRecord | null>;
  create(data: BlogCreateData): Promise<BlogRecord>;
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
      status: 400 | 404 | 409;
      error: string;
    };

export async function createBlogPost(
  body: unknown,
  repository: BlogRepository,
): Promise<ServiceResult<BlogRecord>> {
  const input = parseBlogCreateInput(body);

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
      data: await repository.create(input.data),
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
  repository: BlogRepository,
): Promise<ServiceResult<BlogRecord>> {
  const input = parseBlogUpdateInput(body);

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
  repository: BlogRepository,
): Promise<ServiceResult<{ deleted: true }>> {
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
