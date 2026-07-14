"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
};

export function SubmitButton({
  children,
  pendingLabel = "Saving...",
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

type DeleteButtonProps = {
  label?: string;
  pendingLabel?: string;
  confirmation: string;
};

export function DeleteButton({
  label = "Delete",
  pendingLabel = "Deleting...",
  confirmation,
}: DeleteButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmation)) {
          event.preventDefault();
        }
      }}
      className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function IconDeleteButton({ confirmation }: { confirmation: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmation)) {
          event.preventDefault();
        }
      }}
      className="flex size-10 items-center justify-center rounded-md text-[#62758d] transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f78b4] disabled:cursor-wait disabled:opacity-40"
      aria-label={pending ? "Deleting leadership profile" : "Delete leadership profile"}
      title="Delete profile"
    >
      <Trash2 className="size-[18px]" aria-hidden="true" />
    </button>
  );
}
