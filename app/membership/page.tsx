import { SubmitButton } from "@/app/admin/_components/form-controls";
import { PageIntro, PublicPageShell } from "@/app/_components/public-shell";
import { submitMembershipApplicationAction } from "@/app/membership/actions";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "Membership",
  description:
    "Apply for SSDU membership and submit your student diplomacy interests for administrator review.",
  path: "/membership",
});

type MembershipPageProps = {
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

export default async function MembershipPage({
  searchParams,
}: MembershipPageProps) {
  const params = (await searchParams) ?? {};
  const error = firstParam(params.error);
  const success = firstParam(params.success);

  return (
    <PublicPageShell>
      <main className="px-6 py-12 sm:px-10 lg:px-16">
        <section className="mx-auto grid max-w-3xl gap-8">
          <PageIntro
            eyebrow="Membership"
            title="Apply for SSDU Membership"
            description="Submit your information for administrator review. SSDU will use this information only to evaluate and respond to your application."
          />

          <StatusMessage error={error} success={success} />

          <form
            action={submitMembershipApplicationAction}
            className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-800" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              maxLength={160}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={255}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-800" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                required
                maxLength={40}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-800" htmlFor="university">
              University or institution
            </label>
            <input
              id="university"
              name="university"
              required
              maxLength={180}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-800" htmlFor="areaOfInterest">
              Area of interest
            </label>
            <input
              id="areaOfInterest"
              name="areaOfInterest"
              required
              maxLength={180}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
            />
          </div>

            <SubmitButton pendingLabel="Submitting...">
              Submit application
            </SubmitButton>
          </form>
        </section>
      </main>
    </PublicPageShell>
  );
}
