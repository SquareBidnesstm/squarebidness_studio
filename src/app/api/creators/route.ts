// src/app/api/creators/route.ts — public list
import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase/server";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("creators")
    .select("id, slug, name, bio, location, photo_url, instagram, website")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ creators: data ?? [] });
}
