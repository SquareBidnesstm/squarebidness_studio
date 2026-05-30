// src/app/api/admin/creators/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";
import { slugify } from "../../../../lib/helpers";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("creators")
    .select("*")
    .order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ creators: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, bio, location, photo_url, instagram, website, custom_slug } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = custom_slug?.trim() ? slugify(custom_slug) : slugify(name) + "-" + Date.now().toString(36);

  const { data, error } = await supabaseServer
    .from("creators")
    .insert({
      slug,
      name: name.trim(),
      bio: bio?.trim() || null,
      location: location?.trim() || null,
      photo_url: photo_url?.trim() || null,
      instagram: instagram?.trim().replace(/^@/, "") || null,
      website: website?.trim() || null,
    })
    .select("id, slug, name")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, creator: data });
}
