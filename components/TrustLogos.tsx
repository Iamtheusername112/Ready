import { Building2, Landmark, Shield } from "lucide-react";

const items = [
  { Icon: Building2, label: "Trusted institution" },
  { Icon: Landmark, label: "Banking partner" },
  { Icon: Shield, label: "Secure platform" },
] as const;

export function TrustLogos() {
  return (
    <div
      className="inline-flex items-center gap-6 rounded-full border border-black/[0.06] bg-white px-6 py-3 shadow-sm sm:gap-8 sm:px-8"
      role="img"
      aria-label="Trusted by leading institutions"
    >
      {items.map(({ Icon, label }) => (
        <Icon
          key={label}
          className="size-7 shrink-0 text-neutral-400 sm:size-8"
          strokeWidth={1.35}
          aria-hidden
        />
      ))}
    </div>
  );
}
