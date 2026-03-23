"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({
  priceId,
  children,
  variant = "default",
  className,
}: {
  priceId: string;
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={loading || !priceId}
      onClick={async () => {
        if (!priceId) return;
        setLoading(true);
        try {
          const res = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priceId }),
          });
          const data = await res.json().catch(() => ({}));
          if (typeof data?.url === "string") {
            window.location.href = data.url;
          }
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Opening checkout…" : children}
    </Button>
  );
}
