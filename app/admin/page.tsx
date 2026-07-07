import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import { prismaProgramRepository } from "@/lib/programs/program-repository";

export default async function AdminPage() {
  const session = await requireAdminSession();
  const [leadership, programs] = await Promise.all([
    prismaLeadershipRepository.listAll(),
    prismaProgramRepository.listAll(),
  ]);
  const nextWorkItems = [
    "Research management",
    "Archive management",
    "Membership applications",
    "Contact message review",
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10 lg:px-16">
      <section className="mx-auto grid max-w-6xl gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
            Administrator
          </p>
          <h1 className="text-4xl font-semibold tracking-normal">
            SSDU Admin Dashboard
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-700">
            Signed in as {session?.fullName ?? "an authenticated administrator"}.
            Manage the content areas that already have backend support before
            moving to the next feature milestone.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/leadership"
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Content
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Manage leadership</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add, edit, reorder, hide, and delete leadership profiles.
            </p>
            <p className="mt-5 text-sm font-semibold text-slate-950">
              {leadership.length} profiles
            </p>
          </Link>

          <Link
            href="/admin/programs"
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Content
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Manage programs</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Create, schedule, publish, archive, cancel, and remove programs.
            </p>
            <p className="mt-5 text-sm font-semibold text-slate-950">
              {programs.length} programs
            </p>
          </Link>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Next planned feature areas</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {nextWorkItems.map((item, index) => (
              <div
                key={item}
                className="rounded-md border border-slate-200 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Step {index + 1}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
