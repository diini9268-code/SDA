import Link from "next/link";
import { PublicPageShell } from "@/app/_components/public-shell";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about SSDU's student diplomacy mission, public programs, leadership development, publications, and membership platform.",
  path: "/about",
});

const filters = ["Mission", "Leadership", "Programs", "Research", "Membership"];

const records = [
  {
    badge: "Mandate",
    title: "Student Diplomacy and Public Service Development",
    meta: "SSDU Foundation",
    date: "Active",
    ref: "ABOUT-001",
    action: "Read Mandate",
    body: "SSDU supports students who want to understand diplomacy, develop leadership skills, and contribute to constructive civic conversations through organized programs and publications.",
  },
  {
    badge: "Platform",
    title: "A Central Public Website for SSDU Activity",
    meta: "Digital Platform",
    date: "Current",
    ref: "ABOUT-002",
    action: "View Platform",
    body: "The website gives visitors a reliable place to follow SSDU activity, explore leadership, read updates, apply for membership, and contact the organization.",
  },
  {
    badge: "Priorities",
    title: "Programs, Dialogue, Publications, and Membership",
    meta: "Strategic Focus",
    date: "MVP",
    ref: "ABOUT-003",
    action: "Explore Work",
    body: "Current priorities include leadership development, public dialogue, civic engagement, publication of organizational updates, and clear membership pathways for students and partners.",
  },
];

export default function AboutPage() {
  return (
    <PublicPageShell activeHref="/about">
      <main className="bg-[#f7fafc] pb-24 pt-24 text-[#181c1e] md:pt-20">
        <section className="border-b border-[#c4c6cf] bg-[#f7fafc] px-5 py-6 md:px-16">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className="flex size-11 items-center justify-center border border-[#c4c6cf] bg-white text-[#000a1e]"
                aria-hidden="true"
              >
                SSDU
              </span>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#44474e]">
                  About Repository
                </p>
                <h1 className="font-serif text-[28px] font-black leading-9 tracking-[-0.02em] text-[#000a1e]">
                  SSDU Institutional Profile
                </h1>
              </div>
            </div>
            <div className="hidden items-center border border-[#c4c6cf] bg-[#ebeef0] px-3 py-2 font-mono text-sm font-bold text-[#000a1e] sm:flex">
              PUBLIC
            </div>
          </div>
        </section>

        <section className="sticky top-[80px] z-40 flex gap-3 overflow-x-auto border-b border-[#c4c6cf] bg-[#f7fafc] px-5 py-4 md:px-16">
          {filters.map((filter, index) => (
            <span
              key={filter}
              className={
                index === 0
                  ? "whitespace-nowrap border border-[#000a1e] bg-[#002147] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-white"
                  : "whitespace-nowrap border border-[#74777f] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#44474e]"
              }
            >
              {filter}
            </span>
          ))}
        </section>

        <section className="mx-auto max-w-[1280px] px-5 py-4 md:px-16">
          <div className="mb-4 flex items-center justify-between border-b border-[#c4c6cf]/40 py-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#44474e]">
              3 Profile Records
            </p>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#000a1e]">
              Verified
            </p>
          </div>

          <div className="space-y-4">
            {records.map((record, index) => (
              <article
                key={record.ref}
                className={`relative border bg-[#f7fafc] p-4 ${
                  index === 2 ? "border-2 border-[#002147]" : "border-[#c4c6cf]"
                }`}
              >
                <div className="absolute right-0 top-0 border-b border-l border-[#c4c6cf] bg-[#f7e382] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#211b00]">
                  {record.badge}
                </div>
                <div className="flex items-start gap-4 pr-28">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center border border-[#c4c6cf] ${
                      index === 2
                        ? "bg-[#002147] text-white"
                        : "bg-[#ebeef0] text-[#000a1e]"
                    }`}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h2 className="mb-1 font-serif text-lg font-bold leading-6 text-[#000a1e]">
                      {record.title}
                    </h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm leading-5 text-[#44474e]">
                      <span>{record.meta}</span>
                      <span>{record.date}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-5 text-[#44474e]">
                  {record.body}
                </p>
                <div className="mt-4 flex flex-col gap-3 border-t border-[#c4c6cf]/50 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#74777f]">
                    REF: {record.ref}
                  </span>
                  <Link
                    href={
                      index === 0
                        ? "/programs"
                        : index === 1
                          ? "/leadership"
                          : "/membership"
                    }
                    className={
                      index === 1
                        ? "border border-[#000a1e] px-6 py-3 text-center font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#000a1e]"
                        : "bg-[#000a1e] px-6 py-3 text-center font-mono text-xs font-semibold uppercase tracking-[0.05em] text-white"
                    }
                  >
                    {record.action}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-[1280px] px-5 md:px-16">
          <div className="overflow-hidden border border-[#c4c6cf] bg-white">
            <div
              className="h-36 bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(0,10,30,0.84), rgba(0,10,30,0.2)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80')",
              }}
            />
            <div className="p-4">
              <h2 className="font-serif text-lg font-bold leading-6 text-[#000a1e]">
                Mission Context
              </h2>
              <p className="mt-2 text-sm leading-5 text-[#44474e]">
                SSDU exists to connect Somali students with diplomacy,
                leadership, policy education, civic dialogue, and public service
                opportunities through a professional digital platform.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[#c4c6cf]/50 pt-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#74777f]">
                  PROFILE-MAP
                </span>
                <Link
                  href="/contact"
                  className="bg-[#000a1e] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.05em] text-white"
                >
                  Contact SSDU
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
