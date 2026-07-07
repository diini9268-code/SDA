import Link from "next/link";
import { DeleteButton, SubmitButton } from "@/app/admin/_components/form-controls";
import {
  createArchiveAction,
  deleteArchiveAction,
  updateArchiveAction,
} from "@/app/admin/archive/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import type { ArchiveRecord } from "@/lib/archive/archive-service";

type ArchiveAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function formatDateTimeInput(value?: Date): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 16);
}

function imagesToText(archive?: ArchiveRecord): string {
  return archive?.images.join("\n") ?? "";
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

function ArchiveForm({
  action,
  archive,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  archive?: ArchiveRecord;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${archive?.id ?? "new"}-title`}>
            Title
          </label>
          <input
            id={`${archive?.id ?? "new"}-title`}
            name="title"
            required
            maxLength={220}
            defaultValue={archive?.title}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${archive?.id ?? "new"}-activityDate`}>
            Activity date
          </label>
          <input
            id={`${archive?.id ?? "new"}-activityDate`}
            name="activityDate"
            type="datetime-local"
            required
            defaultValue={formatDateTimeInput(archive?.activityDate)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${archive?.id ?? "new"}-summary`}>
          Summary
        </label>
        <textarea
          id={`${archive?.id ?? "new"}-summary`}
          name="summary"
          required
          rows={5}
          maxLength={5000}
          defaultValue={archive?.summary}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${archive?.id ?? "new"}-images`}>
          Image URLs
        </label>
        <textarea
          id={`${archive?.id ?? "new"}-images`}
          name="images"
          rows={4}
          defaultValue={imagesToText(archive)}
          placeholder="https://example.com/archive-photo.jpg"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
        <p className="text-xs leading-5 text-slate-500">
          One image URL per line. Use HTTPS or local public paths only.
        </p>
      </div>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}

export default async function ArchiveAdminPage({
  searchParams,
}: ArchiveAdminPageProps) {
  await requireAdminSession();
  const params = (await searchParams) ?? {};
  const entries = await prismaArchiveRepository.listAll();
  const error = firstParam(params.error);
  const success = firstParam(params.success);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10 lg:px-16">
      <section className="mx-auto grid max-w-6xl gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
              Back to dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal">Archive management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create and maintain historical SSDU activity records.
            </p>
          </div>
          <p className="text-sm font-medium text-slate-600">{entries.length} entries</p>
        </div>

        <StatusMessage error={error} success={success} />

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Add archive entry</h2>
          <div className="mt-5">
            <ArchiveForm action={createArchiveAction} submitLabel="Create archive entry" />
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Existing archive entries</h2>
          {entries.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No archive entries have been created yet.
            </p>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{entry.title}</h3>
                    <p className="text-sm text-slate-600">
                      {entry.activityDate.toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      /archive/{entry.slug} · {entry.images.length} images
                    </p>
                  </div>
                  <form action={deleteArchiveAction.bind(null, entry.id)}>
                    <DeleteButton confirmation={`Delete ${entry.title}?`} />
                  </form>
                </div>
                <details className="mt-5">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">Edit archive entry</summary>
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <ArchiveForm
                      action={updateArchiveAction.bind(null, entry.id)}
                      archive={entry}
                      submitLabel="Save changes"
                    />
                  </div>
                </details>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
