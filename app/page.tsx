import Link from "next/link";
import { PublicPageShell } from "@/app/_components/public-shell";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  description:
    "SSDU connects Somali students with diplomacy, leadership, programs, publications, and civic engagement opportunities.",
  path: "/",
});

const focusAreas = [
  {
    label: "Research",
    description:
      "Publishing analysis and student perspectives on diplomacy, policy, and civic affairs.",
  },
  {
    label: "Programs",
    description:
      "Hosting seminars, workshops, and practical learning opportunities for emerging leaders.",
  },
  {
    label: "Engagement",
    description:
      "Connecting students with civic participation, dialogue, and public service pathways.",
  },
  {
    label: "Dialogue",
    description:
      "Creating structured spaces for exchange across institutions, communities, and partners.",
  },
];

async function getHomeData() {
  try {
    const [archive, blog, leadership, programs] = await Promise.all([
      prismaArchiveRepository.listPublic(),
      prismaBlogRepository.listPublic(),
      prismaLeadershipRepository.listPublic(),
      prismaProgramRepository.listPublic(),
    ]);

    return {
      archiveCount: archive.length,
      blog: blog.slice(0, 3),
      blogCount: blog.length,
      featuredLeader: leadership[0] ?? null,
      leadershipCount: leadership.length,
      programs: programs.slice(0, 3),
      programCount: programs.length,
    };
  } catch {
    return {
      archiveCount: 0,
      blog: [],
      blogCount: 0,
      featuredLeader: null,
      leadershipCount: 0,
      programs: [],
      programCount: 0,
    };
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <PublicPageShell>
      <main className="bg-slate-50 text-slate-950">
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8 lg:px-10">
          <div
            className="relative min-h-[520px] overflow-hidden rounded-sm bg-slate-950 px-6 py-20 text-white shadow-2xl sm:px-10 lg:px-14"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(2, 6, 23, 0.94) 0%, rgba(2, 6, 23, 0.78) 44%, rgba(2, 6, 23, 0.42) 100%), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="max-w-xl pt-12 sm:pt-20">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                Somali Student Diplomacy Union
              </p>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
                Shaping the Future of Somali Diplomacy
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-200 sm:text-lg">
                Empowering the next generation of Somali scholars and leaders
                to navigate the complexities of international relations and
                global governance.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/membership"
                  className="rounded bg-sky-700 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-sky-600"
                >
                  Join Us
                </Link>
                <Link
                  href="/about"
                  className="rounded border border-white/40 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
                >
                  Our Mission
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Core pillars" title="What We Do" centered />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {focusAreas.map((area, index) => (
                <article
                  key={area.label}
                  className="rounded border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex size-9 items-center justify-center rounded border border-slate-200 bg-slate-50 text-xs font-black text-sky-800">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2 className="mt-5 text-lg font-black">{area.label}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {area.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Publications"
                title="Latest Research"
                note="Shown from published blog records until the research module is available."
              />
              <Link
                href="/blog"
                className="text-sm font-bold text-sky-800 hover:text-sky-950"
              >
                View all publications
              </Link>
            </div>

            {data.blog.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {data.blog.map((post) => {
                  const media = post.media[0];

                  return (
                    <article
                      key={post.id}
                      className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm"
                    >
                      {media ? (
                        // Blog media URLs are admin-entered and can point to multiple hosts.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={media.url}
                          alt={media.altText ?? post.title}
                          className="h-44 w-full object-cover"
                        />
                      ) : (
                        <div className="h-44 bg-[linear-gradient(135deg,#dbeafe,#f8fafc_45%,#bae6fd)]" />
                      )}
                      <div className="p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          {formatDate(post.publishedAt)}
                        </p>
                        <h3 className="mt-3 text-lg font-black leading-snug">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="hover:text-sky-800"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        {post.excerpt ? (
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                            {post.excerpt}
                          </p>
                        ) : null}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="mt-4 inline-flex text-sm font-bold text-sky-800 hover:text-sky-950"
                        >
                          Read more
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyPanel message="Published blog records will appear here when available." />
            )}
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="Programs"
              title="Upcoming Programs"
              note="Upcoming items come from scheduled or published program records."
            />
            {data.programs.length > 0 ? (
              <div className="relative grid gap-5 border-l border-slate-200 pl-7">
                {data.programs.map((program) => (
                  <article
                    key={program.id}
                    className="relative rounded border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <span className="absolute -left-[34px] top-6 size-3 rounded-full border-2 border-white bg-sky-700 shadow" />
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-800">
                      {formatDate(program.eventDate)}
                    </p>
                    <h3 className="mt-2 text-lg font-black">
                      <Link
                        href={`/programs/${program.slug}`}
                        className="hover:text-sky-800"
                      >
                        {program.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      {program.location}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                      {program.description}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyPanel message="Scheduled and published programs will appear here when available." />
            )}
          </div>
        </section>

        <section className="bg-slate-200 px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div className="border-l-4 border-sky-600 pl-6">
              <p className="text-2xl font-black leading-snug text-slate-950">
                A movement for students who want to understand diplomacy,
                public service, and the future of Somali leadership.
              </p>
              {data.featuredLeader ? (
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-600">
                  {data.featuredLeader.fullName}, {data.featuredLeader.position}
                </p>
              ) : (
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-slate-600">
                  Somali Student Diplomacy Union
                </p>
              )}
            </div>
            <div className="overflow-hidden rounded border-[10px] border-slate-900 bg-slate-300 shadow-xl lg:rotate-2">
              {data.featuredLeader?.photo ? (
                // Leadership photo URLs are admin-entered and can point to multiple hosts.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.featuredLeader.photo}
                  alt={data.featuredLeader.fullName}
                  className="h-80 w-full object-cover"
                />
              ) : (
                <div className="flex h-80 items-center justify-center bg-[linear-gradient(135deg,#e2e8f0,#f8fafc)] text-6xl font-black text-slate-400">
                  SSDU
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-12 sm:px-8 lg:px-10">
          <dl className="mx-auto grid max-w-4xl gap-6 text-center sm:grid-cols-4">
            <Stat label="Leaders" value={data.leadershipCount} />
            <Stat label="Programs" value={data.programCount} />
            <Stat label="Publications" value={data.blogCount} />
            <Stat label="Archive" value={data.archiveCount} />
          </dl>
        </section>

        <section className="bg-sky-950 px-5 py-16 text-center text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-black sm:text-4xl">
              Join the Union Today
            </h2>
            <p className="mt-4 text-sm leading-7 text-sky-100 sm:text-base">
              Become part of a student community dedicated to academic rigor,
              civic dialogue, and leadership development.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/membership"
                className="rounded bg-white px-5 py-3 text-sm font-bold text-sky-950 transition hover:bg-sky-100"
              >
                Become a Member
              </Link>
              <Link
                href="/contact"
                className="rounded border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

function SectionHeading({
  centered = false,
  eyebrow,
  note,
  title,
}: {
  centered?: boolean;
  eyebrow: string;
  note?: string;
  title: string;
}) {
  return (
    <div className={centered ? "mx-auto max-w-xl text-center" : "max-w-xl"}>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-800">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
        {title}
      </h2>
      {note ? <p className="mt-3 text-sm leading-6 text-slate-600">{note}</p> : null}
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="mt-8 rounded border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
      {message}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-3xl font-black text-slate-950">{value}</dd>
    </div>
  );
}
