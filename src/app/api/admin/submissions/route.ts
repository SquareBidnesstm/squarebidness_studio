// src/app/api/admin/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || "pending";

  const query = supabaseServer
    .from("music_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (status !== "all") query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ submissions: data ?? [] });
}
