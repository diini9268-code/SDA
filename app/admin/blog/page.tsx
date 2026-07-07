import Link from "next/link";
import { DeleteButton, SubmitButton } from "@/app/admin/_components/form-controls";
import {
  createBlogAction,
  deleteBlogAction,
  updateBlogAction,
} from "@/app/admin/blog/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import type { BlogRecord } from "@/lib/blog/blog-service";
import type { BlogStatusValue } from "@/lib/blog/validation";

type BlogAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const blogStatuses: BlogStatusValue[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function formatDateTimeInput(value?: Date): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 16);
}

function mediaToText(blog?: BlogRecord): string {
  if (!blog) {
    return "";
  }

  return blog.media
    .map((media) =>
      [
        media.url,
        media.altText ?? "",
        media.mimeType,
        media.sizeBytes?.toString() ?? "",
      ].join(" | "),
    )
    .join("\n");
}

function StatusMessage({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (!error && !success) {
    return null;
  }

  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm ${
        error
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
      role="status"
    >
      {error ?? success}
    </div>
  );
}

function BlogForm({
  action,
  blog,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  blog?: BlogRecord;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${blog?.id ?? "new"}-title`}>
            Title
          </label>
          <input
            id={`${blog?.id ?? "new"}-title`}
            name="title"
            required
            maxLength={220}
            defaultValue={blog?.title}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${blog?.id ?? "new"}-category`}>
            Category
          </label>
          <input
            id={`${blog?.id ?? "new"}-category`}
            name="category"
            required
            maxLength={120}
            defaultValue={blog?.category}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${blog?.id ?? "new"}-excerpt`}>
          Excerpt
        </label>
        <textarea
          id={`${blog?.id ?? "new"}-excerpt`}
          name="excerpt"
          rows={2}
          maxLength={500}
          defaultValue={blog?.excerpt ?? ""}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${blog?.id ?? "new"}-content`}>
          Content
        </label>
        <textarea
          id={`${blog?.id ?? "new"}-content`}
          name="content"
          required
          rows={8}
          maxLength={20000}
          defaultValue={blog?.content}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${blog?.id ?? "new"}-publishedAt`}>
            Publication date
          </label>
          <input
            id={`${blog?.id ?? "new"}-publishedAt`}
            name="publishedAt"
            type="datetime-local"
            required
            defaultValue={formatDateTimeInput(blog?.publishedAt)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${blog?.id ?? "new"}-status`}>
            Status
          </label>
          <select
            id={`${blog?.id ?? "new"}-status`}
            name="status"
            defaultValue={blog?.status ?? "DRAFT"}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          >
            {blogStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${blog?.id ?? "new"}-media`}>
          Blog media
        </label>
        <textarea
          id={`${blog?.id ?? "new"}-media`}
          name="media"
          rows={4}
          defaultValue={mediaToText(blog)}
          placeholder="https://example.com/image.jpg | Alt text | image/jpeg | 240000"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
        <p className="text-xs leading-5 text-slate-500">
          One media item per line: URL | alt text | MIME type | size in bytes.
          Allowed MIME types: image/jpeg, image/png, image/webp, image/gif,
          application/pdf.
        </p>
      </div>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}

export default async function BlogAdminPage({ searchParams }: BlogAdminPageProps) {
  await requireAdminSession();
  const params = (await searchParams) ?? {};
  const posts = await prismaBlogRepository.listAll();
  const error = firstParam(params.error);
  const success = firstParam(params.success);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10 lg:px-16">
      <section className="mx-auto grid max-w-6xl gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
              Back to dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal">Blog management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create, publish, archive, and attach media that belongs only to
              each blog post.
            </p>
          </div>
          <p className="text-sm font-medium text-slate-600">{posts.length} posts</p>
        </div>

        <StatusMessage error={error} success={success} />

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Add blog post</h2>
          <div className="mt-5">
            <BlogForm action={createBlogAction} submitLabel="Create blog post" />
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Existing blog posts</h2>
          {posts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No blog posts have been created yet.
            </p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-slate-600">
                      {post.category} · {post.publishedAt.toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {post.status} · /blog/{post.slug} · {post.media.length} media
                    </p>
                  </div>
                  <form action={deleteBlogAction.bind(null, post.id)}>
                    <DeleteButton confirmation={`Delete ${post.title}?`} />
                  </form>
                </div>
                <details className="mt-5">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">Edit blog post</summary>
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <BlogForm
                      action={updateBlogAction.bind(null, post.id)}
                      blog={post}
                      submitLabel="Save changes"
                    />
                  </div>
                </details>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
