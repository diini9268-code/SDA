import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  FileImage,
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
import {
  IconDeleteButton,
} from "@/app/admin/_components/form-controls";
import { AdminBrand, getAdminDisplayName } from "@/app/admin/_components/admin-brand";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import {
  deleteBlogAction,
} from "@/app/admin/blog/actions";
import {
  BlogForm,
  type BlogFormInitialData,
} from "@/app/admin/blog/blog-form";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import type { BlogRecord } from "@/lib/blog/blog-service";
import { formatPublicationDateInput, type BlogStatusValue } from "@/lib/blog/validation";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";

type BlogAdminPageProps = {
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

function statusLabel(status: BlogStatusValue): string {
  return status[0] + status.slice(1).toLowerCase();
}

function StatusMessage({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  return <div className={`rounded-[8px] border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role="status">{error ?? success}</div>;
}

function toBlogFormInitialData(blog: BlogRecord): BlogFormInitialData {
  return {
    id: blog.id,
    title: blog.title,
    category: blog.category,
    excerpt: blog.excerpt ?? "",
    content: blog.content,
    publishedAt: formatPublicationDateInput(blog.publishedAt),
    status: blog.status,
    media: blog.media.map((media) => ({
      id: media.id,
      url: media.url,
      altText: media.altText ?? "",
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
    })),
  };
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
  const adminName = getAdminDisplayName(session?.fullName);

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[104px] items-center border-b border-white/10 px-5"><AdminBrand /></div>
        <nav aria-label="Administrator navigation" className="flex gap-1 overflow-x-auto px-4 py-4 lg:flex-1 lg:flex-col lg:overflow-y-auto">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={href === "/admin/blog" ? "page" : undefined} className={`flex min-h-12 shrink-0 items-center gap-3 rounded-[8px] px-4 text-[15px] font-medium transition-colors ${href === "/admin/blog" ? "bg-[#174e73] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon className="size-5" aria-hidden="true" />{label}{href === "/admin/membership" && pendingCount ? <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">{pendingCount}</span> : null}{href === "/admin/contact" && unreadCount ? <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span> : null}</Link>)}</nav>
        <div className="hidden border-t border-white/10 p-4 lg:block"><div className="mb-3 flex items-center gap-3 px-3"><span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">{initials(adminName)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{adminName}</p><p className="truncate text-xs text-white/45">{session?.email}</p></div></div><LogoutButton /></div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-[#dfe5eb] bg-white"><div className="mx-auto flex min-h-[104px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 xl:px-10 2xl:px-12"><div><h1 className="text-[22px] font-bold">Blog</h1><p className="mt-1 text-[15px] text-[#52657c]">Somali Diplomacy Association CMS</p></div><div className="flex items-center gap-3"><Link href="/blog" className="hidden rounded-md border border-[#d5dee6] px-4 py-2 text-sm font-semibold text-[#52657c] transition-colors hover:border-[#1f78b4] hover:text-[#1f78b4] sm:block">View public page</Link><span className="flex size-11 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white" aria-label={`Signed in as ${adminName}`}>{initials(adminName)}</span><span className="lg:hidden"><LogoutButton compact /></span></div></div></header>

        <div className="mx-auto grid w-full max-w-[1600px] gap-7 p-5 sm:p-8 xl:p-10 2xl:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">Blog posts</h2><p className="mt-1 text-sm text-[#718196]">{posts.length} posts stored in the database</p></div><Link href={showForm ? "/admin/blog" : "/admin/blog?create=1#blog-form"} className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-5 font-semibold text-white shadow-sm transition hover:bg-[#155f91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f78b4]">{showForm ? <X className="size-5" /> : <Plus className="size-5" />}{showForm ? "Close form" : "Add new"}</Link></div>
          <StatusMessage error={firstParam(params.error) ?? (editId && !editingPost ? "Blog post not found." : null)} success={firstParam(params.success)} />

          {showForm ? <section id="blog-form" className="scroll-mt-6 rounded-[8px] border border-[#dfe5eb] bg-white p-5 shadow-sm sm:p-7" aria-labelledby="blog-form-title"><h2 id="blog-form-title" className="text-xl font-bold">{editingPost ? `Edit ${editingPost.title}` : "Add blog post"}</h2><p className="mt-1 text-sm text-[#718196]">Upload media directly from your computer. The existing backend handles the slug, ordering, and blog relationship.</p><div className="mt-6"><BlogForm initialData={editingPost ? toBlogFormInitialData(editingPost) : undefined} /></div></section> : null}

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
