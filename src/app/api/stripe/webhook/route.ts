// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "../../../../lib/supabase/server";

export const config = { api: { bodyParser: false } };

function clean(s: string | undefined) {
  return String(s || "").replace(/(^"|"$)/g, "").trim();
}

function normalizeStatus(s: string) {
  const v = String(s || "").toLowerCase();
  if (v === "active" || v === "trialing") return "ACTIVE";
  if (v === "past_due")            return "PAST_DUE";
  if (v === "canceled")            return "CANCELED";
  if (v === "unpaid")              return "UNPAID";
  if (v === "incomplete")          return "INCOMPLETE";
  if (v === "incomplete_expired")  return "INCOMPLETE_EXPIRED";
  if (v === "paused")              return "PAUSED";
  return v.toUpperCase();
}

export async function POST(req: NextRequest) {
  const stripeKey = clean(process.env.STRIPE_SECRET_KEY);
  const whsec    = clean(process.env.STRIPE_WEBHOOK_SECRET);

  if (!stripeKey) return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  if (!whsec)     return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });

  const stripe = new Stripe(stripeKey);
  const sig    = req.headers.get("stripe-signature") || "";
  const buf    = await req.arrayBuffer();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, whsec);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const obj      = event.data.object as any;
  const livemode = !!event.livemode;

  try {
    // ── Provision on successful checkout ──────────────────────────────────
    if (event.type === "checkout.session.completed") {
      const session        = obj as Stripe.Checkout.Session;
      const email          = String(session.customer_details?.email || "").trim().toLowerCase();
      const subscriptionId = String(session.subscription || "").trim();
      const customerId     = String(session.customer || "").trim();

      if (!email || !subscriptionId) {
        return NextResponse.json({ received: true, skipped: true });
      }

      await supabaseServer.from("subscribers").upsert({
        email,
        subscription_id: subscriptionId,
        customer_id:     customerId,
        status:          "ACTIVE",
        tier:            "premium",
        livemode,
        updated_at:      new Date().toISOString(),
      }, { onConflict: "subscription_id" });

      // Welcome email via Resend (optional — fires if RESEND_API_KEY is set)
      const resendKey  = clean(process.env.RESEND_API_KEY);
      const resendFrom = clean(process.env.RESEND_FROM);
      if (resendKey && resendFrom) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: resendFrom,
            to: email,
            subject: "SB Studio Premium — You're in.",
            html: `
              <div style="font-family:system-ui,sans-serif;color:#111;line-height:1.6">
                <h2 style="margin:0 0 12px">SB Studio Premium is active.</h2>
                <p>Your subscription is live. Head back to the network and watch anything marked Premium.</p>
                <div style="margin:20px 0">
                  <a href="https://studio.squarebidness.com"
                     style="background:#e50914;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:800;display:inline-block">
                    Open SB Studio
                  </a>
                </div>
                <p style="color:#666;font-size:13px">
                  To access premium content, click "I'm a subscriber" on any video and enter this email: <strong>${email}</strong>
                </p>
              </div>
            `,
          }),
        }).catch(() => {});
      }

      return NextResponse.json({ received: true, ok: true });
    }

    // ── Keep status current on updates ────────────────────────────────────
    if (event.type === "customer.subscription.updated") {
      const sub            = obj as Stripe.Subscription;
      const subscriptionId = String(sub.id).trim();
      const status         = normalizeStatus(sub.status);

      await supabaseServer
        .from("subscribers")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("subscription_id", subscriptionId);

      return NextResponse.json({ received: true, ok: true });
    }

    // ── Mark canceled ─────────────────────────────────────────────────────
    if (event.type === "customer.subscription.deleted") {
      const sub            = obj as Stripe.Subscription;
      const subscriptionId = String(sub.id).trim();

      await supabaseServer
        .from("subscribers")
        .update({ status: "CANCELED", updated_at: new Date().toISOString() })
        .eq("subscription_id", subscriptionId);

      return NextResponse.json({ received: true, ok: true });
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("[studio/webhook]", e?.message);
    return NextResponse.json({ received: true, ok: false, error: e?.message }, { status: 200 });
  }
}
