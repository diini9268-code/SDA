import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";
import BlogPage from "@/app/blog/page";
import LeadershipPage from "@/app/leadership/page";
import MembershipPage from "@/app/membership/page";
import Home from "@/app/page";

describe("Public pages", () => {
  it("renders the public home page", async () => {
    render(await Home());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Shaping Somalia's Diplomatic Future",
      }),
    ).toBeDefined();
    expect(
      screen.getAllByRole("link", { name: /Join SSDU/ }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toBeDefined();
    expect(
      screen
        .getAllByRole("link", { name: "Home" })[0]
        ?.getAttribute("aria-current"),
    ).toBe("page");
    expect(screen.queryByRole("link", { name: "Login" })).toBeNull();
    for (const link of screen.getAllByRole("link", { name: /Join SSDU/ })) {
      expect(link.getAttribute("href")).toBe("/contact");
    }
  });

  it("renders the about page with public navigation", async () => {
    cleanup();
    render(await AboutPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "About SSDU",
      }),
    ).toBeDefined();
    expect(
      screen.getAllByRole("link", { name: "Membership" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "Contact" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen
        .getAllByRole("link", { name: "About" })[0]
        ?.getAttribute("aria-current"),
    ).toBe("page");
    expect(
      screen.getByRole("heading", { level: 2, name: "Published Milestones" }),
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Login" }).getAttribute("href"),
    ).toBe("/admin");
    for (const link of screen.getAllByRole("link", { name: /Join SSDU/ })) {
      expect(link.getAttribute("href")).toBe("/membership");
    }
    expect(screen.queryByRole("button", { name: /newsletter/i })).toBeNull();
  });

  it("renders the leadership page hierarchy", async () => {
    cleanup();
    render(await LeadershipPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Our Leadership",
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The Executive Hierarchy",
      }),
    ).toBeDefined();
  });

  it("renders the backend-aware blog directory", async () => {
    cleanup();
    render(await BlogPage({}));

    expect(
      screen.getByRole("heading", { level: 1, name: "The SSDU Blog" }),
    ).toBeDefined();
    expect(
      screen
        .getAllByRole("link", { name: "Blog" })[0]
        ?.getAttribute("aria-current"),
    ).toBe("page");
    expect(screen.getByRole("searchbox").getAttribute("name")).toBe("q");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "No articles have been published yet.",
      }),
    ).toBeDefined();
    expect(screen.queryByText("Showing 12 of 48 publications")).toBeNull();
  });

  it("renders only backend-supported membership application fields", async () => {
    cleanup();
    render(await MembershipPage({}));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Join the SSDU Community",
      }),
    ).toBeDefined();
    for (const fieldName of [
      "fullName",
      "email",
      "phone",
      "university",
      "areaOfInterest",
    ]) {
      expect(document.querySelector(`[name="${fieldName}"]`)).not.toBeNull();
    }
    for (const unsupportedField of ["city", "category", "motivation"]) {
      expect(document.querySelector(`[name="${unsupportedField}"]`)).toBeNull();
    }
    expect(
      screen.getByRole("button", { name: "Submit Application" }),
    ).toBeDefined();
  });
});
