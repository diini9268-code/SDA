import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  Inbox,
  LayoutDashboard,
  Mail,
  Phone,
  Target,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { SubmitButton } from "@/app/admin/_components/form-controls";
import { AdminBrand, getAdminDisplayName } from "@/app/admin/_components/admin-brand";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import { updateMembershipStatusAction } from "@/app/admin/membership/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
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

const statusClasses: Record<ApplicationStatusValue, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

function firstParam(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function initials(value: string): string {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AD";
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

function statusLabel(status: ApplicationStatusValue): string {
  return status[0] + status.slice(1).toLowerCase();
}

function StatusMessage({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  return <div className={`rounded-[8px] border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role="status">{error ?? success}</div>;
}

function StatusForm({ application }: { application: MembershipApplicationRecord }) {
  return (
    <form action={updateMembershipStatusAction.bind(null, application.id)} className="flex min-w-[190px] items-center gap-2">
      <label className="sr-only" htmlFor={`${application.id}-status`}>Review status for {application.fullName}</label>
      <select id={`${application.id}-status`} name="status" defaultValue={application.status} className="min-h-10 min-w-0 flex-1 rounded-[8px] border border-[#ced9e3] bg-white px-3 text-sm text-[#0a294d] outline-none focus:border-[#1f78b4] focus:ring-2 focus:ring-[#1f78b4]/15">{applicationStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select>
      <SubmitButton pendingLabel="Saving..." className="min-h-10 bg-[#1f78b4] px-3 hover:bg-[#155f91]">Save</SubmitButton>
    </form>
  );
}

export default async function MembershipAdminPage({ searchParams }: MembershipAdminPageProps) {
  const session = await requireAdminSession();
  const params = (await searchParams) ?? {};
  const [applications, messages] = await Promise.all([
    prismaMembershipRepository.listAll(),
    prismaContactRepository.listAll(),
  ]);
  const pendingCount = applications.filter((application) => application.status === "PENDING").length;
  const approvedCount = applications.filter((application) => application.status === "APPROVED").length;
  const rejectedCount = applications.filter((application) => application.status === "REJECTED").length;
  const unreadCount = messages.filter((message) => message.status === "UNREAD").length;
  const adminName = getAdminDisplayName(session?.fullName);

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[88px] items-center border-b border-white/10 px-4"><AdminBrand /></div>
        <nav aria-label="Administrator navigation" className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={href === "/admin/membership" ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium transition-colors ${href === "/admin/membership" ? "bg-[#174e73] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="size-5" aria-hidden="true" />{label}{href === "/admin/membership" && pendingCount ? <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">{pendingCount}</span> : null}{href === "/admin/contact" && unreadCount ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span> : null}</Link>)}</nav>
        <div className="hidden border-t border-white/10 p-4 lg:block"><div className="mb-3 flex items-center gap-3 px-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">{initials(adminName)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{adminName}</p><p className="truncate text-xs text-white/45">{session?.email}</p></div></div><LogoutButton /></div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-[#dfe5eb] bg-white"><div className="mx-auto flex min-h-[88px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 xl:px-8 2xl:px-10"><div><h1 className="text-[20px] font-bold">Membership Applications</h1><p className="mt-1 text-[14px] text-[#52657c]">Somali Diplomacy Association CMS</p></div><div className="flex items-center gap-3"><Link href="/membership" className="hidden rounded-md border border-[#d5dee6] px-4 py-2 text-sm font-semibold text-[#52657c] transition-colors hover:border-[#1f78b4] hover:text-[#1f78b4] sm:block">View application page</Link><span className="flex size-10 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>{initials(adminName)}</span><span className="lg:hidden"><LogoutButton compact /></span></div></div></header>

        <div className="mx-auto grid w-full max-w-[1600px] gap-6 p-5 sm:p-8 xl:p-8 2xl:p-10">
          <div><h2 className="text-2xl font-bold">Application review</h2><p className="mt-1 max-w-2xl text-sm text-[#718196]">Review application details and update the existing status. Applicant contact information remains inside the protected administration area.</p></div>
          <StatusMessage error={firstParam(params.error)} success={firstParam(params.success)} />

          <section aria-label="Application totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[{ label: "Total", value: applications.length, tone: "text-[#1f78b4]" }, { label: "Pending", value: pendingCount, tone: "text-amber-600" }, { label: "Approved", value: approvedCount, tone: "text-emerald-600" }, { label: "Rejected", value: rejectedCount, tone: "text-red-600" }].map((item) => <div key={item.label} className="rounded-[8px] border border-[#dfe5eb] bg-white p-5"><p className={`text-3xl font-bold ${item.tone}`}>{item.value}</p><p className="mt-2 text-sm font-semibold text-[#52657c]">{item.label}</p></div>)}
          </section>

          <section className="overflow-hidden rounded-[8px] border border-[#dfe5eb] bg-white" aria-labelledby="applications-table-title">
            <h2 id="applications-table-title" className="sr-only">Submitted membership applications</h2>
            {applications.length === 0 ? <div className="p-12 text-center sm:p-16"><span className="mx-auto flex size-20 items-center justify-center rounded-[8px] bg-[#f3f6fa]"><UserRoundCheck className="size-10 text-[#62758d]" /></span><h3 className="mt-6 text-2xl font-bold">No applications yet</h3><p className="mx-auto mt-3 max-w-md text-[#52657c]">Applications will appear here after someone submits the public membership form.</p><Link href="/membership" className="mt-6 inline-flex min-h-11 items-center rounded-[8px] border border-[#1f78b4] px-5 font-semibold text-[#1f78b4] hover:bg-[#e7f1f8]">View public form</Link></div> : <>
              <div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[1050px] border-collapse text-left"><thead className="bg-[#f7f9fb] text-xs uppercase text-[#5b6d84]"><tr><th className="px-7 py-5 font-bold">Applicant</th><th className="px-6 py-5 font-bold">Contact</th><th className="px-6 py-5 font-bold">Background</th><th className="px-6 py-5 font-bold">Submitted</th><th className="px-6 py-5 font-bold">Review status</th></tr></thead><tbody className="divide-y divide-[#e7ebef]">{applications.map((application) => <tr key={application.id} className="align-top transition-colors hover:bg-[#f8fbfd]"><td className="px-7 py-5"><div className="flex items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e7f1f8] text-sm font-bold text-[#1f78b4]">{initials(application.fullName)}</span><div><p className="font-semibold">{application.fullName}</p><span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[application.status]}`}>{statusLabel(application.status)}</span></div></div></td><td className="px-6 py-5 text-sm text-[#52657c]"><a href={`mailto:${application.email}`} className="flex items-center gap-2 hover:text-[#1f78b4] hover:underline"><Mail className="size-4" />{application.email}</a><a href={`tel:${application.phone}`} className="mt-2 flex items-center gap-2 hover:text-[#1f78b4] hover:underline"><Phone className="size-4" />{application.phone}</a></td><td className="px-6 py-5 text-sm text-[#52657c]"><p className="font-medium text-[#0a294d]">{application.university}</p><p className="mt-2">{application.areaOfInterest}</p></td><td className="px-6 py-5 text-sm text-[#52657c]">{formatDate(application.submittedAt)}</td><td className="px-6 py-5"><StatusForm application={application} /></td></tr>)}</tbody></table></div>
              <div className="divide-y divide-[#e7ebef] lg:hidden">{applications.map((application) => <article key={application.id} className="p-5"><div className="flex items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e7f1f8] text-sm font-bold text-[#1f78b4]">{initials(application.fullName)}</span><div className="min-w-0 flex-1"><h3 className="font-semibold">{application.fullName}</h3><p className="mt-1 text-sm text-[#52657c]">{application.university}</p><span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[application.status]}`}>{statusLabel(application.status)}</span></div></div><dl className="mt-5 grid gap-3 text-sm"><div><dt className="font-semibold">Contact</dt><dd className="mt-1 break-all text-[#52657c]">{application.email}<br />{application.phone}</dd></div><div><dt className="font-semibold">Area of interest</dt><dd className="mt-1 text-[#52657c]">{application.areaOfInterest}</dd></div><div><dt className="font-semibold">Submitted</dt><dd className="mt-1 text-[#52657c]">{formatDate(application.submittedAt)}</dd></div></dl><div className="mt-5 border-t border-[#e7ebef] pt-4"><StatusForm application={application} /></div></article>)}</div>
            </>}
          </section>
        </div>
      </div>
    </main>
  );
}
