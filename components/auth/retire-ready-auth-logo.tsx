import Link from "next/link";

export function RetireReadyAuthLogo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#149191]/40 focus-visible:ring-offset-2 rounded-lg">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#149191] text-lg font-bold text-white shadow-md"
        aria-hidden
      >
        R
      </span>
      <span className="text-xl font-semibold tracking-tight text-slate-800">RetireReady</span>
    </Link>
  );
}
