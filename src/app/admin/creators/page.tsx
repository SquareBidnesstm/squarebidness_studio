"use client";
import { useState, useEffect } from "react";

interface Creator {
  id: string; slug: string; name: string; bio?: string;
  location?: string; photo_url?: string; instagram?: string;
  website?: string; is_active: boolean;
}

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", bio: "", location: "", photo_url: "", instagram: "", website: "", custom_slug: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/creators");
    const data = await res.json();
    setCreators(data.creators ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function set(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }));
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setErr("Name is required."); return; }
    setSaving(true); setErr(""); setMsg("");
    try {
      const res = await fetch("/api/admin/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(`✓ Created: ${data.creator.name} (/${data.creator.slug})`);
      setForm({ name: "", bio: "", location: "", photo_url: "", instagram: "", website: "", custom_slug: "" });
      await load();
    } catch (e: any) {
      setErr(e.message || "Failed to create creator");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(c: Creator) {
    await fetch(`/api/admin/creators/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !c.is_active }),
    });
    await load();
  }

  async function remove(c: Creator) {
    if (!confirm(`Delete ${c.name}? This cannot be undone.`)) return;
    await fetch(`/api/admin/creators/${c.id}`, { method: "DELETE" });
    await load();
  }

  const input: React.CSSProperties = {
    width: "100%", background: "#0f0f0f", border: "1px solid #222",
    borderRadius: 10, padding: "11px 14px", color: "#f1f1f1",
    fontSize: "0.9rem", outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "0 20px 80px", fontFamily: "system-ui, sans-serif", color: "#f1f1f1" }}>
      <nav style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #111", marginBottom: 32 }}>
        <a href="/admin" style={{ color: "#555", fontSize: "0.85rem" }}>← Admin Dashboard</a>
        <span style={{ color: "#333", fontSize: "0.8rem" }}>Creator Management</span>
      </nav>

      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 950, letterSpacing: "-0.04em", marginBottom: 28 }}>Creators</h1>

        {/* ADD FORM */}
        <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 16, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 900, marginBottom: 18 }}>Add Creator</h2>

          {err && <div style={{ background: "#1a0505", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#fca5a5", fontSize: "0.85rem" }}>{err}</div>}
          {msg && <div style={{ background: "#0a1a0a", border: "1px solid #166534", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#4ade80", fontSize: "0.85rem" }}>{msg}</div>}

          <form onSubmit={create} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>Name *</label>
              <input style={input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Creator or artist name" required />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>Bio</label>
              <textarea style={{ ...input, minHeight: 80, resize: "vertical" }} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Short bio (1-2 sentences)" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>Location</label>
              <input style={input} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Hammond, LA" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>Instagram</label>
              <input style={input} value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="handle (no @)" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>Photo URL</label>
              <input style={input} value={form.photo_url} onChange={e => set("photo_url", e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>Website</label>
              <input style={input} value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>Custom Slug</label>
              <input style={input} value={form.custom_slug} onChange={e => set("custom_slug", e.target.value)} placeholder="auto-generated if empty" />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" disabled={saving}
                style={{ width: "100%", background: "#e50914", color: "#fff", border: "none", borderRadius: 10, padding: "11px 14px", fontWeight: 900, fontSize: "0.9rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : "Add Creator"}
              </button>
            </div>
          </form>
        </div>

        {/* CREATOR LIST */}
        <h2 style={{ fontSize: "1rem", fontWeight: 900, marginBottom: 14 }}>
          {loading ? "Loading…" : `${creators.length} Creator${creators.length !== 1 ? "s" : ""}`}
        </h2>

        {!loading && !creators.length && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#333", border: "1px dashed #1a1a1a", borderRadius: 14 }}>
            No creators yet. Add the first one above.
          </div>
        )}

        <div style={{ display: "grid", gap: 10 }}>
          {creators.map(c => (
            <div key={c.id} style={{ background: "#0c0c0c", border: `1px solid ${c.is_active ? "#1a1a1a" : "#2a1a1a"}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              {c.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.photo_url} alt={c.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 900, fontSize: "0.95rem", marginBottom: 2 }}>{c.name}</p>
                <p style={{ color: "#555", fontSize: "0.78rem" }}>
                  /{c.slug}{c.location ? ` · ${c.location}` : ""}
                  {c.instagram ? ` · @${c.instagram}` : ""}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <a href={`/creator/${c.slug}`} target="_blank" rel="noopener noreferrer"
                  style={{ background: "transparent", color: "#555", border: "1px solid #222", borderRadius: 8, padding: "6px 12px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
                  View
                </a>
                <button onClick={() => toggleActive(c)}
                  style={{ background: "transparent", color: c.is_active ? "#4ade80" : "#555", border: `1px solid ${c.is_active ? "#166534" : "#222"}`, borderRadius: 8, padding: "6px 12px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                  {c.is_active ? "Active" : "Hidden"}
                </button>
                <button onClick={() => remove(c)}
                  style={{ background: "transparent", color: "#ef4444", border: "1px solid #3a1f1f", borderRadius: 8, padding: "6px 12px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
