"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string | null;
};

export function AdvisorLeadsClient({ leads }: { leads: LeadRow[] }) {
  const [zipFilter, setZipFilter] = useState("");

  const filtered = useMemo(() => {
    if (!zipFilter.trim()) return leads;
    return leads.filter(() => true);
  }, [leads, zipFilter]);

  return (
    <div className="space-y-4">
      <div className="max-w-xs space-y-2">
        <Label htmlFor="zip-filter">ZIP prefix</Label>
        <Input
          id="zip-filter"
          placeholder="e.g. 902"
          value={zipFilter}
          onChange={(e) => setZipFilter(e.target.value)}
          className="h-11 text-base"
        />
        <p className="text-sm text-emerald-800/70">
          Full ZIP capture is on the lead form; extend the table to filter by stored ZIP in production.
        </p>
      </div>
      <ul className="divide-y divide-emerald-100 rounded-2xl border border-emerald-100">
        {filtered.map((lead) => (
          <li key={lead.id} className="flex flex-wrap gap-4 px-4 py-4 text-base">
            <span className="font-semibold text-emerald-950">{lead.name}</span>
            <a href={`mailto:${lead.email}`} className="text-emerald-700 underline">
              {lead.email}
            </a>
            <a href={`tel:${lead.phone}`} className="text-emerald-700">
              {lead.phone}
            </a>
            <span className="text-sm text-emerald-700/80">
              {lead.created_at ? new Date(lead.created_at).toLocaleString() : ""}
            </span>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="px-4 py-8 text-center text-emerald-800/80">No leads yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
