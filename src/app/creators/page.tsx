// src/app/creators/page.tsx — creator directory
import Link from "next/link";
import { supabaseServer } from "../../lib/supabase/server";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Creators — SB Studio Network",
  description: "Independent filmmakers, musicians, and culture creators on the SB Studio Network.",
};

export default async function CreatorsPage() {
  const { data: creators } = await supabaseServer
    .from("creators")
    .select("id, slug, name, bio, location, photo_url")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const list = creators ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#000" }}>
      {/* NAV */}
      <nav style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid #111", background: "#000", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/studio-192.png" alt="SB Studio" style={{ height: 40, width: 40, objectFit: "contain" }} />
          <span style={{ padding: "2px 7px", background: "#1a0000", border: "1px solid #7f0000", borderRadius: 999, fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e50914" }}>Network</span>
        </Link>
        <Link href="/" style={{ color: "#555", fontSize: "0.85rem" }}>← All Videos</Link>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ color: "#e50914", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
            The Network
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 950, letterSpacing: "-0.04em", marginBottom: 12 }}>
            Creators
          </h1>
          <p style={{ color: "#666", fontSize: "1rem", lineHeight: 1.6, maxWidth: 580 }}>
            Independent talent distributed on the SB Studio Network. Filmmakers, musicians, comedians, and culture creators from across the South.
          </p>
        </div>

        {!list.length ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#333" }}>
            <p style={{ fontSize: "3rem", marginBottom: 12 }}>🎬</p>
            <p style={{ fontSize: "1.1rem", color: "#444", marginBottom: 6 }}>Network is loading up.</p>
            <p style={{ color: "#333", fontSize: "0.9rem" }}>First creators coming soon.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
            {list.map((c: any) => (
              <Link key={c.id} href={`/creator/${c.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 16, overflow: "hidden", transition: "border-color 0.18s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#333")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#1a1a1a")}
                >
                  {/* Photo */}
                  <div style={{ paddingTop: "56.25%", position: "relative", background: "#0a0a0a" }}>
                    {c.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photo_url} alt={c.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                        🎬
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "14px 16px" }}>
                    <h2 style={{ fontSize: "1.05rem", fontWeight: 900, color: "#f1f1f1", marginBottom: 4 }}>{c.name}</h2>
                    {c.location && (
                      <p style={{ color: "#555", fontSize: "0.75rem", marginBottom: 6 }}>📍 {c.location}</p>
                    )}
                    {c.bio && (
                      <p style={{ color: "#666", fontSize: "0.85rem", lineHeight: 1.5,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                      }}>
                        {c.bio}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #111", padding: "20px", textAlign: "center", color: "#333", fontSize: "0.8rem" }}>
        © {new Date().getFullYear()} Square Bidness Studio
      </footer>
    </div>
  );
}
