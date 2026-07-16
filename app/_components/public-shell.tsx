import { HomeHeader } from "@/app/_components/home-header";
import { SiteFooter } from "@/app/_components/site-footer";
import { publicNavigation } from "@/lib/site/official-content";

export function PublicHeader({ activeHref }: { activeHref?: string }) {
  return <HomeHeader items={publicNavigation} activeHref={activeHref} overlay={false} />;
}

export function PublicFooter() {
  return <SiteFooter />;
}

export function PublicPageShell({ activeHref, children }: { activeHref?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh min-w-0 flex-col bg-[#f5f8fb] text-[#071f3c]">
      <PublicHeader activeHref={activeHref} />
      <div className="flex-1 pt-20 sm:pt-[90px]">{children}</div>
      <PublicFooter />
    </div>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#0874b9]">{eyebrow}</p>
      <h1 className="mt-5 font-serif text-[42px] font-bold leading-[1.08] text-[#071f3c] sm:text-[56px] lg:text-[68px]">{title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-[#52657c] sm:text-xl sm:leading-9">{description}</p>
    </div>
  );
}
