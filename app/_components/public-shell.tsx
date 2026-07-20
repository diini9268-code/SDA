import Link from "next/link";
import { BrandLogo, HomeHeader } from "@/app/_components/home-header";
import { getSiteCmsContent } from "@/lib/site/cms-content";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Research" },
  { href: "/membership", label: "Membership" },
];

export function PublicHeader({ activeHref }: { activeHref?: string }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b-2 border-[#e9c176] bg-[#f8f9fa]/95 shadow-sm backdrop-blur dark:bg-[#f8f9fa]/95">
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-6 px-6 md:px-10 xl:px-12">
        <Link
          href="/"
          className="font-serif text-xl font-bold text-[#000613]"
          aria-label="SDA home"
        >
          SDA
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
          Join SDA
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
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-6 py-12 md:grid-cols-4 md:px-10 xl:px-12">
        <div className="space-y-6">
          <div className="font-serif text-xl font-bold">SDA</div>
          <p className="text-sm leading-6 text-[#e1e3e4]/80">
            Empowering Somali youth through diplomatic education, leadership
            development, and international engagement.
          </p>
          <div className="flex gap-4 text-[#e1e3e4]/80" aria-label="SDA principles">
            <span>Diplomacy</span>
            <span>Leadership</span>
            <span>Unity</span>
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
            <p>Use the public contact form for official inquiries.</p>
          </address>
        </div>

        <div>
          <h2 className="mb-6 font-serif text-xl font-bold">Mission Statement</h2>
          <p className="text-sm leading-6 text-[#e1e3e4]/80">
            To empower Somali youth through diplomatic education, leadership
            development, and international engagement.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] border-t border-white/10 px-6 py-6 md:px-10 xl:px-12">
        <p className="text-center text-sm text-[#e1e3e4]/60">
          &copy; 2026 Somali Diplomacy Association. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export async function PublicPageShell({
  activeHref,
  children,
}: {
  activeHref?: string;
  children: React.ReactNode;
}) {
  const cms = await getSiteCmsContent();
  const brand = {
    organizationName: cms.global.content.organizationName,
    motto: cms.global.content.motto,
    logoUrl: cms.global.media.hero?.url,
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <HomeHeader
        activeHref={activeHref}
        brand={brand}
        items={cms.navigation}
        overlay={false}
        secondaryItem={{ href: "/login", label: "Login" }}
        joinHref="/membership"
      />
      <div className="pt-20 sm:pt-[90px]">{children}</div>
      <footer className="mt-auto bg-[#0a294d] text-[#c3cfda]">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-14 md:grid-cols-3 md:px-10 xl:px-12">
          <div>
            <BrandLogo brand={brand} inverse />
            <p className="mt-6 max-w-sm text-sm leading-7">
              {cms.global.content.mission}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#28b1f2]">
              Quick links
            </h2>
            <ul className="mt-6 grid gap-3 text-sm">
              {cms.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#28b1f2]">
              Contact
            </h2>
            <p className="mt-6 text-sm leading-7">
              {cms.global.content.location}
            </p>
            <Link href="/contact" className="mt-4 inline-flex text-sm font-semibold text-white hover:text-[#28b1f2]">
              Contact SDA
            </Link>
          </div>
        </div>
      </footer>
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
