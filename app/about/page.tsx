import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Globe2,
  Handshake,
  Mail,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { BrandLogo, HomeHeader } from "@/app/_components/home-header";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import type { ArchiveRecord } from "@/lib/archive/archive-service";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import type { ProgramRecord } from "@/lib/programs/program-service";
import { createPageMetadata } from "@/lib/site/metadata";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about the Somali Student Diplomacy Union, its principles, public archive, programs, and work supporting Somali youth diplomacy.",
  path: "/about",
});

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/membership", label: "Membership" },
  { href: "/leadership", label: "Leadership" },
  { href: "/contact", label: "Contact" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We uphold clear ethical standards across our public programs, partnerships, and organizational work.",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    description:
      "We pursue high standards in diplomatic education, leadership, and public engagement.",
  },
  {
    icon: UsersRound,
    title: "Inclusivity",
    description:
      "We welcome Somali students and professionals from varied communities, disciplines, and experiences.",
  },
  {
    icon: Handshake,
    title: "Unity",
    description:
      "We believe dialogue and cooperation create durable paths to shared progress.",
  },
  {
    icon: BookOpen,
    title: "Knowledge",
    description:
      "We invest in evidence-based thinking, practical training, and continuous learning.",
  },
  {
    icon: Globe2,
    title: "Global Mindset",
    description:
      "We prepare members to participate confidently in international conversations.",
  },
];

const faqs = [
  {
    question: "Who can apply for membership?",
    answer:
      "The membership form accepts applications from people who can provide their contact details, university, and area of interest. Applications are reviewed by the SSDU administration team.",
  },
  {
    question: "How can I find current programs?",
    answer:
      "Published programs appear on the Programs page with their date, location, description, and current status.",
  },
  {
    question: "Where can I see SSDU's previous work?",
    answer:
      "The public Archive contains organizational activities and images that have been published by SSDU administrators.",
  },
  {
    question: "How can I contact the organization?",
    answer:
      "Use the Contact page to send a message directly to the SSDU administration team.",
  },
];

async function getAboutData(): Promise<{
  archive: ArchiveRecord[];
  programs: ProgramRecord[];
  archiveAvailable: boolean;
}> {
  const [archiveResult, programResult] = await Promise.allSettled([
    prismaArchiveRepository.listPublic(),
    prismaProgramRepository.listPublic(),
  ]);

  return {
    archive: archiveResult.status === "fulfilled" ? archiveResult.value : [],
    programs: programResult.status === "fulfilled" ? programResult.value : [],
    archiveAvailable: archiveResult.status === "fulfilled",
  };
}

function getYear(date: Date): string {
  return new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
}

export default async function AboutPage() {
  const data = await getAboutData();
  const gallery = data.archive.flatMap((entry) =>
    entry.images.map((src, index) => ({
      src,
      alt: index === 0 ? entry.title : `${entry.title}, image ${index + 1}`,
      id: `${entry.id}-${index}`,
    })),
  );

  return (
    <div className="min-w-0 bg-white text-[#0a294d]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-white px-4 py-3 font-semibold text-[#0a294d] shadow-xl transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <HomeHeader
        items={navigationItems}
        activeHref="/about"
        overlay={false}
        secondaryItem={{ href: "/admin", label: "Login" }}
        joinHref="/membership"
      />

      <main id="main-content" className="pt-20 sm:pt-[90px]">
        <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#0a294d] text-white lg:min-h-[610px]">
          <OptimizedFillImage
            src="/home/diplomatic-chamber.png"
            alt=""
            className="h-full w-full object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-[#071f3c]/78" />
          <div className="relative mx-auto w-full max-w-[1780px] px-5 py-24 text-center md:px-10 xl:px-12">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#29b6f6]">
              Our Story
            </p>
            <h1 className="mt-7 font-serif text-[52px] font-bold leading-none sm:text-[66px] lg:text-[80px]">
              About SSDU
            </h1>
            <p className="mx-auto mt-9 max-w-[980px] text-lg leading-8 text-white/78 sm:text-xl lg:text-[25px] lg:leading-10">
              A youth-led platform building practical pathways into diplomacy,
              leadership, research, and international engagement.
            </p>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1780px] items-center gap-12 px-5 md:px-10 lg:grid-cols-[1fr_1.05fr] xl:gap-20 xl:px-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Our Purpose
              </p>
              <h2 className="mt-6 max-w-3xl font-serif text-[40px] font-bold leading-tight sm:text-[50px] lg:text-[56px]">
                From a Vision to a Movement
              </h2>
              <div className="mt-8 max-w-[760px] space-y-6 text-[17px] leading-8 text-[#52657c] sm:text-lg">
                <p>
                  SSDU creates space for Somali students and emerging
                  professionals to develop diplomatic skills, exchange ideas,
                  and participate in public life.
                </p>
                <p>
                  Our work connects members with published programs,
                  organizational leadership, research, and a growing public
                  archive of activities.
                </p>
                <p>
                  We focus on practical learning and responsible engagement so
                  that participants can contribute with confidence at home and
                  internationally.
                </p>
              </div>
            </div>
            <div className="relative min-h-[390px] overflow-hidden rounded-[20px] bg-[#eaf1f7] shadow-[0_20px_50px_rgba(10,41,77,0.14)] sm:min-h-[520px]">
              <OptimizedFillImage
                src="/home/membership-speaker.png"
                alt="A speaker participating in a public diplomacy event"
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute bottom-0 left-0 bg-[#1778b8] px-7 py-5 text-white sm:px-10 sm:py-7">
                <p className="font-serif text-3xl font-bold">Youth-led</p>
                <p className="mt-1 text-sm text-white/80 sm:text-base">
                  Diplomacy in action
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f7fb] py-20 lg:py-28">
          <div className="mx-auto max-w-[1780px] px-5 md:px-10 xl:px-12">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Core Values
              </p>
              <h2 className="mt-6 font-serif text-[40px] font-bold leading-tight sm:text-[50px]">
                The Principles That Guide Us
              </h2>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <article
                    key={value.title}
                    className="min-h-[250px] rounded-[18px] border border-[#dbe3ea] bg-white p-8 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#a8c7da] hover:shadow-xl motion-reduce:transform-none sm:p-10"
                  >
                    <div className="flex size-14 items-center justify-center rounded-[16px] bg-[#e7f1f8] text-[#0874b9]">
                      <Icon
                        className="size-7"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-7 text-2xl font-bold text-[#071f3c]">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-[17px] leading-8 text-[#52657c]">
                      {value.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#0a294d] py-20 text-white lg:py-28">
          <div className="mx-auto max-w-[1300px] px-5 md:px-10">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#29b6f6]">
                Our Journey
              </p>
              <h2 className="mt-6 font-serif text-[40px] font-bold sm:text-[50px]">
                Published Milestones
              </h2>
            </div>
            {data.archive.length > 0 ? (
              <ol className="relative mx-auto mt-16 max-w-[1000px] border-l border-[#2c5279] pl-8 sm:pl-12">
                {data.archive.map((entry) => (
                  <li key={entry.id} className="relative pb-12 last:pb-0">
                    <span className="absolute -left-[53px] flex size-10 items-center justify-center rounded-full bg-[#1778b8] text-xs font-bold sm:-left-[69px] sm:size-12">
                      {getYear(entry.activityDate).slice(2)}
                    </span>
                    <p className="text-xl font-bold text-[#29b6f6]">
                      {getYear(entry.activityDate)}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-bold">
                      {entry.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-[17px] leading-8 text-[#c3cfda]">
                      {entry.summary}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mx-auto mt-14 max-w-3xl rounded-[18px] border border-dashed border-white/25 px-6 py-12 text-center text-lg text-[#c3cfda]">
                {data.archiveAvailable
                  ? "No public milestones have been published yet."
                  : "Published milestones are temporarily unavailable."}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1780px] px-5 md:px-10 xl:px-12">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Gallery
              </p>
              <h2 className="mt-6 font-serif text-[40px] font-bold sm:text-[50px]">
                Moments From Our Archive
              </h2>
            </div>
            {gallery.length > 0 ? (
              <div className="mt-14 grid auto-rows-[220px] gap-5 md:grid-cols-2 xl:grid-cols-3">
                {gallery.slice(0, 5).map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative overflow-hidden rounded-[18px] bg-[#eaf1f7] ${index === 0 ? "md:col-span-2 xl:row-span-2" : ""}`}
                  >
                    <OptimizedFillImage
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03] motion-reduce:transform-none"
                      sizes={
                        index === 0
                          ? "(min-width: 1280px) 66vw, 100vw"
                          : "(min-width: 1280px) 33vw, 50vw"
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-auto mt-14 max-w-3xl rounded-[18px] border border-dashed border-[#b9c7d4] bg-[#f8fafc] px-6 py-12 text-center text-lg text-[#52657c]">
                {data.archiveAvailable
                  ? "No archive photographs have been published yet."
                  : "Archive photographs are temporarily unavailable."}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#f4f7fb] py-20 lg:py-28">
          <div className="mx-auto max-w-[1080px] px-5 md:px-10">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                FAQ
              </p>
              <h2 className="mt-6 font-serif text-[40px] font-bold sm:text-[50px]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mt-14 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-[18px] border border-[#dbe3ea] bg-white px-6 open:shadow-md sm:px-9"
                >
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-[#071f3c] [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown
                      className="size-5 shrink-0 text-[#0874b9] transition-transform group-open:rotate-180 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="border-t border-[#e4e8ec] pb-7 pt-5 text-[17px] leading-8 text-[#52657c]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0a294d] text-[#c3cfda]">
        <div className="mx-auto grid max-w-[1780px] gap-12 px-5 py-20 md:grid-cols-2 md:px-10 xl:grid-cols-4 xl:px-12">
          <div>
            <BrandLogo inverse />
            <p className="mt-7 max-w-sm text-[16px] leading-7">
              Empowering Somali youth through training, dialogue, research, and
              international engagement.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Quick Links
            </h2>
            <ul className="mt-7 space-y-4">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Public Programs
            </h2>
            {data.programs.length > 0 ? (
              <ul className="mt-7 space-y-4">
                {data.programs.slice(0, 5).map((program) => (
                  <li key={program.id}>
                    <Link
                      href={`/programs/${program.slug}`}
                      className="transition-colors hover:text-white"
                    >
                      {program.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-7 leading-7">
                No public programs are listed yet.
              </p>
            )}
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.28em] text-[#28b1f2]">
              Contact
            </h2>
            <p className="mt-7 leading-7">
              Membership, program, and partnership questions are handled through
              the existing contact form.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex min-h-11 items-center gap-3 text-white transition-colors hover:text-[#28b1f2]"
            >
              <Mail className="size-5" aria-hidden="true" /> Contact SSDU
            </Link>
            <Link
              href="/membership"
              className="group mt-5 inline-flex min-h-11 items-center gap-3 text-white transition-colors hover:text-[#28b1f2]"
            >
              Apply for membership
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1780px] flex-col gap-4 border-t border-white/10 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-10 xl:px-12">
          <p>
            &copy; 2026 Somali Student Diplomacy Union. All rights reserved.
          </p>
          <Link href="/contact" className="transition-colors hover:text-white">
            Privacy and terms inquiries
          </Link>
        </div>
      </footer>
    </div>
  );
}
