import Link from "next/link";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  Inbox,
  LayoutDashboard,
  Target,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { AdminBrand, getAdminDisplayName } from "@/app/admin/_components/admin-brand";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import { requireAdminPageSession } from "@/lib/auth/require-admin";
import { prismaReportsRepository } from "@/lib/reports/report-repository";
import { getReportsSnapshot } from "@/lib/reports/report-service";
import type { CategoryCount, StatusCount } from "@/lib/reports/report-service";
import type { MonthlyCount } from "@/lib/reports/report-service";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin", label: "Dashboard Home", icon: LayoutDashboard },
  { href: "/admin/content", label: "Website Content", icon: LayoutDashboard },
  { href: "/admin/gallery", label: "Activity Gallery", icon: LayoutDashboard },
  { href: "/admin/leadership", label: "Leadership", icon: UsersRound },
  { href: "/admin/programs", label: "Programs", icon: Target },
  { href: "/admin/blog", label: "Blog", icon: BookOpenText },
  { href: "/admin/membership", label: "Applications", icon: UserRoundCheck },
  { href: "/admin/contact", label: "Messages", icon: Inbox },
  { href: "/admin/users", label: "Users", icon: UserRound },
  { href: "/admin/reports", label: "Reports", icon: ChartNoAxesColumnIncreasing },
];

const applicationColors: Record<string, string> = {
  APPROVED: "#1f78b4",
  PENDING: "#f59e0b",
  REJECTED: "#ef4444",
};

function initials(value: string): string {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AD";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function statusLabel(value: string): string {
  return value.split("_").map((part) => part[0] + part.slice(1).toLowerCase()).join(" ");
}

function countStatus(items: StatusCount[], status: string): number {
  return items.find((item) => item.status === status)?.count ?? 0;
}

function DonutChart({ items }: { items: StatusCount[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  let cursor = 0;
  const segments = items.map((item) => {
    const start = cursor;
    cursor += total ? (item.count / total) * 100 : 0;
    return `${applicationColors[item.status] ?? "#94a3b8"} ${start}% ${cursor}%`;
  });
  const background = total ? `conic-gradient(${segments.join(", ")})` : "#e2e8f0";

  return (
    <div className="grid items-center gap-7 sm:grid-cols-[220px_minmax(0,1fr)]">
      <div className="relative mx-auto size-48 rounded-full sm:size-52" style={{ background }} role="img" aria-label={`Application status chart. ${items.map((item) => `${statusLabel(item.status)} ${item.count}`).join(", ")}`}>
        <div className="absolute inset-[28%] flex flex-col items-center justify-center rounded-full bg-white"><span className="text-3xl font-bold">{total}</span><span className="mt-1 text-xs font-semibold uppercase text-[#718196]">Total</span></div>
      </div>
      <dl className="grid gap-3">
        {items.length ? items.map((item) => <div key={item.status} className="flex items-center justify-between gap-4"><dt className="flex items-center gap-2 text-sm text-[#52657c]"><span className="size-2.5 rounded-full" style={{ backgroundColor: applicationColors[item.status] ?? "#94a3b8" }} />{statusLabel(item.status)}</dt><dd className="font-bold">{item.count}</dd></div>) : <div className="text-sm text-[#718196]">No applications yet.</div>}
      </dl>
    </div>
  );
}

function BarChart({ items }: { items: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <dl className="grid gap-4" aria-label="Current content totals">
      {items.map((item) => <div key={item.label} className="grid grid-cols-[92px_minmax(0,1fr)_36px] items-center gap-3 sm:grid-cols-[110px_minmax(0,1fr)_44px]"><dt className="truncate text-sm font-medium text-[#52657c]">{item.label}</dt><dd className="h-7 overflow-hidden rounded-[4px] bg-[#edf2f7]"><span className="block h-full min-w-1 rounded-[4px] bg-[#1f78b4] transition-[width]" style={{ width: `${(item.value / max) * 100}%` } as CSSProperties} /></dd><dd className="text-right text-sm font-bold">{item.value}</dd></div>)}
    </dl>
  );
}

function LineChart({ items }: { items: MonthlyCount[] }) {
  const values = items.length ? items : [{ month: "No data", count: 0 }];
  const max = Math.max(1, ...values.map((item) => item.count));
  const points = values.map((item, index) => {
    const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
    const y = 92 - (item.count / max) * 76;
    return { ...item, x, y };
  });

  return (
    <div>
      <div className="relative h-56 border-b border-l border-[#91a0b2]" role="img" aria-label={`Application submissions over six months. ${values.map((item) => `${item.month} ${item.count}`).join(", ")}`}>
        <div className="pointer-events-none absolute inset-0 grid grid-rows-4">{Array.from({ length: 4 }, (_, index) => <span key={index} className="border-t border-dashed border-[#e5eaf0]" />)}</div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          <polyline points={points.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#1f78b4" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {points.map((point) => <circle key={point.month} cx={point.x} cy={point.y} r="1.8" fill="#1f78b4" vectorEffect="non-scaling-stroke" />)}
        </svg>
      </div>
      <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>{values.map((item) => <div key={item.month} className="text-center"><p className="text-xs font-semibold text-[#52657c]">{item.month}</p><p className="mt-1 text-xs text-[#718196]">{item.count}</p></div>)}</div>
    </div>
  );
}

function Breakdown({ title, items }: { title: string; items: Array<{ label: string; value: number }> }) {
  return (
    <section className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 sm:p-7">
      <h2 className="text-xl font-bold">{title}</h2>
      <dl className="mt-5 divide-y divide-[#e7ebef]">{items.map((item) => <div key={item.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"><dt className="text-sm text-[#52657c]">{item.label}</dt><dd className="font-bold">{item.value}</dd></div>)}</dl>
    </section>
  );
}

function CategoryBreakdown({ items }: { items: CategoryCount[] }) {
  return <Breakdown title="Blog Categories" items={items.length ? items.map((item) => ({ label: item.category, value: item.count })) : [{ label: "No categories", value: 0 }]} />;
}

export default async function AdminReportsPage() {
  const session = await requireAdminPageSession();
  const snapshot = await getReportsSnapshot(prismaReportsRepository);
  const pendingCount = countStatus(snapshot.membership.byStatus, "PENDING");
  const unreadCount = countStatus(snapshot.contact.byStatus, "UNREAD");
  const adminName = getAdminDisplayName(session?.fullName);
  const contentTotals = [
    { label: "Blog", value: snapshot.totals.blogPosts },
    { label: "Programs", value: snapshot.totals.programs },
    { label: "Applications", value: snapshot.totals.membershipApplications },
    { label: "Messages", value: snapshot.totals.contactMessages },
    { label: "Archive", value: snapshot.totals.archiveEntries },
  ];

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[88px] items-center border-b border-white/10 px-4"><AdminBrand /></div>
        <nav aria-label="Administrator navigation" className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={href === "/admin/reports" ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium transition-colors ${href === "/admin/reports" ? "bg-[#174e73] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="size-5" aria-hidden="true" />{label}{href === "/admin/membership" && pendingCount ? <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">{pendingCount}</span> : null}{href === "/admin/contact" && unreadCount ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span> : null}</Link>)}</nav>
        <div className="hidden border-t border-white/10 p-4 lg:block"><div className="mb-3 flex items-center gap-3 px-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">{initials(adminName)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{adminName}</p><p className="truncate text-xs text-white/45">{session?.email}</p></div></div><LogoutButton /></div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-[#dfe5eb] bg-white"><div className="mx-auto flex min-h-[88px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 xl:px-8 2xl:px-10"><div><h1 className="text-[20px] font-bold">Reports &amp; Analytics</h1><p className="mt-1 text-[14px] text-[#52657c]">Somali Diplomacy Association CMS</p></div><div className="flex items-center gap-3"><span className="hidden text-right text-xs text-[#718196] sm:block">Generated<br />{formatDate(snapshot.generatedAt)}</span><span className="flex size-10 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>{initials(adminName)}</span><span className="lg:hidden"><LogoutButton compact /></span></div></div></header>

        <div className="mx-auto grid w-full max-w-[1600px] gap-6 p-5 sm:p-8 xl:p-8 2xl:p-10">
          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 sm:p-8"><h2 className="text-[23px] font-bold">Application Growth</h2><p className="mt-1 text-sm text-[#718196]">Submissions received over the last six months</p><div className="mt-8"><LineChart items={snapshot.membership.monthlyApplications} /></div></div>
            <div className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 sm:p-8"><h2 className="text-[23px] font-bold">Applications Overview</h2><p className="mt-1 text-sm text-[#718196]">Current application review statuses</p><div className="mt-6"><DonutChart items={snapshot.membership.byStatus} /></div></div>
          </section>

          <section aria-labelledby="report-totals-title" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <h2 id="report-totals-title" className="sr-only">Report totals</h2>
            {[{ label: "Approval Rate", value: `${snapshot.membership.approvalRate}%`, detail: `${snapshot.totals.membershipApplications} applications` }, { label: "Unread Rate", value: `${snapshot.contact.unreadRate}%`, detail: `${snapshot.totals.contactMessages} messages` }, { label: "Upcoming Programs", value: snapshot.programs.upcoming, detail: `${snapshot.programs.liveOrScheduled} live or scheduled` }, { label: "Blog Media", value: snapshot.totals.blogMedia, detail: `${snapshot.totals.blogPosts} posts` }].map((metric) => <div key={metric.label} className="rounded-[8px] border border-[#dfe5eb] bg-white p-5"><p className="text-3xl font-bold text-[#1f78b4]">{metric.value}</p><p className="mt-3 font-bold">{metric.label}</p><p className="mt-1 text-sm text-[#718196]">{metric.detail}</p></div>)}
          </section>

          <section className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 sm:p-7"><h2 className="text-xl font-bold">Current Content Totals</h2><p className="mt-1 text-sm text-[#718196]">Records currently stored by backend module</p><div className="mt-6"><BarChart items={contentTotals} /></div></section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Breakdown title="Blog Status" items={[{ label: "Published", value: snapshot.blog.published }, { label: "Draft", value: snapshot.blog.drafts }, { label: "Archived", value: snapshot.blog.archived }]} />
            <CategoryBreakdown items={snapshot.blog.categories} />
            <Breakdown title="Program Status" items={snapshot.programs.byStatus.length ? snapshot.programs.byStatus.map((item) => ({ label: statusLabel(item.status), value: item.count })) : [{ label: "No programs", value: 0 }]} />
            <Breakdown title="Message Status" items={snapshot.contact.byStatus.length ? snapshot.contact.byStatus.map((item) => ({ label: statusLabel(item.status), value: item.count })) : [{ label: "No messages", value: 0 }]} />
          </section>
        </div>
      </div>
    </main>
  );
}
