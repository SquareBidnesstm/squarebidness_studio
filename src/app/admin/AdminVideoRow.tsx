"use client";
import { useState } from "react";
import { formatViews } from "../../lib/helpers";
import { getThumbnailUrl } from "../../lib/cloudflare";

export function AdminVideoRow({ video }: { video: any }) {
  const [status, setStatus] = useState(video.status);
  const [featured, setFeatured] = useState(video.is_featured ?? false);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  const thumb = video.cf_thumbnail_url || (video.cf_video_id ? getThumbnailUrl(video.cf_video_id) : null);

  async function patch(updates: Record<string, any>) {
    setLoading(true);
    await fetch(`/api/admin/videos/${video.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setLoading(false);
  }

  async function toggleStatus() {
    const next = status === "published" ? "draft" : "published";
    await patch({ status: next });
    setStatus(next);
  }

  async function toggleFeatured() {
    const next = !featured;
    await patch({ is_featured: next });
    setFeatured(next);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${video.title}"? This cannot be undone.`)) return;
    setLoading(true);
    await fetch(`/api/admin/videos/${video.id}`, { method: "DELETE" });
    setDeleted(true);
  }

  const catColor: Record<string, string> = {
    shorts: "#e50914", culture: "#a855f7", music: "#3b82f6",
    events: "#22c55e", comedy: "#f59e0b", documentary: "#64748b",
    promo: "#ec4899", other: "#555",
  };

  return (
    <tr style={{ borderBottom: "1px solid #0f0f0f", opacity: loading ? 0.5 : 1 }}>
      {/* Thumbnail */}
      <td style={{ padding: "10px 16px" }}>
        <a href={`/watch/${video.slug}`} target="_blank" rel="noopener">
          <div style={{ width: 90, height: 52, borderRadius: 6, overflow: "hidden", background: "#0a0a0a", flexShrink: 0 }}>
            {thumb && <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
        </a>
      </td>
      {/* Title */}
      <td style={{ padding: "10px 16px", maxWidth: 260 }}>
        <a href={`/watch/${video.slug}`} target="_blank" rel="noopener" style={{ fontWeight: 700, fontSize: "0.88rem", color: "#f1f1f1", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {video.title}
        </a>
        <p style={{ color: "#444", fontSize: "0.72rem", marginTop: 2 }}>{video.slug}</p>
      </td>
      {/* Category */}
      <td style={{ padding: "10px 16px" }}>
        <span style={{ color: catColor[video.category] ?? "#888", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          {video.category}
        </span>
      </td>
      {/* Status */}
      <td style={{ padding: "10px 16px" }}>
        <button
          onClick={toggleStatus}
          disabled={loading}
          style={{
            padding: "3px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 900,
            border: "none", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
            background: status === "published" ? "rgba(34,197,94,.15)" : "rgba(255,255,255,.06)",
            color: status === "published" ? "#4ade80" : "#888",
          }}
        >
          {status === "published" ? "Live" : "Draft"}
        </button>
      </td>
      {/* Views */}
      <td style={{ padding: "10px 16px", color: "#555", fontSize: "0.82rem" }}>
        {video.view_count > 0 ? formatViews(video.view_count) : "—"}
      </td>
      {/* Date */}
      <td style={{ padding: "10px 16px", color: "#444", fontSize: "0.75rem" }}>
        {new Date(video.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
      </td>
      {/* Actions */}
      <td style={{ padding: "10px 16px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={toggleFeatured}
            disabled={loading}
            title={featured ? "Remove from featured" : "Set as featured hero"}
            style={{
              background: featured ? "rgba(229,9,20,.15)" : "transparent",
              border: `1px solid ${featured ? "#7f0000" : "#222"}`,
              borderRadius: 6, padding: "4px 8px", cursor: "pointer",
              color: featured ? "#e50914" : "#444", fontSize: "0.8rem",
            }}
          >
            {featured ? "★" : "☆"}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{ background: "transparent", border: "1px solid #2a0000", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#7f1d1d", fontSize: "0.8rem" }}
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}
