"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import {
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
} from "@/lib/blog/blog-service";
import { deleteStoredBlogMedia } from "@/lib/blog/blog-media-workflow";
import type { BlogStatusValue } from "@/lib/blog/validation";

const blogStatuses: BlogStatusValue[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

function getText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function parseMediaText(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [url = "", altText = "", mimeType = "image/jpeg", size = ""] =
        line.split("|").map((part) => part.trim());

      return {
        url,
        altText,
        mimeType,
        sizeBytes: size ? Number(size) : null,
        displayOrder: index,
      };
    });
}

function getBlogPayload(formData: FormData) {
  const status = getText(formData, "status");

  return {
    title: getText(formData, "title"),
    category: getText(formData, "category"),
    excerpt: getText(formData, "excerpt"),
    content: getText(formData, "content"),
    publishedAt: getText(formData, "publishedAt"),
    status: blogStatuses.includes(status as BlogStatusValue)
      ? status
      : "DRAFT",
    media: parseMediaText(getText(formData, "media")),
  };
}

function redirectWithStatus(message: string, status: "success" | "error") {
  redirect(
    `/admin/blog?${new URLSearchParams({
      [status]: message,
    }).toString()}`,
  );
}

async function requireActionAdmin() {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin");
  }
}

export async function createBlogAction(formData: FormData) {
  await requireActionAdmin();

  const result = await createBlogPost(getBlogPayload(formData), prismaBlogRepository);

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirectWithStatus("Blog post created.", "success");
}

export async function updateBlogAction(id: string, formData: FormData) {
  await requireActionAdmin();

  const result = await updateBlogPost(
    id,
    getBlogPayload(formData),
    prismaBlogRepository,
  );

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirectWithStatus("Blog post updated.", "success");
}

export async function deleteBlogAction(id: string) {
  await requireActionAdmin();

  const blog = await prismaBlogRepository.findById(id);
  const result = await deleteBlogPost(id, prismaBlogRepository);

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  if (blog) {
    await deleteStoredBlogMedia(blog);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirectWithStatus("Blog post deleted.", "success");
}
