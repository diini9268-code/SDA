import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Landmark, Scale, ShieldCheck, UsersRound } from "lucide-react";
import { HomeHeader } from "@/app/_components/home-header";
import { SiteFooter } from "@/app/_components/site-footer";
import {
  foundedLabel,
  missionAims,
  officialMission,
  officialValues,
  organizationLocation,
  organizationMotto,
  publicNavigation,
  strategicObjectives,
} from "@/lib/site/official-content";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description: "Learn about the Somali Diplomacy Association, its official mission, strategic objectives, governance, values, membership principles, and international outreach.",
  path: "/about",
});

const structure = [
  { title: "Supreme Council", description: "The highest governing body, responsible for strategic direction, policy, organizational oversight, major initiatives, plans, budgets, and the protection of SDA's constitution and governance framework.", roles: "Chairperson · Deputy Chairperson" },
  { title: "Executive Council", description: "The body responsible for managing the Association's day-to-day operations and implementing its approved direction.", roles: "Director General · Deputy Director General · Secretary General" },
];

const conduct = [
  "Uphold and protect the reputation and integrity of the Association.",
  "Demonstrate exemplary character, professionalism, and ethical conduct.",
  "Respect organizational leadership, bylaws, and governance structures.",
  "Work actively toward unity, inclusion, and effective collaboration.",
];

const prohibited = [
  "Corruption, financial misconduct, or misuse of organizational resources.",
  "Discrimination based on clan, gender, religion, or background.",
  "Actions that discredit, embarrass, or harm the Association.",
  "Abuse of power, authority, or position within the organization.",
];

const funding = [
  "Membership fees and voluntary contributions from members.",
  "Lawful grants, donations, and awards from partner organizations.",
  "Revenue from programs, training events, and workshops.",
  "Institutional support and partnerships with national and international organizations.",
];

const outreachOrganizations = ["Afro Arab Youth Council", "International Association for Political Science Students (IAPSS)", "United Nations Kenya / UN Youth", "International Youth Diplomacy Conference", "Youth for Peace International", "Global Peace Chain", "World Youth Forum", "AIESEC", "Global Youth Parliament", "Best Diplomat", "Save the Children"];

export default function AboutPage() {
  return (
    <div className="min-w-0 bg-white text-[#071f3c]">
      <a href="#main-content" className="sr-only z-[100] rounded-md bg-white px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      <HomeHeader items={publicNavigation} activeHref="/about" />
      <main id="main-content">
        <section className="relative isolate flex min-h-[690px] items-end overflow-hidden bg-[#071f3c] text-white lg:min-h-[780px] lg:items-center">
          <Image src="/official/sda-italian-embassy-engagement.jpg" alt="SDA representatives during an international engagement" fill className="object-cover object-center" priority sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,25,48,0.95),rgba(4,25,48,0.72)_55%,rgba(4,25,48,0.32))]" />
          <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-20 pt-32 sm:px-8 md:px-10 lg:pb-10 xl:px-16">
            <div className="max-w-[900px]"><p className="text-sm font-bold uppercase tracking-[0.28em] text-[#29b6f6]">Established {foundedLabel} · {organizationLocation}</p><h1 className="mt-7 font-serif text-[54px] font-bold leading-[1.02] sm:text-[72px] lg:text-[88px]">About the Somali Diplomacy Association</h1><p className="mt-8 max-w-[820px] text-lg leading-8 text-white/78 sm:text-xl sm:leading-9">An independent, youth-led platform nurturing diplomatic knowledge, leadership skills, collaboration, and meaningful international engagement among young Somalis.</p></div>
          </div>
        </section>

        <section className="py-24 lg:py-32"><div className="mx-auto grid w-full max-w-[1600px] gap-14 px-5 sm:px-8 md:px-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-20 xl:px-16"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Our Foundation</p><h2 className="mt-5 font-serif text-[42px] font-bold leading-[1.08] sm:text-[54px]">Building diplomatic capacity from within Somalia&apos;s youth.</h2><p className="mt-7 text-lg leading-9 text-[#52657c]">SDA was founded in February 2024 by passionate Somali youth with a shared commitment to diplomacy, leadership, unity, and academic excellence. It brings together students, young professionals, and aspiring diplomats who want to contribute to community affairs, international relations, and peace-building.</p></div><div className="relative aspect-[3/2] overflow-hidden bg-[#e8f1f7]"><Image src="/official/sda-diplomacy-workshop.jpg" alt="SDA diplomacy workshop in session" fill className="object-cover" sizes="(min-width: 1024px) 55vw, 100vw" /></div></div></section>

        <section className="bg-[#f3f7fa] py-24 lg:py-32"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Official Mission</p><h2 className="mt-5 font-serif text-[42px] font-bold leading-[1.08] sm:text-[54px]">Empower youth. Strengthen Somalia&apos;s global engagement.</h2><p className="mt-7 text-lg leading-9 text-[#52657c]">{officialMission}</p></div><ol className="grid gap-4">{missionAims.map((aim, index) => <li key={aim} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 border-b border-[#d8e1e8] pb-5"><span className="font-serif text-2xl font-bold text-[#0a9fda]">{String(index + 1).padStart(2, "0")}</span><p className="leading-7 text-[#40566d]">{aim}</p></li>)}</ol></div></div></section>

        <section className="py-24 lg:py-32"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div className="max-w-4xl"><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Strategic Objectives</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">A practical agenda for education, partnership and participation.</h2></div><div className="mt-14 grid gap-px overflow-hidden border border-[#dce5eb] bg-[#dce5eb] md:grid-cols-2 xl:grid-cols-3">{strategicObjectives.map((objective, index) => <article key={objective} className="bg-white p-7 sm:p-9"><span className="font-serif text-3xl font-bold text-[#0a9fda]">{index + 1}</span><p className="mt-5 text-[17px] leading-8 text-[#40566d]">{objective}</p></article>)}</div></div></section>

        <section className="bg-[#071f3c] py-24 text-white lg:py-32"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#29b6f6]">Governance</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">Organizational Structure</h2></div><div className="mt-14 grid gap-6 lg:grid-cols-2">{structure.map((item, index) => <article key={item.title} className="border border-white/15 p-7 sm:p-10"><div className="flex items-center gap-4">{index === 0 ? <Landmark className="size-8 text-[#29b6f6]" /> : <UsersRound className="size-8 text-[#29b6f6]" />}<h3 className="font-serif text-3xl font-bold">{item.title}</h3></div><p className="mt-6 text-[17px] leading-8 text-white/68">{item.description}</p><p className="mt-7 border-t border-white/15 pt-5 text-sm font-semibold uppercase tracking-[0.12em] text-[#29b6f6]">{item.roles}</p></article>)}</div><p className="mx-auto mt-12 max-w-4xl text-center text-lg leading-8 text-white/68">Leadership serves a two-year term. Elections use a confidential secret ballot, major decisions require a majority vote, and transitions follow the Association&apos;s constitution.</p></div></section>

        <section className="py-24 lg:py-32"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-20"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Values & Principles</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">Standards that guide SDA.</h2><p className="mt-6 text-lg leading-9 text-[#52657c]">{organizationMotto} is expressed through accountable governance, respectful participation, transparent leadership, and meaningful collaboration.</p></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{officialValues.map((value) => <div key={value} className="flex min-h-28 items-center justify-center border border-[#dce5eb] bg-[#f7fafc] p-4 text-center font-semibold"><BadgeCheck className="mr-2 size-5 shrink-0 text-[#0a9fda]" />{value}</div>)}</div></div></div></section>

        <section className="bg-[#f3f7fa] py-24 lg:py-32"><div className="mx-auto grid w-full max-w-[1600px] gap-7 px-5 sm:px-8 md:px-10 lg:grid-cols-2 xl:px-16"><article className="bg-white p-7 sm:p-10"><ShieldCheck className="size-9 text-[#0874b9]" /><h2 className="mt-6 font-serif text-3xl font-bold">Code of Conduct</h2><ul className="mt-7 grid gap-4">{conduct.map((item) => <li key={item} className="flex gap-3 leading-7 text-[#52657c]"><span className="mt-2 size-2 shrink-0 rounded-full bg-[#0a9fda]" />{item}</li>)}</ul></article><article className="bg-[#fff8f7] p-7 sm:p-10"><Scale className="size-9 text-[#b84242]" /><h2 className="mt-6 font-serif text-3xl font-bold">Strictly Prohibited</h2><ul className="mt-7 grid gap-4">{prohibited.map((item) => <li key={item} className="flex gap-3 leading-7 text-[#6c4b4b]"><span className="mt-2 size-2 shrink-0 rounded-full bg-[#c94e4e]" />{item}</li>)}</ul></article></div></section>

        <section className="py-24 lg:py-32"><div className="mx-auto grid w-full max-w-[1600px] gap-14 px-5 sm:px-8 md:px-10 lg:grid-cols-2 lg:gap-20 xl:px-16"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Finance & Sustainability</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">Transparent and accountable stewardship.</h2><p className="mt-7 text-lg leading-9 text-[#52657c]">SDA operates a transparent financial management system with internal reviews and reporting to maintain accountability to members and partners.</p><ul className="mt-8 grid gap-3">{funding.map((item) => <li key={item} className="flex gap-3 leading-7 text-[#52657c]"><span className="mt-2 size-2 shrink-0 bg-[#0a9fda]" />{item}</li>)}</ul></div><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">International Outreach</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">Building relationships beyond borders.</h2><p className="mt-7 text-lg leading-9 text-[#52657c]">SDA has reached out through official correspondence to international institutions, embassies, and youth diplomacy organizations seeking recognition, cooperation, and collaboration.</p><div className="mt-8 flex flex-wrap gap-2">{outreachOrganizations.map((item) => <span key={item} className="border border-[#cbd9e3] px-3 py-2 text-sm text-[#52657c]">{item}</span>)}</div></div></div></section>

        <section className="bg-[#f3f7fa] py-24 lg:py-32"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div className="max-w-4xl"><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Official Activities</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">Diplomacy in practice.</h2></div><div className="mt-14 grid gap-5 lg:grid-cols-3"><div className="relative aspect-[3/2] overflow-hidden lg:col-span-2"><Image src="/official/sda-official-venue-group.jpg" alt="SDA members at an official venue" fill className="object-cover" sizes="(min-width: 1024px) 66vw, 100vw" /></div><div className="relative aspect-[3/2] overflow-hidden lg:aspect-auto"><Image src="/official/sda-interactive-discussion.jpg" alt="SDA interactive group discussion session" fill className="object-cover" sizes="(min-width: 1024px) 34vw, 100vw" /></div><div className="relative aspect-[3/2] overflow-hidden"><Image src="/official/sda-diplomacy-workshop.jpg" alt="SDA diplomacy training workshop" fill className="object-cover" sizes="(min-width: 1024px) 34vw, 100vw" /></div><div className="relative aspect-[3/2] overflow-hidden lg:col-span-2"><Image src="/official/sda-italian-embassy-engagement.jpg" alt="SDA representatives meeting during an international engagement" fill className="object-cover object-center" sizes="(min-width: 1024px) 66vw, 100vw" /></div></div></div></section>

        <section className="bg-[#0a9fda] text-white"><div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-5 py-16 sm:px-8 md:px-10 lg:flex-row lg:items-center lg:justify-between xl:px-16"><div><h2 className="font-serif text-3xl font-bold sm:text-4xl">Partner with the Somali Diplomacy Association.</h2><p className="mt-3 max-w-3xl text-lg leading-8 text-white/80">SDA welcomes cooperation from institutions and individuals who share its commitment to diplomacy, leadership, peace, and youth development.</p></div><Link href="/contact" className="inline-flex min-h-14 shrink-0 items-center gap-3 rounded-[8px] bg-white px-7 text-lg font-semibold text-[#0874b9]">Contact SDA <ArrowRight className="size-5" /></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
