import Image from "next/image";
import { HomeHeader } from "@/app/_components/home-header";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { SiteFooter } from "@/app/_components/site-footer";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import type { LeadershipProfile } from "@/lib/leadership/leadership-service";
import { leadershipProfiles, publicNavigation } from "@/lib/site/official-content";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Leadership",
  description: "Meet the official leadership of the Somali Diplomacy Association and learn about its governance structure.",
  path: "/leadership",
});

async function getPublishedProfiles(): Promise<LeadershipProfile[]> {
  try {
    return await prismaLeadershipRepository.listPublic();
  } catch {
    return [];
  }
}

export default async function LeadershipPage() {
  const publishedProfiles = await getPublishedProfiles();
  const officialNames = new Set(leadershipProfiles.map((profile) => profile.name.toLowerCase()));
  const additionalProfiles = publishedProfiles.filter((profile) => !officialNames.has(profile.fullName.toLowerCase()));

  return (
    <div className="min-w-0 bg-white text-[#071f3c]">
      <a href="#main-content" className="sr-only z-[100] rounded-md bg-white px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      <HomeHeader items={publicNavigation} activeHref="/leadership" overlay={false} />
      <main id="main-content" className="pt-20 sm:pt-[90px]">
        <section className="bg-[#071f3c] text-white"><div className="mx-auto grid min-h-[560px] w-full max-w-[1600px] gap-12 px-5 py-20 sm:px-8 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-24 xl:px-16"><div><p className="text-sm font-bold uppercase tracking-[0.26em] text-[#29b6f6]">Leadership</p><h1 className="mt-6 font-serif text-[46px] font-bold leading-[1.03] sm:text-[68px] lg:text-[78px]">Leadership grounded in service and accountability.</h1><p className="mt-7 max-w-2xl text-lg leading-9 text-white/70">SDA&apos;s leadership guides the Association&apos;s strategy, institutional development, research, international cooperation, and youth engagement.</p></div><div className="relative aspect-[3/2] overflow-hidden"><Image src="/official/sda-official-venue-group.jpg" alt="Somali Diplomacy Association members and leaders" fill className="object-cover" priority sizes="(min-width: 1024px) 60vw, 100vw" /></div></div></section>

        <section className="py-24 lg:py-32"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div className="max-w-4xl"><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Official Leadership</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[56px]">The people guiding SDA.</h2></div><div className="mt-14 grid gap-x-7 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">{leadershipProfiles.map((profile) => <article key={profile.name} className="group"><div className="relative aspect-[4/5] overflow-hidden bg-[#e8f1f7]"><Image src={profile.photo} alt={`Portrait of ${profile.name}`} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none" sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" /></div><h3 className="mt-6 font-serif text-[27px] font-bold leading-tight">{profile.name}</h3><p className="mt-2 min-h-12 text-[15px] font-semibold leading-6 text-[#0874b9]">{profile.position}</p><p className="mt-4 text-[15px] leading-7 text-[#52657c]">{profile.biography}</p></article>)}</div></div></section>

        <section className="bg-[#f3f7fa] py-24 lg:py-32"><div className="mx-auto grid w-full max-w-[1600px] gap-7 px-5 sm:px-8 md:px-10 lg:grid-cols-2 xl:px-16"><article className="bg-white p-7 sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0874b9]">Supreme Council</p><h2 className="mt-5 font-serif text-3xl font-bold">Strategic governance</h2><p className="mt-5 text-[17px] leading-8 text-[#52657c]">Sets the Association&apos;s strategic direction and policy, oversees activities and programs, approves major initiatives and budgets, and safeguards the constitution and governance framework.</p><p className="mt-7 border-t border-[#dce5eb] pt-5 font-semibold">Chairperson · Deputy Chairperson</p></article><article className="bg-white p-7 sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0874b9]">Executive Council</p><h2 className="mt-5 font-serif text-3xl font-bold">Day-to-day leadership</h2><p className="mt-5 text-[17px] leading-8 text-[#52657c]">Manages the daily operations of the Association and carries forward the strategy and decisions established through SDA&apos;s governance structure.</p><p className="mt-7 border-t border-[#dce5eb] pt-5 font-semibold">Director General · Deputy Director General · Secretary General</p></article></div></section>

        {additionalProfiles.length ? <section className="py-24"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Published Directory</p><h2 className="mt-5 font-serif text-[38px] font-bold sm:text-[48px]">Additional active profiles</h2><p className="mt-4 max-w-3xl leading-7 text-[#52657c]">These profiles are maintained through the existing protected SDA administration system.</p></div><div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">{additionalProfiles.map((profile) => <article key={profile.id} className="border border-[#dce5eb] bg-white"><div className="relative aspect-[4/3] overflow-hidden bg-[#e8f1f7]">{profile.photo ? <OptimizedFillImage src={profile.photo} alt={`Portrait of ${profile.fullName}`} className="object-cover object-top" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" /> : null}</div><div className="p-7"><h3 className="font-serif text-2xl font-bold">{profile.fullName}</h3><p className="mt-2 font-semibold text-[#0874b9]">{profile.position}</p><p className="mt-4 line-clamp-5 leading-7 text-[#52657c]">{profile.biography}</p></div></article>)}</div></div></section> : null}
      </main>
      <SiteFooter />
    </div>
  );
}
