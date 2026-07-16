import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BookOpenText,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Globe2,
  Inbox,
  LayoutDashboard,
  MapPin,
  Pencil,
  Plus,
  Target,
  UserRound,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";
import {
  IconDeleteButton,
  SubmitButton,
} from "@/app/admin/_components/form-controls";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import {
  createProgramAction,
  deleteProgramAction,
  updateProgramAction,
} from "@/app/admin/programs/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import type { ProgramRecord } from "@/lib/programs/program-service";
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

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin", label: "Dashboard Home", icon: LayoutDashboard },
  { href: "/admin/leadership", label: "Leadership", icon: UsersRound },
  { href: "/admin/programs", label: "Programs", icon: Target },
  { href: "/admin/blog", label: "Blog", icon: BookOpenText },
  { href: "/admin/membership", label: "Applications", icon: UserRoundCheck },
  { href: "/admin/contact", label: "Messages", icon: Inbox },
  { href: "/admin/users", label: "Users", icon: UserRound },
  { href: "/admin/archive", label: "Archive", icon: Archive },
  { href: "/admin/reports", label: "Reports", icon: ChartNoAxesColumnIncreasing },
];

const statusClasses: Record<ProgramStatusValue, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SCHEDULED: "bg-sky-100 text-sky-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  ARCHIVED: "bg-violet-100 text-violet-700",
  CANCELLED: "bg-red-100 text-red-700",
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

function formatDateTimeInput(value?: Date): string {
  if (!value) return "";
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

function statusLabel(status: ProgramStatusValue): string {
  return status[0] + status.slice(1).toLowerCase();
}

function StatusMessage({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  return <div className={`rounded-[8px] border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role="status">{error ?? success}</div>;
}

function ProgramForm({ action, program, submitLabel }: { action: (formData: FormData) => void; program?: ProgramRecord; submitLabel: string }) {
  const fieldClass = "min-h-12 rounded-[8px] border border-[#ced9e3] bg-[#f6f9fc] px-4 text-[15px] text-[#0a294d] outline-none transition focus:border-[#1f78b4] focus:ring-2 focus:ring-[#1f78b4]/15";

  return (
    <form action={action} className="grid gap-5">
      <label className="grid gap-2 text-sm font-semibold">Program title<input name="title" required maxLength={220} defaultValue={program?.title} className={fieldClass} /></label>
      <label className="grid gap-2 text-sm font-semibold">Description<textarea name="description" required rows={4} maxLength={5000} defaultValue={program?.description} className={`${fieldClass} py-3`} /></label>
      <div className="grid gap-5 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold">Event date and time<input name="eventDate" type="datetime-local" required defaultValue={formatDateTimeInput(program?.eventDate)} className={fieldClass} /></label>
        <label className="grid gap-2 text-sm font-semibold">Location<input name="location" required maxLength={220} defaultValue={program?.location} className={fieldClass} /></label>
        <label className="grid gap-2 text-sm font-semibold">Status<select name="status" defaultValue={program?.status ?? "DRAFT"} className={fieldClass}>{programStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></label>
      </div>
      <div className="flex flex-wrap items-center gap-3"><SubmitButton className="min-h-11 bg-[#1f78b4] px-6 hover:bg-[#155f91]">{submitLabel}</SubmitButton><Link href="/admin/programs" className="rounded-md px-4 py-2 text-sm font-semibold text-[#52657c] hover:bg-[#edf3f8]">Cancel</Link></div>
    </form>
  );
}

function ProgramActions({ program }: { program: ProgramRecord }) {
  return <div className="flex items-center gap-1"><Link href={`/admin/programs?edit=${encodeURIComponent(program.id)}#program-form`} className="flex size-10 items-center justify-center rounded-md text-[#62758d] transition-colors hover:bg-[#e7f1f8] hover:text-[#1f78b4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f78b4]" aria-label={`Edit ${program.title}`} title="Edit program"><Pencil className="size-[18px]" aria-hidden="true" /></Link><form action={deleteProgramAction.bind(null, program.id)}><IconDeleteButton confirmation={`Delete ${program.title}?`} subject="program" /></form></div>;
}

export default async function ProgramsAdminPage({ searchParams }: ProgramsAdminPageProps) {
  const session = await requireAdminSession();
  const params = (await searchParams) ?? {};
  const [programs, applications, messages] = await Promise.all([
    prismaProgramRepository.listAll(),
    prismaMembershipRepository.listAll(),
    prismaContactRepository.listAll(),
  ]);
  const pendingCount = applications.filter((item) => item.status === "PENDING").length;
  const unreadCount = messages.filter((item) => item.status === "UNREAD").length;
  const editId = firstParam(params.edit);
  const editingProgram = editId ? programs.find((program) => program.id === editId) : undefined;
  const showForm = firstParam(params.create) === "1" || Boolean(editingProgram);
  const adminName = session?.fullName ?? "Administrator";

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[104px] items-center gap-3 border-b border-white/10 px-6"><span className="flex size-12 shrink-0 flex-col items-center justify-center"><Globe2 className="size-7 text-[#27b3f4]" /><span className="text-[7px] font-bold tracking-[0.22em]">SSDU</span></span><div><p className="text-lg font-bold">SSDU Admin</p><p className="text-sm text-[#27b3f4]">Administrator</p></div></div>
        <nav aria-label="Administrator navigation" className="flex gap-1 overflow-x-auto px-4 py-4 lg:flex-1 lg:flex-col lg:overflow-y-auto">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={href === "/admin/programs" ? "page" : undefined} className={`flex min-h-12 shrink-0 items-center gap-3 rounded-[8px] px-4 text-[15px] font-medium transition-colors ${href === "/admin/programs" ? "bg-[#174e73] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="size-5" aria-hidden="true" />{label}{href === "/admin/membership" && pendingCount ? <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">{pendingCount}</span> : null}{href === "/admin/contact" && unreadCount ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span> : null}</Link>)}</nav>
        <div className="hidden border-t border-white/10 p-4 lg:block"><div className="mb-3 flex items-center gap-3 px-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">{initials(adminName)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{adminName}</p><p className="truncate text-xs text-white/45">{session?.email}</p></div></div><LogoutButton /></div>
      </aside>

      <div className="min-w-0">
        <header className="flex min-h-[104px] items-center justify-between border-b border-[#dfe5eb] bg-white px-5 sm:px-8"><div><h1 className="text-[22px] font-bold">Programs</h1><p className="mt-1 text-[15px] text-[#52657c]">Somali Student Diplomacy Union CMS</p></div><div className="flex items-center gap-3"><Link href="/programs" className="hidden rounded-md border border-[#d5dee6] px-4 py-2 text-sm font-semibold text-[#52657c] transition-colors hover:border-[#1f78b4] hover:text-[#1f78b4] sm:block">View public page</Link><span className="flex size-11 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>{initials(adminName)}</span><span className="lg:hidden"><LogoutButton compact /></span></div></header>

        <div className="grid gap-6 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">Program records</h2><p className="mt-1 text-sm text-[#718196]">{programs.length} programs stored in the database</p></div><Link href={showForm ? "/admin/programs" : "/admin/programs?create=1#program-form"} className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-5 font-semibold text-white shadow-sm transition hover:bg-[#155f91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f78b4]">{showForm ? <X className="size-5" /> : <Plus className="size-5" />}{showForm ? "Close form" : "Add new"}</Link></div>
          <StatusMessage error={firstParam(params.error) ?? (editId && !editingProgram ? "Program not found." : null)} success={firstParam(params.success)} />

          {showForm ? <section id="program-form" className="scroll-mt-6 rounded-[8px] border border-[#dfe5eb] bg-white p-5 shadow-sm sm:p-7" aria-labelledby="program-form-title"><h2 id="program-form-title" className="text-xl font-bold">{editingProgram ? `Edit ${editingProgram.title}` : "Add program"}</h2><p className="mt-1 text-sm text-[#718196]">The slug is generated automatically from the title by the existing backend.</p><div className="mt-6"><ProgramForm action={editingProgram ? updateProgramAction.bind(null, editingProgram.id) : createProgramAction} program={editingProgram} submitLabel={editingProgram ? "Save changes" : "Create program"} /></div></section> : null}

          <section className="overflow-hidden rounded-[8px] border border-[#dfe5eb] bg-white" aria-labelledby="programs-table-title">
            <h2 id="programs-table-title" className="sr-only">Stored programs</h2>
            {programs.length === 0 ? <div className="p-12 text-center sm:p-16"><span className="mx-auto flex size-20 items-center justify-center rounded-[8px] bg-[#f3f6fa]"><Target className="size-10 text-[#62758d]" /></span><h3 className="mt-6 text-2xl font-bold">No programs yet</h3><p className="mx-auto mt-3 max-w-md text-[#52657c]">Program content will appear here after an administrator creates the first database record.</p><Link href="/admin/programs?create=1#program-form" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-5 font-semibold text-white hover:bg-[#155f91]"><Plus className="size-5" />Add first program</Link></div> : <>
              <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[900px] border-collapse text-left"><thead className="bg-[#f7f9fb] text-xs uppercase text-[#5b6d84]"><tr><th className="px-7 py-5 font-bold">Program</th><th className="px-6 py-5 font-bold">Schedule</th><th className="px-6 py-5 font-bold">Status</th><th className="px-6 py-5 font-bold">Actions</th></tr></thead><tbody className="divide-y divide-[#e7ebef]">{programs.map((program) => <tr key={program.id} className="transition-colors hover:bg-[#f8fbfd]"><td className="px-7 py-5"><p className="font-semibold">{program.title}</p><p className="mt-1 max-w-md truncate text-sm text-[#718196]">{program.description}</p><p className="mt-1 text-xs text-[#9aabba]">/programs/{program.slug}</p></td><td className="px-6 py-5"><p className="flex items-center gap-2 text-sm text-[#52657c]"><CalendarDays className="size-4" />{formatDate(program.eventDate)}</p><p className="mt-2 flex items-center gap-2 text-sm text-[#52657c]"><MapPin className="size-4" />{program.location}</p></td><td className="px-6 py-5"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[program.status]}`}>{statusLabel(program.status)}</span></td><td className="px-6 py-5"><ProgramActions program={program} /></td></tr>)}</tbody></table></div>
              <div className="divide-y divide-[#e7ebef] md:hidden">{programs.map((program) => <article key={program.id} className="p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-semibold">{program.title}</h3><p className="mt-1 line-clamp-2 text-sm text-[#718196]">{program.description}</p></div><ProgramActions program={program} /></div><div className="mt-4 grid gap-2 text-sm text-[#52657c]"><p className="flex items-center gap-2"><CalendarDays className="size-4" />{formatDate(program.eventDate)}</p><p className="flex items-center gap-2"><MapPin className="size-4" />{program.location}</p></div><span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[program.status]}`}>{statusLabel(program.status)}</span></article>)}</div>
            </>}
          </section>
        </div>
      </div>
    </main>
  );
}
