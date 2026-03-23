import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { LineChart, PiggyBank, UserRound } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <section
          id="features"
          className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="sr-only">
            Features
          </h2>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-8">
            <FeatureCard
              icon={LineChart}
              title="Will My Money Last?"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
            />
            <FeatureCard
              icon={UserRound}
              title="Social Security Optimizer"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
            />
            <FeatureCard
              icon={PiggyBank}
              title="Budget Planner"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
            />
          </div>
        </section>
        <div className="flex w-full flex-col" aria-hidden>
          <div id="pricing" className="h-px w-full scroll-mt-24" />
          <div id="advisor" className="h-px w-full scroll-mt-24" />
          <div id="signin" className="h-px w-full scroll-mt-24" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
