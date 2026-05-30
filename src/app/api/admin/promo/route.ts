// src/app/api/admin/promo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || "new";

  const query = supabaseServer
    .from("promo_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (status !== "all") query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ inquiries: data ?? [] });
}
