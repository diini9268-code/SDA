import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  Inbox,
  LayoutDashboard,
  Pencil,
  Plus,
  Target,
  UserRound,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";
import { OptimizedFillImage } from "@/app/_components/optimized-image";
import {
  IconDeleteButton,
  SubmitButton,
} from "@/app/admin/_components/form-controls";
import { AdminBrand, getAdminDisplayName } from "@/app/admin/_components/admin-brand";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import {
  createLeadershipAction,
  deleteLeadershipAction,
  updateLeadershipAction,
} from "@/app/admin/leadership/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import type { LeadershipProfile } from "@/lib/leadership/leadership-service";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";

type LeadershipAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

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

function firstParam(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function initials(value: string): string {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AD";
}

function StatusMessage({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;

  return (
    <div className={`rounded-[8px] border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role="status">
      {error ?? success}
    </div>
  );
}

function LeadershipForm({ action, profile, submitLabel }: { action: (formData: FormData) => void; profile?: LeadershipProfile; submitLabel: string }) {
  const fieldClass = "min-h-12 rounded-[8px] border border-[#ced9e3] bg-[#f6f9fc] px-4 text-[15px] text-[#0a294d] outline-none transition focus:border-[#1f78b4] focus:ring-2 focus:ring-[#1f78b4]/15";

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">Full name<input name="fullName" required maxLength={160} defaultValue={profile?.fullName} className={fieldClass} /></label>
        <label className="grid gap-2 text-sm font-semibold">Role<input name="position" required maxLength={160} defaultValue={profile?.position} className={fieldClass} /></label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">Biography<textarea name="biography" required rows={4} maxLength={5000} defaultValue={profile?.biography} className={`${fieldClass} py-3`} /></label>
      <div className="grid gap-5 md:grid-cols-[1fr_9rem]">
        <label className="grid gap-2 text-sm font-semibold">Photo URL<input name="photo" type="url" maxLength={2048} placeholder="https://..." defaultValue={profile?.photo ?? ""} className={fieldClass} /></label>
        <label className="grid gap-2 text-sm font-semibold">Display order<input name="displayOrder" type="number" min={0} defaultValue={profile?.displayOrder ?? 0} className={fieldClass} /></label>
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold"><input name="isActive" type="checkbox" defaultChecked={profile?.isActive ?? true} className="size-4 accent-[#1f78b4]" />Visible on the public leadership page</label>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton className="min-h-11 bg-[#1f78b4] px-6 hover:bg-[#155f91]">{submitLabel}</SubmitButton>
        <Link href="/admin/leadership" className="rounded-md px-4 py-2 text-sm font-semibold text-[#52657c] hover:bg-[#edf3f8]">Cancel</Link>
      </div>
    </form>
  );
}

function ProfileAvatar({ profile }: { profile: LeadershipProfile }) {
  return profile.photo ? (
    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#e7f1f8]"><OptimizedFillImage src={profile.photo} alt="" sizes="48px" className="h-full w-full object-cover" /></span>
  ) : (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e7f1f8] text-sm font-bold text-[#1f78b4]" aria-hidden="true">{initials(profile.fullName)}</span>
  );
}

function RowActions({ profile }: { profile: LeadershipProfile }) {
  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/leadership?edit=${encodeURIComponent(profile.id)}#profile-form`} className="flex size-10 items-center justify-center rounded-md text-[#62758d] transition-colors hover:bg-[#e7f1f8] hover:text-[#1f78b4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f78b4]" aria-label={`Edit ${profile.fullName}`} title="Edit profile"><Pencil className="size-[18px]" aria-hidden="true" /></Link>
      <form action={deleteLeadershipAction.bind(null, profile.id)}><IconDeleteButton confirmation={`Delete ${profile.fullName}?`} subject="leadership profile" /></form>
    </div>
  );
}

export default async function LeadershipAdminPage({ searchParams }: LeadershipAdminPageProps) {
  const session = await requireAdminSession();
  const params = (await searchParams) ?? {};
  const [profiles, applications, messages] = await Promise.all([
    prismaLeadershipRepository.listAll(),
    prismaMembershipRepository.listAll(),
    prismaContactRepository.listAll(),
  ]);
  const pendingCount = applications.filter((item) => item.status === "PENDING").length;
  const unreadCount = messages.filter((item) => item.status === "UNREAD").length;
  const editId = firstParam(params.edit);
  const editingProfile = editId ? profiles.find((profile) => profile.id === editId) : undefined;
  const showForm = firstParam(params.create) === "1" || Boolean(editingProfile);
  const adminName = getAdminDisplayName(session?.fullName);

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[88px] items-center border-b border-white/10 px-4"><AdminBrand /></div>
        <nav aria-label="Administrator navigation" className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={href === "/admin/leadership" ? "page" : undefined} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium transition-colors ${href === "/admin/leadership" ? "bg-[#174e73] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="size-5" aria-hidden="true" />{label}{href === "/admin/membership" && pendingCount ? <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">{pendingCount}</span> : null}{href === "/admin/contact" && unreadCount ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span> : null}</Link>)}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block"><div className="mb-3 flex items-center gap-3 px-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">{initials(adminName)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{adminName}</p><p className="truncate text-xs text-white/45">{session?.email}</p></div></div><LogoutButton /></div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-[#dfe5eb] bg-white"><div className="mx-auto flex min-h-[88px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 xl:px-8 2xl:px-10"><div><h1 className="text-[20px] font-bold">Leadership</h1><p className="mt-1 text-[14px] text-[#52657c]">Somali Diplomacy Association CMS</p></div><div className="flex items-center gap-3"><Link href="/leadership" className="hidden rounded-md border border-[#d5dee6] px-4 py-2 text-sm font-semibold text-[#52657c] transition-colors hover:border-[#1f78b4] hover:text-[#1f78b4] sm:block">View public page</Link><span className="flex size-10 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>{initials(adminName)}</span><span className="lg:hidden"><LogoutButton compact /></span></div></div></header>

        <div className="mx-auto grid w-full max-w-[1600px] gap-6 p-5 sm:p-8 xl:p-8 2xl:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">Leadership profiles</h2><p className="mt-1 text-sm text-[#718196]">{profiles.length} profiles stored in the database</p></div><Link href={showForm ? "/admin/leadership" : "/admin/leadership?create=1#profile-form"} className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-5 font-semibold text-white shadow-sm transition hover:bg-[#155f91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f78b4]">{showForm ? <X className="size-5" /> : <Plus className="size-5" />}{showForm ? "Close form" : "Add leader"}</Link></div>
          <StatusMessage error={firstParam(params.error) ?? (editId && !editingProfile ? "Leadership profile not found." : null)} success={firstParam(params.success)} />

          {showForm ? <section id="profile-form" className="scroll-mt-6 rounded-[8px] border border-[#dfe5eb] bg-white p-5 shadow-sm sm:p-7" aria-labelledby="profile-form-title"><h2 id="profile-form-title" className="text-xl font-bold">{editingProfile ? `Edit ${editingProfile.fullName}` : "Add leadership profile"}</h2><p className="mt-1 text-sm text-[#718196]">All fields below map directly to the existing leadership record.</p><div className="mt-6"><LeadershipForm action={editingProfile ? updateLeadershipAction.bind(null, editingProfile.id) : createLeadershipAction} profile={editingProfile} submitLabel={editingProfile ? "Save changes" : "Create profile"} /></div></section> : null}

          <section className="overflow-hidden rounded-[8px] border border-[#dfe5eb] bg-white" aria-labelledby="profiles-table-title">
            <h2 id="profiles-table-title" className="sr-only">Stored leadership profiles</h2>
            {profiles.length === 0 ? <div className="p-10 text-center"><UsersRound className="mx-auto size-9 text-[#9aabba]" /><p className="mt-3 font-semibold">No leadership profiles yet</p><p className="mt-1 text-sm text-[#718196]">Use Add leader to create the first profile.</p></div> : <>
              <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-[#f7f9fb] text-xs uppercase text-[#5b6d84]"><tr><th className="px-7 py-5 font-bold">Member</th><th className="px-6 py-5 font-bold">Role</th><th className="px-6 py-5 font-bold">Visibility / order</th><th className="px-6 py-5 font-bold">Actions</th></tr></thead><tbody className="divide-y divide-[#e7ebef]">{profiles.map((profile) => <tr key={profile.id} className="transition-colors hover:bg-[#f8fbfd]"><td className="px-7 py-5"><div className="flex items-center gap-4"><ProfileAvatar profile={profile} /><span className="font-semibold">{profile.fullName}</span></div></td><td className="px-6 py-5 text-[#52657c]">{profile.position}</td><td className="px-6 py-5"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${profile.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{profile.isActive ? "Active" : "Hidden"}</span><span className="ml-3 text-sm text-[#718196]">Order {profile.displayOrder}</span></td><td className="px-6 py-5"><RowActions profile={profile} /></td></tr>)}</tbody></table></div>
              <div className="divide-y divide-[#e7ebef] md:hidden">{profiles.map((profile) => <article key={profile.id} className="p-5"><div className="flex items-start gap-3"><ProfileAvatar profile={profile} /><div className="min-w-0 flex-1"><h3 className="font-semibold">{profile.fullName}</h3><p className="mt-1 text-sm text-[#52657c]">{profile.position}</p></div><RowActions profile={profile} /></div><div className="mt-4 flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${profile.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{profile.isActive ? "Active" : "Hidden"}</span><span className="text-xs text-[#718196]">Display order {profile.displayOrder}</span></div></article>)}</div>
            </>}
          </section>
        </div>
      </div>
    </main>
  );
}
