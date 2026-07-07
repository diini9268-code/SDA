import Link from "next/link";

const navigationItems = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Research" },
  { href: "/leadership", label: "Leadership" },
  { href: "/programs", label: "Programs" },
  { href: "/archive", label: "Archive" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 text-slate-950 backdrop-blur dark:border-slate-200/80 dark:bg-white/95 dark:text-slate-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="text-base font-black tracking-tight text-slate-950 dark:text-slate-950"
        >
          SSDU
        </Link>
        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-7 text-xs font-bold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-600">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-sky-800">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/membership"
            className="rounded bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:ring-offset-2 dark:bg-slate-950 dark:text-white"
          >
            Join SSDU
          </Link>
          <Link
            href="/admin"
            className="hidden rounded border border-slate-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-950 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:ring-offset-2 sm:inline-flex dark:border-slate-300 dark:text-slate-700 dark:hover:text-slate-950"
          >
            Admin
          </Link>
        </div>
      </div>
      <nav
        aria-label="Mobile primary navigation"
        className="border-t border-slate-100 px-5 py-3 md:hidden dark:border-slate-100"
      >
        <ul className="flex gap-5 overflow-x-auto text-xs font-bold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-600">
          {navigationItems.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link href={item.href} className="transition hover:text-sky-800">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-white dark:bg-slate-950 dark:text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-[1.2fr_0.8fr_0.8fr] sm:px-8 lg:px-10">
        <div className="space-y-3">
          <p className="text-lg font-black tracking-tight">SSDU</p>
          <p className="max-w-sm text-sm leading-6 text-slate-300">
            Empowering Somali students through diplomacy, leadership, public
            service, and civic engagement.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Quick links
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-slate-300">
            {navigationItems.slice(0, 4).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Connect
          </p>
          <div className="mt-4 grid gap-2 text-sm text-slate-300">
            <Link href="/membership" className="hover:text-white">
              Membership
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact SSDU
            </Link>
            <Link href="/admin" className="hover:text-white">
              Admin portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-white dark:text-slate-950">
      <PublicHeader />
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
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-600">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl dark:text-slate-950">
        {title}
      </h1>
      <p className="text-lg leading-8 text-slate-700 dark:text-slate-700">
        {description}
      </p>
    </div>
  );
}
