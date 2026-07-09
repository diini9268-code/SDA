import Link from "next/link";
import { SubmitButton } from "@/app/admin/_components/form-controls";
import { PublicPageShell } from "@/app/_components/public-shell";
import { submitMembershipApplicationAction } from "@/app/membership/actions";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "Membership",
  description:
    "Apply for SSDU membership and join the Somali Student Diplomacy Union community.",
  path: "/membership",
});

type MembershipPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type Benefit = {
  title: string;
  description: string;
  icon: string;
};

type Tier = {
  title: string;
  audience: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function StatusMessage({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (!error && !success) {
    return null;
  }

  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm ${
        error
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
      role="status"
    >
      {error ?? success}
    </div>
  );
}

const benefits: Benefit[] = [
  {
    title: "Global Networks",
    description:
      "Access exclusive networking events with Somali diplomats, UN officials, and international policy makers.",
    icon: "GN",
  },
  {
    title: "Academic Growth",
    description:
      "Unlock a repository of research journals, policy briefs, and diplomatic archives specific to the Horn of Africa.",
    icon: "AG",
  },
  {
    title: "Expert Mentorship",
    description:
      "Be paired with senior fellows and alumni currently serving in governmental and non-governmental leadership roles.",
    icon: "EM",
  },
  {
    title: "Forum Participation",
    description:
      "Represent the SSDU in international student summits, model UN events, and regional diplomatic conferences.",
    icon: "FP",
  },
];

const tiers: Tier[] = [
  {
    title: "Student Member",
    audience: "For current undergraduates",
    features: [
      "Access to campus chapters",
      "Union voting rights",
      "Quarterly newsletter",
    ],
    cta: "Apply as Student",
  },
  {
    title: "Associate Fellow",
    audience: "For graduate students & researchers",
    features: [
      "Priority conference selection",
      "Publishing opportunities",
      "Direct diplomatic mentorship",
      "Official union credentials",
    ],
    cta: "Apply as Fellow",
    featured: true,
  },
  {
    title: "Alumni Member",
    audience: "For established professionals",
    features: [
      "Exclusive advisory board access",
      "Mentor status",
      "Lifelong event invitations",
    ],
    cta: "Join Alumni Network",
  },
];

const steps = [
  {
    number: "01",
    title: "Application",
    text: "Submit your academic credentials and a statement of intent through our secure portal.",
  },
  {
    number: "02",
    title: "Review",
    text: "Our Admissions Committee evaluates candidates based on academic merit and leadership potential.",
  },
  {
    number: "03",
    title: "Onboarding",
    text: "Attend the induction ceremony and receive your official credentials and mentorship packet.",
  },
];

function TextInput({
  id,
  label,
  type = "text",
  maxLength,
}: {
  id: string;
  label: string;
  type?: string;
  maxLength: number;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-[#000613]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        maxLength={maxLength}
        className="h-12 rounded-md border border-[#c7ccd2] bg-white px-4 text-sm text-[#000613] outline-none transition focus:border-[#00639c] focus:ring-2 focus:ring-[#40acfe]/30"
      />
    </div>
  );
}

export default async function MembershipPage({
  searchParams,
}: MembershipPageProps) {
  const params = (await searchParams) ?? {};
  const error = firstParam(params.error);
  const success = firstParam(params.success);

  return (
    <PublicPageShell activeHref="/membership">
      <main className="pt-[129px] md:pt-20">
        <section
          className="relative flex min-h-[520px] items-center border-b border-[#000613] bg-[#001f3f] px-6 py-24 text-white md:px-16"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0, 6, 19, 0.94) 0%, rgba(0, 31, 63, 0.82) 42%, rgba(0, 31, 63, 0.58) 100%), url('https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1800&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="max-w-2xl space-y-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f9d28b]">
                Official Union Membership
              </p>
              <h1 className="max-w-xl font-serif text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Join the Vanguard of Somali Diplomacy
              </h1>
              <p className="max-w-xl text-base font-semibold leading-8 text-white/90">
                Shape the future of international relations. Become part of a
                prestigious network of scholars and future diplomats dedicated
                to Somalia&apos;s global standing.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#application"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-[#f9d28b] px-7 text-sm font-bold text-[#000613] transition hover:bg-[#e9c176] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#001f3f]"
                >
                  Apply for Membership
                </Link>
                <Link
                  href="#benefits"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white px-7 text-sm font-bold text-white transition hover:bg-white hover:text-[#000613] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#001f3f]"
                >
                  Explore Benefits
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="bg-white px-6 py-20 md:px-16">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-[#000613]">
                Why Join the Union?
              </h2>
              <div className="mx-auto mt-5 h-px w-24 bg-[#e9c176]" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-lg border border-[#d6dbe0] bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex size-10 items-center justify-center rounded-md bg-[#002e5f] text-xs font-bold text-white">
                    {benefit.icon}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#000613]">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#43474e]">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f1f3f5] px-6 py-20 md:px-16">
          <div className="mx-auto max-w-[1280px]">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold text-[#000613]">
                Membership Tiers
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#5c636b]">
                Select the level of engagement that aligns with your current
                academic or professional standing.
              </p>
            </div>
            <div className="grid items-stretch gap-6 lg:grid-cols-3">
              {tiers.map((tier) => (
                <article
                  key={tier.title}
                  className={`relative rounded-lg border p-7 ${
                    tier.featured
                      ? "border-[#f9d28b] bg-[#002e5f] text-white shadow-xl"
                      : "border-[#d6dbe0] bg-white text-[#000613] shadow-sm"
                  }`}
                >
                  {tier.featured ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#f9d28b] px-5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#000613]">
                      Most Prestigious
                    </div>
                  ) : null}
                  <h3 className="font-serif text-xl font-bold">{tier.title}</h3>
                  <p
                    className={`mt-2 text-sm ${
                      tier.featured ? "text-white/78" : "text-[#5c636b]"
                    }`}
                  >
                    {tier.audience}
                  </p>
                  <ul className="mt-8 space-y-4 text-sm">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className={`mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                            tier.featured
                              ? "border-[#f9d28b] text-[#f9d28b]"
                              : "border-[#00639c] text-[#00639c]"
                          }`}
                        >
                          +
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#application"
                    className={`mt-10 inline-flex h-11 w-full items-center justify-center rounded-md border px-4 text-sm font-bold transition ${
                      tier.featured
                        ? "border-[#f9d28b] bg-[#f9d28b] text-[#000613] hover:bg-[#e9c176]"
                        : "border-[#000613] bg-white text-[#000613] hover:bg-[#000613] hover:text-white"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 md:px-16">
          <div className="mx-auto max-w-[1120px]">
            <div className="mb-14 text-center">
              <h2 className="font-serif text-3xl font-bold text-[#000613]">
                Pathway to Membership
              </h2>
              <p className="mt-4 text-sm text-[#5c636b]">
                A streamlined three-step process to join our diplomatic
                community.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {steps.map((step, index) => (
                <article key={step.number} className="relative text-center">
                  {index < steps.length - 1 ? (
                    <div className="absolute left-[58%] top-6 hidden h-px w-[84%] bg-[#c7ccd2] md:block" />
                  ) : null}
                  <div
                    className={`relative z-10 mx-auto flex size-12 items-center justify-center rounded-full border text-sm font-bold ${
                      index === 2
                        ? "border-[#e9c176] bg-[#fff1d6] text-[#000613]"
                        : "border-[#000613] bg-[#000613] text-white"
                    }`}
                  >
                    {step.number}
                  </div>
                  <h3 className="mt-6 font-serif text-lg font-bold text-[#000613]">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-[#5c636b]">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#002e5f] px-6 py-20 text-white md:px-16">
          <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold">
                Voices of the Union
              </h2>
              <blockquote className="mt-7 border-l-4 border-[#f9d28b] pl-5 font-serif text-lg italic leading-8 text-white">
                Being a part of SSDU hasn&apos;t just broadened my network; it
                has refined my voice as a future leader for Somalia.
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#f9d28b] text-sm font-bold text-[#000613]">
                  AH
                </div>
                <div>
                  <p className="text-sm font-bold">Anisa H. Ahmed</p>
                  <p className="text-xs text-white/70">
                    Associate Fellow, Mogadishu Chapter
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              {[
                {
                  quote:
                    "The mentorship I received from an SSDU alumnus at the Ministry of Foreign Affairs was instrumental in securing my current internship at the UN.",
                  author: "Khalid M. Barre, Student Member",
                },
                {
                  quote:
                    "SSDU provides the intellectual rigor and structural support necessary for the Somali diaspora to engage meaningfully in international relations.",
                  author: "Dr. Farhiya Omar, Alumni Fellow",
                },
              ].map((testimonial) => (
                <blockquote
                  key={testimonial.author}
                  className="rounded-lg border border-white/12 bg-white/8 p-6 shadow-sm"
                >
                  <p className="font-serif text-base italic leading-7 text-white">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <footer className="mt-5 text-sm font-bold text-[#f9d28b]">
                    {testimonial.author}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f8f9fa] px-6 py-20 text-center md:px-16">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-6 flex size-12 items-center justify-center border border-[#000613] text-lg font-bold text-[#000613]">
              I
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#000613] sm:text-4xl">
              Shape the Future Today
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#5c636b]">
              Your journey as a diplomatic leader begins with a single
              application. Join a community that values heritage, excellence,
              and the pursuit of peace.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="#application"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#000613] px-7 text-sm font-bold text-white transition hover:bg-[#002e5f]"
              >
                Begin Application
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#000613] px-7 text-sm font-bold text-[#000613] transition hover:bg-[#000613] hover:text-white"
              >
                Inquiry for Chapters
              </Link>
            </div>
            <p className="mt-7 text-xs italic text-[#5c636b]">
              Next induction ceremony begins in September 2024. Applications
              close August 15th.
            </p>
          </div>
        </section>

        <section id="application" className="bg-white px-6 py-20 md:px-16">
          <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00639c]">
                Secure Application
              </p>
              <h2 className="mt-4 font-serif text-3xl font-bold text-[#000613]">
                Submit Your Membership Interest
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#43474e]">
                SSDU administrators will review your information and respond
                through the contact details you provide. Membership tier
                selection is reviewed during follow-up.
              </p>
            </div>

            <div className="grid gap-5">
              <StatusMessage error={error} success={success} />
              <form
                action={submitMembershipApplicationAction}
                className="grid gap-5 rounded-lg border border-[#d6dbe0] bg-white p-6 shadow-sm sm:p-8"
              >
                <TextInput id="fullName" label="Full name" maxLength={160} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextInput
                    id="email"
                    label="Email address"
                    type="email"
                    maxLength={255}
                  />
                  <TextInput id="phone" label="Phone" maxLength={40} />
                </div>
                <TextInput
                  id="university"
                  label="University or institution"
                  maxLength={180}
                />
                <TextInput
                  id="areaOfInterest"
                  label="Area of interest"
                  maxLength={180}
                />

                <SubmitButton
                  pendingLabel="Submitting..."
                  className="h-12 rounded-md bg-[#000613] text-sm font-bold hover:bg-[#002e5f]"
                >
                  Submit application
                </SubmitButton>
              </form>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
