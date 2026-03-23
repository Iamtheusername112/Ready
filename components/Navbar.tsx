"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/advisor-portal", label: "Advisor Portal" },
  { href: "/sign-in", label: "Sign In" },
] as const;

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full bg-rr-teal text-[17px] font-bold leading-none text-white"
        aria-hidden
      >
        R
      </span>
      <span className="text-[19px] font-semibold tracking-tight">
        <span className="text-rr-navy">Retire</span>
        <span className="text-rr-teal">Ready</span>
      </span>
    </Link>
  );
}

function NavLinks({ className }: { className?: string }) {
  return (
    <nav className={cn("flex flex-col gap-1 md:flex-row md:items-center md:gap-9", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-[15px] font-medium text-rr-navy py-2 md:py-0 hover:text-rr-teal transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function Navbar() {
  return (
    <header className="w-full border-b border-black/[0.04] bg-transparent">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-3 lg:px-8">
        <div className="flex min-w-0 justify-start">
          <Logo />
        </div>

        <NavLinks className="hidden justify-center md:flex" />

        <div className="flex min-w-0 items-center justify-end gap-3">
          <Link
            href="/sign-up"
            className="hidden h-11 items-center justify-center rounded-full bg-rr-teal px-7 text-[15px] font-semibold text-white shadow-none transition-colors hover:bg-rr-teal/90 md:inline-flex"
          >
            Get Started
          </Link>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-rr-navy"
                  aria-label="Open menu"
                >
                  <Menu className="size-6" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[min(100%,20rem)] border-l border-border p-0">
              <SheetHeader className="border-b border-border px-4 py-3 text-left">
                <SheetTitle className="text-rr-navy">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4 py-4">
                <NavLinks />
                <Link
                  href="/sign-up"
                  className="mt-2 flex h-11 w-full items-center justify-center rounded-full bg-rr-teal text-[15px] font-semibold text-white transition-colors hover:bg-rr-teal/90"
                >
                  Get Started
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
