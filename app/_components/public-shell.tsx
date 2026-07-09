import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/blog", label: "Research" },
  { href: "/archive", label: "Archive" },
  { href: "/membership", label: "Membership" },
];

export function PublicHeader({ activeHref }: { activeHref?: string }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b-2 border-[#e9c176] bg-[#f8f9fa]/95 shadow-sm backdrop-blur dark:bg-[#f8f9fa]/95">
      <nav className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-6 px-6 md:px-16">
        <Link
          href="/"
          className="font-serif text-xl font-bold text-[#000613]"
          aria-label="SSDU home"
        >
          SSDU
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={
                  item.href === activeHref
                    ? "border-b-2 border-[#e9c176] pb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#000613]"
                    : "text-xs font-semibold uppercase tracking-[0.08em] text-[#43474e] transition-colors hover:text-[#000613]"
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/membership"
          className="rounded-lg bg-[#000613] px-6 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-[#40acfe] hover:text-[#001f3f] focus:outline-none focus:ring-2 focus:ring-[#40acfe] focus:ring-offset-2"
        >
          Join SSDU
        </Link>
      </nav>

      <nav
        aria-label="Mobile primary navigation"
        className="border-t border-[#e1e3e4] bg-[#f8f9fa] px-4 py-3 md:hidden"
      >
        <ul className="flex gap-5 overflow-x-auto text-xs font-semibold uppercase tracking-[0.08em] text-[#43474e]">
          {navigationItems.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={
                  item.href === activeHref
                    ? "text-[#000613]"
                    : "transition-colors hover:text-[#000613]"
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="shrink-0">
            <Link href="/contact" className="transition-colors hover:text-[#000613]">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-auto w-full bg-[#000613] text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-6 py-12 md:grid-cols-4 md:px-16">
        <div className="space-y-6">
          <div className="font-serif text-xl font-bold">SSDU</div>
          <p className="text-sm leading-6 text-[#e1e3e4]/80">
            Empowering Somali youth to lead in international diplomacy and
            research.
          </p>
          <div className="flex gap-4 text-[#e1e3e4]/80" aria-label="Social links">
            <span aria-hidden="true">@</span>
            <span aria-hidden="true">web</span>
            <span aria-hidden="true">hub</span>
          </div>
        </div>

        <div>
          <h2 className="mb-6 font-serif text-xl font-bold">Quick Links</h2>
          <ul className="space-y-4 text-sm text-[#e1e3e4]/80">
            <li>
              <Link className="hover:text-white hover:underline" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/blog">
                Research
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/programs">
                Programs
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/membership">
                Join Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-6 font-serif text-xl font-bold">Contact Info</h2>
          <address className="space-y-4 text-sm not-italic leading-6 text-[#e1e3e4]/80">
            <p>Mogadishu, Somalia</p>
            <p>contact@ssdu.org</p>
            <p>+252 61 XXX XXXX</p>
          </address>
        </div>

        <div>
          <h2 className="mb-6 font-serif text-xl font-bold">Mission Statement</h2>
          <p className="text-sm leading-6 text-[#e1e3e4]/80">
            To cultivate a generation of diplomats who are academically
            proficient, culturally grounded, and globally competitive.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] border-t border-white/10 px-6 py-6 md:px-16">
        <p className="text-center text-sm text-[#e1e3e4]/60">
          &copy; 2024 Somali Student Diplomacy Union. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function PublicPageShell({
  activeHref,
  children,
}: {
  activeHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <PublicHeader activeHref={activeHref} />
      {children}
      <PublicFooter />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00639c]">
        {eyebrow}
      </p>
      <h1 className="font-serif text-3xl font-bold tracking-normal text-[#000613] sm:text-4xl">
        {title}
      </h1>
      <p className="text-lg leading-8 text-[#43474e]">{description}</p>
    </div>
  );
}
