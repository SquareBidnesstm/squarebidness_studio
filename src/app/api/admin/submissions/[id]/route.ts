// src/app/api/admin/submissions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../../lib/supabase/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, notes } = await req.json();

  const updates: Record<string, any> = {};
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes?.trim() || null;

  const { error } = await supabaseServer
    .from("music_submissions")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
