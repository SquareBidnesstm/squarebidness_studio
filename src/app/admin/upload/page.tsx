"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["shorts","culture","music","events","comedy","documentary","promo","other"];

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("shorts");
  const [tags, setTags] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [access, setAccess] = useState("free");
  const [phase, setPhase] = useState<"idle"|"uploading"|"saving"|"done"|"error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) { setError("Title and video file are required."); return; }
    setError(""); setPhase("uploading"); setProgress(0);

    try {
      // 1. Get Cloudflare direct upload URL
      const urlRes = await fetch("/api/admin/upload-url", { method: "POST" });
      if (!urlRes.ok) {
        const errData = await urlRes.json().catch(() => ({}));
        throw new Error(errData.error ?? "Failed to get upload URL");
      }
      const { uid, uploadURL } = await urlRes.json();

      // 2. Upload directly to Cloudflare via POST multipart
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch(uploadURL, { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const errText = await uploadRes.text().catch(() => "");
        throw new Error(`Upload failed (${uploadRes.status}): ${errText}`);
      }

      // 3. Save metadata to Supabase
      setPhase("saving");
      const saveRes = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(), description: description.trim() || null,
          category, cf_video_id: uid,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          custom_slug: customSlug.trim() || null,
          access: access || "free",
        }),
      });
      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error ?? "Failed to save video");
      }
      await saveRes.json();

      setPhase("done");
      setTimeout(() => router.push("/admin"), 1200);
    } catch (err: any) {
      setError(err.message ?? "Upload failed");
      setPhase("error");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "0 20px 80px" }}>
      {/* Nav */}
      <nav style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #111", marginBottom: 32 }}>
        <a href="/admin" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/studio-192.png" alt="SB Studio" style={{ height: 36, width: 36, objectFit: "contain" }} />
          <span style={{ color: "#555", fontWeight: 400, fontSize: "0.85rem" }}>Admin</span>
        </a>
        <a href="/admin" style={{ color: "#555", fontSize: "0.85rem" }}>← Back to Dashboard</a>
      </nav>

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 950, letterSpacing: "-0.04em", marginBottom: 28 }}>
          Upload Video
        </h1>

        {error && (
          <div style={{ background: "#1a0505", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: "#fca5a5", fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        {phase === "done" && (
          <div style={{ background: "#0a1a0a", border: "1px solid #166534", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#4ade80", fontWeight: 700 }}>
            ✓ Upload complete — redirecting to dashboard…
          </div>
        )}

        {(phase === "uploading" || phase === "saving") && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem", color: "#a1a1aa" }}>
              <span>{phase === "uploading" ? "Uploading to Cloudflare…" : "Saving metadata…"}</span>
              {phase === "uploading" && <span>{progress}%</span>}
            </div>
            <div style={{ height: 6, background: "#111", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#e50914", borderRadius: 99, width: phase === "saving" ? "100%" : `${progress}%`, transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
          {/* Video file */}
          <div className="form-group">
            <label className="label">Video File *</label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${file ? "#e50914" : "#222"}`, borderRadius: 12,
                padding: "32px 20px", textAlign: "center", cursor: "pointer",
                background: file ? "rgba(229,9,20,.04)" : "#080808",
                transition: "all 0.18s",
              }}
            >
              {file ? (
                <div>
                  <p style={{ color: "#f1f1f1", fontWeight: 700 }}>{file.name}</p>
                  <p style={{ color: "#555", fontSize: "0.8rem", marginTop: 4 }}>
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: "2rem", marginBottom: 8 }}>🎬</p>
                  <p style={{ color: "#a1a1aa" }}>Click to select video</p>
                  <p style={{ color: "#444", fontSize: "0.8rem", marginTop: 4 }}>MP4, MOV, WebM — up to 4GB</p>
                </div>
              )}
              <input
                ref={fileRef} type="file" accept="video/*"
                style={{ display: "none" }}
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Title *</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Video title" />
          </div>

          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description (optional)" style={{ minHeight: 80 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="label">Category</label>
              <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Custom Slug</label>
              <input className="input" value={customSlug} onChange={e => setCustomSlug(e.target.value)} placeholder="auto-generated if empty" />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Tags (comma separated)</label>
            <input className="input" value={tags} onChange={e => setTags(e.target.value)} placeholder="louisiana, culture, short film" />
          </div>

          <div className="form-group">
            <label className="label">Access</label>
            <select className="input" value={access} onChange={e => setAccess(e.target.value)}>
              <option value="free">Free — anyone can watch</option>
              <option value="premium">Premium — subscribers only</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn--red btn--wide"
            disabled={phase === "uploading" || phase === "saving" || phase === "done"}
            style={{ marginTop: 8 }}
          >
            {phase === "uploading" ? `Uploading ${progress}%…` : phase === "saving" ? "Saving…" : "Upload & Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

