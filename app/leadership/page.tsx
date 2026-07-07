import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";

export const dynamic = "force-dynamic";

async function getLeadershipProfiles() {
  try {
    return await prismaLeadershipRepository.listPublic();
  } catch {
    return [];
  }
}

export default async function LeadershipPage() {
  const profiles = await getLeadershipProfiles();

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:px-10 lg:px-16">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
            Leadership
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-slate-950">
            SSDU Leadership
          </h1>
          <p className="text-lg leading-8 text-slate-700">
            Executive council members and organizational leaders guiding SSDU
            programs, research, and student diplomacy initiatives.
          </p>
        </div>

        {profiles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {profiles.map((profile) => (
              <article
                key={profile.id}
                className="border border-slate-200 bg-white p-5"
              >
                <h2 className="text-xl font-semibold text-slate-950">
                  {profile.fullName}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  {profile.position}
                </p>
                <p className="mt-4 text-base leading-7 text-slate-700">
                  {profile.biography}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="border border-slate-200 bg-white p-5 text-slate-700">
            Leadership profiles will be published here after administrator
            review.
          </p>
        )}
      </section>
    </main>
  );
}
