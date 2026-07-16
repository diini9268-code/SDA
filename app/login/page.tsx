import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/app/_components/home-header";
import { MemberLoginForm } from "@/app/login/member-login-form";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "Member Login",
  description: "Member access for the SDA community.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f3f7fa] px-5 py-10 text-[#071f3c] sm:px-8 sm:py-14">
      <div className="w-full max-w-[610px] text-center">
        <Link href="/" aria-label="SDA home" className="inline-flex rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0874b9]"><BrandLogo compactOnMobile /></Link>
        <h1 className="mt-8 font-serif text-[40px] font-bold leading-tight sm:text-[46px]">Member Login</h1>
        <p className="mt-2 text-[17px] leading-7 text-[#52657c]">Welcome to the SDA member access page</p>

        <section aria-label="Member sign in" className="mt-9 rounded-[20px] border border-[#dce3e9] bg-white p-6 text-left shadow-[0_16px_45px_rgba(10,41,77,0.10)] sm:p-10">
          <MemberLoginForm />
          <div className="mt-8 border-t border-[#e1e7ec] pt-7 text-center text-[15px] text-[#52657c]">
            Not a member yet?{" "}<Link href="/membership" className="font-semibold text-[#0874b9] transition-colors hover:text-[#075d92]">Apply for membership</Link>
          </div>
        </section>

        <Link href="/admin/login" className="mt-7 inline-flex items-center gap-2 rounded-md px-3 py-2 text-[14px] font-medium text-[#52657c] transition-colors hover:text-[#0874b9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0874b9]">
          <ShieldCheck className="size-4" aria-hidden="true" />Admin login
        </Link>
      </div>
    </main>
  );
}
