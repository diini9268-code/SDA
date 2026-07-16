import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  LockKeyhole,
  Mail,
  Send,
} from "lucide-react";
import { SubmitButton } from "@/app/admin/_components/form-controls";
import { HomeHeader } from "@/app/_components/home-header";
import { SiteFooter } from "@/app/_components/site-footer";
import { submitContactMessageAction } from "@/app/contact/actions";
import { publicNavigation } from "@/lib/site/official-content";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Send the Somali Diplomacy Association a message through the supported public contact workflow.",
  path: "/contact",
});

type ContactPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const workflowFacts = [
  {
    icon: LockKeyhole,
    title: "Private submission",
    description:
      "Your message is stored in the private contact inbox for authorized administrators.",
  },
  {
    icon: ClipboardCheck,
    title: "Admin review",
    description:
      "The SDA administration team can review and manage the status of each inquiry.",
  },
  {
    icon: Mail,
    title: "Your reply address",
    description:
      "Your submitted email address is retained with the message so the team can follow up outside the site.",
  },
];

function firstParam(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function StatusMessage({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (!error && !success) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-[12px] border px-4 py-3 text-sm leading-6 ${
        error
          ? "border-[#f1b8b8] bg-[#fff3f1] text-[#8b1a1a]"
          : "border-[#b8ddc5] bg-[#f0fbf4] text-[#176235]"
      }`}
      role={error ? "alert" : "status"}
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      {error ?? success}
    </div>
  );
}

function Field({
  id,
  label,
  maxLength,
  name,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  maxLength: number;
  name: string;
  placeholder: string;
  type?: "text" | "email";
}) {
  return (
    <div className="grid gap-2.5">
      <label htmlFor={id} className="text-[16px] font-semibold text-[#071f3c]">
        {label} <span aria-hidden="true">*</span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete={name === "fullName" ? "name" : name === "email" ? "email" : undefined}
        className="min-h-[58px] rounded-[16px] border border-[#cbd8e2] bg-[#edf3f8] px-5 text-[16px] text-[#071f3c] outline-none transition-[border-color,background-color,box-shadow] placeholder:text-[#718196] hover:border-[#9db9cc] focus:border-[#1684c2] focus:bg-white focus:ring-4 focus:ring-[#1684c2]/15"
      />
    </div>
  );
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = (await searchParams) ?? {};
  const error = firstParam(params.error);
  const success = firstParam(params.success);

  return (
    <div className="min-h-screen bg-[#f3f7fa] text-[#071f3c]">
      <a href="#main-content" className="sr-only z-[100] rounded-md bg-white px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to main content
      </a>
      <HomeHeader
        items={publicNavigation}
        activeHref="/contact"
        overlay={false}
        secondaryItem={{ href: "/login", label: "Login" }}
        joinHref="/membership"
      />

      <main id="main-content" className="pt-20 sm:pt-[90px]">
        <section className="flex min-h-[500px] items-center justify-center bg-[#0a294d] px-5 py-24 text-center text-white sm:min-h-[590px] md:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#2ab3f3] sm:text-base">
              Get in touch
            </p>
            <h1 className="mt-7 font-serif text-[48px] font-bold leading-[1.05] sm:text-[66px] lg:text-[76px]">
              Contact Us
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-[#becbd7] sm:text-[23px] sm:leading-10">
              Send a question about membership, programs, partnerships, or
              SDA activities through the official contact workflow.
            </p>
          </div>
        </section>

        <section className="px-5 py-20 md:px-10 xl:px-16 xl:py-28">
          <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.55fr)] xl:gap-16">
            <aside aria-labelledby="contact-process-heading" className="space-y-5">
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#0874b9]">What happens next</p>
                <h2 id="contact-process-heading" className="mt-4 font-serif text-[34px] font-bold leading-tight sm:text-[42px]">
                  A supported path to the team
                </h2>
              </div>
              {workflowFacts.map(({ icon: Icon, title, description }) => (
                <article key={title} className="flex gap-5 rounded-[8px] border border-[#dce3e9] bg-white p-6 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[#e7f1f7] text-[#0874b9]">
                    <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[18px] font-semibold">{title}</h3>
                    <p className="mt-2 text-[15px] leading-7 text-[#52657c]">{description}</p>
                  </div>
                </article>
              ))}
              <Link href="/membership" className="inline-flex min-h-11 items-center gap-2 px-1 pt-4 font-semibold text-[#0874b9] transition-colors hover:text-[#075d92]">
                Looking to join SDA? <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </aside>

            <div className="rounded-[8px] border border-[#dce3e9] bg-white p-6 shadow-[0_16px_50px_rgba(10,41,77,0.08)] sm:p-9 xl:p-12">
              <h2 className="font-serif text-[34px] font-bold sm:text-[42px]">Send a Message</h2>
              <p className="mt-3 max-w-2xl text-[16px] leading-7 text-[#52657c]">
                All fields are required. Messages enter the private admin inbox
                with an unread status.
              </p>
              <form action={submitContactMessageAction} className="mt-9 grid gap-7">
                <div className="grid gap-7 md:grid-cols-2">
                  <Field id="fullName" label="Full Name" name="fullName" maxLength={160} placeholder="Your name" />
                  <Field id="email" label="Email" name="email" type="email" maxLength={255} placeholder="you@email.com" />
                </div>
                <Field id="subject" label="Subject" name="subject" maxLength={220} placeholder="How can we help?" />
                <div className="grid gap-2.5">
                  <label htmlFor="message" className="text-[16px] font-semibold">Message <span aria-hidden="true">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    maxLength={5000}
                    placeholder="Write your message here..."
                    className="min-h-[190px] resize-y rounded-[8px] border border-[#cbd8e2] bg-[#edf3f8] px-5 py-4 text-[16px] leading-7 outline-none transition-[border-color,background-color,box-shadow] placeholder:text-[#718196] hover:border-[#9db9cc] focus:border-[#1684c2] focus:bg-white focus:ring-4 focus:ring-[#1684c2]/15"
                  />
                </div>
                <StatusMessage error={error} success={success} />
                <SubmitButton
                  pendingLabel="Sending..."
                  className="inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#1778b8] px-7 text-[18px] font-semibold text-white shadow-md transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-[#0a6098] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-[#7698ad] motion-reduce:transform-none"
                >
                  Send Message <Send className="size-5" aria-hidden="true" />
                </SubmitButton>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
