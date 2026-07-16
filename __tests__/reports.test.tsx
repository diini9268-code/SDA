import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminReportsPage from "@/app/admin/reports/page";
import { buildReportsSnapshot } from "@/lib/reports/report-service";

const reportRepository = vi.hoisted(() => ({
  getSnapshot: vi.fn(),
}));

vi.mock("@/lib/auth/require-admin", () => ({
  requireAdminSession: vi.fn(async () => ({
    sub: "admin-id",
    email: "admin@example.com",
    fullName: "SSDU Administrator",
    role: "ADMIN",
  })),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/lib/reports/report-repository", () => ({
  prismaReportsRepository: reportRepository,
}));

const generatedAt = new Date("2026-07-07T12:00:00.000Z");

describe("reports and analytics", () => {
  it("builds a report snapshot from aggregate counts", () => {
    const snapshot = buildReportsSnapshot({
      generatedAt,
      blogStatusCounts: [
        { status: "PUBLISHED", count: 3 },
        { status: "DRAFT", count: 1 },
      ],
      blogCategoryCounts: [{ category: "News", count: 2 }],
      blogMediaCount: 4,
      programStatusCounts: [
        { status: "PUBLISHED", count: 2 },
        { status: "SCHEDULED", count: 1 },
      ],
      upcomingProgramCount: 2,
      membershipStatusCounts: [
        { status: "APPROVED", count: 6 },
        { status: "PENDING", count: 3 },
        { status: "REJECTED", count: 1 },
      ],
      contactStatusCounts: [
        { status: "UNREAD", count: 2 },
        { status: "READ", count: 6 },
      ],
      archiveCount: 5,
    });

    expect(snapshot.totals).toEqual({
      blogPosts: 4,
      blogMedia: 4,
      programs: 3,
      membershipApplications: 10,
      contactMessages: 8,
      archiveEntries: 5,
    });
    expect(snapshot.programs.liveOrScheduled).toBe(3);
    expect(snapshot.membership.approvalRate).toBe(60);
    expect(snapshot.contact.unreadRate).toBe(25);
  });

  it("renders the admin report page without personal contact details", async () => {
    reportRepository.getSnapshot.mockResolvedValue(
      buildReportsSnapshot({
        generatedAt,
        blogStatusCounts: [{ status: "PUBLISHED", count: 1 }],
        blogCategoryCounts: [{ category: "Diplomacy", count: 1 }],
        blogMediaCount: 2,
        programStatusCounts: [{ status: "SCHEDULED", count: 1 }],
        upcomingProgramCount: 1,
        membershipStatusCounts: [{ status: "PENDING", count: 1 }],
        contactStatusCounts: [{ status: "UNREAD", count: 1 }],
        archiveCount: 1,
      }),
    );

    render(await AdminReportsPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Reports & Analytics",
      }),
    ).toBeDefined();
    expect(screen.getByRole("heading", { name: "Content Overview" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Applications Overview" })).toBeDefined();
    expect(screen.getByText("Diplomacy")).toBeDefined();
    expect(screen.getByText("admin@example.com")).toBeDefined();
  });
});
