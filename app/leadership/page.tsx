import { PageIntro, PublicPageShell } from "@/app/_components/public-shell";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Leadership",
  description:
    "Meet SSDU leadership and organizational members guiding programs, publications, and student diplomacy initiatives.",
  path: "/leadership",
});

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
    <PublicPageShell>
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <section className="mx-auto max-w-5xl space-y-8">
          <PageIntro
            eyebrow="Leadership"
            title="SSDU Leadership"
            description="Executive council members and organizational leaders guiding SSDU programs, publications, and student diplomacy initiatives."
          />

          {profiles.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {profiles.map((profile) => (
                <article
                  key={profile.id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
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
            <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-700 shadow-sm">
              Leadership profiles will be published here after administrator
              review.
            </p>
          )}
        </section>
      </main>
    </PublicPageShell>
  );
}
