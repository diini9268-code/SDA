import Link from "next/link";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { PublicPageShell } from "@/app/_components/public-shell";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import type { LeadershipProfile } from "@/lib/leadership/leadership-service";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Leadership",
  description:
    "Meet SSDU leadership and organizational members guiding programs, publications, and student diplomacy initiatives.",
  path: "/leadership",
});

const fallbackProfiles = [
  {
    fullName: "Abdi Warsame",
    position: "Union Chairperson",
    biography:
      "A graduate student specializing in International Relations. Abdi oversees the strategic direction of the Union and represents SSDU at global policy forums.",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
  },
  {
    fullName: "Leyla Hassan",
    position: "Deputy Chairperson",
    biography:
      "Focusing on Law and Public Policy, Leyla manages internal operations and ensures academic standards are maintained across all regional student chapters.",
    photo:
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?auto=format&fit=crop&w=700&q=80",
  },
  {
    fullName: "Omar Sheikh",
    position: "Director of Research",
    biography:
      "Omar leads the Union's diplomatic archive project and coordinates with international think tanks on Horn of Africa stability and student advocacy.",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80",
  },
  {
    fullName: "Fatima Yusuf",
    position: "Treasurer & Finance",
    biography:
      "Managing the Union's endowments and project budgets, Fatima ensures financial transparency and sustainable growth for student scholarships.",
    photo:
      "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=700&q=80",
  },
  {
    fullName: "Mohamed Ali",
    position: "Communications Director",
    biography:
      "Mohamed handles all external press relations and digital diplomacy initiatives, ensuring the Union's voice resonates across international platforms.",
    photo:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=700&q=80",
  },
  {
    fullName: "Sahra Ahmed",
    position: "Membership & Outreach",
    biography:
      "Sahra is responsible for diversifying the Union's membership base and coordinating with Somali student associations in the diaspora.",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80",
  },
];

async function getLeadershipProfiles() {
  try {
    return await prismaLeadershipRepository.listPublic();
  } catch {
    return [];
  }
}

function displayProfiles(profiles: LeadershipProfile[]) {
  if (profiles.length === 0) {
    return fallbackProfiles;
  }

  return profiles.map((profile, index) => ({
    fullName: profile.fullName,
    position: profile.position,
    biography: profile.biography,
    photo: profile.photo ?? fallbackProfiles[index % fallbackProfiles.length].photo,
  }));
}

function LeadershipCard({
  biography,
  fullName,
  photo,
  position,
}: {
  biography: string;
  fullName: string;
  photo: string;
  position: string;
}) {
  return (
    <article className="rounded-md border border-[#c4c6cf] bg-white p-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
        <OptimizedFillImage
          src={photo}
          alt={fullName}
          className="h-full w-full object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
      <h3 className="mt-5 font-serif text-xl font-bold text-[#000613]">
        {fullName}
      </h3>
      <p className="mt-1 text-xs font-semibold text-[#00639c]">{position}</p>
      <p className="mt-4 text-sm leading-6 text-[#44474e]">{biography}</p>
    </article>
  );
}

export default async function LeadershipPage() {
  const profiles = displayProfiles(await getLeadershipProfiles());
  const coreProfiles = profiles.slice(0, 3);
  const councilProfiles = profiles.slice(3, 6);

  return (
    <PublicPageShell activeHref="/leadership">
      <main className="bg-[#f7fafc] pt-20 text-[#181c1e]">
        <section className="border-b border-[#c4c6cf] bg-[#f7fafc]">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-16">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 text-sm text-[#44474e]"
            >
              <Link href="/" className="hover:text-[#000613]">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link href="/about" className="hover:text-[#000613]">
                About Us
              </Link>
              <span className="mx-2">›</span>
              <span className="font-semibold text-[#000613]">Leadership</span>
            </nav>
            <h1 className="font-serif text-[32px] font-bold leading-[40px] text-[#000613] md:text-[48px] md:leading-[60px]">
              Our Leadership
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#44474e]">
              The Somali Student Diplomacy Union is guided by a dedicated team
              of student leaders, policy researchers, and cultural ambassadors
              committed to fostering international cooperation and academic
              excellence.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-20 text-center md:px-16">
          <span className="inline-flex rounded-full bg-[#d6e3ff] px-4 py-1 text-xs font-semibold text-[#00639c]">
            Governance Structure
          </span>
          <h2 className="mt-5 font-serif text-[32px] font-bold leading-10 text-[#000613]">
            The Executive Hierarchy
          </h2>

          <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center">
            <div className="w-64 rounded-md border-2 border-[#000613] bg-white p-6">
              <div className="text-xl" aria-hidden="true">
                ♜
              </div>
              <h3 className="mt-2 font-serif text-lg font-bold text-[#000613]">
                Chairperson
              </h3>
              <p className="mt-2 text-sm leading-5 text-[#44474e]">
                Strategic Oversight &amp; Union Spokesperson
              </p>
            </div>
            <div className="h-12 w-px bg-[#00639c]" />
            <div className="w-64 rounded-md border-2 border-[#40acfe] bg-white p-6">
              <div className="text-xl text-[#00639c]" aria-hidden="true">
                ♟
              </div>
              <h3 className="mt-2 font-serif text-lg font-bold text-[#000613]">
                Deputy Chairperson
              </h3>
              <p className="mt-2 text-sm leading-5 text-[#44474e]">
                Internal Operations &amp; Chapter Relations
              </p>
            </div>
            <div className="h-10 w-px bg-[#00639c]" />
            <div className="h-px w-full max-w-4xl bg-[#00639c]" />
            <div className="grid w-full max-w-5xl gap-8 pt-10 md:grid-cols-3">
              {[
                "Policy & Research Division",
                "Finance & Membership",
                "External Affairs & Media",
              ].map((label) => (
                <div
                  key={label}
                  className="rounded-md border border-[#c4c6cf] bg-white px-6 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#44474e]">
                    Executive Council
                  </p>
                  <p className="mt-1 text-sm text-[#44474e]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f1f4f6] py-20">
          <div className="mx-auto max-w-[1280px] px-6 md:px-16">
            <h2 className="border-l-4 border-[#e9c176] pl-6 font-serif text-[32px] font-bold leading-10 text-[#000613]">
              Core Leadership
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {coreProfiles.map((profile) => (
                <LeadershipCard key={profile.fullName} {...profile} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7fafc] py-20">
          <div className="mx-auto max-w-[1280px] px-6 md:px-16">
            <h2 className="border-l-4 border-[#e9c176] pl-6 font-serif text-[32px] font-bold leading-10 text-[#000613]">
              Executive Council
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {(councilProfiles.length > 0 ? councilProfiles : fallbackProfiles.slice(3)).map(
                (profile) => (
                  <LeadershipCard key={profile.fullName} {...profile} />
                ),
              )}
            </div>
          </div>
        </section>

        <section className="bg-[#000613] px-6 py-20 text-center text-white md:px-16">
          <h2 className="font-serif text-[32px] font-bold leading-10">
            Join the Next Generation of Diplomats
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#eef1f3]">
            Are you ready to represent, research, and reform? Applications for
            the Executive Council Associate program are now open.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/membership"
              className="bg-[#ffdea5] px-8 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#000613]"
            >
              Apply Now
            </Link>
            <Link
              href="/programs"
              className="border border-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
            >
              View Open Roles
            </Link>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
