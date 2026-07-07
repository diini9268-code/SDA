import Link from "next/link";
import { DeleteButton, SubmitButton } from "@/app/admin/_components/form-controls";
import {
  createLeadershipAction,
  deleteLeadershipAction,
  updateLeadershipAction,
} from "@/app/admin/leadership/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import type { LeadershipProfile } from "@/lib/leadership/leadership-service";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";

type LeadershipAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
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

function LeadershipForm({
  action,
  profile,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  profile?: LeadershipProfile;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${profile?.id ?? "new"}-fullName`}>
          Full name
        </label>
        <input
          id={`${profile?.id ?? "new"}-fullName`}
          name="fullName"
          required
          maxLength={160}
          defaultValue={profile?.fullName}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${profile?.id ?? "new"}-position`}>
          Position
        </label>
        <input
          id={`${profile?.id ?? "new"}-position`}
          name="position"
          required
          maxLength={160}
          defaultValue={profile?.position}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${profile?.id ?? "new"}-biography`}>
          Biography
        </label>
        <textarea
          id={`${profile?.id ?? "new"}-biography`}
          name="biography"
          required
          rows={4}
          maxLength={5000}
          defaultValue={profile?.biography}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${profile?.id ?? "new"}-photo`}>
            Photo URL
          </label>
          <input
            id={`${profile?.id ?? "new"}-photo`}
            name="photo"
            type="url"
            maxLength={2048}
            placeholder="https://..."
            defaultValue={profile?.photo ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${profile?.id ?? "new"}-displayOrder`}>
            Order
          </label>
          <input
            id={`${profile?.id ?? "new"}-displayOrder`}
            name="displayOrder"
            type="number"
            min={0}
            defaultValue={profile?.displayOrder ?? 0}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-900"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={profile?.isActive ?? true}
          className="h-4 w-4 rounded border-slate-300"
        />
        Active on public leadership page
      </label>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}

export default async function LeadershipAdminPage({
  searchParams,
}: LeadershipAdminPageProps) {
  await requireAdminSession();
  const params = (await searchParams) ?? {};
  const profiles = await prismaLeadershipRepository.listAll();
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
            <h1 className="mt-3 text-3xl font-semibold tracking-normal">Leadership management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create, edit, reorder, activate, or remove leadership profiles shown on the public site.
            </p>
          </div>
          <p className="text-sm font-medium text-slate-600">{profiles.length} profiles</p>
        </div>

        <StatusMessage error={error} success={success} />

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Add leadership profile</h2>
          <div className="mt-5">
            <LeadershipForm action={createLeadershipAction} submitLabel="Create profile" />
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Existing profiles</h2>
          {profiles.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No leadership profiles have been created yet.
            </p>
          ) : (
            profiles.map((profile) => (
              <article key={profile.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{profile.fullName}</h3>
                    <p className="text-sm text-slate-600">{profile.position}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {profile.isActive ? "Active" : "Hidden"} · Order {profile.displayOrder}
                    </p>
                  </div>
                  <form action={deleteLeadershipAction.bind(null, profile.id)}>
                    <DeleteButton confirmation={`Delete ${profile.fullName}?`} />
                  </form>
                </div>
                <details className="mt-5">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">Edit profile</summary>
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <LeadershipForm
                      action={updateLeadershipAction.bind(null, profile.id)}
                      profile={profile}
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
