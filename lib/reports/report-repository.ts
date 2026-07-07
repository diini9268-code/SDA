import { getPrismaClient } from "@/lib/db/prisma";
import { buildReportsSnapshot } from "@/lib/reports/report-service";
import type {
  CategoryCount,
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
      contactStatusCounts: toStatusCounts(contactStatusCounts),
      archiveCount,
    });
  },
};
