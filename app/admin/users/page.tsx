import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  Globe2,
  Inbox,
  LayoutDashboard,
  Mail,
  ShieldCheck,
  Target,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaAdminUserDirectoryRepository } from "@/lib/auth/user-repository";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin", label: "Dashboard Home", icon: LayoutDashboard },
  { href: "/admin/leadership", label: "Leadership", icon: UsersRound },
  { href: "/admin/programs", label: "Programs", icon: Target },
  { href: "/admin/blog", label: "Blog", icon: BookOpenText },
  { href: "/admin/membership", label: "Applications", icon: UserRoundCheck },
  { href: "/admin/contact", label: "Messages", icon: Inbox },
  { href: "/admin/users", label: "Users", icon: UserRound },
  { href: "/admin/reports", label: "Reports", icon: ChartNoAxesColumnIncreasing },
];

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

export default async function AdminUsersPage() {
  const session = await requireAdminSession();
  const [users, applications, messages] = await Promise.all([
    prismaAdminUserDirectoryRepository.listAdmins(),
    prismaMembershipRepository.listAll(),
    prismaContactRepository.listAll(),
  ]);
  const pendingCount = applications.filter((application) => application.status === "PENDING").length;
  const unreadCount = messages.filter((message) => message.status === "UNREAD").length;
  const adminName = session?.fullName ?? "Administrator";

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[104px] items-center gap-3 border-b border-white/10 px-6"><span className="flex size-12 shrink-0 flex-col items-center justify-center"><Globe2 className="size-7 text-[#27b3f4]" /><span className="text-[7px] font-bold tracking-[0.22em]">SSDU</span></span><div><p className="text-lg font-bold">SSDU Admin</p><p className="text-sm text-[#27b3f4]">Administrator</p></div></div>
        <nav aria-label="Administrator navigation" className="flex gap-1 overflow-x-auto px-4 py-4 lg:flex-1 lg:flex-col lg:overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={href === "/admin/users" ? "page" : undefined} className={`flex min-h-12 shrink-0 items-center gap-3 rounded-[8px] px-4 text-[15px] font-medium transition-colors ${href === "/admin/users" ? "bg-[#174e73] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="size-5" aria-hidden="true" />{label}{href === "/admin/membership" && pendingCount ? <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">{pendingCount}</span> : null}{href === "/admin/contact" && unreadCount ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span> : null}</Link>)}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block"><div className="mb-3 flex items-center gap-3 px-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">{initials(adminName)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{adminName}</p><p className="truncate text-xs text-white/45">{session?.email}</p></div></div><LogoutButton /></div>
      </aside>

      <div className="min-w-0">
        <header className="flex min-h-[104px] items-center justify-between border-b border-[#dfe5eb] bg-white px-5 sm:px-8">
          <div><h1 className="text-[22px] font-bold">Users</h1><p className="mt-1 text-[15px] text-[#52657c]">Somali Student Diplomacy Union CMS</p></div>
          <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>{initials(adminName)}</span><span className="lg:hidden"><LogoutButton compact /></span></div>
        </header>

        <div className="p-5 sm:p-8">
          <section className="overflow-hidden rounded-[8px] border border-[#dfe5eb] bg-white" aria-labelledby="admin-users-title">
            <div className="flex min-h-[100px] items-center justify-between gap-4 border-b border-[#e4e9ee] px-5 sm:px-8">
              <div><h2 id="admin-users-title" className="text-[23px] font-bold">Administrator Accounts</h2><p className="mt-1 text-sm text-[#718196]">Accounts authorized by the existing administrator authentication system</p></div>
              <span className="rounded-full bg-[#e7f1f8] px-3 py-1 text-sm font-semibold text-[#1f78b4]">{users.length} Total</span>
            </div>

            {users.length ? <div className="divide-y divide-[#e4e9ee]">{users.map((user) => <article key={user.id} className="grid gap-5 px-5 py-5 transition-colors hover:bg-[#f8fbfd] sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.7fr)_180px] lg:items-center"><div className="flex min-w-0 items-center gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e7eef7] font-bold">{initials(user.fullName)}</span><div className="min-w-0"><h3 className="truncate font-bold">{user.fullName}</h3><a href={`mailto:${user.email}`} className="mt-1 flex items-center gap-2 truncate text-sm text-[#52657c] hover:text-[#1f78b4] hover:underline"><Mail className="size-4 shrink-0" aria-hidden="true" />{user.email}</a></div></div><div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700"><ShieldCheck className="size-4" aria-hidden="true" />Administrator</span></div><dl className="text-sm"><dt className="font-semibold text-[#718196]">Created</dt><dd className="mt-1 text-[#294564]">{formatDate(user.createdAt)}</dd></dl></article>)}</div> : <div className="px-5 py-16 text-center sm:px-8"><span className="mx-auto flex size-16 items-center justify-center rounded-[8px] bg-[#f3f6fa]"><UserRound className="size-8 text-[#62758d]" aria-hidden="true" /></span><h3 className="mt-5 text-xl font-bold">No administrator accounts</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#52657c]">No administrator records are available in the existing users table.</p></div>}
          </section>
        </div>
      </div>
    </main>
  );
}
