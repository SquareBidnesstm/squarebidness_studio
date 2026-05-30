import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";
import { slugify } from "../../../../lib/helpers";
import { getThumbnailUrl } from "../../../../lib/cloudflare";

// GET — list all videos (admin view, all statuses)
export async function GET() {
  const { data, error } = await supabaseServer
    .from("videos")
    .select("id, slug, title, category, status, is_featured, view_count, duration_seconds, cf_video_id, cf_thumbnail_url, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ videos: data ?? [] });
}

// POST — create new video record after Cloudflare upload
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, category, cf_video_id, duration_seconds, tags, custom_slug, access } = body;

  if (!title || !cf_video_id) {
    return NextResponse.json({ error: "title and cf_video_id required" }, { status: 400 });
  }

  const slug = custom_slug ? slugify(custom_slug) : slugify(title) + "-" + Date.now().toString(36);
  const cf_thumbnail_url = getThumbnailUrl(cf_video_id);

  const { data, error } = await supabaseServer
    .from("videos")
    .insert({
      slug, title, description: description || null,
      category: category || "shorts",
      cf_video_id, cf_thumbnail_url,
      duration_seconds: duration_seconds || null,
      tags: tags || [],
      access: access || "free",
      status: "draft",
    })
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
}
