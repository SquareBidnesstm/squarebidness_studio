import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "../../../../../lib/supabase/server";
import { checkRateLimit } from "../../../../../lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Rate limit: 5 view increments per IP per slug per 15 min window
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { limited } = await checkRateLimit(`view:${ip}:${slug}`, 5);
    if (limited) return NextResponse.json({ ok: false, reason: "rate_limited" });

    // Use atomic RPC to avoid race conditions
    await supabaseServer.rpc("increment_video_views", { video_slug: slug });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
