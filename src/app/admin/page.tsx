import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthed } from "../../lib/auth";
import { supabaseServer } from "../../lib/supabase/server";
import { formatDuration, formatViews } from "../../lib/helpers";
import { getThumbnailUrl } from "../../lib/cloudflare";
import { AdminVideoRow } from "./AdminVideoRow";

export const revalidate = 0;

const CATEGORIES = ["shorts","culture","music","events","comedy","documentary","promo","other"];

export default async function AdminDashboard() {
  if (!await isAdminAuthed()) redirect("/admin/login");

  const [{ data: videos }, { data: stats }] = await Promise.all([
    supabaseServer
      .from("videos")
      .select("id, slug, title, category, status, is_featured, view_count, duration_seconds, cf_video_id, cf_thumbnail_url, created_at")
      .order("created_at", { ascending: false }),
    supabaseServer
      .from("videos")
      .select("status, view_count"),
  ]);

  const all = stats ?? [];
  const published = all.filter(v => v.status === "published").length;
  const drafts = all.filter(v => v.status === "draft").length;
  const totalViews = all.reduce((s, v) => s + (v.view_count ?? 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "0 20px 80px" }}>
      <style>{`
        .admin-nav { display: flex; flex-direction: column; border-bottom: 1px solid #111; margin-bottom: 32px; padding: 10px 0; gap: 10px; }
        .admin-nav-top { display: flex; align-items: center; justify-content: space-between; }
        .admin-nav-links { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        @media (min-width: 640px) {
          .admin-nav { flex-direction: row; align-items: center; justify-content: space-between; height: 56px; padding: 0; gap: 0; }
          .admin-nav-top { flex: 0 0 auto; }
        }
      `}</style>
      {/* NAV */}
      <nav className="admin-nav">
        <div className="admin-nav-top">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ fontWeight: 950, fontSize: "1.1rem", letterSpacing: "-0.04em" }}>
              SB<span style={{ color: "#e50914" }}>Studio</span>
            </Link>
            <span style={{ padding: "2px 8px", background: "#1a0000", border: "1px solid #7f0000", borderRadius: 999, color: "#e50914", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Admin</span>
          </div>
        </div>
        <div className="admin-nav-links">
          <Link href="/admin/upload" className="btn btn--red" style={{ minHeight: 34, fontSize: "0.82rem", padding: "0 14px" }}>
            + Upload Video
          </Link>
          <Link href="/admin/creators" style={{ color: "#888", fontSize: "0.82rem" }}>Creators</Link>
          <Link href="/admin/submissions" style={{ color: "#888", fontSize: "0.82rem" }}>Submissions</Link>
          <Link href="/admin/promo" style={{ color: "#e50914", fontSize: "0.82rem" }}>Promo</Link>
          <a href="/api/admin/logout" style={{ color: "#555", fontSize: "0.82rem" }}>Sign Out</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 36 }}>
          {[
            { label: "Total Videos", value: all.length },
            { label: "Published", value: published, color: "#4ade80" },
            { label: "Drafts", value: drafts, color: "#888" },
            { label: "Total Views", value: formatViews(totalViews), color: "#e50914" },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ padding: "18px 20px", textAlign: "center" }}>
              <p style={{ color: "#555", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: "2rem", fontWeight: 950, color: color ?? "#f1f1f1" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* VIDEO TABLE */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "-0.02em" }}>All Videos</h2>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1c1c1c" }}>
                {["Thumbnail", "Title", "Category", "Status", "Views", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#555", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(videos ?? []).map((v: any) => (
                <AdminVideoRow key={v.id} video={v} />
              ))}
              {!videos?.length && (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#333" }}>
                    No videos yet. <Link href="/admin/upload" style={{ color: "#e50914" }}>Upload your first →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
