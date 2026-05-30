// src/app/api/admin/creators/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../../lib/supabase/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, bio, location, photo_url, instagram, website, is_active } = body;

  const updates: Record<string, any> = {};
  if (name     !== undefined) updates.name       = String(name).trim();
  if (bio      !== undefined) updates.bio        = bio?.trim() || null;
  if (location !== undefined) updates.location   = location?.trim() || null;
  if (photo_url!== undefined) updates.photo_url  = photo_url?.trim() || null;
  if (instagram!== undefined) updates.instagram  = instagram?.trim().replace(/^@/, "") || null;
  if (website  !== undefined) updates.website    = website?.trim() || null;
  if (is_active!== undefined) updates.is_active  = Boolean(is_active);

  const { error } = await supabaseServer
    .from("creators").update(updates).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Unlink videos first (creator_id → null via ON DELETE SET NULL, but let's be explicit)
  await supabaseServer.from("videos").update({ creator_id: null }).eq("creator_id", id);

  const { error } = await supabaseServer.from("creators").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
