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
        name: "Shaping the Future of Somali Diplomacy",
      }),
    ).toBeDefined();
    expect(screen.getAllByRole("link", { name: "Join Us" }).length).toBeGreaterThan(0);
  });

  it("renders the about page with public navigation", () => {
    cleanup();
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "SSDU Institutional Profile",
      }),
    ).toBeDefined();
    expect(screen.getAllByRole("link", { name: "Programs" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Contact" }).length).toBeGreaterThan(0);
  });
});
