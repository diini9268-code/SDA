import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Target,
  Trash2,
  UserRound,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";
import { AdminBrand, getAdminDisplayName } from "@/app/admin/_components/admin-brand";
import {
  IconDeleteButton,
  SubmitButton,
} from "@/app/admin/_components/form-controls";
import { LogoutButton } from "@/app/admin/_components/logout-button";
import {
  createAdminUserAction,
  deleteAdminUserAction,
  resetAdminUserPasswordAction,
  updateAdminUserAction,
} from "@/app/admin/users/actions";
import { requireAdminPageSession } from "@/lib/auth/require-admin";
import {
  type AdminUserSort,
  type AdminUserSummary,
  prismaAdminUserDirectoryRepository,
} from "@/lib/auth/user-repository";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";

type AdminUsersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

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

const fieldClass =
  "min-h-12 rounded-[8px] border border-[#ced9e3] bg-[#f6f9fc] px-4 text-[15px] text-[#0a294d] outline-none transition focus:border-[#1f78b4] focus:ring-2 focus:ring-[#1f78b4]/15";

function firstParam(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function positiveInteger(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function initials(value: string): string {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD"
  );
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value);
}

function roleLabel(role: AdminUserSummary["role"]): string {
  return role === "ADMIN" ? "Administrator" : "Blogger";
}

function StatusMessage({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (!error && !success) return null;
  return (
    <div
      className={`rounded-[8px] border px-4 py-3 text-sm ${
        error
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
      role="status"
    >
      {error ?? success}
    </div>
  );
}

function UserAvatar({ user }: { user: AdminUserSummary }) {
  const displayName = getAdminDisplayName(user.fullName);
  return (
    <span
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e7eef7] text-sm font-bold text-[#1f78b4]"
      aria-hidden="true"
    >
      {initials(displayName)}
    </span>
  );
}

function IdentityFields({ user }: { user?: AdminUserSummary }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold">
        Full Name
        <input
          name="fullName"
          required
          minLength={2}
          maxLength={160}
          autoComplete="name"
          defaultValue={user ? getAdminDisplayName(user.fullName) : ""}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Email Address
        <input
          name="email"
          type="email"
          required
          maxLength={255}
          autoComplete="email"
          defaultValue={user?.email ?? ""}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Role
        <select
          name="role"
          defaultValue={user?.role ?? "BLOGGER"}
          className={fieldClass}
        >
          <option value="BLOGGER">Blogger</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </label>
    </div>
  );
}

function PasswordFields() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className={fieldClass}
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Confirm Password
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className={fieldClass}
        />
      </label>
      <p className="text-sm text-[#718196] md:col-span-2">
        Passwords must contain at least 12 characters, matching the existing
        administrator provisioning policy.
      </p>
    </div>
  );
}

function UserForm({
  mode,
  user,
}: {
  mode: "create" | "edit" | "reset";
  user?: AdminUserSummary;
}) {
  const isCreate = mode === "create";
  const isReset = mode === "reset";
  const action = isCreate
    ? createAdminUserAction
    : isReset && user
      ? resetAdminUserPasswordAction.bind(null, user.id)
      : user
        ? updateAdminUserAction.bind(null, user.id)
        : createAdminUserAction;

  return (
    <form action={action} className="grid gap-6">
      {!isReset ? <IdentityFields user={user} /> : null}
      {isCreate || isReset ? <PasswordFields /> : null}
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton
          pendingLabel={isReset ? "Resetting..." : "Saving..."}
          className="min-h-11 bg-[#1f78b4] px-6 hover:bg-[#155f91]"
        >
          {isCreate
            ? "Create User"
            : isReset
              ? "Reset Password"
              : "Save Changes"}
        </SubmitButton>
        <Link
          href="/admin/users"
          className="rounded-md px-4 py-2 text-sm font-semibold text-[#52657c] hover:bg-[#edf3f8]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function RowActions({
  user,
  currentAdminId,
  adminCount,
}: {
  user: AdminUserSummary;
  currentAdminId: string;
  adminCount: number;
}) {
  const displayName = getAdminDisplayName(user.fullName);
  const deletionDisabled =
    user.id === currentAdminId ||
    (user.role === "ADMIN" && adminCount <= 1);

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/users?view=${encodeURIComponent(user.id)}#user-panel`}
        className="flex size-10 items-center justify-center rounded-md text-[#62758d] transition-colors hover:bg-[#e7f1f8] hover:text-[#1f78b4]"
        aria-label={`View ${displayName}`}
        title="View user"
      >
        <Eye className="size-[18px]" aria-hidden="true" />
      </Link>
      <Link
        href={`/admin/users?edit=${encodeURIComponent(user.id)}#user-panel`}
        className="flex size-10 items-center justify-center rounded-md text-[#62758d] transition-colors hover:bg-[#e7f1f8] hover:text-[#1f78b4]"
        aria-label={`Edit ${displayName}`}
        title="Edit user"
      >
        <Pencil className="size-[18px]" aria-hidden="true" />
      </Link>
      <Link
        href={`/admin/users?reset=${encodeURIComponent(user.id)}#user-panel`}
        className="flex size-10 items-center justify-center rounded-md text-[#62758d] transition-colors hover:bg-[#e7f1f8] hover:text-[#1f78b4]"
        aria-label={`Reset password for ${displayName}`}
        title="Reset password"
      >
        <KeyRound className="size-[18px]" aria-hidden="true" />
      </Link>
      {deletionDisabled ? (
        <span
          className="flex size-10 items-center justify-center rounded-md text-[#a7b2bf]"
          title={
            user.id === currentAdminId
              ? "You cannot delete the account you are using"
              : "The last administrator cannot be deleted"
          }
          aria-label="Delete unavailable"
        >
          <Trash2 className="size-[18px]" aria-hidden="true" />
        </span>
      ) : (
        <form action={deleteAdminUserAction.bind(null, user.id)}>
          <IconDeleteButton
            confirmation={`Delete ${displayName}? This action cannot be undone.`}
            subject="user account"
          />
        </form>
      )}
    </div>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session = await requireAdminPageSession();
  const params = (await searchParams) ?? {};
  const query = firstParam(params.q)?.trim() ?? "";
  const sort: AdminUserSort =
    firstParam(params.sort) === "newest" ? "newest" : "name";
  const page = positiveInteger(firstParam(params.page), 1);
  const pageSize = positiveInteger(firstParam(params.pageSize), 10);
  const selectedId =
    firstParam(params.view) ??
    firstParam(params.edit) ??
    firstParam(params.reset);

  const [directory, applications, messages] = await Promise.all([
    prismaAdminUserDirectoryRepository.listAdmins({
      search: query,
      sort,
      page,
      pageSize,
    }),
    prismaMembershipRepository.listAll(),
    prismaContactRepository.listAll(),
  ]);
  const selectedUser = selectedId
    ? await prismaAdminUserDirectoryRepository.findAdminById(selectedId)
    : null;
  const pendingCount = applications.filter(
    (application) => application.status === "PENDING",
  ).length;
  const unreadCount = messages.filter(
    (message) => message.status === "UNREAD",
  ).length;
  const adminCount = directory.adminTotal;
  const adminName = getAdminDisplayName(session?.fullName);
  const mode = firstParam(params.create) === "1"
    ? "create"
    : firstParam(params.edit)
      ? "edit"
      : firstParam(params.reset)
        ? "reset"
        : firstParam(params.view)
          ? "view"
          : null;
  const hasMissingSelection = Boolean(selectedId && !selectedUser);

  const queryFor = (
    overrides: Record<string, string | number | null>,
  ): string => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    next.set("sort", sort);
    next.set("pageSize", String(directory.pageSize));
    next.set("page", String(directory.page));
    for (const [key, value] of Object.entries(overrides)) {
      if (value === null) next.delete(key);
      else next.set(key, String(value));
    }
    return `/admin/users?${next.toString()}`;
  };

  return (
    <main className="min-h-svh bg-[#f3f6fa] text-[#0a294d] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="bg-[#0a294d] text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col">
        <div className="flex min-h-[88px] items-center border-b border-white/10 px-4">
          <AdminBrand />
        </div>
        <nav
          aria-label="Administrator navigation"
          className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto"
        >
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={href === "/admin/users" ? "page" : undefined}
              className={`flex min-h-11 shrink-0 items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium transition-colors ${
                href === "/admin/users"
                  ? "bg-[#174e73] text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
              {href === "/admin/membership" && pendingCount ? (
                <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-[#0a294d]">
                  {pendingCount}
                </span>
              ) : null}
              {href === "/admin/contact" && unreadCount ? (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="mb-3 flex items-center gap-3 px-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#1f82c1] font-bold">
              {initials(adminName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{adminName}</p>
              <p className="truncate text-xs text-white/45">{session?.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-[#dfe5eb] bg-white">
          <div className="mx-auto flex min-h-[88px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 xl:px-8 2xl:px-10">
            <div>
              <h1 className="text-[20px] font-bold">Users</h1>
              <p className="mt-1 text-[14px] text-[#52657c]">
                Somali Diplomacy Association CMS
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 items-center justify-center rounded-full bg-[#0a294d] text-sm font-bold text-white"
                aria-label={`Signed in as ${adminName}`}
              >
                {initials(adminName)}
              </span>
              <span className="lg:hidden">
                <LogoutButton compact />
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1600px] gap-6 p-5 sm:p-8 xl:p-8 2xl:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">CMS user accounts</h2>
              <p className="mt-1 text-sm text-[#718196]">
                Create administrators and Bloggers with role-based access.
              </p>
            </div>
            <Link
              href={mode === "create" ? "/admin/users" : "/admin/users?create=1#user-panel"}
              className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-[#1f78b4] px-5 font-semibold text-white shadow-sm transition hover:bg-[#155f91]"
            >
              {mode === "create" ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Plus className="size-5" aria-hidden="true" />
              )}
              {mode === "create" ? "Close Form" : "Create User"}
            </Link>
          </div>

          <StatusMessage
            error={
              firstParam(params.error) ??
              (hasMissingSelection ? "User account not found." : null)
            }
            success={firstParam(params.success)}
          />

          <section
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="User account statistics"
          >
            <div className="rounded-[8px] border border-[#dfe5eb] bg-white p-6">
              <p className="text-sm font-semibold text-[#718196]">Total Users</p>
              <p className="mt-3 text-3xl font-bold">{adminCount}</p>
              <p className="mt-1 text-sm text-[#52657c]">Stored user records</p>
            </div>
            <div className="rounded-[8px] border border-[#dfe5eb] bg-white p-6">
              <p className="text-sm font-semibold text-[#718196]">
                Administrators
              </p>
              <p className="mt-3 text-3xl font-bold">{directory.total}</p>
              <p className="mt-1 text-sm text-[#52657c]">
                Full CMS access
              </p>
            </div>
          </section>

          {mode === "create" || ((mode === "edit" || mode === "reset") && selectedUser) ? (
            <section
              id="user-panel"
              className="scroll-mt-6 rounded-[8px] border border-[#dfe5eb] bg-white p-5 shadow-sm sm:p-7"
              aria-labelledby="user-form-title"
            >
              <h2 id="user-form-title" className="text-xl font-bold">
                {mode === "create"
                  ? "Create CMS user"
                  : mode === "reset"
                    ? `Reset password for ${getAdminDisplayName(selectedUser!.fullName)}`
                    : `Edit ${getAdminDisplayName(selectedUser!.fullName)}`}
              </h2>
              <p className="mt-1 text-sm text-[#718196]">
                These fields map directly to the existing User model.
              </p>
              <div className="mt-6">
                <UserForm
                  mode={mode as "create" | "edit" | "reset"}
                  user={selectedUser ?? undefined}
                />
              </div>
            </section>
          ) : null}

          {mode === "view" && selectedUser ? (
            <section
              id="user-panel"
              className="scroll-mt-6 rounded-[8px] border border-[#dfe5eb] bg-white p-5 shadow-sm sm:p-7"
              aria-labelledby="user-details-title"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <UserAvatar user={selectedUser} />
                  <div>
                    <h2 id="user-details-title" className="text-xl font-bold">
                      {getAdminDisplayName(selectedUser.fullName)}
                    </h2>
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="mt-1 block text-sm text-[#52657c] hover:text-[#1f78b4]"
                    >
                      {selectedUser.email}
                    </a>
                  </div>
                </div>
                <Link
                  href="/admin/users"
                  className="rounded-md px-4 py-2 text-sm font-semibold text-[#52657c] hover:bg-[#edf3f8]"
                >
                  Close
                </Link>
              </div>
              <dl className="mt-7 grid gap-5 border-t border-[#e4e9ee] pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-bold uppercase text-[#718196]">
                    Role
                  </dt>
                  <dd className="mt-2 font-semibold">{roleLabel(selectedUser.role)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase text-[#718196]">
                    Created
                  </dt>
                  <dd className="mt-2">{formatDate(selectedUser.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase text-[#718196]">
                    Last updated
                  </dt>
                  <dd className="mt-2">{formatDate(selectedUser.updatedAt)}</dd>
                </div>
              </dl>
            </section>
          ) : null}

          <section
            className="overflow-hidden rounded-[8px] border border-[#dfe5eb] bg-white"
            aria-labelledby="admin-users-title"
          >
            <div className="grid gap-5 border-b border-[#e4e9ee] px-5 py-6 sm:px-7 xl:grid-cols-[minmax(280px,1fr)_auto] xl:items-end">
              <form className="grid gap-4 sm:grid-cols-[minmax(220px,1fr)_180px_130px_auto]">
                <label className="grid gap-2 text-sm font-semibold">
                  Search users
                  <span className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#718196]"
                      aria-hidden="true"
                    />
                    <input
                      name="q"
                      type="search"
                      defaultValue={query}
                      placeholder="Name or email"
                      className={`${fieldClass} w-full pl-10`}
                    />
                  </span>
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Sort
                  <select name="sort" defaultValue={sort} className={fieldClass}>
                    <option value="name">Alphabetically</option>
                    <option value="newest">Newest first</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Rows
                  <select
                    name="pageSize"
                    defaultValue={directory.pageSize}
                    className={fieldClass}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="min-h-12 self-end rounded-[8px] bg-[#0a294d] px-5 text-sm font-semibold text-white hover:bg-[#174e73]"
                >
                  Apply
                </button>
              </form>
              <span className="rounded-full bg-[#e7f1f8] px-3 py-1 text-sm font-semibold text-[#1f78b4]">
                {directory.total} Total
              </span>
            </div>

            {directory.users.length ? (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[980px] border-collapse text-left">
                    <thead className="bg-[#f7f9fb] text-xs uppercase text-[#5b6d84]">
                      <tr>
                        <th className="px-7 py-5 font-bold">User</th>
                        <th className="px-6 py-5 font-bold">Email</th>
                        <th className="px-6 py-5 font-bold">Role</th>
                        <th className="px-6 py-5 font-bold">Created</th>
                        <th className="px-6 py-5 font-bold">Updated</th>
                        <th className="px-6 py-5 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7ebef]">
                      {directory.users.map((user) => (
                        <tr
                          key={user.id}
                          className="transition-colors hover:bg-[#f8fbfd]"
                        >
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-3">
                              <UserAvatar user={user} />
                              <span className="font-semibold">
                                {getAdminDisplayName(user.fullName)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <a
                              href={`mailto:${user.email}`}
                              className="inline-flex items-center gap-2 text-[#52657c] hover:text-[#1f78b4]"
                            >
                              <Mail className="size-4" aria-hidden="true" />
                              {user.email}
                            </a>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                              <ShieldCheck
                                className="size-4"
                                aria-hidden="true"
                              />
                              {roleLabel(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-[#52657c]">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-5 text-sm text-[#52657c]">
                            {formatDate(user.updatedAt)}
                          </td>
                          <td className="px-6 py-5">
                            <RowActions
                              user={user}
                              currentAdminId={session?.sub ?? ""}
                              adminCount={adminCount}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="divide-y divide-[#e7ebef] lg:hidden">
                  {directory.users.map((user) => (
                    <article key={user.id} className="p-5">
                      <div className="flex items-start gap-3">
                        <UserAvatar user={user} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold">
                            {getAdminDisplayName(user.fullName)}
                          </h3>
                          <p className="mt-1 truncate text-sm text-[#52657c]">
                            {user.email}
                          </p>
                        </div>
                        <RowActions
                          user={user}
                          currentAdminId={session?.sub ?? ""}
                          adminCount={adminCount}
                        />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#718196]">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                          {roleLabel(user.role)}
                        </span>
                        <span>Created {formatDate(user.createdAt)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="px-5 py-16 text-center sm:px-8">
                <span className="mx-auto flex size-16 items-center justify-center rounded-[8px] bg-[#f3f6fa]">
                  <UserRound
                    className="size-8 text-[#62758d]"
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-5 text-xl font-bold">No users found</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#52657c]">
                  Adjust the search or create a CMS user account.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e9ee] px-5 py-4 sm:px-7">
              <p className="text-sm text-[#52657c]">
                Page {Math.min(directory.page, directory.totalPages)} of{" "}
                {directory.totalPages} · {directory.total} users
              </p>
              <div className="flex items-center gap-2">
                {directory.page > 1 ? (
                  <Link
                    href={queryFor({ page: directory.page - 1 })}
                    className="inline-flex min-h-10 items-center gap-1 rounded-md border border-[#d5dee6] px-3 text-sm font-semibold hover:border-[#1f78b4] hover:text-[#1f78b4]"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex min-h-10 items-center gap-1 rounded-md border border-[#e4e9ee] px-3 text-sm text-[#a7b2bf]">
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Previous
                  </span>
                )}
                {directory.page < directory.totalPages ? (
                  <Link
                    href={queryFor({ page: directory.page + 1 })}
                    className="inline-flex min-h-10 items-center gap-1 rounded-md border border-[#d5dee6] px-3 text-sm font-semibold hover:border-[#1f78b4] hover:text-[#1f78b4]"
                  >
                    Next
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="inline-flex min-h-10 items-center gap-1 rounded-md border border-[#e4e9ee] px-3 text-sm text-[#a7b2bf]">
                    Next
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
          </section>

          <aside className="flex items-start gap-3 rounded-[8px] border border-[#d5dee6] bg-white p-5 text-sm leading-6 text-[#52657c]">
            <LockKeyhole
              className="mt-0.5 size-5 shrink-0 text-[#1f78b4]"
              aria-hidden="true"
            />
            <p>
              Administrators have full CMS access. Bloggers can create and edit
              only their own drafts; an administrator must publish or delete
              those posts.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
