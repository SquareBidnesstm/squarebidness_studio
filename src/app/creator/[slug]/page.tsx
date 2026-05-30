// src/app/creator/[slug]/page.tsx — individual creator profile
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "../../../lib/supabase/server";
import { formatDuration, formatViews } from "../../../lib/helpers";
import { getThumbnailUrl } from "../../../lib/cloudflare";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: c } = await supabaseServer
    .from("creators").select("name, bio, photo_url").eq("slug", slug).maybeSingle();
  if (!c) return { title: "Creator — SB Studio" };
  return {
    title: `${c.name} — SB Studio Network`,
    description: c.bio ?? `Watch ${c.name}'s content on SB Studio Network.`,
    openGraph: { title: `${c.name} — SB Studio`, description: c.bio ?? "", images: c.photo_url ? [c.photo_url] : [] },
  };
}

export default async function CreatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: creator } = await supabaseServer
    .from("creators")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!creator) notFound();

  const { data: videos } = await supabaseServer
    .from("videos")
    .select("id, slug, title, cf_video_id, cf_thumbnail_url, duration_seconds, view_count, category, access")
    .eq("creator_id", creator.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const vids = videos ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      {/* NAV */}
      <nav style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid #111", background: "#000", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/studio-192.png" alt="SB Studio" style={{ height: 40, width: 40, objectFit: "contain" }} />
          <span style={{ padding: "2px 7px", background: "#1a0000", border: "1px solid #7f0000", borderRadius: 999, fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e50914" }}>Network</span>
        </Link>
        <Link href="/creators" style={{ color: "#555", fontSize: "0.85rem" }}>← Creators</Link>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* CREATOR PROFILE */}
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: 48, flexWrap: "wrap" }}>
          {/* Photo */}
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#111", border: "2px solid #222", overflow: "hidden", flexShrink: 0 }}>
            {creator.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={creator.photo_url} alt={creator.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🎬</div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 950, letterSpacing: "-0.04em", marginBottom: 6 }}>
              {creator.name}
            </h1>

            {creator.location && (
              <p style={{ color: "#555", fontSize: "0.85rem", marginBottom: 10 }}>📍 {creator.location}</p>
            )}

            {creator.bio && (
              <p style={{ color: "#888", lineHeight: 1.65, fontSize: "0.95rem", maxWidth: 560, marginBottom: 14 }}>
                {creator.bio}
              </p>
            )}

            {/* Social links */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {creator.instagram && (
                <a href={`https://instagram.com/${creator.instagram}`} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#555", fontSize: "0.82rem", border: "1px solid #222", borderRadius: 999, padding: "5px 12px", textDecoration: "none" }}>
                  @{creator.instagram}
                </a>
              )}
              {creator.website && (
                <a href={creator.website} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#555", fontSize: "0.82rem", border: "1px solid #222", borderRadius: 999, padding: "5px 12px", textDecoration: "none" }}>
                  Website ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* VIDEO GRID */}
        <h2 style={{ fontSize: "0.75rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#444", marginBottom: 18 }}>
          {vids.length} Video{vids.length !== 1 ? "s" : ""} on the Network
        </h2>

        {!vids.length ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#333" }}>
            <p style={{ fontSize: "2rem", marginBottom: 10 }}>🎬</p>
            <p style={{ color: "#444" }}>No published videos yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
            {vids.map((v: any) => {
              const thumb = v.cf_thumbnail_url || getThumbnailUrl(v.cf_video_id);
              const dur = v.duration_seconds ? formatDuration(v.duration_seconds) : null;
              const views = v.view_count ? formatViews(v.view_count) : null;
              const isPremium = v.access && v.access !== "free";

              return (
                <Link key={v.id} href={`/watch/${v.slug}`} style={{ textDecoration: "none" }}>
                  <article style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 14, overflow: "hidden" }}>
                    <div style={{ position: "relative", paddingTop: "56.25%", background: "#0a0a0a" }}>
                      {v.cf_video_id && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                      {dur && (
                        <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,.8)", color: "#fff", fontSize: "0.72rem", fontWeight: 800, padding: "2px 6px", borderRadius: 4 }}>
                          {dur}
                        </span>
                      )}
                      {isPremium && (
                        <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(245,158,11,.9)", color: "#000", fontSize: "0.62rem", fontWeight: 900, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.05em" }}>
                          ★ PREMIUM
                        </span>
                      )}
                    </div>
                    <div style={{ padding: "12px 14px 14px" }}>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f1f1f1", lineHeight: 1.25, marginBottom: 4 }}>{v.title}</h3>
                      {views && <p style={{ color: "#555", fontSize: "0.75rem" }}>{views} views</p>}
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #111", padding: "20px", textAlign: "center", color: "#333", fontSize: "0.8rem" }}>
        © {new Date().getFullYear()} Square Bidness Studio
      </footer>
    </div>
  );
}
