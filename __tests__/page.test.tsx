import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";
import LeadershipPage from "@/app/leadership/page";
import Home from "@/app/page";

describe("Public pages", () => {
  it("renders the public home page", async () => {
    render(await Home());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Fostering Excellence in Somali Diplomacy",
      }),
    ).toBeDefined();
    expect(
      screen.getAllByRole("link", { name: "Explore Our Mission" }).length,
    ).toBeGreaterThan(0);
  });

  it("renders the about page with public navigation", () => {
    cleanup();
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "About SSDU",
      }),
    ).toBeDefined();
    expect(screen.getAllByRole("link", { name: "Programs" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Contact" }).length).toBeGreaterThan(0);
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
});
