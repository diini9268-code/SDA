import Link from "next/link";
import { Mail, UserRound } from "lucide-react";
import { BrandLogo, HomeHeader } from "@/app/_components/home-header";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import type { LeadershipProfile } from "@/lib/leadership/leadership-service";
import { leadershipProfiles, publicNavigation } from "@/lib/site/official-content";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Leadership",
  description: "Meet the official leadership of the Somali Diplomacy Association.",
  path: "/leadership",
});

const navigationItems = publicNavigation;

type PublicLeadershipProfile = Pick<LeadershipProfile, "fullName" | "position" | "biography" | "photo">;

async function getLeadershipProfiles(): Promise<LeadershipProfile[]> {
  try {
    return await prismaLeadershipRepository.listPublic();
  } catch {
    return [];
  }
}

function LeadershipCard({ profile }: { profile: PublicLeadershipProfile }) {
  return (
    <article className="group overflow-hidden rounded-[20px] border border-[#dce3e9] bg-white shadow-[0_10px_35px_rgba(10,41,77,0.06)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#b9d4e5] hover:shadow-[0_20px_45px_rgba(10,41,77,0.13)] motion-reduce:transform-none">
      <div className="relative aspect-[1.44/1] overflow-hidden bg-[#e8f1f7]">
        {profile.photo ? (
          <OptimizedFillImage
            src={profile.photo}
            alt={`Portrait of ${profile.fullName}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none"
            sizes="(min-width: 1280px) 31vw, (min-width: 768px) 48vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center" role="img" aria-label={`No portrait published for ${profile.fullName}`}>
            <UserRound className="size-16 text-[#79a7c3]" strokeWidth={1.25} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="p-6 sm:p-8">
        <p className="inline-flex rounded-full border border-[#cbd9e3] px-4 py-1 text-sm font-medium text-[#52657c]">
          Leadership
        </p>
        <h2 className="mt-5 font-serif text-[26px] font-bold leading-tight text-[#071f3c] sm:text-[29px]">
          {profile.fullName}
        </h2>
        <p className="mt-1 text-[17px] font-medium text-[#0874b9]">
          {profile.position}
        </p>
        <p className="mt-5 line-clamp-4 text-[16px] leading-7 text-[#52657c]">
          {profile.biography}
        </p>
      </div>
    </article>
  );
}

export default async function LeadershipPage() {
  const publishedProfiles = await getLeadershipProfiles();
  const officialNames = new Set(leadershipProfiles.map((profile) => profile.name.toLowerCase()));
  const profiles: PublicLeadershipProfile[] = [
    ...leadershipProfiles.map((profile) => ({ fullName: profile.name, position: profile.position, biography: profile.biography, photo: profile.photo })),
    ...publishedProfiles.filter((profile) => !officialNames.has(profile.fullName.toLowerCase())),
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-[#071f3c]">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-white px-4 py-3 text-[#071f3c] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <HomeHeader
        items={navigationItems}
        activeHref="/leadership"
        overlay={false}
        secondaryItem={{ href: "/login", label: "Login" }}
        joinHref="/membership"
      />

      <main id="main-content" className="pt-20 sm:pt-[90px]">
        <section className="flex min-h-[500px] items-center justify-center bg-[#0a294d] px-5 py-24 text-center text-white sm:min-h-[590px] md:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#2ab3f3] sm:text-base">
              Leadership
            </p>
            <h1 className="mt-7 font-serif text-[46px] font-bold leading-[1.05] sm:text-[64px] lg:text-[74px]">
              Our Leadership
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-[#becbd7] sm:text-[23px] sm:leading-10">
              Meet the people guiding SDA&apos;s work in diplomacy, research,
              international cooperation, and youth leadership.
            </p>
          </div>
        </section>

        <section aria-labelledby="directory-heading" className="px-5 py-20 sm:py-24 md:px-10 xl:px-12">
          <div className="mx-auto max-w-[1780px]">
            <div className="flex flex-col gap-5 text-center sm:items-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Published Profiles
              </p>
              <h2 id="directory-heading" className="font-serif text-[38px] font-bold leading-tight sm:text-[52px]">
                The People Guiding SDA
              </h2>
              <p className="max-w-2xl text-[17px] leading-8 text-[#52657c]">
                Official portraits are followed by any additional profiles
                published through the existing administration system.
              </p>
            </div>

            {profiles.length > 0 ? (
              <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {profiles.map((profile) => (
                  <LeadershipCard key={`${profile.fullName}-${profile.position}`} profile={profile} />
                ))}
              </div>
            ) : (
              <div className="mx-auto mt-14 max-w-3xl rounded-[20px] border border-dashed border-[#b8cbd8] bg-white px-6 py-16 text-center sm:px-12">
                <UserRound className="mx-auto size-12 text-[#2486c0]" strokeWidth={1.4} aria-hidden="true" />
                <h3 className="mt-6 font-serif text-[28px] font-bold">
                  No leadership profiles are published yet.
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-[16px] leading-7 text-[#52657c]">
                  Active profiles will appear here after an authorized
                  administrator publishes them.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white px-5 py-20 text-center md:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
              Connect
            </p>
            <h2 className="mt-6 font-serif text-[38px] font-bold leading-tight sm:text-[50px]">
              Contact the Organization
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-8 text-[#52657c]">
              Leadership and partnership questions are handled through the
              existing public contact workflow.
            </p>
            <Link
              href="/contact"
              className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-[24px] bg-[#1778b8] px-7 font-semibold text-white shadow-md transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-[#0a6098] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0874b9] motion-reduce:transform-none"
            >
              <Mail className="size-5" aria-hidden="true" /> Contact SDA
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#0a294d] text-[#c3cfda]">
        <div className="mx-auto grid max-w-[1780px] gap-12 px-5 py-20 md:grid-cols-2 md:px-10 xl:grid-cols-3 xl:px-12">
          <div>
            <BrandLogo inverse />
            <p className="mt-7 max-w-sm text-[16px] leading-7">
              Empowering Somali youth through training, dialogue, research,
              and international engagement.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">Quick Links</h2>
            <ul className="mt-7 grid grid-cols-2 gap-4">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white focus-visible:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">Contact</h2>
            <p className="mt-7 max-w-md leading-7">
              Use the supported public contact form for leadership,
              membership, and partnership inquiries.
            </p>
            <Link href="/contact" className="mt-7 inline-flex min-h-11 items-center gap-3 text-white transition-colors hover:text-[#28b1f2]">
              <Mail className="size-5" aria-hidden="true" /> Contact SDA
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1780px] flex-col gap-4 border-t border-white/10 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10 xl:px-12">
          <p>&copy; 2026 Somali Diplomacy Association. All rights reserved.</p>
          <Link href="/contact" className="transition-colors hover:text-white">Privacy and terms inquiries</Link>
        </div>
      </footer>
    </div>
  );
}
