import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarDays, Globe2, Handshake, MapPin, MessagesSquare } from "lucide-react";
import { PublicPageShell } from "@/app/_components/public-shell";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Programs",
  description: "Explore official Somali Diplomacy Association training, academic forums, diplomatic dialogue, networking, cultural exchange, and research activities.",
  path: "/programs",
});

const activityAreas = [
  { icon: Globe2, title: "Diplomacy Training", description: "Interactive education in diplomacy, international law, negotiation, and conflict resolution." },
  { icon: MessagesSquare, title: "Academic Forums", description: "Debates, seminars, workshops, and youth discussion panels on national and global affairs." },
  { icon: Handshake, title: "Professional Networking", description: "Events connecting SDA members with diplomats, institutions, and international organizations." },
  { icon: BookOpenText, title: "Research & Publications", description: "Research and publication activities that promote diplomatic knowledge and informed dialogue." },
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

async function getPrograms() {
  try {
    return await prismaProgramRepository.listPublic();
  } catch {
    return [];
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <PublicPageShell activeHref="/programs">
      <main>
        <section className="relative isolate min-h-[620px] overflow-hidden bg-[#071f3c] text-white"><Image src="/official/sda-diplomacy-workshop.jpg" alt="SDA diplomacy training workshop" fill className="object-cover" priority sizes="100vw" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,25,48,0.95),rgba(4,25,48,0.62),rgba(4,25,48,0.32))]" /><div className="relative mx-auto flex min-h-[620px] w-full max-w-[1600px] items-center px-5 py-20 sm:px-8 md:px-10 xl:px-16"><div className="max-w-[870px]"><p className="text-sm font-bold uppercase tracking-[0.26em] text-[#29b6f6]">Programs & Activities</p><h1 className="mt-6 font-serif text-[52px] font-bold leading-[1.03] sm:text-[68px] lg:text-[80px]">Diplomatic education through practice.</h1><p className="mt-7 max-w-3xl text-lg leading-9 text-white/76">SDA delivers training, academic dialogue, networking, cultural exchange, civic education, research, and publication activities that strengthen the diplomatic and leadership capacities of Somali youth.</p></div></div></section>

        <section className="py-24 lg:py-32"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-20"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Program Areas</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">Capacity, dialogue and connection.</h2></div><p className="max-w-3xl text-lg leading-9 text-[#52657c]">Programs are designed to advance knowledge of diplomacy and international relations, develop professional leadership skills, promote peaceful coexistence, and create meaningful networks for young Somalis.</p></div><div className="mt-14 grid gap-px overflow-hidden border border-[#dce5eb] bg-[#dce5eb] md:grid-cols-2 xl:grid-cols-4">{activityAreas.map(({ icon: Icon, title, description }) => <article key={title} className="bg-white p-7 sm:p-9"><Icon className="size-8 text-[#0a9fda]" /><h3 className="mt-7 font-serif text-2xl font-bold">{title}</h3><p className="mt-4 leading-7 text-[#52657c]">{description}</p></article>)}</div></div></section>

        <section className="bg-[#f3f7fa] py-24 lg:py-32"><div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 md:px-10 xl:px-16"><div className="max-w-4xl"><p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0874b9]">Published Schedule</p><h2 className="mt-5 font-serif text-[42px] font-bold sm:text-[54px]">Current SDA programs</h2><p className="mt-5 text-lg leading-8 text-[#52657c]">The following records are maintained by authorized administrators through the existing program management system.</p></div>{programs.length ? <div className="mt-14 grid gap-7 lg:grid-cols-2 xl:grid-cols-3">{programs.map((program) => <article key={program.id} className="group flex min-h-[330px] flex-col border border-[#dce5eb] bg-white p-7 sm:p-9"><span className="self-start rounded-full bg-[#e7f3fa] px-3 py-1 text-sm font-semibold text-[#0874b9]">{program.status.charAt(0) + program.status.slice(1).toLowerCase()}</span><h3 className="mt-7 font-serif text-[28px] font-bold leading-tight group-hover:text-[#0874b9]"><Link href={`/programs/${program.slug}`}>{program.title}</Link></h3><p className="mt-5 line-clamp-3 leading-7 text-[#52657c]">{program.description}</p><div className="mt-auto grid gap-2 pt-7 text-sm text-[#718196]"><p className="flex items-center gap-2"><CalendarDays className="size-4 text-[#0a9fda]" />{formatDate(program.eventDate)}</p><p className="flex items-center gap-2"><MapPin className="size-4 text-[#0a9fda]" />{program.location}</p></div><Link href={`/programs/${program.slug}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0874b9]">Program details <ArrowRight className="size-4" /></Link></article>)}</div> : <div className="mt-14 border border-dashed border-[#b8cbd8] bg-white px-6 py-14 text-center"><h3 className="font-serif text-2xl font-bold">No public programs are currently published.</h3><p className="mt-3 text-[#52657c]">Approved program records will appear here when they are published.</p></div>}</div></section>

        <section className="py-24"><div className="mx-auto grid w-full max-w-[1600px] gap-6 px-5 sm:px-8 md:grid-cols-2 md:px-10 xl:px-16"><div className="relative min-h-[390px] overflow-hidden"><Image src="/official/sda-interactive-discussion.jpg" alt="Interactive SDA group discussion" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" /></div><div className="flex flex-col justify-center bg-[#071f3c] p-8 text-white sm:p-12"><p className="text-sm font-bold uppercase tracking-[0.22em] text-[#29b6f6]">Diplomatic Awareness</p><h2 className="mt-5 font-serif text-4xl font-bold">Structured dialogue on Somalia&apos;s role in the world.</h2><p className="mt-6 text-lg leading-8 text-white/70">SDA awareness sessions create space for young participants to examine foreign policy priorities and the role youth can play in shaping diplomatic outcomes.</p><Link href="/contact" className="mt-8 inline-flex items-center gap-2 font-semibold text-[#29b6f6]">Discuss a program partnership <ArrowRight className="size-4" /></Link></div></div></section>
      </main>
    </PublicPageShell>
  );
}
