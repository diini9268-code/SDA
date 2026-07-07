import Link from "next/link";
import { PageIntro, PublicPageShell } from "@/app/_components/public-shell";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Archive",
  description:
    "Browse SSDU archive records, historical activities, organizational milestones, and past programs.",
  path: "/archive",
});

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

async function getArchiveEntries() {
  try {
    return await prismaArchiveRepository.listPublic();
  } catch {
    return [];
  }
}

export default async function ArchivePage() {
  const entries = await getArchiveEntries();

  return (
    <PublicPageShell>
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <section className="mx-auto max-w-5xl space-y-8">
          <PageIntro
            eyebrow="Archive"
            title="SSDU Archive"
            description="Historical activities, organizational milestones, and past SSDU records."
          />

          {entries.length > 0 ? (
            <div className="grid gap-4">
              {entries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">
                        <Link
                          href={`/archive/${entry.slug}`}
                          className="hover:underline"
                        >
                          {entry.title}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {formatDate(entry.activityDate)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">
                      {entry.images.length} images
                    </span>
                  </div>
                  <p className="mt-4 text-base leading-7 text-slate-700">
                    {entry.summary}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-700 shadow-sm">
              Archive records will be published here after administrator review.
            </p>
          )}
        </section>
      </main>
    </PublicPageShell>
  );
}
