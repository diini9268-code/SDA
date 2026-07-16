import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminPage from "@/app/admin/page";

const repositories = vi.hoisted(() => ({
  archive: {
    listAll: vi.fn(),
  },
  blog: {
    listAll: vi.fn(),
  },
  contact: {
    listAll: vi.fn(),
  },
  leadership: {
    listAll: vi.fn(),
  },
  membership: {
    listAll: vi.fn(),
  },
  programs: {
    listAll: vi.fn(),
  },
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

vi.mock("@/lib/archive/archive-repository", () => ({
  prismaArchiveRepository: repositories.archive,
}));

vi.mock("@/lib/blog/blog-repository", () => ({
  prismaBlogRepository: repositories.blog,
}));

vi.mock("@/lib/contact/contact-repository", () => ({
  prismaContactRepository: repositories.contact,
}));

vi.mock("@/lib/leadership/leadership-repository", () => ({
  prismaLeadershipRepository: repositories.leadership,
}));

vi.mock("@/lib/membership/membership-repository", () => ({
  prismaMembershipRepository: repositories.membership,
}));

vi.mock("@/lib/programs/program-repository", () => ({
  prismaProgramRepository: repositories.programs,
}));

const now = new Date("2026-07-07T12:00:00.000Z");

describe("Admin dashboard", () => {
  it("renders dashboard statistics and management links", async () => {
    repositories.archive.listAll.mockResolvedValue([
      {
        id: "archive-1",
        title: "Archive item",
        updatedAt: now,
      },
    ]);
    repositories.blog.listAll.mockResolvedValue([
      {
        id: "blog-1",
        title: "Published update",
        category: "News",
        status: "PUBLISHED",
        updatedAt: now,
      },
      {
        id: "blog-2",
        title: "Draft update",
        category: "News",
        status: "DRAFT",
        updatedAt: now,
      },
    ]);
    repositories.contact.listAll.mockResolvedValue([
      {
        id: "contact-1",
        fullName: "Website Visitor",
        subject: "Partnership inquiry",
        status: "UNREAD",
        createdAt: now,
      },
    ]);
    repositories.leadership.listAll.mockResolvedValue([
      {
        id: "leader-1",
        fullName: "Amina Hassan",
        isActive: true,
      },
    ]);
    repositories.membership.listAll.mockResolvedValue([
      {
        id: "membership-1",
        fullName: "Student Applicant",
        areaOfInterest: "Diplomacy",
        status: "PENDING",
        submittedAt: now,
      },
      {
        id: "membership-2",
        fullName: "Approved Applicant",
        areaOfInterest: "Research",
        status: "APPROVED",
        submittedAt: now,
      },
    ]);
    repositories.programs.listAll.mockResolvedValue([
      {
        id: "program-1",
        title: "Diplomacy workshop",
        status: "SCHEDULED",
        updatedAt: now,
      },
    ]);

    render(await AdminPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Dashboard Home",
      }),
    ).toBeDefined();
    expect(screen.getByText("1 drafts")).toBeDefined();
    expect(screen.getByText("1 total programs")).toBeDefined();
    expect(screen.getByText("2 total applications")).toBeDefined();
    expect(screen.getByText("1 total messages")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Blog by Category" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Application Status" })).toBeDefined();
    expect(screen.getAllByRole("link", { name: /Applications/ }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Users" }).getAttribute("href")).toBe(
      "/admin/users",
    );
    expect(screen.queryByRole("searchbox")).toBeNull();
  });
});
