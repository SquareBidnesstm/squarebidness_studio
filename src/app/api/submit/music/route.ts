// src/app/api/submit/music/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { artist_name, contact_name, email, phone, genre, location, bio, music_link, instagram, website } = body;

    if (!artist_name?.trim() || !contact_name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Artist name, contact name, and email are required." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const { error } = await supabaseServer.from("music_submissions").insert({
      artist_name:  String(artist_name).trim(),
      contact_name: String(contact_name).trim(),
      email:        String(email).trim().toLowerCase(),
      phone:        phone?.trim()       || null,
      genre:        genre?.trim()       || null,
      location:     location?.trim()    || null,
      bio:          bio?.trim()         || null,
      music_link:   music_link?.trim()  || null,
      instagram:    instagram?.trim().replace(/^@/, "") || null,
      website:      website?.trim()     || null,
      status:       "pending",
    });

    if (error) {
      console.error("[submit/music]", error);
      return NextResponse.json({ error: "Could not save submission. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Submission received." });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
