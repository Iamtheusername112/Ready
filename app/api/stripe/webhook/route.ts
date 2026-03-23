import { createServiceClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!secret || !stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    const subId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

    if (userId && customerId) {
      await supabase.from("userprofile").upsert(
        { id: userId, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
      await supabase.from("usersubscription").upsert(
        {
          userid: userId,
          status: "active",
          stripecustomerid: customerId,
          stripesubid: subId ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "userid" }
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = sub.metadata?.userId;
    if (userId) {
      await supabase
        .from("usersubscription")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("userid", userId);
    }
  }

  return NextResponse.json({ received: true });
}
