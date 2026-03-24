"use client";

import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      expand
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:border-emerald-200/90 group-[.toaster]:bg-white group-[.toaster]:text-emerald-950 group-[.toaster]:shadow-lg",
          title: "group-[.toast]:font-semibold group-[.toast]:text-emerald-950",
          description: "group-[.toast]:text-emerald-900/80",
          success: "group-[.toast]:border-emerald-300",
          error: "group-[.toast]:border-red-200",
          warning: "group-[.toast]:border-amber-200",
          info: "group-[.toast]:border-sky-200",
        },
      }}
      {...props}
    />
  );
}
