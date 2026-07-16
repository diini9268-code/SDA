import Link from "next/link";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { PublicPageShell } from "@/app/_components/public-shell";
import type { ArchiveRecord } from "@/lib/archive/archive-service";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Archive",
  description:
    "Browse SDA archive records and documented organizational activities.",
  path: "/archive",
});

type ArchiveDisplayEntry = {
  id: string;
  title: string;
  slug?: string;
  summary: string;
  activityDate: Date;
  imageUrl: string;
  imageAlt: string;
  label: string;
  period: string;
  action: string;
};

type RepositoryCard = {
  title: string;
  summary: string;
  label: string;
  action: string;
};

const sampleArchiveEntries: ArchiveDisplayEntry[] = [
  {
    id: "official-founding-2024",
    title: "Somali Diplomacy Association Founded",
    summary:
      "SDA was founded in February 2024 by Somali youth committed to diplomacy, leadership, unity, and academic excellence.",
    activityDate: new Date("2024-02-01T00:00:00.000Z"),
    imageUrl: "/official/sda-official-venue-group.jpg",
    imageAlt: "Somali Diplomacy Association members gathered at an official venue",
    label: "Official Milestone",
    period: "February 2024",
    action: "Official Record",
  },
];

const repositoryCards: RepositoryCard[] = [
  {
    title: "Diplomacy and International Relations",
    summary:
      "Education in diplomacy, international law, negotiation, and conflict resolution.",
    label: "Training",
    action: "Program Area",
  },
  {
    title: "Leadership Development",
    summary:
      "Workshops in public speaking, strategic thinking, planning, teamwork, and ethical leadership.",
    label: "Development",
    action: "Program Area",
  },
  {
    title: "Research and Publications",
    summary:
      "Research and publication activities advancing diplomatic knowledge and informed dialogue.",
    label: "Knowledge",
    action: "Program Area",
  },
];

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function toArchiveDisplayEntry(entry: ArchiveRecord): ArchiveDisplayEntry {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    summary: entry.summary,
    activityDate: entry.activityDate,
    imageUrl: entry.images[0] ?? "",
    imageAlt: entry.title,
    label: "Archive Record",
    period: formatMonthYear(entry.activityDate),
    action: "Explore Record",
  };
}

async function getArchiveEntries() {
  try {
    return await prismaArchiveRepository.listPublic();
  } catch {
    return [];
  }
}

function EntryLink({
  entry,
  children,
  className,
}: {
  entry: ArchiveDisplayEntry;
  children: React.ReactNode;
  className: string;
}) {
  if (!entry.slug) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Link href={`/archive/${entry.slug}`} className={className}>
      {children}
    </Link>
  );
}

function TimelineCard({
  entry,
}: {
  entry: ArchiveDisplayEntry;
}) {
  return (
    <article
      className="rounded-lg border border-[#cbd2da] bg-white p-6 text-left shadow-sm"
    >
      <span className="inline-flex rounded-full border border-[#cbd2da] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#5c636b]">
        {entry.label}
      </span>
      <h3 className="mt-4 font-serif text-xl font-bold text-[#000613]">
        {entry.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#5c636b]">{entry.summary}</p>
      <EntryLink
        entry={entry}
        className="mt-5 inline-flex text-xs font-bold text-[#00639c] hover:underline"
      >
        {entry.action}
      </EntryLink>
    </article>
  );
}

export default async function ArchivePage() {
  const archiveEntries = await getArchiveEntries();
  const entries =
    archiveEntries.length > 0
      ? archiveEntries.map(toArchiveDisplayEntry)
      : sampleArchiveEntries;
  const featured = entries[0];
  const timelineEntries = entries.slice(1, 4);

  return (
    <PublicPageShell activeHref="/archive">
      <main className="pt-[129px] md:pt-20">
        <section className="bg-[#002e5f] px-6 py-24 text-white md:px-16">
          <div className="mx-auto max-w-[1600px]">
            <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl">
              The SDA Archive
            </h1>
            <p className="mt-8 max-w-2xl border-l-4 border-[#f9d28b] pl-5 text-base leading-7 text-white/72">
              A chronological repository of Somali youth diplomacy, academic
              discourse, and institutional history.
            </p>
          </div>
        </section>

        <section className="bg-[#f8f9fa] px-6 py-16 md:px-16">
          <div className="mx-auto max-w-[1600px]">
            <article className="grid overflow-hidden rounded-lg border border-[#cbd2da] bg-white shadow-sm lg:grid-cols-[1fr_1fr]">
              {featured.imageUrl ? (
                <div className="relative min-h-[320px] w-full">
                  <OptimizedFillImage
                    src={featured.imageUrl}
                    alt={featured.imageAlt}
                    className="h-full min-h-[320px] w-full object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center bg-[#002e5f] px-6 text-center">
                  <p className="font-serif text-3xl font-bold text-white">
                    SDA Archive Record
                  </p>
                </div>
              )}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00639c]">
                  {featured.label}
                </p>
                <h2 className="mt-5 max-w-xl font-serif text-3xl font-bold leading-tight text-[#000613] sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-[#43474e]">
                  {featured.summary}
                </p>
                <EntryLink
                  entry={featured}
                  className="mt-7 inline-flex text-sm font-bold text-[#000613] hover:text-[#00639c] hover:underline"
                >
                  {featured.action}
                </EntryLink>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-[#f8f9fa] px-6 py-20 md:px-16">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-16 text-center">
              <h2 className="font-serif text-3xl font-bold text-[#000613]">
                Institutional Timeline
              </h2>
              <div className="mx-auto mt-5 h-px w-20 bg-[#e9c176]" />
            </div>

            <div className="relative mx-auto max-w-5xl space-y-12 md:space-y-16">
              <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[#cbd2da] md:block" />
              {timelineEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="relative grid gap-5 md:grid-cols-[1fr_40px_1fr] md:items-center"
                >
                  <div className={index % 2 === 0 ? "md:text-right" : ""}>
                    {index % 2 === 1 ? (
                      <TimelineCard entry={entry} />
                    ) : (
                      <p className="font-serif text-xl text-[#000613]">
                        {entry.period}
                      </p>
                    )}
                  </div>
                  <div className="relative hidden items-center justify-center md:flex">
                    <span className="z-10 flex size-8 items-center justify-center rounded-full bg-[#000613] text-[10px] font-bold text-white">
                      {index === 0 ? "ST" : index === 1 ? "DI" : "AR"}
                    </span>
                  </div>
                  <div>
                    {index % 2 === 0 ? (
                      <TimelineCard entry={entry} />
                    ) : (
                      <p className="font-serif text-xl text-[#000613]">
                        {entry.period}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eef0f2] px-6 py-20 md:px-16">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-serif text-4xl font-bold text-[#000613]">
                  Program and Knowledge Areas
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-[#5c636b]">
                  Official areas of work documented in the SDA organization profile.
                </p>
              </div>
              <Link
                href="/archive"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#000613] bg-white px-7 text-sm font-bold text-[#000613] transition hover:bg-[#000613] hover:text-white"
              >
                Browse All Records
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {repositoryCards.map((card) => (
                <article
                  key={card.title}
                  className="flex min-h-[260px] flex-col rounded-sm border border-[#cbd2da] bg-white p-7 shadow-sm"
                >
                  <div className="mb-8 flex size-8 items-center justify-center rounded-sm border border-[#00639c] text-xs font-bold text-[#00639c]">
                    AR
                  </div>
                  <h3 className="font-serif text-lg font-bold leading-tight text-[#000613]">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[#5c636b]">
                    {card.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-8 text-[10px] font-bold uppercase tracking-[0.12em] text-[#43474e]">
                    <span>{card.label}</span>
                    <span className="text-[#000613]">{card.action}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f8f9fa] px-6 py-20 md:px-16">
          <div className="mx-auto max-w-[1600px] rounded-xl bg-[#002e5f] px-6 py-14 text-center text-white shadow-2xl md:px-16">
            <h2 className="font-serif text-4xl font-bold">
              Contact SDA
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/75">
              Use the public contact workflow for questions about SDA activities,
              programs, publications, or official records.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#f9d28b] px-8 text-sm font-bold text-[#000613] transition hover:bg-[#e9c176]"
              >
                Send an Inquiry
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white px-8 text-sm font-bold text-white transition hover:bg-white hover:text-[#000613]"
              >
                Contact SDA
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
