"use client";

import Image from "next/image";
import Link from "next/link";

export type AdRecord = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  url: string;
};

export function AdSlot({
  type,
  ads,
}: {
  type: "sidebar" | "inline" | "footer";
  ads: AdRecord[];
}) {
  const ad = ads[0];
  if (!ad) {
    return null;
  }

  const layout =
    type === "sidebar"
      ? "flex flex-col gap-3 p-4"
      : type === "footer"
        ? "flex flex-wrap items-center gap-4 p-4"
        : "flex flex-col gap-3 p-5 sm:flex-row sm:items-center";

  return (
    <aside
      className={`overflow-hidden rounded-2xl border border-emerald-100 bg-white/90 shadow-sm ${layout}`}
      data-ad-slot={type}
    >
      {ad.image ? (
        <Link href={ad.url} target="_blank" rel="noopener noreferrer" className="relative block shrink-0">
          <Image
            src={ad.image}
            alt=""
            width={type === "sidebar" ? 280 : 320}
            height={type === "footer" ? 72 : 140}
            className={type === "footer" ? "h-16 w-auto object-contain" : "h-28 w-full rounded-lg object-cover sm:h-24 sm:w-40"}
          />
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Sponsored</p>
        <h3 className="text-lg font-semibold text-emerald-950">{ad.title}</h3>
        {ad.description ? (
          <p className="mt-1 text-sm leading-relaxed text-emerald-900/80">{ad.description}</p>
        ) : null}
        <Link
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-emerald-700 underline-offset-2 hover:underline"
        >
          Learn more
        </Link>
      </div>
    </aside>
  );
}
