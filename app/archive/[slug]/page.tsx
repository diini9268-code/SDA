import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/app/_components/public-shell";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

type ArchiveDetailPageProps = {
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
}: ArchiveDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await prismaArchiveRepository.findPublicBySlug(slug);

  if (!entry) {
    return createPageMetadata({
      title: "Archive record",
      description: "SSDU archive record.",
      path: `/archive/${slug}`,
    });
  }

  return createPageMetadata({
    title: entry.title,
    description: entry.summary.slice(0, 160),
    path: `/archive/${entry.slug}`,
  });
}

export default async function ArchiveDetailPage({
  params,
}: ArchiveDetailPageProps) {
  const { slug } = await params;
  const entry = await prismaArchiveRepository.findPublicBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <PublicPageShell>
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/archive"
            className="text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            Back to archive
          </Link>
          <header className="mt-6 border-b border-slate-200 pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              Archive
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
              {entry.title}
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-600">
              {formatDate(entry.activityDate)}
            </p>
          </header>

          <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-slate-800">
            {entry.summary}
          </div>

          {entry.images.length > 0 ? (
            <section className="mt-8 grid gap-3">
              {entry.images.map((image) => (
                <a
                  key={image}
                  href={image}
                  className="rounded-md border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 hover:border-slate-400"
                >
                  {image}
                </a>
              ))}
            </section>
          ) : null}
        </article>
      </main>
    </PublicPageShell>
  );
}
