import Link from "next/link";
import { PageIntro, PublicPageShell } from "@/app/_components/public-shell";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "Read SSDU updates, reflections, organizational notes, and student diplomacy publications.",
  path: "/blog",
});

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

async function getBlogPosts() {
  try {
    return await prismaBlogRepository.listPublic();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <PublicPageShell>
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <section className="mx-auto max-w-5xl space-y-8">
          <PageIntro
            eyebrow="Blog"
            title="SSDU Blog"
            description="Updates, reflections, and organizational notes published by SSDU administrators."
          />

          {posts.length > 0 ? (
            <div className="grid gap-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase text-slate-500">
                        {post.category}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-950">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:underline"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">
                      {post.media.length} media
                    </span>
                  </div>
                  {post.excerpt ? (
                    <p className="mt-4 text-base leading-7 text-slate-700">
                      {post.excerpt}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-700 shadow-sm">
              Blog posts will be published here after administrator review.
            </p>
          )}
        </section>
      </main>
    </PublicPageShell>
  );
}
