"use client";

import { useState, useTransition } from "react";
import { submitAdvisorLead } from "@/app/actions/leads";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdvisorLeadModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await submitAdvisorLead({ name, email, phone, zip: zip || undefined });
      if (res.ok) {
        setDone(true);
        setTimeout(() => onOpenChange(false), 1200);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Connect with an advisor</DialogTitle>
          <DialogDescription className="text-base">
            A certified professional can review your plan at no cost. We&apos;ll share your contact
            details only with a matched advisor.
          </DialogDescription>
        </DialogHeader>
        {done ? (
          <p className="py-6 text-center text-lg font-medium text-emerald-800">Thank you! We&apos;ll be in touch.</p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="lead-name">Full name</Label>
              <Input
                id="lead-name"
                required
                className="h-12 text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                required
                className="h-12 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone">Phone</Label>
              <Input
                id="lead-phone"
                type="tel"
                required
                className="h-12 text-base"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-zip">ZIP code (optional)</Label>
              <Input
                id="lead-zip"
                className="h-12 text-base"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={pending} className="h-12 rounded-full text-base">
              {pending ? "Sending…" : "Yes, connect me"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
