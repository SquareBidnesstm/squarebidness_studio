import Link from "next/link";
import { supabaseServer } from "../lib/supabase/server";
import { formatDuration, formatViews } from "../lib/helpers";
import { getThumbnailUrl } from "../lib/cloudflare";

export const revalidate = 60;

const CATEGORIES = [
  { value: "all",          label: "All" },
  { value: "shorts",       label: "Shorts" },
  { value: "culture",      label: "Culture" },
  { value: "music",        label: "Music" },
  { value: "events",       label: "Events" },
  { value: "comedy",       label: "Comedy" },
  { value: "documentary",  label: "Documentary" },
  { value: "promo",        label: "Promo" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat, q } = await searchParams;

  let query = supabaseServer
    .from("videos")
    .select("id, slug, title, description, cf_video_id, cf_thumbnail_url, duration_seconds, category, view_count, is_featured, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(48);

  if (cat && cat !== "all") query = query.eq("category", cat);
  if (q) query = query.ilike("title", `%${q}%`);

  const [{ data: videos }, { data: featured }] = await Promise.all([
    query,
    (!cat && !q)
      ? supabaseServer
          .from("videos")
          .select("id, slug, title, description, cf_video_id, cf_thumbnail_url, duration_seconds, category")
          .eq("status", "published")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const hero = featured as any;
  const grid = (videos ?? []) as any[];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(0,0,0,.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1a1a1a",
        height: 60, display: "flex", alignItems: "center", padding: "0 20px",
      }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontWeight: 950, fontSize: "1.15rem", letterSpacing: "-0.04em",
              color: "#fff",
            }}>SB<span style={{ color: "#e50914" }}>Studio</span></span>
            <span style={{
              padding: "2px 7px", background: "#1a0000", border: "1px solid #7f0000",
              borderRadius: 999, fontSize: "0.6rem", fontWeight: 900,
              letterSpacing: "0.14em", textTransform: "uppercase", color: "#e50914",
            }}>Network</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <form method="GET" style={{ display: "flex", gap: 8 }}>
              <input
                name="q"
                defaultValue={q}
                placeholder="Search..."
                className="input"
                style={{ width: 180, minHeight: 36, padding: "0 12px", fontSize: "0.85rem" }}
              />
            </form>
            <Link href="/admin" style={{ color: "#555", fontSize: "0.8rem" }}>Admin</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO FEATURE ── */}
      {hero && (
        <section style={{
          position: "relative", height: "clamp(320px, 55vw, 560px)",
          background: "#000", overflow: "hidden",
        }}>
          {/* BG thumbnail */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${hero.cf_thumbnail_url || getThumbnailUrl(hero.cf_video_id)})`,
            backgroundSize: "cover", backgroundPosition: "center",
            filter: "brightness(.35)",
          }} />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,.85) 40%, transparent 100%), linear-gradient(to top, rgba(0,0,0,.9) 0%, transparent 50%)",
          }} />

          <div className="wrap" style={{
            position: "relative", height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            paddingBottom: "clamp(24px, 5vw, 48px)",
          }}>
            <span className="badge badge--red" style={{ marginBottom: 12, alignSelf: "flex-start" }}>Featured</span>
            <h1 style={{
              fontSize: "clamp(1.8rem, 5vw, 3.5rem)", fontWeight: 950,
              letterSpacing: "-0.04em", lineHeight: 1.05, maxWidth: 600, marginBottom: 12,
            }}>
              {hero.title}
            </h1>
            {hero.description && (
              <p style={{
                color: "rgba(255,255,255,.72)", fontSize: "clamp(.9rem, 1.5vw, 1.05rem)",
                maxWidth: 520, lineHeight: 1.55, marginBottom: 20,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {hero.description}
              </p>
            )}
            <div style={{ display: "flex", gap: 12 }}>
              <Link href={`/watch/${hero.slug}`} className="btn btn--red" style={{ gap: 8 }}>
                <span>▶</span> Watch Now
              </Link>
            </div>
          </div>
        </section>
      )}

      <main style={{ padding: "32px 0 80px" }}>
        <div className="wrap">

          {/* ── CATEGORY FILTERS ── */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {CATEGORIES.map(({ value, label }) => {
              const active = (!cat && value === "all") || cat === value;
              const href = value === "all" ? `/${q ? `?q=${q}` : ""}` : `/?cat=${value}${q ? `&q=${q}` : ""}`;
              return (
                <Link key={value} href={href} style={{
                  padding: "6px 16px", borderRadius: 999, fontSize: "0.85rem", fontWeight: 800,
                  background: active ? "#e50914" : "#111",
                  color: active ? "#fff" : "#a1a1aa",
                  border: `1px solid ${active ? "#e50914" : "#222"}`,
                  transition: "all 0.14s",
                }}>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── VIDEO GRID ── */}
          {!grid.length ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#444" }}>
              <p style={{ fontSize: "3rem", marginBottom: 12 }}>🎬</p>
              <p style={{ fontSize: "1.1rem", color: "#666" }}>
                {q ? `No results for "${q}"` : "No videos published yet."}
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: 18,
            }}>
              {grid.map((v: any) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #111", padding: "20px 20px",
        textAlign: "center", color: "#333", fontSize: "0.8rem",
      }}>
        <p>
          © {new Date().getFullYear()} <span style={{ color: "#555" }}>Square Bidness Studio</span>
          {" · "}
          <a href="https://squarebidness.com" style={{ color: "#444" }}>squarebidness.com</a>
        </p>
      </footer>
    </div>
  );
}

function VideoCard({ video }: { video: any }) {
  const thumb = video.cf_thumbnail_url || getThumbnailUrl(video.cf_video_id);
  const dur = video.duration_seconds ? formatDuration(video.duration_seconds) : null;
  const views = video.view_count ? formatViews(video.view_count) : null;
  const catLabel = video.category
    ? video.category.charAt(0).toUpperCase() + video.category.slice(1)
    : null;

  return (
    <Link href={`/watch/${video.slug}`} style={{ textDecoration: "none" }}>
      <article className="card" style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
        {/* Thumbnail */}
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#0a0a0a" }}>
          {video.cf_video_id && (
            <img
              src={thumb}
              alt={video.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {/* Play overlay */}
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0)", transition: "background 0.18s",
          }}
            className="play-overlay"
          >
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(229,9,20,.85)", display: "flex",
              alignItems: "center", justifyContent: "center",
              opacity: 0, transition: "opacity 0.18s",
              fontSize: "1rem", paddingLeft: 3,
            }}>▶</div>
          </div>
          {/* Duration badge */}
          {dur && (
            <span style={{
              position: "absolute", bottom: 8, right: 8,
              background: "rgba(0,0,0,.8)", color: "#fff",
              fontSize: "0.72rem", fontWeight: 800, padding: "2px 6px", borderRadius: 4,
            }}>{dur}</span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "12px 14px 14px" }}>
          {catLabel && (
            <p style={{ color: "#e50914", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>
              {catLabel}
            </p>
          )}
          <h2 style={{ fontSize: "0.95rem", fontWeight: 800, lineHeight: 1.25, color: "#f1f1f1", marginBottom: 4 }}>
            {video.title}
          </h2>
          {views && (
            <p style={{ color: "#555", fontSize: "0.75rem" }}>{views} views</p>
          )}
        </div>
      </article>
    </Link>
  );
}
