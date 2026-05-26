import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../../lib/supabase/server";
import { deleteCloudflareVideo } from "../../../../../lib/cloudflare";

// PATCH — update video metadata/status/featured
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const allowed = ["title", "description", "category", "status", "is_featured", "tags", "duration_seconds", "cf_thumbnail_url", "slug"];
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  const { error } = await supabaseServer.from("videos").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE — remove from Supabase + Cloudflare
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: video } = await supabaseServer
    .from("videos").select("cf_video_id").eq("id", id).single();

  const { error } = await supabaseServer.from("videos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Delete from Cloudflare (best effort)
  if (video?.cf_video_id) {
    await deleteCloudflareVideo(video.cf_video_id).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
