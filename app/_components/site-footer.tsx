import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { BrandLogo } from "@/app/_components/home-header";
import {
  officialMission,
  organizationLocation,
  organizationName,
  organizationShortName,
  publicNavigation,
} from "@/lib/site/official-content";

export function SiteFooter() {
  return (
    <footer className="bg-[#071f3c] text-white">
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:px-10 lg:grid-cols-[1.15fr_0.7fr_1fr] lg:py-20 xl:px-16">
        <div>
          <BrandLogo inverse />
          <p className="mt-7 max-w-xl text-[15px] leading-7 text-white/68">{officialMission}</p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#28b1f2]">Quick Links</h2>
          <nav className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3 text-[15px] text-white/72" aria-label="Footer navigation">
            {publicNavigation.map((item) => <Link key={item.href} href={item.href} className="transition-colors hover:text-white">{item.label}</Link>)}
          </nav>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#28b1f2]">Contact</h2>
          <div className="mt-6 grid gap-4 text-[15px] text-white/72">
            <p className="flex items-center gap-3"><MapPin className="size-4 text-[#28b1f2]" aria-hidden="true" />{organizationLocation}</p>
            <Link href="/contact" className="flex items-center gap-3 transition-colors hover:text-white"><Mail className="size-4 text-[#28b1f2]" aria-hidden="true" />Send an official inquiry</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 border-t border-white/10 px-5 py-7 text-sm text-white/48 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 xl:px-16">
        <p>&copy; 2026 {organizationName}. All rights reserved.</p>
        <p>{organizationShortName} · Mogadishu, Somalia</p>
      </div>
    </footer>
  );
}
