import Link from "next/link";
import { PageIntro, PublicPageShell } from "@/app/_components/public-shell";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  description:
    "SSDU connects students with diplomacy, leadership, public service, programs, publications, and civic engagement opportunities.",
  path: "/",
});

async function getHomeStats() {
  try {
    const [archive, blog, leadership, programs] = await Promise.all([
      prismaArchiveRepository.listPublic(),
      prismaBlogRepository.listPublic(),
      prismaLeadershipRepository.listPublic(),
      prismaProgramRepository.listPublic(),
    ]);

    return {
      archiveCount: archive.length,
      blogCount: blog.length,
      leadershipCount: leadership.length,
      programCount: programs.length,
      latestPost: blog[0] ?? null,
      nextProgram: programs[0] ?? null,
    };
  } catch {
    return {
      archiveCount: 0,
      blogCount: 0,
      leadershipCount: 0,
      programCount: 0,
      latestPost: null,
      nextProgram: null,
    };
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

export default async function Home() {
  const stats = await getHomeStats();

  return (
    <PublicPageShell>
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <section className="mx-auto grid max-w-6xl gap-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <PageIntro
              eyebrow="Somali Student Diplomacy Union"
              title="Students building diplomacy, leadership, and public service capacity."
              description="SSDU is a student-led platform for programs, publications, leadership development, membership, and civic engagement."
            />
            <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Get involved
              </p>
              <div className="grid gap-3 sm:flex sm:flex-wrap">
                <Link
                  href="/membership"
                  className="rounded-md bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Apply for membership
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  Contact SSDU
                </Link>
              </div>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <dt className="text-sm font-medium text-slate-500">Leaders</dt>
              <dd className="mt-2 text-3xl font-semibold text-slate-950">
                {stats.leadershipCount}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <dt className="text-sm font-medium text-slate-500">Programs</dt>
              <dd className="mt-2 text-3xl font-semibold text-slate-950">
                {stats.programCount}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <dt className="text-sm font-medium text-slate-500">Blog posts</dt>
              <dd className="mt-2 text-3xl font-semibold text-slate-950">
                {stats.blogCount}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <dt className="text-sm font-medium text-slate-500">Archive records</dt>
              <dd className="mt-2 text-3xl font-semibold text-slate-950">
                {stats.archiveCount}
              </dd>
            </div>
          </dl>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Latest blog
              </p>
              {stats.latestPost ? (
                <>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                    <Link
                      href={`/blog/${stats.latestPost.slug}`}
                      className="hover:underline"
                    >
                      {stats.latestPost.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {formatDate(stats.latestPost.publishedAt)}
                  </p>
                  {stats.latestPost.excerpt ? (
                    <p className="mt-4 text-sm leading-6 text-slate-700">
                      {stats.latestPost.excerpt}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Blog posts will appear here after publication.
                </p>
              )}
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Next program
              </p>
              {stats.nextProgram ? (
                <>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                    <Link
                      href={`/programs/${stats.nextProgram.slug}`}
                      className="hover:underline"
                    >
                      {stats.nextProgram.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {stats.nextProgram.location} -{" "}
                    {formatDate(stats.nextProgram.eventDate)}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-slate-700">
                    {stats.nextProgram.description}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Programs will appear here after publication.
                </p>
              )}
            </article>
          </section>
        </section>
      </main>
    </PublicPageShell>
  );
}
