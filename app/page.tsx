import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, Globe2, Handshake, Target, UsersRound } from "lucide-react";
import { HomeHeader } from "@/app/_components/home-header";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { SiteFooter } from "@/app/_components/site-footer";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import {
  foundedLabel,
  leadershipProfiles,
  officialMission,
  officialValues,
  organizationLocation,
  organizationMotto,
  publicNavigation,
  strategicObjectives,
} from "@/lib/site/official-content";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  description: "The official website of the Somali Diplomacy Association, empowering Somali youth through diplomatic education, leadership development, research, and international engagement.",
  path: "/",
});

async function getHomeData() {
  const [blogResult, leadershipResult, programsResult] = await Promise.allSettled([
    prismaBlogRepository.listPublic(),
    prismaLeadershipRepository.listPublic(),
    prismaProgramRepository.listPublic(),
  ]);
  const blog = blogResult.status === "fulfilled" ? blogResult.value : [];
  const leadership = leadershipResult.status === "fulfilled" ? leadershipResult.value : [];
  const programs = programsResult.status === "fulfilled" ? programsResult.value : [];

  return {
    blog: blog.slice(0, 3),
    programs: programs.slice(0, 3),
    statistics: [
      { value: blogResult.status === "fulfilled" ? blog.length : null, label: "Published Articles" },
      { value: programsResult.status === "fulfilled" ? programs.length : null, label: "Public Programs" },
      { value: leadershipResult.status === "fulfilled" ? leadership.length : null, label: "Published Leadership Profiles" },
    ],
  };
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <div className="home-shell min-w-0 bg-white text-[#071f3c]">
      <a href="#main-content" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-white px-4 py-3 font-semibold shadow-xl transition-transform focus:translate-y-0">Skip to main content</a>
      <HomeHeader items={publicNavigation} activeHref="/" />

      <main id="main-content">
        <section className="relative isolate min-h-[760px] overflow-hidden bg-[#071f3c] text-white lg:min-h-[860px]">
          <OptimizedFillImage src="/official/sda-official-venue-group.jpg" alt="Somali Diplomacy Association members gathered at an official venue" className="object-cover object-center" priority sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,25,48,0.96)_0%,rgba(4,25,48,0.84)_42%,rgba(4,25,48,0.34)_72%,rgba(4,25,48,0.24)_100%)]" />
          <div className="relative mx-auto grid min-h-[760px] w-full max-w-[1600px] items-end px-5 pb-20 pt-32 sm:px-8 sm:pb-24 md:px-10 lg:min-h-[860px] lg:grid-cols-[minmax(0,1.15fr)_minmax(390px,0.85fr)] lg:items-center lg:gap-16 lg:pb-16 xl:px-16">
            <div className="home-fade-up max-w-[900px]">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#29b6f6]">Founded {foundedLabel} · {organizationLocation}</p>
              <h1 className="mt-7 max-w-[900px] font-serif text-[48px] font-bold leading-[1.02] sm:text-[66px] lg:text-[78px] xl:text-[88px]">Diplomacy, leadership and unity for Somalia&apos;s next generation.</h1>
              <p className="mt-8 max-w-[760px] text-lg leading-8 text-white/78 sm:text-xl sm:leading-9">{officialMission}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/membership" className="inline-flex min-h-14 items-center gap-3 rounded-[8px] bg-[#0a9fda] px-7 text-lg font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0787bb] motion-reduce:transform-none">Become a Member <ArrowRight className="size-5" aria-hidden="true" /></Link>
                <Link href="/about" className="inline-flex min-h-14 items-center rounded-[8px] border border-white/60 px-7 text-lg font-semibold transition hover:bg-white/10">About SDA</Link>
              </div>
            </div>
            <dl className="mt-14 grid gap-3 sm:grid-cols-3 lg:mt-0 lg:grid-cols-1">
              {data.statistics.map((item) => <div key={item.label} className="border-l-2 border-[#29b6f6] bg-[#0a294d]/72 px-6 py-5 backdrop-blur-md"><dt className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60">{item.label}</dt><dd className="mt-2 font-serif text-4xl font-bold text-white">{item.value ?? "—"}</dd></div>)}
            </dl>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-20">
              <div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Who We Are</p><h2 className="mt-5 font-serif text-[42px] font-bold leading-[1.08] sm:text-[54px] lg:text-[62px]">A platform for diplomatic knowledge and youth leadership.</h2></div>
              <p className="max-w-3xl text-lg leading-9 text-[#52657c]">SDA is an independent, youth-led organization building the capacity of young Somalis to engage in community affairs, international relations, and peace-building. It brings together students, young professionals, and aspiring diplomats committed to shaping a better future for Somalia.</p>
            </div>
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {[{ icon: Target, title: "Our Mission", text: officialMission }, { icon: Globe2, title: "Strategic Objectives", text: strategicObjectives.slice(0, 3).join(" ") }, { icon: Handshake, title: "Our Principles", text: officialValues.join(" · ") }].map(({ icon: Icon, title, text }) => <article key={title} className="border-t-4 border-[#0a9fda] bg-[#f4f8fb] p-7 sm:p-9"><Icon className="size-8 text-[#0874b9]" aria-hidden="true" /><h3 className="mt-7 font-serif text-2xl font-bold">{title}</h3><p className="mt-4 text-[16px] leading-8 text-[#52657c]">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#f3f7fa] py-24 lg:py-32">
          <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Programs & Activities</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">Learning through engagement.</h2></div><Link href="/programs" className="inline-flex items-center gap-2 font-semibold text-[#0874b9] hover:underline">View published programs <ArrowRight className="size-4" /></Link></div>
            <div className="mt-14 grid gap-7 lg:grid-cols-2">
              <article className="relative min-h-[460px] overflow-hidden bg-[#071f3c] text-white"><Image src="/official/sda-diplomacy-workshop.jpg" alt="SDA diplomacy training workshop" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /><div className="absolute inset-0 bg-gradient-to-t from-[#071f3c] via-[#071f3c]/25 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-7 sm:p-10"><h3 className="font-serif text-3xl font-bold">Diplomacy Training Workshop</h3><p className="mt-3 max-w-2xl leading-7 text-white/75">Interactive learning on diplomacy, international law, negotiation, and conflict resolution for Somali students and professionals.</p></div></article>
              <article className="relative min-h-[460px] overflow-hidden bg-[#071f3c] text-white"><Image src="/official/sda-interactive-discussion.jpg" alt="SDA members participating in an interactive group discussion" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /><div className="absolute inset-0 bg-gradient-to-t from-[#071f3c] via-[#071f3c]/25 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-7 sm:p-10"><h3 className="font-serif text-3xl font-bold">Diplomatic Awareness & Dialogue</h3><p className="mt-3 max-w-2xl leading-7 text-white/75">Structured discussions on diplomacy, Somalia&apos;s foreign policy priorities, and the role of youth in diplomatic outcomes.</p></div></article>
            </div>
            {data.programs.length ? <div className="mt-8 grid gap-5 md:grid-cols-3">{data.programs.map((program) => <Link key={program.id} href={`/programs/${program.slug}`} className="group border border-[#dbe4eb] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"><CalendarDays className="size-6 text-[#0a9fda]" /><h3 className="mt-5 font-serif text-xl font-bold group-hover:text-[#0874b9]">{program.title}</h3><p className="mt-3 text-sm leading-6 text-[#52657c]">{program.location} · {formatDate(program.eventDate)}</p></Link>)}</div> : null}
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Leadership</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">People advancing the mission.</h2></div><Link href="/leadership" className="inline-flex items-center gap-2 font-semibold text-[#0874b9] hover:underline">Meet the leadership <ArrowRight className="size-4" /></Link></div>
            <div className="mt-14 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">{leadershipProfiles.map((leader) => <article key={leader.name}><div className="relative aspect-[4/5] overflow-hidden bg-[#e8f1f7]"><Image src={leader.photo} alt={`Portrait of ${leader.name}`} fill className="object-cover object-top" sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" /></div><h3 className="mt-5 font-serif text-2xl font-bold">{leader.name}</h3><p className="mt-1 text-sm font-semibold leading-6 text-[#0874b9]">{leader.position}</p></article>)}</div>
          </div>
        </section>

        {data.blog.length ? <section className="bg-[#f3f7fa] py-24 lg:py-32"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div className="flex items-end justify-between gap-6"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Insights</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">From the SDA Blog</h2></div><BookOpenText className="hidden size-12 text-[#9db9cc] sm:block" /></div><div className="mt-14 grid gap-7 lg:grid-cols-3">{data.blog.map((post) => <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white p-7 sm:p-8"><p className="text-sm font-semibold text-[#0874b9]">{post.category}</p><h3 className="mt-5 font-serif text-2xl font-bold leading-8 group-hover:text-[#0874b9]">{post.title}</h3><p className="mt-5 line-clamp-3 leading-7 text-[#52657c]">{post.excerpt ?? post.content}</p><p className="mt-7 text-sm text-[#718196]">{formatDate(post.publishedAt ?? post.createdAt)}</p></Link>)}</div></div></section> : null}

        <section className="relative isolate overflow-hidden bg-[#071f3c] text-white"><Image src="/official/sda-workshop-provided.jpg" alt="SDA diplomacy workshop participants" fill className="object-cover" sizes="100vw" /><div className="absolute inset-0 bg-[#071f3c]/82" /><div className="relative mx-auto max-w-[1100px] px-5 py-24 text-center sm:px-8 lg:py-32"><UsersRound className="mx-auto size-10 text-[#29b6f6]" /><p className="mt-7 text-sm font-bold uppercase tracking-[0.25em] text-[#29b6f6]">{organizationMotto}</p><h2 className="mt-5 font-serif text-[42px] font-bold leading-tight sm:text-[58px]">Take part in Somalia&apos;s diplomatic future.</h2><p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/72">Membership is open to people committed to SDA&apos;s mission, constitution, ethical standards, and active participation.</p><Link href="/membership" className="mt-9 inline-flex min-h-14 items-center gap-3 rounded-[8px] bg-white px-8 text-lg font-semibold text-[#0874b9]">Apply for Membership <ArrowRight className="size-5" /></Link></div></section>
      </main>

      <SiteFooter />
    </div>
  );
}
