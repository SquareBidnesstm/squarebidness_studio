import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const q = searchParams.get("q");
  const limit = Math.min(Number(searchParams.get("limit") ?? 24), 48);

  let query = supabaseServer
    .from("videos")
    .select("id, slug, title, cf_video_id, cf_thumbnail_url, duration_seconds, category, view_count, is_featured, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cat && cat !== "all") query = query.eq("category", cat);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ videos: data ?? [] });
}
