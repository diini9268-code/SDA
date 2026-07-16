import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ClipboardCheck,
  Handshake,
  Landmark,
  Send,
  UsersRound,
} from "lucide-react";
import { HomeHeader } from "@/app/_components/home-header";
import { SiteFooter } from "@/app/_components/site-footer";
import { submitMembershipApplicationAction } from "@/app/membership/actions";
import {
  membershipCategories,
  membershipRequirements,
  publicNavigation,
} from "@/lib/site/official-content";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "Membership",
  description:
    "Learn about Somali Diplomacy Association membership and submit an application for administrative review.",
  path: "/membership",
});

type MembershipPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const opportunities = [
  {
    icon: Landmark,
    title: "Diplomatic Education",
    description:
      "Take part in workshops covering diplomacy, international law, negotiation, and conflict resolution.",
    href: "/programs",
  },
  {
    icon: UsersRound,
    title: "Leadership Development",
    description:
      "Build public speaking, strategic thinking, planning, teamwork, and ethical leadership skills.",
    href: "/programs",
  },
  {
    icon: ClipboardCheck,
    title: "Active Participation",
    description:
      "Contribute to forums, research, community activities, and other initiatives organized by SDA.",
  },
  {
    icon: Handshake,
    title: "Direct Contact",
    description:
      "Use the supported contact workflow for membership, program, and partnership questions.",
    href: "/contact",
  },
];

const faqs = [
  {
    question: "What information is required to apply?",
    answer:
      "The application requires your full name, email address, phone number, university, and area of interest.",
  },
  {
    question: "What happens after I submit?",
    answer:
      "Your application is stored with a pending status so an authorized SDA administrator can review it.",
  },
  {
    question: "Can I ask a question before applying?",
    answer:
      "Yes. Use the Contact page to send a membership question to the SDA administration team.",
  },
  {
    question: "Can I track my application online?",
    answer:
      "Not currently. The existing backend supports administrator status management but does not provide a public applicant account or tracking portal.",
  },
];

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

const inputClassName =
  "mt-2 h-14 w-full rounded-[14px] border border-[#ccd8e3] bg-[#f0f5fa] px-5 text-[16px] text-[#071f3c] outline-none transition placeholder:text-[#718197] focus:border-[#29a9e8] focus:bg-white focus:ring-4 focus:ring-[#29a9e8]/15";

export default async function MembershipPage({
  searchParams,
}: MembershipPageProps) {
  const params = (await searchParams) ?? {};
  const success = firstParam(params.success);
  const error = firstParam(params.error);

  return (
    <div className="min-w-0 bg-white text-[#0a294d]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-white px-4 py-3 font-semibold text-[#0a294d] shadow-xl transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <HomeHeader
        items={publicNavigation}
        activeHref="/membership"
        overlay={false}
        secondaryItem={{ href: "/login", label: "Login" }}
        joinHref="#application"
      />

      <main id="main-content" className="pt-20 sm:pt-[90px]">
        <section className="bg-[#0a294d] px-5 py-24 text-center text-white md:px-10 lg:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#29b6f6]">
            Membership
          </p>
          <h1 className="mt-7 font-serif text-[48px] font-bold leading-none sm:text-[62px] lg:text-[70px]">
            Join the SDA Community
          </h1>
          <p className="mx-auto mt-8 max-w-[860px] text-lg leading-8 text-[#c3cfda] sm:text-xl">
            Submit your information for administrative review and explore
            SDA&apos;s diplomatic education, leadership development, research,
            and international engagement activities.
          </p>
          <a
            href="#application"
            className="group mt-10 inline-flex h-14 items-center gap-3 rounded-[8px] bg-[#1778b8] px-8 text-lg font-semibold text-white shadow-lg transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-[#0a6098] hover:shadow-xl motion-reduce:transform-none"
          >
            Apply Now
            <ArrowRight
              className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </a>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10 xl:px-16">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Participate with SDA
              </p>
              <h2 className="mt-6 font-serif text-[40px] font-bold leading-tight sm:text-[50px]">
                Opportunities to Learn and Contribute
              </h2>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-[8px] bg-[#e7f1f8] text-[#0874b9]">
                      <Icon
                        className="size-7"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#071f3c]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-[17px] leading-8 text-[#52657c]">
                        {item.description}
                      </p>
                    </div>
                  </>
                );

                return item.href ? (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex min-h-[220px] gap-6 rounded-[8px] border border-[#dbe3ea] bg-white p-8 transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-[#abc7d8] hover:shadow-xl motion-reduce:transform-none"
                  >
                    {content}
                  </Link>
                ) : (
                  <article
                    key={item.title}
                    className="flex min-h-[220px] gap-6 rounded-[8px] border border-[#dbe3ea] bg-white p-8"
                  >
                    {content}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#eef4f8] py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start xl:px-16">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Official Membership
              </p>
              <h2 className="mt-6 font-serif text-[40px] font-bold leading-tight sm:text-[50px]">
                Categories and Requirements
              </h2>
              <p className="mt-6 max-w-2xl text-[17px] leading-8 text-[#52657c]">
                SDA membership is organized into three categories. Every
                member is expected to uphold the Association&apos;s constitution,
                professional conduct, and active participation standards.
              </p>
              <ul className="mt-8 space-y-4">
                {membershipRequirements.map((requirement) => (
                  <li key={requirement} className="flex gap-3 text-[17px] leading-7 text-[#29445f]">
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-[#1b86c4]" aria-hidden="true" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {membershipCategories.map((category) => (
                <article key={category.title} className="rounded-[8px] border border-[#d4e0e8] bg-white p-7">
                  <h3 className="font-serif text-2xl font-bold text-[#071f3c]">{category.title}</h3>
                  <p className="mt-4 text-[16px] leading-7 text-[#52657c]">{category.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="application"
          className="scroll-mt-24 bg-white py-20 lg:py-28"
        >
          <div className="mx-auto max-w-[980px] px-5 md:px-10">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                Application
              </p>
              <h2 className="mt-6 font-serif text-[40px] font-bold leading-tight sm:text-[50px]">
                Apply for Membership
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-8 text-[#52657c]">
                Complete every field below. Your application will be submitted
                to the existing administrative review workflow.
              </p>
            </div>

            {success ? (
              <div
                role="status"
                className="mt-10 rounded-[14px] border border-[#9ed9b1] bg-[#ecfff2] px-5 py-4 text-[#176c36]"
              >
                {success}
              </div>
            ) : null}
            {error ? (
              <div
                role="alert"
                className="mt-10 rounded-[14px] border border-[#efb4b4] bg-[#fff1f1] px-5 py-4 text-[#9b2525]"
              >
                {error}
              </div>
            ) : null}

            <form
              action={submitMembershipApplicationAction}
              className="mt-10 rounded-[8px] border border-[#dbe3ea] bg-white p-6 shadow-[0_18px_50px_rgba(10,41,77,0.10)] sm:p-10"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <label className="text-[16px] font-semibold text-[#071f3c]">
                  Full name <span aria-hidden="true">*</span>
                  <input
                    className={inputClassName}
                    name="fullName"
                    autoComplete="name"
                    maxLength={160}
                    required
                  />
                </label>
                <label className="text-[16px] font-semibold text-[#071f3c]">
                  Email address <span aria-hidden="true">*</span>
                  <input
                    className={inputClassName}
                    type="email"
                    name="email"
                    autoComplete="email"
                    maxLength={255}
                    required
                  />
                </label>
                <label className="text-[16px] font-semibold text-[#071f3c]">
                  Phone number <span aria-hidden="true">*</span>
                  <input
                    className={inputClassName}
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    maxLength={40}
                    placeholder="+252 61 123 4567"
                    pattern="[+()0-9 .-]{7,40}"
                    required
                  />
                </label>
                <label className="text-[16px] font-semibold text-[#071f3c]">
                  University <span aria-hidden="true">*</span>
                  <input
                    className={inputClassName}
                    name="university"
                    autoComplete="organization"
                    maxLength={180}
                    required
                  />
                </label>
              </div>
              <label className="mt-6 block text-[16px] font-semibold text-[#071f3c]">
                Area of interest <span aria-hidden="true">*</span>
                <input
                  className={inputClassName}
                  name="areaOfInterest"
                  maxLength={180}
                  placeholder="e.g. public diplomacy, policy research, peacebuilding"
                  required
                />
              </label>
              <button
                type="submit"
                className="group mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-[8px] bg-[#1778b8] px-8 text-lg font-semibold text-white shadow-md transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-[#0a6098] hover:shadow-lg motion-reduce:transform-none"
              >
                Submit Application
                <Send className="size-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>

        <section className="bg-[#f4f7fb] pb-24 lg:pb-28">
          <div className="mx-auto max-w-[1080px] px-5 md:px-10">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">
                FAQ
              </p>
              <h2 className="mt-6 font-serif text-[40px] font-bold sm:text-[50px]">
                Membership Questions
              </h2>
            </div>
            <div className="mt-14 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-[8px] border border-[#dbe3ea] bg-white px-6 open:shadow-md sm:px-9"
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

      <SiteFooter />
    </div>
  );
}
