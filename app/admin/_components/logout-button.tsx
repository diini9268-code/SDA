"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className={compact
        ? "flex size-11 items-center justify-center rounded-md border border-[#d5dee6] text-[#52657c] transition-colors hover:border-[#1f78b4] hover:text-[#1f78b4] disabled:cursor-wait disabled:opacity-50"
        : "flex min-h-11 w-full items-center gap-3 rounded-md px-4 text-left text-[15px] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-50"}
      aria-label={compact ? (pending ? "Signing out" : "Logout") : undefined}
    >
      <LogOut className="size-5" aria-hidden="true" />
      {compact ? null : pending ? "Signing out..." : "Logout"}
    </button>
  );
}
