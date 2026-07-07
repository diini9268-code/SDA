import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/leadership", label: "Leadership" },
  { href: "/programs", label: "Programs" },
  { href: "/blog", label: "Blog" },
  { href: "/archive", label: "Archive" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-950">
            SSDU
          </Link>
          <Link
            href="/admin"
            className="w-fit rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            Admin
          </Link>
        </div>
        <nav aria-label="Primary navigation" className="overflow-x-auto">
          <ul className="flex min-w-max gap-x-5 gap-y-2 text-sm font-medium text-slate-600 sm:flex-wrap sm:min-w-0">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-slate-950">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-4 px-6 py-8 text-sm text-slate-600 sm:px-10 lg:px-16">
        <p className="font-semibold text-slate-950">
          Somali Student Diplomacy Union
        </p>
        <p className="max-w-3xl leading-6">
          SSDU connects students with diplomacy, leadership, public service, and
          civic engagement opportunities through programs, publications, and
          organizational initiatives.
        </p>
      </div>
    </footer>
  );
}

export function PublicPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="text-lg leading-8 text-slate-700">{description}</p>
    </div>
  );
}
