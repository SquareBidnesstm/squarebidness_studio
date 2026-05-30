"use client";
import { useState, useEffect } from "react";

interface Submission {
  id: number; artist_name: string; contact_name: string; email: string;
  phone?: string; genre?: string; location?: string; bio?: string;
  music_link?: string; instagram?: string; website?: string;
  status: string; notes?: string; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:  "#f59e0b",
  approved: "#4ade80",
  rejected: "#ef4444",
};

export default function AdminSubmissionsPage() {
  const [filter, setFilter] = useState("pending");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  async function load(status = filter) {
    setLoading(true);
    const res = await fetch(`/api/admin/submissions?status=${status}`);
    const data = await res.json();
    setSubmissions(data.submissions ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/admin/submissions/${id}`, {
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
        <span style={{ color: "#333", fontSize: "0.8rem" }}>Music Submissions</span>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 950, letterSpacing: "-0.04em" }}>Music Submissions</h1>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            {["pending","approved","rejected","all"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{
                  background: filter === s ? "#e50914" : "#111",
                  color: filter === s ? "#fff" : "#555",
                  border: `1px solid ${filter === s ? "#e50914" : "#222"}`,
                  borderRadius: 999, padding: "6px 14px", fontSize: "0.78rem",
                  fontWeight: 900, cursor: "pointer", textTransform: "capitalize",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ color: "#444", textAlign: "center", padding: 40 }}>Loading…</p>}

        {!loading && !submissions.length && (
          <div style={{ textAlign: "center", padding: "60px 0", border: "1px dashed #1a1a1a", borderRadius: 14, color: "#333" }}>
            No {filter === "all" ? "" : filter} submissions yet.
          </div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {submissions.map(s => (
            <div key={s.id} style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 14, overflow: "hidden" }}>
              {/* HEADER ROW */}
              <div
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", flexWrap: "wrap" }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3, flexWrap: "wrap" }}>
                    <p style={{ fontWeight: 900, fontSize: "1rem" }}>{s.artist_name}</p>
                    {s.genre && <span style={{ background: "#111", border: "1px solid #222", borderRadius: 999, padding: "2px 9px", fontSize: "0.7rem", color: "#666" }}>{s.genre}</span>}
                    <span style={{ borderRadius: 999, padding: "2px 9px", fontSize: "0.7rem", fontWeight: 900, background: "transparent", border: `1px solid ${STATUS_COLORS[s.status] || "#444"}`, color: STATUS_COLORS[s.status] || "#444" }}>
                      {s.status}
                    </span>
                  </div>
                  <p style={{ color: "#555", fontSize: "0.78rem" }}>
                    {s.contact_name} · {s.email}{s.location ? ` · ${s.location}` : ""}
                  </p>
                </div>
                <p style={{ color: "#333", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                  {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <span style={{ color: "#333", fontSize: "0.8rem" }}>{expanded === s.id ? "▲" : "▼"}</span>
              </div>

              {/* EXPANDED DETAIL */}
              {expanded === s.id && (
                <div style={{ borderTop: "1px solid #1a1a1a", padding: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 18 }}>
                    {s.bio && (
                      <div style={{ gridColumn: "1/-1" }}>
                        <p style={{ fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 5 }}>About</p>
                        <p style={{ color: "#888", fontSize: "0.88rem", lineHeight: 1.6 }}>{s.bio}</p>
                      </div>
                    )}
                    {s.music_link && (
                      <div>
                        <p style={{ fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 5 }}>Music Link</p>
                        <a href={s.music_link} target="_blank" rel="noopener noreferrer" style={{ color: "#e50914", fontSize: "0.85rem", wordBreak: "break-all" }}>
                          {s.music_link}
                        </a>
                      </div>
                    )}
                    {s.instagram && (
                      <div>
                        <p style={{ fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 5 }}>Instagram</p>
                        <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: "#888", fontSize: "0.85rem" }}>@{s.instagram}</a>
                      </div>
                    )}
                    {s.phone && (
                      <div>
                        <p style={{ fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 5 }}>Phone</p>
                        <p style={{ color: "#888", fontSize: "0.85rem" }}>{s.phone}</p>
                      </div>
                    )}
                    {s.website && (
                      <div>
                        <p style={{ fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 5 }}>Website</p>
                        <a href={s.website} target="_blank" rel="noopener noreferrer" style={{ color: "#888", fontSize: "0.85rem" }}>{s.website}</a>
                      </div>
                    )}
                  </div>

                  {/* Notes + Actions */}
                  <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 7 }}>
                      Internal Notes
                    </label>
                    <textarea
                      value={notes[s.id] ?? s.notes ?? ""}
                      onChange={e => setNotes(n => ({ ...n, [s.id]: e.target.value }))}
                      placeholder="Add notes before approving or rejecting…"
                      style={{ width: "100%", background: "#0f0f0f", border: "1px solid #222", borderRadius: 10, padding: "10px 14px", color: "#f1f1f1", fontSize: "0.85rem", outline: "none", minHeight: 70, resize: "vertical", fontFamily: "inherit", marginBottom: 14 }}
                    />

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {s.status !== "approved" && (
                        <button onClick={() => updateStatus(s.id, "approved")}
                          style={{ background: "#166534", color: "#4ade80", border: "1px solid #166534", borderRadius: 10, padding: "9px 18px", fontWeight: 900, fontSize: "0.85rem", cursor: "pointer" }}>
                          ✓ Approve
                        </button>
                      )}
                      {s.status !== "rejected" && (
                        <button onClick={() => updateStatus(s.id, "rejected")}
                          style={{ background: "transparent", color: "#ef4444", border: "1px solid #3a1f1f", borderRadius: 10, padding: "9px 18px", fontWeight: 900, fontSize: "0.85rem", cursor: "pointer" }}>
                          ✕ Reject
                        </button>
                      )}
                      {s.status !== "pending" && (
                        <button onClick={() => updateStatus(s.id, "pending")}
                          style={{ background: "transparent", color: "#666", border: "1px solid #222", borderRadius: 10, padding: "9px 18px", fontWeight: 900, fontSize: "0.85rem", cursor: "pointer" }}>
                          Reset to Pending
                        </button>
                      )}
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
