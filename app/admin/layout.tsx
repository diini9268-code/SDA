import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "SDA Admin",
    template: "%s | SDA Admin",
  },
  description: "Somali Diplomacy Association content management system.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
