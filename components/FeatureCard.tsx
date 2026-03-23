import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col items-center rounded-2xl border border-black/[0.05] bg-white px-7 py-9 text-center shadow-[0_14px_40px_-18px_rgba(17,24,39,0.12)] sm:px-8 sm:py-10",
        className
      )}
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center text-rr-teal">
        <Icon className="size-14" strokeWidth={1.25} aria-hidden />
      </div>
      <h3 className="mb-3 text-lg font-bold leading-snug tracking-tight text-rr-navy sm:text-xl">
        {title}
      </h3>
      <p className="max-w-[17rem] text-[15px] leading-relaxed text-rr-muted">
        {description}
      </p>
    </article>
  );
}
