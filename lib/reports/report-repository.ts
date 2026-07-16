import { getPrismaClient } from "@/lib/db/prisma";
import { buildReportsSnapshot } from "@/lib/reports/report-service";
import type {
  CategoryCount,
  MonthlyCount,
  ReportsRepository,
  ReportsSnapshot,
  StatusCount,
} from "@/lib/reports/report-service";

function toStatusCounts(
  values: Array<{ status: string; _count: { _all: number } }>,
): StatusCount[] {
  return values
    .map((value) => ({
      status: value.status,
      count: value._count._all,
    }))
    .sort((a, b) => a.status.localeCompare(b.status));
}

function toCategoryCounts(
  values: Array<{ category: string; _count: { _all: number } }>,
): CategoryCount[] {
  return values
    .map((value) => ({
      category: value.category,
      count: value._count._all,
    }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

function buildMonthlyApplicationCounts(values: Date[], now: Date): MonthlyCount[] {
  const monthFormatter = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });

  return Array.from({ length: 6 }, (_, index) => {
    const offset = index - 5;
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    return {
      month: monthFormatter.format(date),
      count: values.filter(
        (value) => value.getUTCFullYear() === year && value.getUTCMonth() === month,
      ).length,
    };
  });
}

export const prismaReportsRepository: ReportsRepository = {
  async getSnapshot(): Promise<ReportsSnapshot> {
    const prisma = getPrismaClient();
    const now = new Date();
    const [
      blogStatusCounts,
      blogCategoryCounts,
      blogMediaCount,
      programStatusCounts,
      upcomingProgramCount,
      membershipStatusCounts,
      recentApplicationDates,
      contactStatusCounts,
      archiveCount,
    ] = await Promise.all([
      prisma.blog.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),
      prisma.blog.groupBy({
        by: ["category"],
        _count: {
          _all: true,
        },
      }),
      prisma.blogMedia.count(),
      prisma.program.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),
      prisma.program.count({
        where: {
          eventDate: {
            gte: now,
          },
          status: {
            in: ["SCHEDULED", "PUBLISHED"],
          },
        },
      }),
      prisma.membershipApplication.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),
      prisma.membershipApplication.findMany({
        where: {
          submittedAt: {
            gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)),
          },
        },
        select: { submittedAt: true },
        orderBy: { submittedAt: "asc" },
      }),
      prisma.contactMessage.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),
      prisma.archive.count(),
    ]);

    return buildReportsSnapshot({
      generatedAt: now,
      blogStatusCounts: toStatusCounts(blogStatusCounts),
      blogCategoryCounts: toCategoryCounts(blogCategoryCounts),
      blogMediaCount,
      programStatusCounts: toStatusCounts(programStatusCounts),
      upcomingProgramCount,
      membershipStatusCounts: toStatusCounts(membershipStatusCounts),
      monthlyApplicationCounts: buildMonthlyApplicationCounts(
        recentApplicationDates.map((application) => application.submittedAt),
        now,
      ),
      contactStatusCounts: toStatusCounts(contactStatusCounts),
      archiveCount,
    });
  },
};
