"use client";

import Link from "next/link";
import { ArrowRight, Globe2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavigationItem = {
  href: string;
  label: string;
};

export function BrandLogo({
  compactOnMobile = false,
  inverse = false,
}: {
  compactOnMobile?: boolean;
  inverse?: boolean;
}) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span
        className={`flex size-[54px] shrink-0 flex-col items-center justify-center rounded-lg transition-colors sm:size-[58px] ${
          inverse ? "bg-white/10" : "bg-[#0a294d]"
        }`}
      >
        <Globe2 className="size-7 text-[#27b3f4]" strokeWidth={1.7} />
        <span className="mt-0.5 text-[8px] font-bold tracking-[0.24em] text-white">
          SSDU
        </span>
      </span>
      <span
        className={`min-w-0 font-serif text-[18px] font-bold leading-[1.05] transition-colors ${
          inverse ? "text-white" : "text-[#0a294d]"
        } ${compactOnMobile ? "hidden sm:block" : "block"}`}
      >
        Somali Student
        <br />
        Diplomacy Union
        <span className="mt-1 block font-sans text-[10px] font-bold tracking-[0.28em] text-[#27a9ec]">
          DIPLOMACY / UNITY
        </span>
      </span>
    </span>
  );
}

export function HomeHeader({ items }: { items: NavigationItem[] }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-[#dfe4e9] bg-white/95 shadow-[0_2px_8px_rgba(10,41,77,0.08)] backdrop-blur"
          : "border-white/10 bg-[#071e38]/55 shadow-none backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1780px] items-center justify-between gap-4 px-5 sm:h-[90px] md:px-10 xl:gap-8 xl:px-12">
        <Link href="/" aria-label="SSDU home" className="shrink-0 rounded-lg">
          <BrandLogo compactOnMobile inverse={!scrolled} />
        </Link>

        <nav
          className="hidden items-center gap-8 xl:flex 2xl:gap-10"
          aria-label="Primary"
        >
          {items.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              aria-current={item.href === "/" ? "page" : undefined}
              className={`py-3 text-[16px] transition-colors 2xl:text-[17px] ${
                item.href === "/"
                  ? "font-semibold text-[#29b6f6]"
                  : scrolled
                    ? "text-[#52657c] hover:text-[#0874b9]"
                    : "text-white/85 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:gap-5">
          <Link
            href="/archive"
            className={`hidden min-h-11 items-center px-2 text-[16px] transition-colors sm:inline-flex ${
              scrolled
                ? "text-[#0a294d] hover:text-[#0874b9]"
                : "text-white/90 hover:text-white"
            }`}
          >
            Archive
          </Link>
          <Link
            href="/contact"
            aria-label="Join SSDU"
            className="inline-flex h-11 items-center gap-2 rounded-[22px] bg-[#1778b8] px-4 text-[15px] font-semibold text-white shadow-md transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#0a6098] hover:shadow-lg motion-reduce:transform-none sm:gap-3 sm:px-5 sm:text-[16px]"
          >
            <span className="sm:hidden" aria-hidden="true">
              Join
            </span>
            <span className="hidden sm:inline" aria-hidden="true">
              Join SSDU
            </span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <details className="group relative xl:hidden">
            <summary
              className={`flex size-11 cursor-pointer list-none items-center justify-center rounded-md border transition-colors [&::-webkit-details-marker]:hidden ${
                scrolled
                  ? "border-[#cbd6df] text-[#0a294d] hover:bg-[#eef5fa]"
                  : "border-white/35 text-white hover:bg-white/10"
              }`}
            >
              <span className="sr-only">
                <span className="group-open:hidden">Open</span>
                <span className="hidden group-open:inline">Close</span>{" "}
                navigation
              </span>
              <Menu className="size-5 group-open:hidden" aria-hidden="true" />
              <X
                className="hidden size-5 group-open:block"
                aria-hidden="true"
              />
            </summary>
            <nav
              aria-label="Mobile primary"
              className="absolute right-0 top-[calc(100%+14px)] w-[min(20rem,calc(100vw-2.5rem))] rounded-[16px] border border-[#dce4eb] bg-white p-3 text-[#52657c] shadow-2xl"
            >
              <ul className="grid gap-1">
                {items.map((item) => (
                  <li key={`mobile-${item.label}-${item.href}`}>
                    <Link
                      href={item.href}
                      aria-current={item.href === "/" ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-lg px-4 text-[16px] transition-colors ${
                        item.href === "/"
                          ? "bg-[#e8f3fa] font-semibold text-[#0874b9]"
                          : "hover:bg-[#f3f7fa] hover:text-[#0874b9]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
