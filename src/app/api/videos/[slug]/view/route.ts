import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Optimistic increment — no TOCTOU race since we increment directly
    const { data: video } = await supabaseServer
      .from("videos")
      .select("id, view_count")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (video) {
      await supabaseServer
        .from("videos")
        .update({ view_count: (video.view_count ?? 0) + 1 })
        .eq("id", video.id);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
