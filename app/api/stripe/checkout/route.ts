import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const body = await req.json().catch(() => ({}));
  const requested =
    typeof body?.priceId === "string" && body.priceId.startsWith("price_") ? body.priceId : undefined;
  const priceId =
    requested ??
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ??
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

  if (!secret || !priceId) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secret);
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?stripe=success`,
    cancel_url: `${appUrl}/dashboard?stripe=cancel`,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "No checkout URL" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
