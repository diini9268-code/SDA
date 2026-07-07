import Link from "next/link";
import { SubmitButton } from "@/app/admin/_components/form-controls";
import { updateMembershipStatusAction } from "@/app/admin/membership/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";
import type { MembershipApplicationRecord } from "@/lib/membership/membership-service";
import type { ApplicationStatusValue } from "@/lib/membership/validation";

type MembershipAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const applicationStatuses: ApplicationStatusValue[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

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

function StatusBadge({ status }: { status: ApplicationStatusValue }) {
  const className =
    status === "APPROVED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : status === "REJECTED"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${className}`}
    >
      {status.toLowerCase()}
    </span>
  );
}

function ApplicationCard({
  application,
}: {
  application: MembershipApplicationRecord;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold">{application.fullName}</h3>
            <StatusBadge status={application.status} />
          </div>
          <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Email</dt>
              <dd className="mt-1 break-all">{application.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Phone</dt>
              <dd className="mt-1">{application.phone}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Institution</dt>
              <dd className="mt-1">{application.university}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Area of interest</dt>
              <dd className="mt-1">{application.areaOfInterest}</dd>
            </div>
          </dl>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Submitted{" "}
            {application.submittedAt.toLocaleString("en", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <form
          action={updateMembershipStatusAction.bind(null, application.id)}
          className="grid min-w-56 gap-3 rounded-md border border-slate-200 p-3"
        >
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor={`${application.id}-status`}
          >
            Review status
          </label>
          <select
            id={`${application.id}-status`}
            name="status"
            defaultValue={application.status}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          >
            {applicationStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <SubmitButton pendingLabel="Saving...">Save status</SubmitButton>
        </form>
      </div>
    </article>
  );
}

export default async function MembershipAdminPage({
  searchParams,
}: MembershipAdminPageProps) {
  await requireAdminSession();
  const params = (await searchParams) ?? {};
  const applications = await prismaMembershipRepository.listAll();
  const error = firstParam(params.error);
  const success = firstParam(params.success);
  const pendingCount = applications.filter(
    (application) => application.status === "PENDING",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10 lg:px-16">
      <section className="mx-auto grid max-w-6xl gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              Back to dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal">
              Membership applications
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review applicant details and update membership application
              statuses. Applicant contact information stays inside the admin
              area.
            </p>
          </div>
          <div className="text-sm font-medium text-slate-600">
            {applications.length} total - {pendingCount} pending
          </div>
        </div>

        <StatusMessage error={error} success={success} />

        <section className="grid gap-4">
          {applications.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No membership applications have been submitted yet.
            </p>
          ) : (
            applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
              />
            ))
          )}
        </section>
      </section>
    </main>
  );
}
