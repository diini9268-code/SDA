import Link from "next/link";
import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/app/_components/public-shell";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
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
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <article className="mx-auto max-w-3xl">
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
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
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

          <section className="mt-8 grid gap-4" aria-label="Post media">
            {post.media.length > 0 ? (
              post.media.map((media) =>
                media.mimeType.startsWith("image/") ? (
                  <figure
                    key={media.id}
                    className="overflow-hidden rounded-[12px] border border-slate-200 bg-slate-100"
                  >
                    <div className="relative aspect-[16/9]">
                      <OptimizedFillImage
                        src={media.url}
                        alt={media.altText ?? post.title}
                        className="size-full object-cover"
                        sizes="(min-width: 768px) 768px, 100vw"
                      />
                    </div>
                    {media.altText ? (
                      <figcaption className="px-4 py-3 text-sm text-slate-600">
                        {media.altText}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : (
                  <a
                    key={media.id}
                    href={media.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-16 items-center gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700 hover:border-slate-400"
                  >
                    <FileText className="size-6 text-slate-500" aria-hidden="true" />
                    <span className="font-semibold text-slate-950">
                      {media.altText ?? "Open attached PDF"}
                    </span>
                  </a>
                ),
              )
            ) : (
              <div className="flex min-h-40 items-center justify-center rounded-[12px] bg-slate-100 text-slate-500">
                <FileText className="size-10" aria-hidden="true" />
                <span className="sr-only">No media published for this post.</span>
              </div>
            )}
          </section>

          <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-slate-800">
            {post.content}
          </div>
        </article>
      </main>
    </PublicPageShell>
  );
}
