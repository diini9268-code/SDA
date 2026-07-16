import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/app/_components/public-shell";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(date);
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prismaBlogRepository.findPublicBySlug(slug);

  if (!post) {
    return createPageMetadata({
      title: "Blog post",
      description: "SDA blog post.",
      path: `/blog/${slug}`,
    });
  }

  return createPageMetadata({
    title: post.title,
    description:
      post.excerpt ??
      `Read ${post.title}, a ${post.category} update from SDA.`,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await prismaBlogRepository.findPublicBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <PublicPageShell>
      <main className="px-5 py-16 sm:px-10 lg:py-24 xl:px-16">
        <article className="mx-auto max-w-[1100px]">
          <Link
            href="/blog"
            className="text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            Back to blog
          </Link>
          <header className="mt-6 border-b border-slate-200 pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              {post.category}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-600">
              {formatDate(post.publishedAt)}
            </p>
            {post.excerpt ? (
              <p className="mt-5 text-lg leading-8 text-slate-700">
                {post.excerpt}
              </p>
            ) : null}
          </header>

          {post.media.length > 0 ? (
            <section className="mt-8 grid gap-3">
              {post.media.map((media) => (
                <a
                  key={media.id}
                  href={media.url}
                  className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700 hover:border-slate-400"
                >
                  <span className="font-semibold text-slate-950">
                    {media.altText ?? "Blog media"}
                  </span>
                  <span className="ml-2 text-slate-500">{media.mimeType}</span>
                </a>
              ))}
            </section>
          ) : null}

          <div className="mt-10 max-w-4xl whitespace-pre-wrap text-[17px] leading-8 text-slate-800">
            {post.content}
          </div>
        </article>
      </main>
    </PublicPageShell>
  );
}
