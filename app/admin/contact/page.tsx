import Link from "next/link";
import { SubmitButton } from "@/app/admin/_components/form-controls";
import { updateContactStatusAction } from "@/app/admin/contact/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import type { ContactMessageRecord } from "@/lib/contact/contact-service";
import type { ContactMessageStatusValue } from "@/lib/contact/validation";

type ContactAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const contactStatuses: ContactMessageStatusValue[] = [
  "UNREAD",
  "READ",
  "ARCHIVED",
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

function StatusBadge({ status }: { status: ContactMessageStatusValue }) {
  const className =
    status === "READ"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : status === "ARCHIVED"
        ? "border-slate-200 bg-slate-100 text-slate-700"
        : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${className}`}
    >
      {status.toLowerCase()}
    </span>
  );
}

function ContactMessageCard({ message }: { message: ContactMessageRecord }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold">{message.subject}</h3>
            <StatusBadge status={message.status} />
          </div>
          <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Sender</dt>
              <dd className="mt-1">{message.fullName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Email</dt>
              <dd className="mt-1 break-all">{message.email}</dd>
            </div>
          </dl>
          <p className="max-w-3xl whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {message.message}
          </p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Received{" "}
            {message.createdAt.toLocaleString("en", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <form
          action={updateContactStatusAction.bind(null, message.id)}
          className="grid min-w-56 gap-3 rounded-md border border-slate-200 p-3"
        >
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor={`${message.id}-status`}
          >
            Message status
          </label>
          <select
            id={`${message.id}-status`}
            name="status"
            defaultValue={message.status}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          >
            {contactStatuses.map((status) => (
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

export default async function ContactAdminPage({
  searchParams,
}: ContactAdminPageProps) {
  await requireAdminSession();
  const params = (await searchParams) ?? {};
  const messages = await prismaContactRepository.listAll();
  const error = firstParam(params.error);
  const success = firstParam(params.success);
  const unreadCount = messages.filter(
    (message) => message.status === "UNREAD",
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
              Contact messages
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review private visitor inquiries and update each message status.
            </p>
          </div>
          <div className="text-sm font-medium text-slate-600">
            {messages.length} total - {unreadCount} unread
          </div>
        </div>

        <StatusMessage error={error} success={success} />

        <section className="grid gap-4">
          {messages.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No contact messages have been submitted yet.
            </p>
          ) : (
            messages.map((message) => (
              <ContactMessageCard key={message.id} message={message} />
            ))
          )}
        </section>
      </section>
    </main>
  );
}
