import { SubmitButton } from "@/app/admin/_components/form-controls";
import { PublicPageShell } from "@/app/_components/public-shell";
import { submitContactMessageAction } from "@/app/contact/actions";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact SSDU with inquiries about programs, partnerships, membership, and organizational activities.",
  path: "/contact",
});

type ContactPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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
      className={`rounded-lg border px-4 py-3 text-sm leading-6 ${
        error
          ? "border-[#ffdad6] bg-[#fff3f1] text-[#93000a]"
          : "border-[#cee5ff] bg-[#f0f7ff] text-[#003e65]"
      }`}
      role="status"
    >
      {error ?? success}
    </div>
  );
}

function TextInputField({
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
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <label
        className="text-xs font-semibold uppercase tracking-[0.08em] text-[#191c1d]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        maxLength={maxLength}
        placeholder={placeholder}
        className="rounded-lg border border-[#c4c6cf] px-4 py-3 text-sm text-[#191c1d] outline-none transition-all placeholder:text-slate-500 focus:border-[#00639c] focus:ring-2 focus:ring-[#40acfe]/30"
      />
    </div>
  );
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = (await searchParams) ?? {};
  const error = firstParam(params.error);
  const success = firstParam(params.success);

  return (
    <PublicPageShell>
      <main className="bg-[#f8f9fa] pb-16 pt-20 text-[#191c1d]">
        <section className="border-b border-[#c4c6cf] bg-[#f3f4f5] py-16">
          <div className="mx-auto max-w-4xl px-4 text-center md:px-0">
            <span className="mb-4 inline-block rounded-full bg-[#ffdea5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#261900]">
              Official Contact
            </span>
            <h1 className="mb-4 font-serif text-[32px] font-bold leading-[40px] text-[#000613] md:text-[48px] md:leading-[60px] md:tracking-[-0.02em]">
              Contact SSDU
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-[30px] text-[#43474e]">
              Reach the Somali Student Diplomacy Union Secretariat with
              inquiries about programs, partnerships, membership, and
              organizational activity.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl px-4">
          <div className="relative mb-12 flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-[#c4c6cf]" />
            <div className="flex flex-col items-center bg-[#f8f9fa] px-4">
              <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#000613] bg-[#000613] font-bold text-white">
                1
              </div>
              <span className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#000613]">
                Details
              </span>
            </div>
            <div className="flex flex-col items-center bg-[#f8f9fa] px-4">
              <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#c4c6cf] bg-white font-bold text-[#43474e]">
                2
              </div>
              <span className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#43474e]">
                Message
              </span>
            </div>
            <div className="flex flex-col items-center bg-[#f8f9fa] px-4">
              <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#c4c6cf] bg-white font-bold text-[#43474e]">
                3
              </div>
              <span className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#43474e]">
                Review
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-[#c4c6cf] bg-white p-8 shadow-sm md:p-12">
            <form action={submitContactMessageAction} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-full mb-4">
                  <h2 className="mb-2 font-serif text-[28px] font-bold leading-9 text-[#000613]">
                    Secretariat Message
                  </h2>
                  <p className="text-sm leading-[22px] text-[#43474e]">
                    Please provide accurate contact details so the SSDU team can
                    review your inquiry and respond through the appropriate
                    administrative channel.
                  </p>
                </div>

                <TextInputField
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  maxLength={160}
                  placeholder="Enter your full name"
                />

                <TextInputField
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  maxLength={255}
                  placeholder="email@university.edu"
                />

                <div className="col-span-full grid gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.08em] text-[#191c1d]"
                    htmlFor="subject"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    required
                    maxLength={220}
                    placeholder="Partnership, program, membership, or general inquiry"
                    className="rounded-lg border border-[#c4c6cf] px-4 py-3 text-sm text-[#191c1d] outline-none transition-all placeholder:text-slate-500 focus:border-[#00639c] focus:ring-2 focus:ring-[#40acfe]/30"
                  />
                </div>

                <div className="col-span-full grid gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.08em] text-[#191c1d]"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    maxLength={5000}
                    placeholder="Write your message to the SSDU Secretariat..."
                    className="rounded-lg border border-[#c4c6cf] px-4 py-3 text-sm text-[#191c1d] outline-none transition-all placeholder:text-slate-500 focus:border-[#00639c] focus:ring-2 focus:ring-[#40acfe]/30"
                  />
                </div>
              </div>

              <StatusMessage error={error} success={success} />

              <div className="mt-12 flex items-center justify-end border-t border-[#c4c6cf] pt-8">
                <SubmitButton
                  pendingLabel="Sending..."
                  className="rounded-lg bg-[#000613] px-8 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-md transition-all hover:bg-[#00639c] disabled:bg-[#74777f]"
                >
                  Send Message
                </SubmitButton>
              </div>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 px-4 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#e7e8e9] p-3 text-[#000613]">
                <span aria-hidden="true">▣</span>
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#000613]">
                  Secure Data Transmission
                </h3>
                <p className="text-sm leading-[22px] text-[#43474e]">
                  Your message is transmitted through the site and stored
                  privately for administrator review.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#e7e8e9] p-3 text-[#000613]">
                <span aria-hidden="true">⌂</span>
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#000613]">
                  Official Diplomatic Channel
                </h3>
                <p className="text-sm leading-[22px] text-[#43474e]">
                  All inquiries are processed by the SSDU administrative team
                  through the current contact message workflow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-2xl px-4">
          <blockquote className="border-l-4 border-[#e9c176] py-4 pl-8 italic">
            <p className="font-serif text-2xl leading-9 text-[#000613]">
              &ldquo;Diplomacy begins with listening carefully, responding
              thoughtfully, and building trust through disciplined
              communication.&rdquo;
            </p>
            <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#43474e]">
              &mdash; SSDU Secretariat Vision Statement
            </footer>
          </blockquote>
        </section>
      </main>
    </PublicPageShell>
  );
}
