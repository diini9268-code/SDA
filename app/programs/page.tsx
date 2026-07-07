import { prismaProgramRepository } from "@/lib/programs/program-repository";

export const dynamic = "force-dynamic";

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
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:px-10 lg:px-16">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
            Programs
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-slate-950">
            SSDU Programs
          </h1>
          <p className="text-lg leading-8 text-slate-700">
            Public programs, student diplomacy activities, and organizational
            events published by SSDU administrators.
          </p>
        </div>

        {programs.length > 0 ? (
          <div className="grid gap-4">
            {programs.map((program) => (
              <article
                key={program.id}
                className="border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">
                      {program.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {program.location} · {formatDate(program.eventDate)}
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
          <p className="border border-slate-200 bg-white p-5 text-slate-700">
            Programs will be published here after administrator review.
          </p>
        )}
      </section>
    </main>
  );
}
