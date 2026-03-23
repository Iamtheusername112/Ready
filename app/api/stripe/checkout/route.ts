import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
