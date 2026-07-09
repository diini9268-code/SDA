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

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDlQz_R9velZNgqh77dalZ2xp0KQExkTKjyWbKF_CC9byWapSG4Y6THQqfaqbQR3BSIE7rTr-IYB7k-VdoaKAsvxejF0uRJXDDzCju5D6O-zaqWmkpo1mVt3urviFIZEWDo1gGmJe92Z6Nv1FvSoBxlrrxN_m8c8iQoVd4pLJi4rSIQ5JgGG4gO60TFPEkjOJPn0vqqOYH9DmJItVfpkipvyXf3jvRX37FLFk8D016e85krfWDim7L5JrAerQnfltuksVsxE00M3G1G";

const leaderFallbackImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAgzko7ssLQUVHP6gWtu59aEwrQYRGImfW0SeZZTPkuhvsfTtoQlUGeSr3nOYyfuNFVqwyzjZ40_jRAxIVhUgUbW7dQfQc3IC5qwIjufdmZMUeIOtjnfopm_XgUAXJyIR1P3EMJhZxLg58DcfGmtqbTAXd0xEdbgs5YCkGeJBsv9KN13g4BPZ-oGTmkl_58JnOAqqk6yJ8dOCczz2SQRf4RwD-ftvQIB_7qmpCEa2t5AxgQhKrI2mpFu7cLX8BWaiEiWfIUaQW9fM2m";

const researchFallbackImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCguPxR6L1XpCJwm_0kyaz_xPDk4znUtQXTVa7TWL6NwQVIrkOaEcWNriROC6OCiH_Dx59hAHuDJtqKfdIvQXvqFnAdYrG5K154BGJLpJCqjl7cq8fT4664CMow_KbWySiAAo3tzQxlehGmKE2Y6FWBogEvsDzJwp9n1vLkx3mqnJxXvHe8nYppJv-pG0cxNP0d7i2eX3G8gu6MXkilKS2_5Sf1H1e9ilHpeJPmSY4Gq8oSNv4gz-u1-xSINBucN5jjb9-tfIBRLc1_",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpEer0loktsE5BPM5eYh8YxR_JshEOKSwvaqpC_F5VI4V7kh6rTlMH4auz2lR0W4PREU-ipkzZgBZJfE056m2iTxzsNw05CZO64Ca2gJ1_oLR76hC76t_RbA8nkQ7JEcjzdjQHDMexJ1suUdmNazfUPKE_Zo-TeO7ZIufk3fFbFcu86h7xR-qkCaWAlZ3fCLANyHZMkWf7IJVEL6Y5i3wbSQmWZld_qKZ6ePvNeUTybBDFMakp4fYMPQ1e1FimKRI_Y3E2OjpLgDvS",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD3ruRFSTO4NRj6dabZz54UvveEzWIrqZ3y-Xh5KQJsjTstfVqE2QZci1CJzsq5K1LC9UYIFHBTzYGazH8nSHepbddQVUntCgIJ9Oob2kAkESWHUvPA57nlCu_KN4_9E9BE0U_VBUdB-HkRHINaqkV10l2IWqvzZnNSKCXudbWr0Cw7TJSwIzq8jtOGxxeEv69od2oclY2urB7xFZJm5Hy1DRieRlyoQCaU_RB2Fw_7l4Fui071ZmKlmksy72BKRRRGOIHiA0TdSPIJ",
];

const focusAreas = [
  {
    icon: "□",
    label: "Research",
    description:
      "In-depth analysis of geopolitical shifts affecting the Horn of Africa and Somali interests.",
  },
  {
    icon: "✥",
    label: "Programs",
    description:
      "Educational initiatives designed to bridge the gap between theory and diplomatic practice.",
  },
  {
    icon: "♟",
    label: "Engagement",
    description:
      "Connecting students with veteran diplomats and international policy experts worldwide.",
  },
  {
    icon: "▱",
    label: "Dialogue",
    description:
      "Facilitating constructive debates on peace-building and regional stability.",
  },
];

const partners = [
  { icon: "⌂", label: "UNU" },
  { icon: "◉", label: "Diplomatic Corps" },
  { icon: "♙", label: "Policy Hub" },
  { icon: "⚖", label: "Justice Int'l" },
  { icon: "◇", label: "Somali Link" },
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
  const leaderName = data.featuredLeader?.fullName ?? "Ahmed Farah";
  const leaderPosition = data.featuredLeader?.position ?? "Chairperson, SSDU";

  return (
    <PublicPageShell activeHref="/">
      <main className="bg-[#f8f9fa] pt-20 text-[#191c1d]">
        <section className="relative flex h-[870px] items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(0,6,19,0.9)_30%,rgba(0,6,19,0.4)_100%)]" />
            {/* Static design asset from the supplied visual reference. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full object-cover"
              src={heroImage}
              alt="Young Somali students in professional attire at a formal diplomatic roundtable."
            />
          </div>

          <div className="relative z-20 mx-auto w-full max-w-[1280px] px-6 md:px-16">
            <div className="max-w-2xl">
              <h1 className="mb-6 font-serif text-[32px] font-bold leading-[40px] text-white md:text-[48px] md:leading-[60px] md:tracking-[-0.02em]">
                Shaping the Future of Somali Diplomacy
              </h1>
              <p className="mb-10 max-w-xl text-lg leading-[30px] text-[#e1e3e4]">
                Empowering the next generation of Somali scholars and leaders
                to navigate the complexities of international relations and
                global governance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/membership"
                  className="flex items-center gap-2 rounded-lg bg-[#001f3f] px-8 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all hover:bg-[#40acfe] hover:text-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#40acfe] focus:ring-offset-2 focus:ring-offset-[#000613]"
                >
                  Join Us <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/about"
                  className="rounded-lg border-2 border-[#e1e3e4] px-8 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#000613]"
                >
                  Our Mission
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-24 md:px-16">
          <div className="mb-16 text-center">
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-[#00639c]">
              Core Pillars
            </span>
            <h2 className="font-serif text-[36px] font-bold leading-[48px] text-[#000613]">
              What We Do
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area) => (
              <article
                key={area.label}
                className="group rounded-xl border border-[#c4c6cf] bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-[#edeeef] text-xl text-[#000613] transition-colors group-hover:bg-[#cee5ff]">
                  <span aria-hidden="true">{area.icon}</span>
                </div>
                <h3 className="mb-4 font-serif text-xl font-bold leading-7 text-[#191c1d]">
                  {area.label}
                </h3>
                <p className="text-sm leading-[22px] text-[#43474e]">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#f3f4f5] py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-16">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-[#00639c]">
                  Policy Insights
                </span>
                <h2 className="font-serif text-[36px] font-bold leading-[48px] text-[#000613]">
                  Latest Research
                </h2>
              </div>
              <Link
                className="hidden text-xs font-semibold uppercase tracking-[0.08em] text-[#000613] underline-offset-4 hover:underline md:block"
                href="/blog"
              >
                View all publications
              </Link>
            </div>

            {data.blog.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {data.blog.map((post, index) => {
                  const media = post.media[0];

                  return (
                    <article
                      key={post.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-[#c4c6cf] bg-white"
                    >
                      <div className="h-48 overflow-hidden">
                        {/* Blog media URLs are admin-entered and can point to multiple hosts. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          src={media?.url ?? researchFallbackImages[index]}
                          alt={media?.altText ?? post.title}
                        />
                      </div>
                      <div className="flex grow flex-col p-8">
                        <time className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#43474e]">
                          {formatDate(post.publishedAt)}
                        </time>
                        <h3 className="mb-6 grow font-serif text-xl font-bold leading-7 text-[#191c1d]">
                          {post.title}
                        </h3>
                        <Link
                          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#000613] hover:text-[#00639c]"
                          href={`/blog/${post.slug}`}
                        >
                          Read more <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#c4c6cf] bg-white p-8 text-sm leading-6 text-[#43474e]">
                Published blog records will appear here when available.
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-24 md:px-16">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="md:w-1/3">
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.18em] text-[#00639c]">
                Calendar
              </span>
              <h2 className="mb-6 font-serif text-[36px] font-bold leading-[48px] text-[#000613]">
                Upcoming Programs
              </h2>
              <p className="text-base leading-[26px] text-[#43474e]">
                Join our curated sessions designed to enhance your diplomatic
                toolkit and global perspective.
              </p>
            </div>

            {data.programs.length > 0 ? (
              <div className="space-y-8 md:w-2/3">
                {data.programs.map((program, index) => (
                  <article
                    key={program.id}
                    className={`relative border-l-2 border-[#c4c6cf] pl-12 ${
                      index === data.programs.length - 1 ? "" : "pb-8"
                    }`}
                  >
                    <div className="absolute -left-[9px] top-0 size-4 rounded-full border-4 border-[#f8f9fa] bg-[#000613]" />
                    <div className="rounded-lg border border-[#c4c6cf] bg-white p-6 shadow-sm transition-colors hover:border-[#00639c]">
                      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#00639c]">
                        {formatDate(program.eventDate)}
                      </span>
                      <h3 className="my-2 font-serif text-xl font-bold leading-7 text-[#191c1d]">
                        <Link href={`/programs/${program.slug}`}>
                          {program.title}
                        </Link>
                      </h3>
                      <p className="text-sm leading-[22px] text-[#43474e]">
                        {program.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="md:w-2/3">
                <div className="rounded-lg border border-dashed border-[#c4c6cf] bg-white p-8 text-sm leading-6 text-[#43474e]">
                  Scheduled and published programs will appear here when
                  available.
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#e7e8e9] py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-16">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div className="relative">
                <div className="absolute -left-8 -top-8 select-none font-serif text-[180px] leading-none text-[#40acfe]/10">
                  “
                </div>
                <blockquote className="relative z-10 border-l-4 border-[#40acfe] pl-8">
                  <p className="mb-8 font-serif text-2xl italic leading-9 text-[#000613]">
                    &ldquo;The union is not just an organization; it is a movement.
                    We are building the intellectual foundation upon which the
                    next century of Somali diplomacy will stand. Our students
                    are the architects of a peaceful and prosperous future.&rdquo;
                  </p>
                  <footer>
                    <h3 className="font-serif text-xl font-bold leading-7 text-[#000613]">
                      {leaderName}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#43474e]">
                      {leaderPosition}
                    </p>
                  </footer>
                </blockquote>
              </div>

              <div className="relative aspect-square">
                <div className="absolute inset-0 -rotate-3 rounded-2xl bg-[#001f3f]" />
                {/* Leadership photo URL is admin-entered when present. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="absolute inset-0 h-full w-full rounded-2xl object-cover transition-transform duration-300 hover:rotate-2"
                  src={data.featuredLeader?.photo ?? leaderFallbackImage}
                  alt={data.featuredLeader?.fullName ?? "SSDU chairperson portrait"}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#c4c6cf] bg-white py-20">
          <div className="mx-auto max-w-[1280px] px-6 md:px-16">
            <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#43474e]">
              Our trusted partners & sponsors
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale transition-all hover:grayscale-0 md:gap-24">
              {partners.map((partner) => (
                <div key={partner.label} className="flex items-center gap-2">
                  <span className="text-4xl" aria-hidden="true">
                    {partner.icon}
                  </span>
                  <span className="font-serif text-xl font-bold text-[#191c1d]">
                    {partner.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#001f3f] py-24 text-white">
          <div className="mx-auto max-w-[1280px] px-6 text-center md:px-16">
            <h2 className="mb-6 font-serif text-[32px] font-bold leading-[40px] md:text-[48px] md:leading-[60px]">
              Join the Union Today
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg leading-[30px] text-[#6f88ad]">
              Become part of an elite community dedicated to academic rigor and
              diplomatic excellence. Your journey into global leadership starts
              here.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/membership"
                className="rounded-lg bg-[#40acfe] px-10 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#001f3f] transition-all hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#001f3f]"
              >
                Membership
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-white/30 px-10 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#001f3f]"
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
