import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  Clock3,
  Inbox,
  LayoutDashboard,
  Mail,
  Target,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { SubmitButton } from "@/app/admin/_components/form-controls";
import { AdminBrand, getAdminDisplayName } from "@/app/admin/_components/admin-brand";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import { updateContactStatusAction } from "@/app/admin/contact/actions";
import { requireAdminPageSession } from "@/lib/auth/require-admin";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import type { ContactMessageRecord } from "@/lib/contact/contact-service";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";
import type { ContactMessageStatusValue } from "@/lib/contact/validation";

type ContactAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const contactStatuses: ContactMessageStatusValue[] = ["UNREAD", "READ", "ARCHIVED"];

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

function firstParam(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AD";
}

function formatReceivedAt(value: Date): string {
  const elapsed = Date.now() - value.getTime();
  const hours = Math.max(0, Math.floor(elapsed / 3_600_000));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

function statusLabel(status: ContactMessageStatusValue): string {
  return status[0] + status.slice(1).toLowerCase();
}

function StatusMessage({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;

  return (
    <div className={`rounded-[8px] border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role="status">
      {error ?? success}
    </div>
  );
}

function MessageRow({ message }: { message: ContactMessageRecord }) {
  return (
    <details className="group border-t border-[#e4e9ee] first:border-t-0 open:bg-[#f8fbfd]">
      <summary className="flex min-h-[100px] cursor-pointer list-none items-center gap-4 px-5 py-4 transition-colors hover:bg-[#f8fbfd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1f78b4] sm:px-8 [&::-webkit-details-marker]:hidden">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e7eef7] text-sm font-bold text-[#0a294d] sm:size-14 sm:text-base">
          {initials(message.fullName)}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-[16px] ${message.status === "UNREAD" ? "font-bold" : "font-medium text-[#52657c]"}`}>{message.fullName}</span>
          <span className="mt-1 block truncate text-[15px] text-[#294564] sm:text-[16px]">{message.subject}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3 text-right">
          <span className="hidden text-sm text-[#52657c] sm:block">{formatReceivedAt(message.createdAt)}</span>
          {message.status === "UNREAD" ? <span className="size-2.5 rounded-full bg-[#1f78b4]" aria-label="Unread message" /> : null}
          <ChevronDown className="size-4 text-[#718196] transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>

      <div className="grid gap-5 border-t border-[#e4e9ee] px-5 py-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#52657c]">
            <a href={`mailto:${message.email}`} className="inline-flex items-center gap-2 break-all hover:text-[#1f78b4] hover:underline"><Mail className="size-4 shrink-0" aria-hidden="true" />{message.email}</a>
            <span className="inline-flex items-center gap-2"><Clock3 className="size-4" aria-hidden="true" /><time dateTime={message.createdAt.toISOString()}>{message.createdAt.toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}</time></span>
          </div>
          <p className="mt-4 max-w-4xl whitespace-pre-wrap text-[15px] leading-7 text-[#294564]">{message.message}</p>
        </div>

        <form action={updateContactStatusAction.bind(null, message.id)} className="flex items-end gap-2 lg:block">
          <div className="min-w-0 flex-1">
            <label className="mb-2 block text-sm font-semibold" htmlFor={`${message.id}-status`}>Message status</label>
            <select id={`${message.id}-status`} name="status" defaultValue={message.status} className="min-h-11 w-full rounded-[8px] border border-[#ced9e3] bg-white px-3 text-sm text-[#0a294d] outline-none focus:border-[#1f78b4] focus:ring-2 focus:ring-[#1f78b4]/15">
              {contactStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
            </select>
          </div>
          <SubmitButton pendingLabel="Saving..." className="min-h-11 bg-[#1f78b4] px-4 hover:bg-[#155f91] lg:mt-3 lg:w-full">Save</SubmitButton>
        </form>
      </div>
    </details>
  );
}

export default async function ContactAdminPage({ searchParams }: ContactAdminPageProps) {
  const session = await requireAdminPageSession();
  const params = (await searchParams) ?? {};
  const [messages, applications] = await Promise.all([
    prismaContactRepository.listAll(),
    prismaMembershipRepository.listAll(),
  ]);
  const unreadCount = messages.filter((message) => message.status === "UNREAD").length;
  const pendingCount = applications.filter((application) => application.status === "PENDING").length;
  const adminName = getAdminDisplayName(session?.fullName);

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[88px] items-center border-b border-white/10 px-4"><AdminBrand /></div>
        <nav aria-label="Administrator navigation" className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={href === "/admin/contact" ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium transition-colors ${href === "/admin/contact" ? "bg-[#174e73] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="size-5" aria-hidden="true" />{label}{href === "/admin/membership" && pendingCount ? <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">{pendingCount}</span> : null}{href === "/admin/contact" && unreadCount ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span> : null}</Link>)}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block"><div className="mb-3 flex items-center gap-3 px-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">{initials(adminName)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{adminName}</p><p className="truncate text-xs text-white/45">{session?.email}</p></div></div><LogoutButton /></div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-[#dfe5eb] bg-white">
          <div className="mx-auto flex min-h-[88px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 xl:px-8 2xl:px-10">
            <div><h1 className="text-[20px] font-bold">Messages</h1><p className="mt-1 text-[14px] text-[#52657c]">Somali Diplomacy Association CMS</p></div>
            <div className="flex items-center gap-3"><Link href="/contact" className="hidden rounded-md border border-[#d5dee6] px-4 py-2 text-sm font-semibold text-[#52657c] transition-colors hover:border-[#1f78b4] hover:text-[#1f78b4] sm:block">View contact page</Link><span className="flex size-10 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>{initials(adminName)}</span><span className="lg:hidden"><LogoutButton compact /></span></div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1600px] p-5 sm:p-8 xl:p-8 2xl:p-10">
          <StatusMessage error={firstParam(params.error)} success={firstParam(params.success)} />
          <section className={`overflow-hidden rounded-[8px] border border-[#dfe5eb] bg-white ${firstParam(params.error) || firstParam(params.success) ? "mt-5" : ""}`} aria-labelledby="contact-messages-title">
            <div className="flex min-h-[100px] items-center justify-between gap-4 px-5 sm:px-8">
              <div><h2 id="contact-messages-title" className="text-[23px] font-bold">Contact Messages</h2><p className="mt-1 text-sm text-[#718196]">{messages.length} total message{messages.length === 1 ? "" : "s"}</p></div>
              {unreadCount ? <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">{unreadCount} Unread</span> : <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">All read</span>}
            </div>

            {messages.length ? messages.map((message) => <MessageRow key={message.id} message={message} />) : <div className="border-t border-[#e4e9ee] px-5 py-16 text-center sm:px-8"><span className="mx-auto flex size-16 items-center justify-center rounded-[8px] bg-[#f3f6fa]"><Inbox className="size-8 text-[#62758d]" aria-hidden="true" /></span><h3 className="mt-5 text-xl font-bold">No messages yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#52657c]">Messages submitted through the public contact form will appear here.</p></div>}
          </section>
        </div>
      </div>
    </main>
  );
}
