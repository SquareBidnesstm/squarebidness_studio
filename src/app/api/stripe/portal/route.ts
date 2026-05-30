// src/app/api/stripe/portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "../../../../lib/supabase/server";

function clean(s: string | undefined) {
  return String(s || "").replace(/(^"|"$)/g, "").trim();
}

export async function GET(req: NextRequest) {
  try {
    const key = clean(process.env.STRIPE_SECRET_KEY);
    if (!key) return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });

    const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    // Look up customer_id from Supabase
    const { data } = await supabaseServer
      .from("subscribers")
      .select("customer_id")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data?.customer_id) {
      return NextResponse.json({ error: "No subscription found for this email" }, { status: 404 });
    }

    const base   = clean(process.env.NEXT_PUBLIC_APP_URL) || "https://studio.squarebidness.com";
    const stripe = new Stripe(key);

    const session = await stripe.billingPortal.sessions.create({
      customer:   data.customer_id,
      return_url: base,
    });

    return NextResponse.redirect(session.url, 302);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Portal error" }, { status: 500 });
  }
}
