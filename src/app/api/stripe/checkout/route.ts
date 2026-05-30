// src/app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function clean(s: string | undefined) {
  return String(s || "").replace(/(^"|"$)/g, "").trim();
}

export async function GET(req: NextRequest) {
  try {
    const key = clean(process.env.STRIPE_SECRET_KEY);
    if (!key) return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });

    const price = clean(process.env.STRIPE_PRICE_PREMIUM);
    if (!price) return NextResponse.json({ error: "Missing STRIPE_PRICE_PREMIUM" }, { status: 500 });

    const base = clean(process.env.NEXT_PUBLIC_APP_URL) || "https://studio.squarebidness.com";
    const email = req.nextUrl.searchParams.get("email") || undefined;

    const stripe = new Stripe(key);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${base}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/`,
      allow_promotion_codes: true,
      customer_email: email || undefined,
      subscription_data: {
        metadata: { product: "sb-studio", tier: "premium" },
      },
      metadata: { product: "sb-studio", tier: "premium" },
    });

    return NextResponse.redirect(session.url!, 302);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Stripe error" }, { status: 500 });
  }
}
