import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TrustLogos } from "@/components/TrustLogos";

export function Hero() {
  return (
    <section
      id="get-started"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 lg:pb-24 lg:pt-14"
      aria-labelledby="hero-heading"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
        <div className="flex max-w-xl flex-col gap-7">
          <h1
            id="hero-heading"
            className="text-[2.35rem] font-bold leading-[1.12] tracking-[-0.02em] text-rr-navy sm:text-[2.65rem] lg:text-[2.85rem]"
          >
            Retirement clarity
            <br />
            starts here
          </h1>
          <p className="max-w-[26rem] text-[17px] leading-[1.65] text-rr-muted sm:text-lg">
            Forecast your money, plan smarter, and feel confident about the future.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button
              nativeButton={false}
              className="h-12 w-full rounded-full bg-rr-teal px-8 text-[15px] font-semibold text-white shadow-sm hover:bg-rr-teal/90 sm:w-auto"
              render={<Link href="/sign-up" />}
            >
              Start Free
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              className="h-12 w-full rounded-full border-2 border-rr-teal bg-white px-8 text-[15px] font-semibold text-rr-teal shadow-none hover:bg-rr-teal/[0.06] sm:w-auto"
              render={<Link href="#features" />}
            >
              See How It Works
            </Button>
          </div>
        </div>

        <div className="relative w-full">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[40px] shadow-[0_18px_45px_-12px_rgba(17,24,39,0.18)]">
            <Image
              src="/hero.png"
              alt="Couple reviewing their retirement plan together on a laptop"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[center_22%]"
            />
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-5 sm:left-5">
            <TrustLogos />
          </div>
        </div>
      </div>
    </section>
  );
}
