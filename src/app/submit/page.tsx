"use client";
import { useState } from "react";
import Link from "next/link";

const GENRES = ["Hip-Hop / Rap","R&B / Soul","Gospel","Blues","Jazz","Funk","Zydeco","Country","Pop","Rock","Electronic","Reggae","Other"];

export default function SubmitPage() {
  const [form, setForm] = useState({
    artist_name: "", contact_name: "", email: "", phone: "",
    genre: "", location: "", bio: "", music_link: "", instagram: "", website: "",
  });
  const [phase, setPhase] = useState<"idle"|"submitting"|"done"|"error">("idle");
  const [errMsg, setErrMsg] = useState("");

  function set(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("submitting"); setErrMsg("");

    try {
      const res = await fetch("/api/submit/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setPhase("done");
    } catch (e: any) {
      setErrMsg(e.message || "Something went wrong. Try again.");
      setPhase("error");
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "#0f0f0f", border: "1px solid #222",
    borderRadius: 12, padding: "13px 14px", color: "#f1f1f1",
    fontSize: "0.92rem", outline: "none", fontFamily: "inherit",
  };
  const lbl: React.CSSProperties = {
    display: "block", fontSize: "0.7rem", fontWeight: 900,
    letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", marginBottom: 7,
  };

  if (phase === "done") {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 460, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(229,9,20,.12)", border: "2px solid rgba(229,9,20,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 24px" }}>
            ✓
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 950, letterSpacing: "-0.04em", color: "#fff", marginBottom: 12 }}>
            Submission received.
          </h1>
          <p style={{ color: "#666", lineHeight: 1.65, marginBottom: 28, fontSize: "0.95rem" }}>
            We'll review your music and be in touch. If it's right for the network, we'll reach out to get you set up.
          </p>
          <Link href="/" style={{ background: "#e50914", color: "#fff", padding: "13px 28px", borderRadius: 999, fontWeight: 900, textDecoration: "none", fontSize: "0.95rem" }}>
            ← Back to Network
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: "system-ui, sans-serif", color: "#f1f1f1" }}>
      {/* NAV */}
      <nav style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid #111", background: "#000", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/studio-192.png" alt="SB Studio" style={{ height: 40, width: 40, objectFit: "contain" }} />
          <span style={{ padding: "2px 7px", background: "#1a0000", border: "1px solid #7f0000", borderRadius: 999, fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e50914" }}>Network</span>
        </Link>
        <Link href="/" style={{ color: "#555", fontSize: "0.85rem" }}>← Back</Link>
      </nav>

      <main style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* HEADER */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ color: "#e50914", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
            Independent Artists
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 950, letterSpacing: "-0.04em", marginBottom: 14 }}>
            Submit Your Music
          </h1>
          <p style={{ color: "#666", lineHeight: 1.65, fontSize: "0.95rem", maxWidth: 520 }}>
            SB Studio is a curated distribution network for independent music artists. We listen to everything submitted. If your music is right for the network we'll reach out to get you set up.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {["Hip-Hop","R&B","Gospel","Blues","Jazz","Zydeco & More"].map(g => (
              <span key={g} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 999, padding: "4px 12px", fontSize: "0.75rem", color: "#555" }}>{g}</span>
            ))}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={submit} style={{ display: "grid", gap: 18 }}>

          {(phase === "error") && (
            <div style={{ background: "#1a0505", border: "1px solid #7f1d1d", borderRadius: 10, padding: "12px 14px", color: "#fca5a5", fontSize: "0.88rem" }}>
              {errMsg}
            </div>
          )}

          {/* Artist info */}
          <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 16, padding: 20, display: "grid", gap: 14 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 4 }}>Artist Info</p>

            <div>
              <label style={lbl}>Artist / Group Name *</label>
              <input style={inp} value={form.artist_name} onChange={e => set("artist_name", e.target.value)} placeholder="Your artist name" required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lbl}>Genre</label>
                <select style={{ ...inp, cursor: "pointer" }} value={form.genre} onChange={e => set("genre", e.target.value)}>
                  <option value="">Select one</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>City / State</label>
                <input style={inp} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Hammond, LA" />
              </div>
            </div>

            <div>
              <label style={lbl}>About Your Music</label>
              <textarea
                style={{ ...inp, minHeight: 100, resize: "vertical" }}
                value={form.bio}
                onChange={e => set("bio", e.target.value)}
                placeholder="Tell us about yourself and your music. What do you make, who is it for, what's your story."
              />
            </div>
          </div>

          {/* Links */}
          <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 16, padding: 20, display: "grid", gap: 14 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 4 }}>Your Music Links</p>

            <div>
              <label style={lbl}>Music Link * (SoundCloud, YouTube, Spotify, etc.)</label>
              <input style={inp} type="url" value={form.music_link} onChange={e => set("music_link", e.target.value)} placeholder="https://soundcloud.com/yourname" required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lbl}>Instagram</label>
                <input style={inp} value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="handle (no @)" />
              </div>
              <div>
                <label style={lbl}>Website</label>
                <input style={inp} type="url" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 16, padding: 20, display: "grid", gap: 14 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 4 }}>Contact</p>

            <div>
              <label style={lbl}>Your Name *</label>
              <input style={inp} value={form.contact_name} onChange={e => set("contact_name", e.target.value)} placeholder="First and last name" required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lbl}>Email *</label>
                <input style={inp} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" required />
              </div>
              <div>
                <label style={lbl}>Phone</label>
                <input style={inp} type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(XXX) XXX-XXXX" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={phase === "submitting"}
            style={{
              background: "#e50914", color: "#fff", border: "none",
              borderRadius: 999, padding: "15px 28px", fontWeight: 900,
              fontSize: "1rem", cursor: phase === "submitting" ? "not-allowed" : "pointer",
              opacity: phase === "submitting" ? 0.6 : 1, width: "100%",
            }}
          >
            {phase === "submitting" ? "Submitting…" : "Submit for Review"}
          </button>

          <p style={{ textAlign: "center", color: "#333", fontSize: "0.78rem", lineHeight: 1.6 }}>
            No podcasts or full-length movies at this time. Music artists only.
            We review every submission personally.
          </p>
        </form>
      </main>
    </div>
  );
}
