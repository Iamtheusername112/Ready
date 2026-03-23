import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserProfile, getProfile } from "@/app/actions/profile";
import { fetchAffiliateOffers } from "@/app/actions/catalog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RecommendationsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  await ensureUserProfile();
  const profile = await getProfile(userId);
  if (!profile?.onboardingcomplete) {
    redirect("/onboarding");
  }

  const offers = await fetchAffiliateOffers();
  const byCategory = offers.reduce<Record<string, typeof offers>>((acc, o) => {
    const c = o.category ?? "Other";
    acc[c] = acc[c] ?? [];
    acc[c].push(o);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-emerald-950">Partner recommendations</h1>
      <p className="mt-2 text-lg text-emerald-900/85">
        Curated tools and services — always choose what fits your situation.
      </p>

      <div className="mt-10 space-y-10">
        {Object.entries(byCategory).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-xl font-semibold text-emerald-900">{category}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {items.map((o) => (
                <Card key={o.id} className="rounded-3xl border-emerald-100">
                  <CardHeader className="flex flex-row items-start gap-3">
                    {o.logo ? (
                      <Image
                        src={o.logo}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                    ) : null}
                    <div>
                      <CardTitle className="text-lg">{o.name}</CardTitle>
                      {o.payout_tier ? (
                        <CardDescription>Payout tier: {o.payout_tier}</CardDescription>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-emerald-900/90">{o.description}</p>
                    <Link
                      href={o.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-base font-semibold text-emerald-700 underline-offset-2 hover:underline"
                    >
                      Visit partner
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {offers.length === 0 ? (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 px-6 py-12 text-center">
            <p className="text-lg font-medium text-emerald-950">Partners coming soon</p>
            <p className="mt-2 max-w-md mx-auto text-base text-emerald-900/80">
              We&apos;re curating trusted tools and services for retirees. Check back later — new picks will appear here.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
