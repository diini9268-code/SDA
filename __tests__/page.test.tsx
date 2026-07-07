import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";
import Home from "@/app/page";

describe("Public pages", () => {
  it("renders the public home page", async () => {
    render(await Home());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Students building diplomacy, leadership, and public service capacity.",
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Apply for membership" }),
    ).toBeDefined();
  });

  it("renders the about page with public navigation", () => {
    cleanup();
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "A student platform for diplomacy, leadership, and public service.",
      }),
    ).toBeDefined();
    expect(screen.getByRole("link", { name: "Programs" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Contact" })).toBeDefined();
  });
});
