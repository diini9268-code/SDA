import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/app/_components/home-header";
import { AdminLoginForm } from "@/app/admin/login/login-form";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "Admin Login",
  description: "Sign in to the protected SSDU administration area.",
  path: "/admin/login",
});

function safeNextPath(value: string | string[] | undefined): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.startsWith("/admin") &&
    candidate !== "/admin/login" &&
    !candidate.startsWith("//")
    ? candidate
    : "/admin";
}

type AdminLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  if (await requireAdminSession()) redirect("/admin");

  const params = (await searchParams) ?? {};
  const nextPath = safeNextPath(params.next);

  return (
    <main className="grid min-h-svh grid-cols-[minmax(0,1fr)] bg-[#0a294d] text-white lg:grid-cols-2">
      <section className="relative hidden min-h-svh overflow-hidden lg:block" aria-label="SSDU administrator portal">
        <Image src="/home/diplomatic-chamber.png" alt="International diplomatic chamber" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-[#061d38]/70" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-10 xl:p-16">
          <Link href="/" aria-label="SSDU home" className="inline-flex rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27b3f4]">
            <BrandLogo compactOnMobile inverse />
          </Link>
          <h2 className="mt-10 font-serif text-[42px] font-bold leading-tight xl:text-[48px]">Administrator Portal</h2>
          <p className="mt-4 max-w-md text-[18px] leading-8 text-white/70">Secure access to the SSDU content management and administration system.</p>
        </div>
      </section>

      <section aria-label="Administrator sign in" className="flex min-h-svh min-w-0 items-center justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="min-w-0 w-full max-w-[520px]">
          <Link href="/" aria-label="SSDU home" className="mb-10 inline-flex rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27b3f4] lg:hidden"><BrandLogo inverse /></Link>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#27b3f4]"><ShieldCheck className="size-5" aria-hidden="true" />Secure admin access</div>
          <h1 className="mt-4 font-serif text-[42px] font-bold leading-tight sm:text-[48px]">Admin Login</h1>
          <p className="mt-3 text-[16px] leading-7 text-white/65">Sign in with an authorized SSDU administrator account.</p>
          <div className="mt-10"><AdminLoginForm nextPath={nextPath} /></div>
          <div className="mt-9 border-t border-white/10 pt-7 text-center text-[14px] leading-6 text-white/45">
            Restricted access. Authorized personnel only.<br />For access issues, use the public{" "}
            <Link href="/contact" className="font-semibold text-[#27b3f4] transition-colors hover:text-white">contact form</Link>.
          </div>
        </div>
      </section>
    </main>
  );
}
