import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AboutPage from "@/app/about/page";
import BlogPage from "@/app/blog/page";
import ContactPage from "@/app/contact/page";
import LeadershipPage from "@/app/leadership/page";
import AdminLoginPage from "@/app/admin/login/page";
import LoginPage from "@/app/login/page";
import MembershipPage from "@/app/membership/page";
import Home from "@/app/page";

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ toString: (): string => "" })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

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
      screen.getAllByRole("link", { name: /Join SDA/ }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toBeDefined();
    expect(
      screen
        .getAllByRole("link", { name: "Home" })[0]
        ?.getAttribute("aria-current"),
    ).toBe("page");
    expect(screen.getByRole("link", { name: "Login" }).getAttribute("href")).toBe("/login");
    for (const link of screen.getAllByRole("link", { name: /Join SDA/ })) {
      expect(link.getAttribute("href")).toBe("/membership");
    }
  });

  it("renders the about page with public navigation", async () => {
    cleanup();
    render(await AboutPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "About SDA",
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
      screen.getByRole("heading", { level: 2, name: "The Principles That Guide Us" }),
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Login" }).getAttribute("href"),
    ).toBe("/login");
    for (const link of screen.getAllByRole("link", { name: /Join SDA/ })) {
      expect(link.getAttribute("href")).toBe("/membership");
    }
    expect(screen.queryByRole("button", { name: /newsletter/i })).toBeNull();
  });

  it("renders the backend-aware leadership directory", async () => {
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
        name: "Abdullaahi Abdikariim Ahmed",
      }),
    ).toBeDefined();
    expect(screen.queryByRole("button", { name: "Supreme Council" })).toBeNull();
    expect(screen.queryByRole("link", { name: /linkedin/i })).toBeNull();
    expect(
      screen
        .getAllByRole("link", { name: "Leadership" })[0]
        ?.getAttribute("aria-current"),
    ).toBe("page");
  });

  it("renders the backend-aware blog directory", async () => {
    cleanup();
    render(await BlogPage({}));

    expect(
      screen.getByRole("heading", { level: 1, name: "The SDA Blog" }),
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
        name: "Join the SDA Community",
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

  it("renders only backend-supported contact message fields", async () => {
    cleanup();
    render(await ContactPage({}));

    expect(screen.getByRole("heading", { level: 1, name: "Contact Us" })).toBeDefined();
    for (const fieldName of ["fullName", "email", "subject", "message"]) {
      expect(document.querySelector(`[name="${fieldName}"]`)).not.toBeNull();
    }
    for (const unsupportedField of ["phone", "attachment", "newsletter"]) {
      expect(document.querySelector(`[name="${unsupportedField}"]`)).toBeNull();
    }
    expect(screen.getByRole("button", { name: /Send Message/ })).toBeDefined();
    expect(screen.queryByText("+252 61 234 5678")).toBeNull();
    expect(screen.queryByText("Maka Al-Mukarama Road")).toBeNull();
  });

  it("renders the public member login without submitting to admin authentication", () => {
    cleanup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<LoginPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Member Login" })).toBeDefined();
    expect(screen.getByLabelText("Remember me")).toBeDefined();
    expect(screen.getByRole("link", { name: "Forgot password?" }).getAttribute("href")).toBe("/contact");
    expect(screen.getByRole("link", { name: /Apply for membership/ }).getAttribute("href")).toBe("/membership");
    expect(screen.getByRole("link", { name: /Admin login/ }).getAttribute("href")).toBe("/admin/login");
    fireEvent.submit(screen.getByRole("button", { name: "Sign In" }).closest("form")!);
    expect(screen.getByRole("status").textContent).toContain("Member authentication is not available yet");
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("preserves the supported administrator login without member-only controls", async () => {
    cleanup();
    render(await AdminLoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("heading", { level: 1, name: "Admin Login" })).toBeDefined();
    expect(document.querySelector('[name="email"]')).not.toBeNull();
    expect(document.querySelector('[name="password"]')).not.toBeNull();
    expect(screen.queryByLabelText(/Remember me/i)).toBeNull();
    expect(screen.queryByRole("link", { name: /Forgot password/i })).toBeNull();
    expect(screen.getByRole("button", { name: /Sign In/ })).toBeDefined();
  });
});
