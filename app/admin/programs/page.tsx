import Link from "next/link";
import { DeleteButton, SubmitButton } from "@/app/admin/_components/form-controls";
import {
  createProgramAction,
  deleteProgramAction,
  updateProgramAction,
} from "@/app/admin/programs/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import type { ProgramRecord } from "@/lib/programs/program-service";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import type { ProgramStatusValue } from "@/lib/programs/validation";

type ProgramsAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const programStatuses: ProgramStatusValue[] = [
  "DRAFT",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
  "CANCELLED",
];

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

function StatusMessage({ error, success }: { error: string | null; success: string | null }) {
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

function ProgramForm({
  action,
  program,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  program?: ProgramRecord;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${program?.id ?? "new"}-title`}>
          Title
        </label>
        <input
          id={`${program?.id ?? "new"}-title`}
          name="title"
          required
          maxLength={220}
          defaultValue={program?.title}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${program?.id ?? "new"}-description`}>
          Description
        </label>
        <textarea
          id={`${program?.id ?? "new"}-description`}
          name="description"
          required
          rows={4}
          maxLength={5000}
          defaultValue={program?.description}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${program?.id ?? "new"}-eventDate`}>
            Event date
          </label>
          <input
            id={`${program?.id ?? "new"}-eventDate`}
            name="eventDate"
            type="datetime-local"
            required
            defaultValue={formatDateTimeInput(program?.eventDate)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${program?.id ?? "new"}-location`}>
            Location
          </label>
          <input
            id={`${program?.id ?? "new"}-location`}
            name="location"
            required
            maxLength={220}
            defaultValue={program?.location}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${program?.id ?? "new"}-status`}>
            Status
          </label>
          <select
            id={`${program?.id ?? "new"}-status`}
            name="status"
            defaultValue={program?.status ?? "DRAFT"}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          >
            {programStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}

export default async function ProgramsAdminPage({
  searchParams,
}: ProgramsAdminPageProps) {
  await requireAdminSession();
  const params = (await searchParams) ?? {};
  const programs = await prismaProgramRepository.listAll();
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
            <h1 className="mt-3 text-3xl font-semibold tracking-normal">Programs management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create, schedule, publish, archive, cancel, or remove SSDU programs.
            </p>
          </div>
          <p className="text-sm font-medium text-slate-600">{programs.length} programs</p>
        </div>

        <StatusMessage error={error} success={success} />

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Add program</h2>
          <div className="mt-5">
            <ProgramForm action={createProgramAction} submitLabel="Create program" />
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Existing programs</h2>
          {programs.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No programs have been created yet.
            </p>
          ) : (
            programs.map((program) => (
              <article key={program.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{program.title}</h3>
                    <p className="text-sm text-slate-600">
                      {program.location} · {program.eventDate.toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {program.status} · /programs/{program.slug}
                    </p>
                  </div>
                  <form action={deleteProgramAction.bind(null, program.id)}>
                    <DeleteButton confirmation={`Delete ${program.title}?`} />
                  </form>
                </div>
                <details className="mt-5">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">Edit program</summary>
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <ProgramForm
                      action={updateProgramAction.bind(null, program.id)}
                      program={program}
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
