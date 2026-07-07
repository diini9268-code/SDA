import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaReportsRepository } from "@/lib/reports/report-repository";
import { getReportsSnapshot } from "@/lib/reports/report-service";
import type { CategoryCount, StatusCount } from "@/lib/reports/report-service";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number | string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

function StatusList({ items }: { items: StatusCount[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-600">No records yet.</p>;
  }

  return (
    <dl className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.status}
          className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3"
        >
          <dt className="text-sm font-semibold text-slate-800">
            {item.status}
          </dt>
          <dd className="text-sm font-semibold text-slate-950">
            {item.count}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CategoryList({ items }: { items: CategoryCount[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-600">No blog categories yet.</p>;
  }

  return (
    <dl className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.category}
          className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3"
        >
          <dt className="text-sm font-semibold text-slate-800">
            {item.category}
          </dt>
          <dd className="text-sm font-semibold text-slate-950">
            {item.count}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default async function AdminReportsPage() {
  await requireAdminSession();
  const snapshot = await getReportsSnapshot(prismaReportsRepository);

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
              Reports and analytics
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Aggregated SSDU website statistics generated from database
              records. Personal applicant and sender details are intentionally
              excluded from this report.
            </p>
          </div>
          <p className="text-sm font-medium text-slate-600">
            Generated {formatDate(snapshot.generatedAt)}
          </p>
        </div>

        <section aria-labelledby="report-totals">
          <h2 id="report-totals" className="text-xl font-semibold">
            Totals
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="Blog posts"
              value={snapshot.totals.blogPosts}
              detail={`${snapshot.totals.blogMedia} blog-owned media records`}
            />
            <MetricCard
              label="Programs"
              value={snapshot.totals.programs}
              detail={`${snapshot.programs.upcoming} upcoming public programs`}
            />
            <MetricCard
              label="Membership applications"
              value={snapshot.totals.membershipApplications}
              detail={`${snapshot.membership.approvalRate}% approval rate`}
            />
            <MetricCard
              label="Contact messages"
              value={snapshot.totals.contactMessages}
              detail={`${snapshot.contact.unreadRate}% unread`}
            />
            <MetricCard
              label="Archive entries"
              value={snapshot.totals.archiveEntries}
              detail="Historical activity records"
            />
            <MetricCard
              label="Live programs"
              value={snapshot.programs.liveOrScheduled}
              detail="Published or scheduled programs"
            />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Blog by status</h2>
            <div className="mt-4">
              <StatusList
                items={[
                  { status: "PUBLISHED", count: snapshot.blog.published },
                  { status: "DRAFT", count: snapshot.blog.drafts },
                  { status: "ARCHIVED", count: snapshot.blog.archived },
                ]}
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Blog categories</h2>
            <div className="mt-4">
              <CategoryList items={snapshot.blog.categories} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Programs by status</h2>
            <div className="mt-4">
              <StatusList items={snapshot.programs.byStatus} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Membership by status</h2>
            <div className="mt-4">
              <StatusList items={snapshot.membership.byStatus} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-semibold">Contact messages by status</h2>
            <div className="mt-4">
              <StatusList items={snapshot.contact.byStatus} />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
