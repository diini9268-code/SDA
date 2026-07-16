import Link from "next/link";
import { PageIntro, PublicPageShell } from "@/app/_components/public-shell";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Programs",
  description:
    "Explore SDA public programs, diplomatic education, leadership activities, and organizational events.",
  path: "/programs",
});

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function getPrograms() {
  try {
    return await prismaProgramRepository.listPublic();
  } catch {
    return [];
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <PublicPageShell>
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <section className="mx-auto max-w-[1600px] space-y-8">
          <PageIntro
            eyebrow="Programs"
            title="SDA Programs"
            description="Diplomatic education, leadership development, academic forums, networking, cultural exchange, research, and organizational events published by SDA administrators."
          />

          {programs.length > 0 ? (
            <div className="grid gap-4">
              {programs.map((program) => (
                <article
                  key={program.id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">
                        <Link
                          href={`/programs/${program.slug}`}
                          className="hover:underline"
                        >
                          {program.title}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {program.location} - {formatDate(program.eventDate)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold uppercase text-slate-500">
                      {program.status}
                    </span>
                  </div>
                  <p className="mt-4 text-base leading-7 text-slate-700">
                    {program.description}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-700 shadow-sm">
              Programs will be published here after administrator review.
            </p>
          )}
        </section>
      </main>
    </PublicPageShell>
  );
}
