"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function MemberLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Member authentication is not available yet. Your information was not submitted.");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="member-email" className="text-[16px] font-medium text-[#071f3c]">Email Address</label>
        <input id="member-email" name="email" type="email" required autoComplete="username" maxLength={255} placeholder="you@example.com" className="min-h-[58px] min-w-0 w-full rounded-[15px] border border-[#ccd8e3] bg-[#edf3f8] px-5 text-[16px] text-[#071f3c] outline-none transition-[border-color,background-color,box-shadow] placeholder:text-[#748398] hover:border-[#9db7ca] focus:border-[#1684c2] focus:bg-white focus:ring-4 focus:ring-[#1684c2]/15" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="member-password" className="text-[16px] font-medium text-[#071f3c]">Password</label>
        <div className="relative">
          <input id="member-password" name="password" type={showPassword ? "text" : "password"} required minLength={8} autoComplete="current-password" className="min-h-[58px] min-w-0 w-full rounded-[15px] border border-[#ccd8e3] bg-[#edf3f8] px-5 pr-14 text-[16px] text-[#071f3c] outline-none transition-[border-color,background-color,box-shadow] hover:border-[#9db7ca] focus:border-[#1684c2] focus:bg-white focus:ring-4 focus:ring-[#1684c2]/15" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-1 flex w-12 items-center justify-center rounded-xl text-[#60738a] transition-colors hover:text-[#0874b9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0874b9]">
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-[15px]">
        <label className="flex items-center gap-2.5 text-[#52657c]">
          <input type="checkbox" name="remember" className="size-4 accent-[#1778b8]" />
          Remember me
        </label>
        <Link href="/contact" className="font-medium text-[#0874b9] transition-colors hover:text-[#075d92]">Forgot password?</Link>
      </div>
      {message ? <p role="status" className="rounded-[12px] border border-[#b9d9ec] bg-[#eff8fd] px-4 py-3 text-sm leading-6 text-[#174c6c]">{message}</p> : null}
      <button type="submit" className="min-h-[58px] rounded-[16px] bg-[#1778b8] px-6 text-[18px] font-semibold text-white shadow-md transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-[#0a6098] hover:shadow-lg motion-reduce:transform-none">Sign In</button>
    </form>
  );
}
