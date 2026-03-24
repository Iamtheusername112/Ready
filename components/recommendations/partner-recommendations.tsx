import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { isNonEmptyTargeting, type AffiliateOfferRow, type UserProfileRow } from "@/lib/catalog/targeting";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function profileSummary(profile: UserProfileRow | null): string {
  if (!profile) return "Curated tools and services — choose what fits your situation.";
  const bits: string[] = [];
  if (profile.age != null) bits.push(`age ${profile.age}`);
  if (profile.retirementage != null) bits.push(`target retirement ${profile.retirementage}`);
  if (profile.risktolerance) bits.push(`${profile.risktolerance} risk`);
  if (bits.length === 0) return "Curated tools and services — choose what fits your situation.";
  return `Using your profile (${bits.join(", ")}), we highlight partners that match your situation when possible.`;
}

export function PartnerRecommendations({
  offers,
  profile,
}: {
  offers: AffiliateOfferRow[];
  profile: UserProfileRow | null;
}) {
  const suggestedCount = offers.filter((o) => isNonEmptyTargeting(o.targetingjson)).length;

  const byCategory = offers.reduce<Record<string, AffiliateOfferRow[]>>((acc, o) => {
    const c = o.category?.trim() || "Other";
    acc[c] = acc[c] ?? [];
    acc[c].push(o);
    return acc;
  }, {});

  const categories = Object.keys(byCategory).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/40 px-6 py-8 shadow-sm sm:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-emerald-950">Partner recommendations</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-emerald-900/88">{profileSummary(profile)}</p>
        {suggestedCount > 0 ? (
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-800">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
            {suggestedCount} {suggestedCount === 1 ? "pick is" : "picks are"} tailored using your age, timing, and (when set) location or risk preferences.
          </p>
        ) : offers.length > 0 ? (
          <p className="mt-2 text-sm text-emerald-800/90">
            These listings are shown to everyone. Add <code className="rounded bg-white/70 px-1">targetingjson</code> on
            rows in Supabase to show &quot;Suggested for you&quot; badges when a user matches.
          </p>
        ) : null}
      </div>

      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category} className="scroll-mt-4">
            <h2 className="text-xl font-semibold text-emerald-950">{category}</h2>
            <p className="mt-1 text-sm text-emerald-800/85">Independent services — verify terms on their sites.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {byCategory[category]!.map((o) => {
                const suggested = isNonEmptyTargeting(o.targetingjson);
                return (
                  <Card
                    key={o.id}
                    className={`rounded-3xl border-emerald-100 transition-shadow ${
                      suggested ? "ring-2 ring-amber-200/80 shadow-md" : "shadow-sm"
                    }`}
                  >
                    <CardHeader className="flex flex-row items-start gap-3 pb-2">
                      {o.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- partner logos use arbitrary URLs
                        <img
                          src={o.logo}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-lg font-semibold text-emerald-800"
                          aria-hidden
                        >
                          {o.name.slice(0, 1)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-lg leading-snug">{o.name}</CardTitle>
                          {suggested ? (
                            <Badge className="border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-50">
                              Suggested for you
                            </Badge>
                          ) : null}
                        </div>
                        <CardDescription className="text-emerald-800/80">Opens in a new tab</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {o.description ? (
                        <p className="text-base leading-relaxed text-emerald-900/90">{o.description}</p>
                      ) : null}
                      <Link
                        href={o.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-emerald-700 underline-offset-2 hover:underline"
                      >
                        Visit partner
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}

        {offers.length === 0 ? (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 px-6 py-12 text-center">
            <p className="text-lg font-medium text-emerald-950">Partners coming soon</p>
            <p className="mt-2 mx-auto max-w-md text-base text-emerald-900/80">
              Add rows to the <code className="rounded bg-white/80 px-1.5 py-0.5 text-sm">affiliateoffers</code> table in
              Supabase, or run <code className="rounded bg-white/80 px-1.5 py-0.5 text-sm">supabase/seed-partner-offers.sql</code>{" "}
              for sample picks.
            </p>
          </div>
        ) : null}
      </div>

      {offers.length > 0 ? (
        <footer className="rounded-2xl border border-emerald-100/80 bg-white/70 px-5 py-4 text-sm leading-relaxed text-emerald-900/85">
          <strong className="font-semibold text-emerald-950">Disclosure:</strong> Partner links may be affiliate or
          referral links. RetireReady does not endorse any partner; offers are for exploration only. Calculators and
          projections in the app are separate from these third-party sites.
        </footer>
      ) : null}
    </div>
  );
}
