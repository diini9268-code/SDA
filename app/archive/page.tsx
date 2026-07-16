import Link from "next/link";
import { Archive, ArrowRight, CalendarDays } from "lucide-react";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { PublicPageShell } from "@/app/_components/public-shell";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Archive",
  description:
    "Browse published Somali Diplomacy Association records and documented activities.",
  path: "/archive",
});

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

async function getArchiveEntries() {
  try {
    return { entries: await prismaArchiveRepository.listPublic(), available: true };
  } catch {
    return { entries: [], available: false };
  }
}

export default async function ArchivePage() {
  const { entries, available } = await getArchiveEntries();

  return (
    <PublicPageShell activeHref="/archive">
      <main id="main-content">
        <section className="bg-[#0a294d] px-5 py-24 text-center text-white md:px-10 lg:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#29b6f6]">
            Documented Work
          </p>
          <h1 className="mt-6 font-serif text-[48px] font-bold leading-tight sm:text-[62px] lg:text-[72px]">
            SDA Archive
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#c3cfda] sm:text-xl">
            Public records and photographs published through the Association&apos;s
            existing content management workflow.
          </p>
        </section>

        <section className="bg-[#f3f7fa] py-20 lg:py-28">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10 xl:px-16">
            {entries.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {entries.map((entry) => (
                  <article
                    key={entry.id}
                    className="flex min-h-[440px] flex-col overflow-hidden rounded-[8px] border border-[#d6e0e8] bg-white transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"
                  >
                    {entry.images[0] ? (
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#dce7ef]">
                        <OptimizedFillImage
                          src={entry.images[0]}
                          alt={entry.title}
                          className="object-cover transition-transform duration-500 hover:scale-[1.03] motion-reduce:transform-none"
                          sizes="(min-width: 1280px) 31vw, (min-width: 768px) 48vw, 100vw"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-[#e6f0f7] text-[#1778b8]">
                        <Archive className="size-14" strokeWidth={1.4} aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-7">
                      <p className="flex items-center gap-2 text-sm font-semibold text-[#52657c]">
                        <CalendarDays className="size-4" aria-hidden="true" />
                        <time dateTime={entry.activityDate.toISOString()}>{formatDate(entry.activityDate)}</time>
                      </p>
                      <h2 className="mt-4 font-serif text-2xl font-bold leading-snug text-[#071f3c]">
                        {entry.title}
                      </h2>
                      <p className="mt-4 text-[16px] leading-7 text-[#52657c]">{entry.summary}</p>
                      <Link
                        href={`/archive/${entry.slug}`}
                        className="mt-auto inline-flex min-h-11 items-end gap-2 pt-7 font-semibold text-[#0874b9] hover:text-[#075d92]"
                      >
                        View record <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-4xl rounded-[8px] border border-dashed border-[#b9c8d4] bg-white px-6 py-20 text-center">
                <Archive className="mx-auto size-14 text-[#1778b8]" strokeWidth={1.4} aria-hidden="true" />
                <h2 className="mt-6 font-serif text-3xl font-bold text-[#071f3c]">
                  No public archive records yet
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-8 text-[#52657c]">
                  {available
                    ? "Records will appear here after an authorized administrator publishes them."
                    : "Archive records are temporarily unavailable. Please try again later."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
