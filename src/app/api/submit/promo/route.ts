// src/app/api/submit/promo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business_name, contact_name, email, phone, business_type, location, what_to_promote, has_footage } = body;

    if (!business_name?.trim() || !contact_name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Business name, contact name, and email are required." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const { error } = await supabaseServer.from("promo_inquiries").insert({
      business_name:   String(business_name).trim(),
      contact_name:    String(contact_name).trim(),
      email:           String(email).trim().toLowerCase(),
      phone:           phone?.trim()            || null,
      business_type:   business_type?.trim()    || null,
      location:        location?.trim()         || null,
      what_to_promote: what_to_promote?.trim()  || null,
      has_footage:     has_footage === true || has_footage === "true",
      status:          "new",
    });

    if (error) {
      console.error("[submit/promo]", error);
      return NextResponse.json({ error: "Could not save inquiry. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
