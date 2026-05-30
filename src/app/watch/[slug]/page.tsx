import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "../../../lib/supabase/server";
import { formatDuration, formatViews } from "../../../lib/helpers";
import { getThumbnailUrl, getEmbedUrl } from "../../../lib/cloudflare";
import { ViewTracker } from "../../../components/ViewTracker";
import { PremiumGate } from "../../../components/PremiumGate";
import { EmbedCopy } from "../../../components/EmbedCopy";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: v } = await supabaseServer
    .from("videos").select("title, description, cf_video_id, cf_thumbnail_url").eq("slug", slug).maybeSingle();
  if (!v) return { title: "Not Found" };
  const thumb = v.cf_thumbnail_url || getThumbnailUrl(v.cf_video_id);
  return {
    title: v.title,
    description: v.description ?? undefined,
    openGraph: { title: v.title, description: v.description ?? undefined, images: [{ url: thumb }], type: "video.other" },
    twitter: { card: "summary_large_image", title: v.title, images: [thumb] },
  };
}

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: video } = await supabaseServer
    .from("videos").select("*").eq("slug", slug).eq("status", "published").maybeSingle();

  if (!video) notFound();

  const { data: related } = await supabaseServer
    .from("videos")
    .select("id, slug, title, cf_video_id, cf_thumbnail_url, duration_seconds, view_count")
    .eq("status", "published")
    .eq("category", video.category)
    .neq("id", video.id)
    .order("created_at", { ascending: false })
    .limit(6);

  const embedUrl = getEmbedUrl(video.cf_video_id);
  const dur = video.duration_seconds ? formatDuration(video.duration_seconds) : null;
  const views = formatViews(video.view_count ?? 0);
  const catLabel = video.category ? video.category.charAt(0).toUpperCase() + video.category.slice(1) : null;
  const isPremium = video.access && video.access !== "free";
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://studio.squarebidness.com";
  const embedCode = `<iframe src="${base}/embed/${slug}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;

  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      <ViewTracker slug={slug} />

      {/* NAV */}
      <nav style={{ height: 56, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid #111", background: "#000", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/studio-192.png" alt="SB Studio" style={{ height: 40, width: 40, objectFit: "contain" }} />
        </Link>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 80px" }}>
        {/* PLAYER or PAYWALL */}
        {isPremium ? (
          <PremiumGate slug={slug} title={video.title} thumbnail={video.cf_thumbnail_url || getThumbnailUrl(video.cf_video_id)} embedUrl={embedUrl} />
        ) : (
          <div style={{ position: "relative", paddingTop: "56.25%", background: "#050505", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
            <iframe
              src={`${embedUrl}?autoplay=true&controls=true&muted=false&loop=false`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* META */}
        {catLabel && (
          <p style={{ color: isPremium ? "#f59e0b" : "#e50914", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            {isPremium && "★ PREMIUM · "}{catLabel}{dur && ` · ${dur}`}
          </p>
        )}
        <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 950, letterSpacing: "-0.03em", marginBottom: 6 }}>
          {video.title}
        </h1>
        <p style={{ color: "#555", fontSize: "0.82rem", marginBottom: 16 }}>
          {views} views · {new Date(video.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        {video.description && (
          <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 10, padding: "14px 16px", marginBottom: 20, color: "rgba(255,255,255,.75)", fontSize: "0.92rem", lineHeight: 1.65 }}>
            {video.description}
          </div>
        )}

        {/* EMBED CODE (free videos only) */}
        {!isPremium && (
          <EmbedCopy code={embedCode} />
        )}

        {/* RELATED */}
        {(related ?? []).length > 0 && (
          <>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#444", marginBottom: 16 }}>
              More to Watch
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {(related ?? []).map((v: any) => {
                const rThumb = v.cf_thumbnail_url || getThumbnailUrl(v.cf_video_id);
                const rDur = v.duration_seconds ? formatDuration(v.duration_seconds) : null;
                return (
                  <Link key={v.id} href={`/watch/${v.slug}`} style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 130, flexShrink: 0 }}>
                      <div style={{ paddingTop: "56.25%", position: "relative", background: "#0a0a0a", borderRadius: 8, overflow: "hidden" }}>
                        {v.cf_video_id && <img src={rThumb} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
                        {rDur && <span style={{ position: "absolute", bottom: 4, right: 4, background: "rgba(0,0,0,.8)", color: "#fff", fontSize: "0.62rem", fontWeight: 800, padding: "1px 5px", borderRadius: 3 }}>{rDur}</span>}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.3, color: "#f1f1f1" }}>{v.title}</p>
                      {v.view_count > 0 && <p style={{ color: "#555", fontSize: "0.72rem", marginTop: 4 }}>{formatViews(v.view_count)} views</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
