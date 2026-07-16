import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/app/_components/public-shell";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

type ProgramDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export async function generateMetadata({
  params,
}: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await prismaProgramRepository.findPublicBySlug(slug);

  if (!program) {
    return createPageMetadata({
      title: "Program",
      description: "SDA program.",
      path: `/programs/${slug}`,
    });
  }

  return createPageMetadata({
    title: program.title,
    description: program.description.slice(0, 160),
    path: `/programs/${program.slug}`,
  });
}

export default async function ProgramDetailPage({
  params,
}: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await prismaProgramRepository.findPublicBySlug(slug);

  if (!program) {
    notFound();
  }

  return (
    <PublicPageShell>
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/programs"
            className="text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            Back to programs
          </Link>
          <header className="mt-6 border-b border-slate-200 pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              {program.status}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
              {program.title}
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-600">
              {program.location} - {formatDate(program.eventDate)}
            </p>
          </header>

          <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-slate-800">
            {program.description}
          </div>
        </article>
      </main>
    </PublicPageShell>
  );
}
