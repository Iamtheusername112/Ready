"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/ai-assistant", label: "AI Assistant" },
] as const;

export function AppHeader({ premium }: { premium: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-200/60 bg-emerald-50/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-emerald-950">
          RetireReady
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-[15px] font-medium text-emerald-900">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline">
              {l.label}
            </Link>
          ))}
          {premium ? (
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Premium</Badge>
          ) : null}
        </nav>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
