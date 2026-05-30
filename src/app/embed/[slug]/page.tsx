// src/app/embed/[slug]/page.tsx — minimal embed player page
import { notFound } from "next/navigation";
import { supabaseServer } from "../../../lib/supabase/server";
import { getEmbedUrl } from "../../../lib/cloudflare";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: v } = await supabaseServer
    .from("videos").select("title").eq("slug", slug).maybeSingle();
  return { title: v ? `${v.title} — SB Studio` : "SB Studio" };
}

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: video } = await supabaseServer
    .from("videos")
    .select("cf_video_id, title, access")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!video) notFound();

  // Premium videos can't be embedded
  if (video.access && video.access !== "free") {
    return (
      <html>
        <body style={{ margin: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <div style={{ textAlign: "center", color: "#fff", fontFamily: "system-ui, sans-serif", padding: 20 }}>
            <p style={{ color: "#e50914", fontWeight: 800, marginBottom: 8 }}>Premium Content</p>
            <p style={{ color: "#888", fontSize: "0.85rem" }}>This video requires an SB Studio Premium subscription.</p>
            <a href="https://studio.squarebidness.com" style={{ color: "#e50914", fontSize: "0.85rem" }}>
              Subscribe at studio.squarebidness.com
            </a>
          </div>
        </body>
      </html>
    );
  }

  const embedUrl = getEmbedUrl(video.cf_video_id);

  return (
    <html>
      <body style={{ margin: 0, padding: 0, background: "#000", overflow: "hidden" }}>
        <iframe
          src={`${embedUrl}?autoplay=false&controls=true&muted=false`}
          style={{ width: "100vw", height: "100vh", border: "none", display: "block" }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        {/* SB Studio watermark */}
        <a
          href="https://studio.squarebidness.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed", bottom: 10, right: 12,
            background: "rgba(0,0,0,.7)", color: "#e50914",
            fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.08em",
            padding: "4px 8px", borderRadius: 4, textDecoration: "none",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          SB STUDIO
        </a>
      </body>
    </html>
  );
}
