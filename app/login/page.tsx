import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/app/_components/home-header";
import { AdminLoginForm } from "@/app/login/login-form";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata = createPageMetadata({
  title: "Admin Login",
  description: "Sign in to the protected SSDU administration area.",
  path: "/login",
});

function safeNextPath(value: string | string[] | undefined): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.startsWith("/admin") && !candidate.startsWith("//")
    ? candidate
    : "/admin";
}

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await requireAdminSession()) redirect("/admin");

  const params = (await searchParams) ?? {};
  const nextPath = safeNextPath(params.next);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f7fa] px-5 py-12 text-[#071f3c] sm:px-8">
      <div className="w-full max-w-[610px]">
        <div className="text-center">
          <Link href="/" aria-label="SSDU home" className="inline-flex rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0874b9]">
            <BrandLogo compactOnMobile />
          </Link>
          <p className="mt-9 text-sm font-bold uppercase tracking-[0.3em] text-[#0874b9]">Protected administration</p>
          <h1 className="mt-5 font-serif text-[42px] font-bold leading-tight sm:text-[50px]">Admin Login</h1>
          <p className="mx-auto mt-3 max-w-md text-[17px] leading-7 text-[#52657c]">
            Sign in with an authorized SSDU administrator account.
          </p>
        </div>
        <section aria-label="Administrator sign in" className="mt-10 rounded-[22px] border border-[#dce3e9] bg-white p-6 shadow-[0_18px_55px_rgba(10,41,77,0.10)] sm:p-10">
          <AdminLoginForm nextPath={nextPath} />
          <div className="mt-8 border-t border-[#e1e7ec] pt-7 text-center text-[15px] leading-7 text-[#52657c]">
            This login is restricted to administrators. Membership applications use the public{" "}
            <Link href="/membership" className="font-semibold text-[#0874b9] hover:text-[#075d92]">membership form</Link>.
          </div>
        </section>
      </div>
    </main>
  );
}
