import Link from "next/link";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import type { BlogRecord } from "@/lib/blog/blog-service";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import type { ContactMessageRecord } from "@/lib/contact/contact-service";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";
import type { MembershipApplicationRecord } from "@/lib/membership/membership-service";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import type { ProgramRecord } from "@/lib/programs/program-service";

type DashboardCard = {
  href: string;
  category: string;
  title: string;
  description: string;
  value: string;
};

type StatCard = {
  label: string;
  value: number;
  detail: string;
  href: string;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

function latestByDate<T>(items: T[], getDate: (item: T) => Date): T | null {
  return items.reduce<T | null>((latest, item) => {
    if (!latest || getDate(item) > getDate(latest)) {
      return item;
    }

    return latest;
  }, null);
}

function ManagementCard({ card }: { card: DashboardCard }) {
  return (
    <Link
      href={card.href}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {card.category}
      </p>
      <h2 className="mt-3 text-2xl font-semibold">{card.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {card.description}
      </p>
      <p className="mt-5 text-sm font-semibold text-slate-950">{card.value}</p>
    </Link>
  );
}

function StatCard({ stat }: { stat: StatCard }) {
  return (
    <Link
      href={stat.href}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400"
    >
      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">
        {stat.value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{stat.detail}</p>
    </Link>
  );
}

function ActivityItem({
  title,
  detail,
  href,
}: {
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-md border border-slate-200 px-4 py-3 transition hover:border-slate-400"
    >
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {detail}
      </p>
    </Link>
  );
}

export default async function AdminPage() {
  const session = await requireAdminSession();
  const [
    archive,
    blog,
    contactMessages,
    leadership,
    membershipApplications,
    programs,
  ] = await Promise.all([
    prismaArchiveRepository.listAll(),
    prismaBlogRepository.listAll(),
    prismaContactRepository.listAll(),
    prismaLeadershipRepository.listAll(),
    prismaMembershipRepository.listAll(),
    prismaProgramRepository.listAll(),
  ]);

  const pendingMembership = membershipApplications.filter(
    (application) => application.status === "PENDING",
  );
  const unreadContact = contactMessages.filter(
    (message) => message.status === "UNREAD",
  );
  const draftBlog = blog.filter((post) => post.status === "DRAFT");
  const publishedBlog = blog.filter((post) => post.status === "PUBLISHED");
  const scheduledPrograms = programs.filter(
    (program) => program.status === "SCHEDULED",
  );
  const publishedPrograms = programs.filter(
    (program) => program.status === "PUBLISHED",
  );

  const managementCards: DashboardCard[] = [
    {
      href: "/admin/blog",
      category: "Content",
      title: "Manage blog",
      description: "Create posts, publish updates, and attach blog-owned media.",
      value: `${blog.length} posts`,
    },
    {
      href: "/admin/leadership",
      category: "Content",
      title: "Manage leadership",
      description: "Add, edit, reorder, hide, and delete leadership profiles.",
      value: `${leadership.length} profiles`,
    },
    {
      href: "/admin/programs",
      category: "Content",
      title: "Manage programs",
      description: "Create, schedule, publish, archive, cancel, and remove programs.",
      value: `${programs.length} programs`,
    },
    {
      href: "/admin/archive",
      category: "Content",
      title: "Manage archive",
      description: "Preserve historical SSDU activities and organizational records.",
      value: `${archive.length} entries`,
    },
    {
      href: "/admin/membership",
      category: "Review",
      title: "Review membership",
      description: "Review submitted membership applications and update statuses.",
      value: `${pendingMembership.length} pending`,
    },
    {
      href: "/admin/contact",
      category: "Review",
      title: "Review contact",
      description: "Review visitor inquiries and mark messages read or archived.",
      value: `${unreadContact.length} unread`,
    },
    {
      href: "/admin/reports",
      category: "Analytics",
      title: "View reports",
      description: "Review aggregated website, content, and submission metrics.",
      value: "Database-backed",
    },
  ];

  const statCards: StatCard[] = [
    {
      label: "Published blog posts",
      value: publishedBlog.length,
      detail: `${draftBlog.length} drafts waiting for review`,
      href: "/admin/blog",
    },
    {
      label: "Live or scheduled programs",
      value: publishedPrograms.length + scheduledPrograms.length,
      detail: `${scheduledPrograms.length} scheduled programs`,
      href: "/admin/programs",
    },
    {
      label: "Pending membership",
      value: pendingMembership.length,
      detail: `${membershipApplications.length} total applications`,
      href: "/admin/membership",
    },
    {
      label: "Unread contact messages",
      value: unreadContact.length,
      detail: `${contactMessages.length} total messages`,
      href: "/admin/contact",
    },
  ];

  const latestPost = latestByDate<BlogRecord>(blog, (post) => post.updatedAt);
  const latestProgram = latestByDate<ProgramRecord>(
    programs,
    (program) => program.updatedAt,
  );
  const latestApplication = latestByDate<MembershipApplicationRecord>(
    membershipApplications,
    (application) => application.submittedAt,
  );
  const latestMessage = latestByDate<ContactMessageRecord>(
    contactMessages,
    (message) => message.createdAt,
  );

  const nextWorkItems = [
    "Website optimization",
    "Security hardening",
    "Production deployment readiness",
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10 lg:px-16">
      <section className="mx-auto grid max-w-6xl gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
              Administrator
            </p>
            <h1 className="text-4xl font-semibold tracking-normal">
              SSDU Admin Dashboard
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-700">
              Signed in as{" "}
              {session?.fullName ?? "an authenticated administrator"}. Monitor
              content health, review submissions, and open the right management
              workflow from one place.
            </p>
          </div>
          <Link
            href="/"
            className="w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            View public site
          </Link>
        </div>

        <section aria-labelledby="dashboard-overview">
          <h2 id="dashboard-overview" className="text-xl font-semibold">
            Dashboard overview
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </section>

        <section aria-labelledby="management-tools">
          <h2 id="management-tools" className="text-xl font-semibold">
            Management tools
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {managementCards.map((card) => (
              <ManagementCard key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Recent activity</h2>
            <div className="mt-4 grid gap-3">
              {latestPost ? (
                <ActivityItem
                  href="/admin/blog"
                  title={latestPost.title}
                  detail={`Latest blog update - ${formatDate(latestPost.updatedAt)}`}
                />
              ) : null}
              {latestProgram ? (
                <ActivityItem
                  href="/admin/programs"
                  title={latestProgram.title}
                  detail={`Latest program update - ${formatDate(latestProgram.updatedAt)}`}
                />
              ) : null}
              {latestApplication ? (
                <ActivityItem
                  href="/admin/membership"
                  title={latestApplication.fullName}
                  detail={`Latest application - ${formatDate(latestApplication.submittedAt)}`}
                />
              ) : null}
              {latestMessage ? (
                <ActivityItem
                  href="/admin/contact"
                  title={latestMessage.subject}
                  detail={`Latest contact message - ${formatDate(latestMessage.createdAt)}`}
                />
              ) : null}
              {!latestPost &&
              !latestProgram &&
              !latestApplication &&
              !latestMessage ? (
                <p className="rounded-md border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600">
                  Recent content and submissions will appear here.
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Next planned feature areas</h2>
            <div className="mt-4 grid gap-3">
              {nextWorkItems.map((item, index) => (
                <div
                  key={item}
                  className="rounded-md border border-slate-200 px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Step {index + 1}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
