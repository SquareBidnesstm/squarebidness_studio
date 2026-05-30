"use client";
import { useState, useEffect } from "react";

interface Inquiry {
  id: number; business_name: string; contact_name: string; email: string;
  phone?: string; business_type?: string; location?: string;
  what_to_promote?: string; has_footage: boolean;
  status: string; notes?: string; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new:       "#e50914",
  contacted: "#f59e0b",
  booked:    "#3b82f6",
  complete:  "#4ade80",
  passed:    "#555",
};

const STATUSES = ["new","contacted","booked","complete","passed"];

export default function AdminPromoPage() {
  const [filter, setFilter] = useState("new");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  async function load(status = filter) {
    setLoading(true);
    const res = await fetch(`/api/admin/promo?status=${status}`);
    const data = await res.json();
    setInquiries(data.inquiries ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/admin/promo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes: notes[id] }),
    });
    await load();
    setExpanded(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "0 20px 80px", fontFamily: "system-ui, sans-serif", color: "#f1f1f1" }}>
      <nav style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #111", marginBottom: 32 }}>
        <a href="/admin" style={{ color: "#555", fontSize: "0.85rem" }}>← Admin Dashboard</a>
        <span style={{ color: "#333", fontSize: "0.8rem" }}>Promo Inquiries</span>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 950, letterSpacing: "-0.04em" }}>Promo Inquiries</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["new","contacted","booked","complete","passed","all"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{
                  background: filter === s ? (STATUS_COLORS[s] || "#fff") : "#111",
                  color: filter === s ? "#fff" : "#555",
                  border: `1px solid ${filter === s ? (STATUS_COLORS[s] || "#fff") : "#222"}`,
                  borderRadius: 999, padding: "6px 14px", fontSize: "0.75rem",
                  fontWeight: 900, cursor: "pointer", textTransform: "capitalize",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ color: "#444", textAlign: "center", padding: 40 }}>Loading…</p>}

        {!loading && !inquiries.length && (
          <div style={{ textAlign: "center", padding: "60px 0", border: "1px dashed #1a1a1a", borderRadius: 14, color: "#333" }}>
            No {filter === "all" ? "" : filter} promo inquiries yet.
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {inquiries.map(inq => (
            <div key={inq.id} style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 14, overflow: "hidden" }}>
              <div
                onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", flexWrap: "wrap" }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3, flexWrap: "wrap" }}>
                    <p style={{ fontWeight: 900, fontSize: "1rem" }}>{inq.business_name}</p>
                    {inq.business_type && <span style={{ background: "#111", border: "1px solid #222", borderRadius: 999, padding: "2px 9px", fontSize: "0.7rem", color: "#666" }}>{inq.business_type}</span>}
                    <span style={{ borderRadius: 999, padding: "2px 9px", fontSize: "0.7rem", fontWeight: 900, border: `1px solid ${STATUS_COLORS[inq.status] || "#444"}`, color: STATUS_COLORS[inq.status] || "#444" }}>
                      {inq.status}
                    </span>
                    {inq.has_footage && <span style={{ background: "#0a1a0a", border: "1px solid #166534", borderRadius: 999, padding: "2px 9px", fontSize: "0.7rem", color: "#4ade80" }}>Has footage</span>}
                  </div>
                  <p style={{ color: "#555", fontSize: "0.78rem" }}>
                    {inq.contact_name} · {inq.email}{inq.location ? ` · ${inq.location}` : ""}
                  </p>
                </div>
                <p style={{ color: "#333", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                  {new Date(inq.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <span style={{ color: "#333", fontSize: "0.8rem" }}>{expanded === inq.id ? "▲" : "▼"}</span>
              </div>

              {expanded === inq.id && (
                <div style={{ borderTop: "1px solid #1a1a1a", padding: "20px" }}>
                  {inq.what_to_promote && (
                    <div style={{ marginBottom: 18 }}>
                      <p style={{ fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 5 }}>What to Promote</p>
                      <p style={{ color: "#888", fontSize: "0.88rem", lineHeight: 1.6 }}>{inq.what_to_promote}</p>
                    </div>
                  )}

                  {inq.phone && (
                    <div style={{ marginBottom: 18 }}>
                      <p style={{ fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 5 }}>Phone</p>
                      <a href={`tel:${inq.phone}`} style={{ color: "#888", fontSize: "0.88rem" }}>{inq.phone}</a>
                    </div>
                  )}

                  <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 7 }}>
                      Notes
                    </label>
                    <textarea
                      value={notes[inq.id] ?? inq.notes ?? ""}
                      onChange={e => setNotes(n => ({ ...n, [inq.id]: e.target.value }))}
                      placeholder="Payment received, shoot date, delivery notes…"
                      style={{ width: "100%", background: "#0f0f0f", border: "1px solid #222", borderRadius: 10, padding: "10px 14px", color: "#f1f1f1", fontSize: "0.85rem", outline: "none", minHeight: 70, resize: "vertical", fontFamily: "inherit", marginBottom: 14 }}
                    />

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {STATUSES.filter(s => s !== inq.status).map(s => (
                        <button key={s} onClick={() => updateStatus(inq.id, s)}
                          style={{
                            background: "transparent",
                            color: STATUS_COLORS[s] || "#888",
                            border: `1px solid ${STATUS_COLORS[s] || "#333"}`,
                            borderRadius: 10, padding: "8px 16px",
                            fontWeight: 900, fontSize: "0.82rem", cursor: "pointer",
                            textTransform: "capitalize",
                          }}>
                          → {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
