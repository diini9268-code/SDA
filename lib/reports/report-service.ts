export type StatusCount = {
  status: string;
  count: number;
};

export type CategoryCount = {
  category: string;
  count: number;
};

export type ReportsSnapshot = {
  generatedAt: Date;
  totals: {
    blogPosts: number;
    blogMedia: number;
    programs: number;
    membershipApplications: number;
    contactMessages: number;
    archiveEntries: number;
  };
  blog: {
    published: number;
    drafts: number;
    archived: number;
    categories: CategoryCount[];
  };
  programs: {
    liveOrScheduled: number;
    byStatus: StatusCount[];
    upcoming: number;
  };
  membership: {
    byStatus: StatusCount[];
    approvalRate: number;
  };
  contact: {
    byStatus: StatusCount[];
    unreadRate: number;
  };
};

export type ReportsRepository = {
  getSnapshot(): Promise<ReportsSnapshot>;
};

function countByStatus(
  counts: Array<{ status: string; count: number }>,
  status: string,
): number {
  return counts.find((item) => item.status === status)?.count ?? 0;
}

function percentage(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

export function buildReportsSnapshot(input: {
  generatedAt: Date;
  blogStatusCounts: StatusCount[];
  blogCategoryCounts: CategoryCount[];
  blogMediaCount: number;
  programStatusCounts: StatusCount[];
  upcomingProgramCount: number;
  membershipStatusCounts: StatusCount[];
  contactStatusCounts: StatusCount[];
  archiveCount: number;
}): ReportsSnapshot {
  const blogPosts = input.blogStatusCounts.reduce(
    (total, item) => total + item.count,
    0,
  );
  const programs = input.programStatusCounts.reduce(
    (total, item) => total + item.count,
    0,
  );
  const membershipApplications = input.membershipStatusCounts.reduce(
    (total, item) => total + item.count,
    0,
  );
  const contactMessages = input.contactStatusCounts.reduce(
    (total, item) => total + item.count,
    0,
  );
  const approvedApplications = countByStatus(
    input.membershipStatusCounts,
    "APPROVED",
  );
  const unreadMessages = countByStatus(input.contactStatusCounts, "UNREAD");

  return {
    generatedAt: input.generatedAt,
    totals: {
      blogPosts,
      blogMedia: input.blogMediaCount,
      programs,
      membershipApplications,
      contactMessages,
      archiveEntries: input.archiveCount,
    },
    blog: {
      published: countByStatus(input.blogStatusCounts, "PUBLISHED"),
      drafts: countByStatus(input.blogStatusCounts, "DRAFT"),
      archived: countByStatus(input.blogStatusCounts, "ARCHIVED"),
      categories: input.blogCategoryCounts,
    },
    programs: {
      liveOrScheduled:
        countByStatus(input.programStatusCounts, "PUBLISHED") +
        countByStatus(input.programStatusCounts, "SCHEDULED"),
      byStatus: input.programStatusCounts,
      upcoming: input.upcomingProgramCount,
    },
    membership: {
      byStatus: input.membershipStatusCounts,
      approvalRate: percentage(approvedApplications, membershipApplications),
    },
    contact: {
      byStatus: input.contactStatusCounts,
      unreadRate: percentage(unreadMessages, contactMessages),
    },
  };
}

export async function getReportsSnapshot(
  repository: ReportsRepository,
): Promise<ReportsSnapshot> {
  return repository.getSnapshot();
}
