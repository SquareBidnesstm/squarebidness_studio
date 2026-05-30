// src/app/api/subscriber/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, active: false, error: "Missing/invalid email" }, { status: 400 });
  }

  try {
    const { data } = await supabaseServer
      .from("subscribers")
      .select("status, tier, subscription_id")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return NextResponse.json({ ok: true, active: false });

    const active = data.status === "ACTIVE";
    return NextResponse.json({ ok: true, active, status: data.status, tier: data.tier });
  } catch (e: any) {
    return NextResponse.json({ ok: false, active: false, error: e?.message }, { status: 500 });
  }
}
