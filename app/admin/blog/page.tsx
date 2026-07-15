import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BookOpenText,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  FileImage,
  Globe2,
  Inbox,
  LayoutDashboard,
  Pencil,
  Plus,
  Target,
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
  createBlogAction,
  deleteBlogAction,
  updateBlogAction,
} from "@/app/admin/blog/actions";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import type { BlogRecord } from "@/lib/blog/blog-service";
import type { BlogStatusValue } from "@/lib/blog/validation";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";

type BlogAdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const blogStatuses: BlogStatusValue[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin", label: "Dashboard Home", icon: LayoutDashboard },
  { href: "/admin/leadership", label: "Leadership", icon: UsersRound },
  { href: "/admin/programs", label: "Programs", icon: Target },
  { href: "/admin/blog", label: "Blog", icon: BookOpenText },
  { href: "/admin/membership", label: "Applications", icon: UserRoundCheck },
  { href: "/admin/contact", label: "Messages", icon: Inbox },
  { href: "/admin/archive", label: "Archive", icon: Archive },
  { href: "/admin/reports", label: "Reports", icon: ChartNoAxesColumnIncreasing },
];

const statusClasses: Record<BlogStatusValue, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  ARCHIVED: "bg-violet-100 text-violet-700",
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

function statusLabel(status: BlogStatusValue): string {
  return status[0] + status.slice(1).toLowerCase();
}

function mediaToText(blog?: BlogRecord): string {
  if (!blog) return "";
  return blog.media.map((media) => [media.url, media.altText ?? "", media.mimeType, media.sizeBytes?.toString() ?? ""].join(" | ")).join("\n");
}

function StatusMessage({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  return <div className={`rounded-[8px] border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role="status">{error ?? success}</div>;
}

function BlogForm({ action, blog, submitLabel }: { action: (formData: FormData) => void; blog?: BlogRecord; submitLabel: string }) {
  const fieldClass = "min-h-12 rounded-[8px] border border-[#ced9e3] bg-[#f6f9fc] px-4 text-[15px] text-[#0a294d] outline-none transition focus:border-[#1f78b4] focus:ring-2 focus:ring-[#1f78b4]/15";

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)]"><label className="grid gap-2 text-sm font-semibold">Post title<input name="title" required maxLength={220} defaultValue={blog?.title} className={fieldClass} /></label><label className="grid gap-2 text-sm font-semibold">Category<input name="category" required maxLength={120} defaultValue={blog?.category} className={fieldClass} /></label></div>
      <label className="grid gap-2 text-sm font-semibold">Excerpt<textarea name="excerpt" rows={2} maxLength={500} defaultValue={blog?.excerpt ?? ""} className={`${fieldClass} py-3`} /><span className="text-xs font-normal text-[#718196]">Optional summary, up to 500 characters.</span></label>
      <label className="grid gap-2 text-sm font-semibold">Content<textarea name="content" required rows={9} maxLength={20000} defaultValue={blog?.content} className={`${fieldClass} py-3`} /></label>
      <div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-semibold">Publication date<input name="publishedAt" type="datetime-local" required defaultValue={formatDateTimeInput(blog?.publishedAt)} className={fieldClass} /></label><label className="grid gap-2 text-sm font-semibold">Status<select name="status" defaultValue={blog?.status ?? "DRAFT"} className={fieldClass}>{blogStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></label></div>
      <label className="grid gap-2 text-sm font-semibold">Media records<textarea name="media" rows={4} defaultValue={mediaToText(blog)} placeholder="https://example.com/image.jpg | Alt text | image/jpeg | 240000" className={`${fieldClass} py-3 font-mono text-sm`} /><span className="text-xs font-normal leading-5 text-[#718196]">One record per line: URL | alt text | MIME type | size in bytes. Existing validation permits JPEG, PNG, WebP, GIF and PDF files up to 10 MB, with no more than 10 records.</span></label>
      <div className="flex flex-wrap items-center gap-3"><SubmitButton className="min-h-11 bg-[#1f78b4] px-6 hover:bg-[#155f91]">{submitLabel}</SubmitButton><Link href="/admin/blog" className="rounded-md px-4 py-2 text-sm font-semibold text-[#52657c] hover:bg-[#edf3f8]">Cancel</Link></div>
    </form>
  );
}

function BlogActions({ post }: { post: BlogRecord }) {
  return <div className="flex items-center gap-1"><Link href={`/admin/blog?edit=${encodeURIComponent(post.id)}#blog-form`} className="flex size-10 items-center justify-center rounded-md text-[#62758d] transition-colors hover:bg-[#e7f1f8] hover:text-[#1f78b4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f78b4]" aria-label={`Edit ${post.title}`} title="Edit blog post"><Pencil className="size-[18px]" aria-hidden="true" /></Link><form action={deleteBlogAction.bind(null, post.id)}><IconDeleteButton confirmation={`Delete ${post.title}?`} subject="blog post" /></form></div>;
}

export default async function BlogAdminPage({ searchParams }: BlogAdminPageProps) {
  const session = await requireAdminSession();
  const params = (await searchParams) ?? {};
  const [posts, applications, messages] = await Promise.all([
    prismaBlogRepository.listAll(),
    prismaMembershipRepository.listAll(),
    prismaContactRepository.listAll(),
  ]);
  const pendingCount = applications.filter((item) => item.status === "PENDING").length;
  const unreadCount = messages.filter((item) => item.status === "UNREAD").length;
  const editId = firstParam(params.edit);
  const editingPost = editId ? posts.find((post) => post.id === editId) : undefined;
  const showForm = firstParam(params.create) === "1" || Boolean(editingPost);
  const adminName = session?.fullName ?? "Administrator";

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[104px] items-center gap-3 border-b border-white/10 px-6"><span className="flex size-12 shrink-0 flex-col items-center justify-center"><Globe2 className="size-7 text-[#27b3f4]" /><span className="text-[7px] font-bold tracking-[0.22em]">SSDU</span></span><div><p className="text-lg font-bold">SSDU Admin</p><p className="text-sm text-[#27b3f4]">Administrator</p></div></div>
        <nav aria-label="Administrator navigation" className="flex gap-1 overflow-x-auto px-4 py-4 lg:flex-1 lg:flex-col lg:overflow-y-auto">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={href === "/admin/blog" ? "page" : undefined} className={`flex min-h-12 shrink-0 items-center gap-3 rounded-[8px] px-4 text-[15px] font-medium transition-colors ${href === "/admin/blog" ? "bg-[#174e73] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="size-5" aria-hidden="true" />{label}{href === "/admin/membership" && pendingCount ? <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">{pendingCount}</span> : null}{href === "/admin/contact" && unreadCount ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span> : null}</Link>)}</nav>
        <div className="hidden border-t border-white/10 p-4 lg:block"><div className="mb-3 flex items-center gap-3 px-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">{initials(adminName)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{adminName}</p><p className="truncate text-xs text-white/45">{session?.email}</p></div></div><LogoutButton /></div>
      </aside>

      <div className="min-w-0">
        <header className="flex min-h-[104px] items-center justify-between border-b border-[#dfe5eb] bg-white px-5 sm:px-8"><div><h1 className="text-[22px] font-bold">Blog</h1><p className="mt-1 text-[15px] text-[#52657c]">Somali Student Diplomacy Union CMS</p></div><div className="flex items-center gap-3"><Link href="/blog" className="hidden rounded-md border border-[#d5dee6] px-4 py-2 text-sm font-semibold text-[#52657c] transition-colors hover:border-[#1f78b4] hover:text-[#1f78b4] sm:block">View public page</Link><span className="flex size-11 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>{initials(adminName)}</span><span className="lg:hidden"><LogoutButton compact /></span></div></header>

        <div className="grid gap-6 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">Blog posts</h2><p className="mt-1 text-sm text-[#718196]">{posts.length} posts stored in the database</p></div><Link href={showForm ? "/admin/blog" : "/admin/blog?create=1#blog-form"} className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-5 font-semibold text-white shadow-sm transition hover:bg-[#155f91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f78b4]">{showForm ? <X className="size-5" /> : <Plus className="size-5" />}{showForm ? "Close form" : "Add new"}</Link></div>
          <StatusMessage error={firstParam(params.error) ?? (editId && !editingPost ? "Blog post not found." : null)} success={firstParam(params.success)} />

          {showForm ? <section id="blog-form" className="scroll-mt-6 rounded-[8px] border border-[#dfe5eb] bg-white p-5 shadow-sm sm:p-7" aria-labelledby="blog-form-title"><h2 id="blog-form-title" className="text-xl font-bold">{editingPost ? `Edit ${editingPost.title}` : "Add blog post"}</h2><p className="mt-1 text-sm text-[#718196]">The slug and media ordering are handled by the existing backend.</p><div className="mt-6"><BlogForm action={editingPost ? updateBlogAction.bind(null, editingPost.id) : createBlogAction} blog={editingPost} submitLabel={editingPost ? "Save changes" : "Create blog post"} /></div></section> : null}

          <section className="overflow-hidden rounded-[8px] border border-[#dfe5eb] bg-white" aria-labelledby="posts-table-title">
            <h2 id="posts-table-title" className="sr-only">Stored blog posts</h2>
            {posts.length === 0 ? <div className="p-12 text-center sm:p-16"><span className="mx-auto flex size-20 items-center justify-center rounded-[8px] bg-[#f3f6fa]"><BookOpenText className="size-10 text-[#62758d]" /></span><h3 className="mt-6 text-2xl font-bold">No blog posts yet</h3><p className="mx-auto mt-3 max-w-md text-[#52657c]">Published and draft content will appear here after an administrator creates the first database record.</p><Link href="/admin/blog?create=1#blog-form" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-5 font-semibold text-white hover:bg-[#155f91]"><Plus className="size-5" />Add first post</Link></div> : <>
              <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[900px] border-collapse text-left"><thead className="bg-[#f7f9fb] text-xs uppercase text-[#5b6d84]"><tr><th className="px-7 py-5 font-bold">Post</th><th className="px-6 py-5 font-bold">Publication</th><th className="px-6 py-5 font-bold">Status</th><th className="px-6 py-5 font-bold">Actions</th></tr></thead><tbody className="divide-y divide-[#e7ebef]">{posts.map((post) => <tr key={post.id} className="transition-colors hover:bg-[#f8fbfd]"><td className="px-7 py-5"><p className="font-semibold">{post.title}</p><p className="mt-1 max-w-md truncate text-sm text-[#718196]">{post.excerpt || post.content}</p><div className="mt-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#e7f1f8] px-2.5 py-1 text-xs font-semibold text-[#1f78b4]">{post.category}</span><span className="flex items-center gap-1 text-xs text-[#9aabba]"><FileImage className="size-3.5" />{post.media.length} media</span></div></td><td className="px-6 py-5"><p className="flex items-center gap-2 text-sm text-[#52657c]"><CalendarDays className="size-4" />{formatDate(post.publishedAt)}</p><p className="mt-2 text-xs text-[#9aabba]">/blog/{post.slug}</p></td><td className="px-6 py-5"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[post.status]}`}>{statusLabel(post.status)}</span></td><td className="px-6 py-5"><BlogActions post={post} /></td></tr>)}</tbody></table></div>
              <div className="divide-y divide-[#e7ebef] md:hidden">{posts.map((post) => <article key={post.id} className="p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-semibold">{post.title}</h3><p className="mt-1 line-clamp-2 text-sm text-[#718196]">{post.excerpt || post.content}</p></div><BlogActions post={post} /></div><div className="mt-4 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#e7f1f8] px-2.5 py-1 text-xs font-semibold text-[#1f78b4]">{post.category}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[post.status]}`}>{statusLabel(post.status)}</span><span className="flex items-center gap-1 text-xs text-[#718196]"><FileImage className="size-3.5" />{post.media.length}</span></div><p className="mt-4 flex items-center gap-2 text-sm text-[#52657c]"><CalendarDays className="size-4" />{formatDate(post.publishedAt)}</p></article>)}</div>
            </>}
          </section>
        </div>
      </div>
    </main>
  );
}
