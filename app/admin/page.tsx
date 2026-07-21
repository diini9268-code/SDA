import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  CircleGauge,
  FileText,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Target,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { AdminBrand, getAdminDisplayName } from "@/app/admin/_components/admin-brand";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import { requireAdminPageSession } from "@/lib/auth/require-admin";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";
import { prismaProgramRepository } from "@/lib/programs/program-repository";

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

const statusColors: Record<string, string> = {
  APPROVED: "#1f78b4",
  PENDING: "#f59e0b",
  REJECTED: "#ef4444",
};

const statusClasses: Record<string, string> = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
  UNREAD: "bg-sky-100 text-sky-700",
  READ: "bg-slate-100 text-slate-600",
  ARCHIVED: "bg-slate-100 text-slate-600",
};

function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AD";
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

function StatCard({
  label,
  value,
  detail,
  href,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  href: string;
  icon: LucideIcon;
  tone: string;
}) {
  return (
    <Link href={href} className="group min-h-[165px] rounded-[8px] border border-[#dfe5eb] bg-white p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#9abbd2] hover:shadow-md motion-reduce:transform-none">
      <span className={`flex size-11 items-center justify-center rounded-[8px] ${tone}`}><Icon className="size-5" aria-hidden="true" /></span>
      <p className="mt-5 text-[30px] font-bold leading-none text-[#0a294d]">{value}</p>
      <p className="mt-2.5 text-[14px] font-medium text-[#52657c]">{label}</p>
      <p className="mt-1 text-xs text-[#718196]">{detail}</p>
    </Link>
  );
}

export default async function AdminPage() {
  const session = await requireAdminPageSession();
  const [blog, contactMessages, leadership, membershipApplications, programs] = await Promise.all([
    prismaBlogRepository.listAll(),
    prismaContactRepository.listAll(),
    prismaLeadershipRepository.listAll(),
    prismaMembershipRepository.listAll(),
    prismaProgramRepository.listAll(),
  ]);

  const pendingApplications = membershipApplications.filter((item) => item.status === "PENDING");
  const unreadMessages = contactMessages.filter((item) => item.status === "UNREAD");
  const livePrograms = programs.filter((item) => item.status === "PUBLISHED" || item.status === "SCHEDULED");
  const activeLeadership = leadership.filter((item) => item.isActive !== false);

  const applicationStatuses = ["APPROVED", "PENDING", "REJECTED"].map((status) => ({
    status,
    count: membershipApplications.filter((item) => item.status === status).length,
  }));
  const applicationTotal = applicationStatuses.reduce((total, item) => total + item.count, 0);
  let cursor = 0;
  const donutSegments = applicationStatuses.map((item) => {
    const start = cursor;
    cursor += applicationTotal ? (item.count / applicationTotal) * 100 : 0;
    return `${statusColors[item.status]} ${start}% ${cursor}%`;
  });
  const donutBackground = applicationTotal
    ? `conic-gradient(${donutSegments.join(", ")})`
    : "conic-gradient(#dbe5ee 0 100%)";

  const categoryMap = new Map<string, number>();
  for (const post of blog) {
    const category = post.category || "Uncategorized";
    categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
  }
  const blogCategories = [...categoryMap.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
    .slice(0, 6);
  const maxCategoryCount = Math.max(1, ...blogCategories.map((item) => item.count));

  const recentApplications = [...membershipApplications]
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    .slice(0, 4);
  const recentMessages = [...contactMessages]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);
  const adminName = getAdminDisplayName(session?.fullName);

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[88px] items-center border-b border-white/10 px-4">
          <AdminBrand />
        </div>
        <nav aria-label="Administrator navigation" className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} aria-current={href === "/admin" ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium transition-colors ${href === "/admin" ? "bg-[#174e73] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
              <Icon className="size-5" aria-hidden="true" />{label}
              {href === "/admin/membership" && pendingApplications.length ? <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">{pendingApplications.length}</span> : null}
              {href === "/admin/contact" && unreadMessages.length ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadMessages.length}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="mb-3 flex items-center gap-3 px-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">{initials(adminName)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{adminName}</p><p className="truncate text-xs text-white/45">{session?.email}</p></div></div>
          <LogoutButton />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-[#dfe5eb] bg-white">
          <div className="mx-auto flex min-h-[88px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 xl:px-8 2xl:px-10">
            <div><h1 className="text-[20px] font-bold">Dashboard Home</h1><p className="mt-1 text-[14px] text-[#52657c]">Somali Diplomacy Association CMS</p></div>
            <div className="flex items-center gap-3"><Link href="/" className="hidden rounded-md border border-[#d5dee6] px-4 py-2 text-sm font-semibold text-[#52657c] transition-colors hover:border-[#1f78b4] hover:text-[#1f78b4] sm:block">View public site</Link><span className="flex size-10 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>{initials(adminName)}</span><span className="lg:hidden"><LogoutButton compact /></span></div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1600px] gap-7 p-5 sm:p-8 xl:p-8 2xl:p-10">
          <section aria-labelledby="dashboard-metrics" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            <h2 id="dashboard-metrics" className="sr-only">Dashboard metrics</h2>
            <StatCard label="Leadership Profiles" value={activeLeadership.length} detail={`${leadership.length} total profiles`} href="/admin/leadership" icon={UsersRound} tone="bg-sky-50 text-sky-600" />
            <StatCard label="Live Programs" value={livePrograms.length} detail={`${programs.length} total programs`} href="/admin/programs" icon={Target} tone="bg-emerald-50 text-emerald-600" />
            <StatCard label="Blog Posts" value={blog.length} detail={`${blog.filter((item) => item.status === "DRAFT").length} drafts`} href="/admin/blog" icon={FileText} tone="bg-violet-50 text-violet-600" />
            <StatCard label="Pending Applications" value={pendingApplications.length} detail={`${membershipApplications.length} total applications`} href="/admin/membership" icon={UserRoundCheck} tone="bg-amber-50 text-amber-600" />
            <StatCard label="Unread Messages" value={unreadMessages.length} detail={`${contactMessages.length} total messages`} href="/admin/contact" icon={MessageSquare} tone="bg-red-50 text-red-600" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-[21px] font-bold">Blog by Category</h2><p className="mt-1 text-sm text-[#718196]">Published and draft posts from the current database</p></div><Link href="/admin/blog" className="text-sm font-semibold text-[#1f78b4] hover:underline">Manage blog</Link></div>
              {blogCategories.length ? <div className="mt-6 grid gap-4">{blogCategories.map((item) => <div key={item.category} className="grid grid-cols-[minmax(90px,150px)_1fr_32px] items-center gap-3"><span className="truncate text-sm font-medium text-[#52657c]">{item.category}</span><span className="h-8 overflow-hidden rounded-[5px] bg-[#edf3f8]"><span className="block h-full rounded-[5px] bg-[#2378ad]" style={{ width: `${Math.max(8, (item.count / maxCategoryCount) * 100)}%` }} /></span><span className="text-right text-sm font-bold">{item.count}</span></div>)}</div> : <p className="mt-6 rounded-[8px] border border-dashed border-[#cfd9e2] px-5 py-7 text-center text-sm text-[#718196]">Blog categories will appear after posts are created.</p>}
            </div>

            <div className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 sm:p-6">
              <h2 className="text-[21px] font-bold">Application Status</h2>
              <div className="mx-auto mt-6 flex size-44 items-center justify-center rounded-full" style={{ background: donutBackground }}><div className="flex size-24 flex-col items-center justify-center rounded-full bg-white"><span className="text-2xl font-bold">{applicationTotal}</span><span className="text-xs text-[#718196]">Total</span></div></div>
              <dl className="mt-6 grid gap-3">{applicationStatuses.map((item) => <div key={item.status} className="flex items-center justify-between"><dt className="flex items-center gap-2 text-sm text-[#52657c]"><span className="size-3 rounded-full" style={{ backgroundColor: statusColors[item.status] }} />{item.status[0]}{item.status.slice(1).toLowerCase()}</dt><dd className="text-sm font-bold">{item.count}</dd></div>)}</dl>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between"><h2 className="text-[21px] font-bold">Recent Applications</h2><Link href="/admin/membership" className="text-sm font-semibold text-[#1f78b4] hover:underline">View all</Link></div>
              <div className="mt-6 divide-y divide-[#e6ebef]">{recentApplications.length ? recentApplications.map((item) => <div key={item.id} className="flex items-center gap-3 py-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e7f1f8] text-sm font-bold text-[#1f78b4]">{initials(item.fullName)}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{item.fullName}</p><p className="truncate text-sm text-[#718196]">{item.areaOfInterest || "Membership application"}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[item.status] ?? "bg-slate-100 text-slate-600"}`}>{item.status[0]}{item.status.slice(1).toLowerCase()}</span></div>) : <p className="py-8 text-center text-sm text-[#718196]">No membership applications yet.</p>}</div>
            </div>

            <div className="rounded-[8px] border border-[#dfe5eb] bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between"><h2 className="text-[21px] font-bold">Recent Messages</h2><Link href="/admin/contact" className="text-sm font-semibold text-[#1f78b4] hover:underline">View all</Link></div>
              <div className="mt-6 divide-y divide-[#e6ebef]">{recentMessages.length ? recentMessages.map((item) => <div key={item.id} className="flex items-center gap-3 py-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e9eff7] text-sm font-bold">{initials(item.fullName || "Message")}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{item.fullName || "Website visitor"}</p><p className="truncate text-sm text-[#718196]">{item.subject}</p></div><div className="text-right"><p className="text-xs text-[#718196]">{formatDate(item.createdAt)}</p>{item.status === "UNREAD" ? <span className="mt-2 ml-auto block size-2.5 rounded-full bg-[#1f78b4]" aria-label="Unread" /> : null}</div></div>) : <p className="py-8 text-center text-sm text-[#718196]">No contact messages yet.</p>}</div>
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[#dfe5eb] bg-white px-5 py-4 text-sm text-[#718196]"><span>Reports use current aggregate database records.</span><Link href="/admin/reports" className="inline-flex items-center gap-2 font-semibold text-[#1f78b4] hover:underline"><CircleGauge className="size-4" />Open database reports</Link></section>
        </div>
      </div>
    </main>
  );
}
