"use client";

import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "Unable to sign in.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Unable to reach the authentication service. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid min-w-0 gap-6">
      <div className="grid gap-2.5">
        <label htmlFor="email" className="text-[16px] font-semibold text-white/85">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          maxLength={255}
          placeholder="admin@example.com"
          className="min-h-[62px] min-w-0 w-full rounded-[16px] border border-white/25 bg-white/10 px-5 text-[16px] text-white outline-none transition-[border-color,background-color,box-shadow] placeholder:text-white/35 hover:border-white/40 hover:bg-white/[0.13] focus:border-[#27b3f4] focus:bg-white/[0.14] focus:ring-4 focus:ring-[#27b3f4]/15"
        />
      </div>
      <div className="grid gap-2.5">
        <label htmlFor="password" className="text-[16px] font-semibold text-white/85">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="current-password"
            className="min-h-[62px] min-w-0 w-full rounded-[16px] border border-white/25 bg-white/10 px-5 pr-14 text-[16px] text-white outline-none transition-[border-color,background-color,box-shadow] hover:border-white/40 hover:bg-white/[0.13] focus:border-[#27b3f4] focus:bg-white/[0.14] focus:ring-4 focus:ring-[#27b3f4]/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-1 flex w-12 items-center justify-center rounded-xl text-white/45 transition-colors hover:text-[#27b3f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#27b3f4]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </div>
      {error ? (
        <p role="alert" className="rounded-[12px] border border-[#f1b8b8] bg-[#fff3f1] px-4 py-3 text-sm text-[#8b1a1a]">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[60px] items-center justify-center gap-3 rounded-[16px] bg-[#1f82c1] px-7 text-[18px] font-semibold text-white shadow-md transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-[#27a3e7] hover:shadow-lg disabled:cursor-wait disabled:bg-[#557c98] motion-reduce:transform-none"
      >
        {pending ? "Signing in..." : "Sign In to Dashboard"}
        <LogIn className="size-5" aria-hidden="true" />
      </button>
    </form>
  );
}
