"use client";
import { useState } from "react";
import Link from "next/link";

const BUSINESS_TYPES = [
  "Restaurant / Food","Nightlife / Lounge","Retail / Apparel","Barbershop / Salon",
  "Real Estate","Contractor / Home Service","Health / Medical","Music / Entertainment",
  "Event / Venue","Other",
];

export default function PromoPage() {
  const [form, setForm] = useState({
    business_name: "", contact_name: "", email: "", phone: "",
    business_type: "", location: "", what_to_promote: "", has_footage: false,
  });
  const [phase, setPhase] = useState<"idle"|"submitting"|"done"|"error">("idle");
  const [errMsg, setErrMsg] = useState("");

  function set(field: string, val: string | boolean) {
    setForm(f => ({ ...f, [field]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("submitting"); setErrMsg("");
    try {
      const res = await fetch("/api/submit/promo", {
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
            Inquiry received.
          </h1>
          <p style={{ color: "#666", lineHeight: 1.65, marginBottom: 28, fontSize: "0.95rem" }}>
            We'll be in touch within one business day to lock in your promo slot and walk you through next steps.
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
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/studio-192.png" alt="SB Studio" style={{ height: 38, width: 38, objectFit: "contain" }} />
        </Link>
        <Link href="/" style={{ color: "#555", fontSize: "0.85rem" }}>← Back</Link>
      </nav>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* HERO */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ color: "#e50914", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
            For Businesses
          </p>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.5rem)", fontWeight: 950, letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 16 }}>
            Book a Promo Slot on the Network.
          </h1>
          <p style={{ color: "#666", lineHeight: 1.7, fontSize: "1rem", maxWidth: 560, marginBottom: 28 }}>
            Get your business in front of the SB Studio audience. We produce or publish your promo video — distributed on the network permanently, shareable anywhere, embeddable on your own site.
          </p>

          {/* What you get */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
            {[
              { icon: "🎬", title: "Produced or Published", desc: "Bring your footage or let us handle it." },
              { icon: "📡", title: "Network Distribution", desc: "Lives on SB Studio permanently — shareable link." },
              { icon: "🔗", title: "Embeddable", desc: "Copy the embed code. Put it on your website." },
              { icon: "💰", title: "$200 Flat", desc: "One-time fee. No monthly charges." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 14, padding: "16px 18px" }}>
                <p style={{ fontSize: "1.4rem", marginBottom: 8 }}>{icon}</p>
                <p style={{ fontWeight: 900, fontSize: "0.9rem", marginBottom: 4 }}>{title}</p>
                <p style={{ color: "#555", fontSize: "0.8rem", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Price callout */}
          <div style={{ background: "rgba(229,9,20,.06)", border: "1px solid rgba(229,9,20,.2)", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontWeight: 900, fontSize: "1.1rem", marginBottom: 2 }}>Promo Slot — $200 flat</p>
              <p style={{ color: "#666", fontSize: "0.85rem" }}>One video · Permanent placement · Shareable + embeddable</p>
            </div>
            <p style={{ color: "#e50914", fontWeight: 900, fontSize: "1.8rem", letterSpacing: "-0.04em" }}>$200</p>
          </div>
        </div>

        {/* FORM */}
        <h2 style={{ fontSize: "1.1rem", fontWeight: 900, marginBottom: 20 }}>Book Your Slot</h2>

        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          {phase === "error" && (
            <div style={{ background: "#1a0505", border: "1px solid #7f1d1d", borderRadius: 10, padding: "12px 14px", color: "#fca5a5", fontSize: "0.88rem" }}>
              {errMsg}
            </div>
          )}

          {/* Business */}
          <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 16, padding: 20, display: "grid", gap: 14 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444" }}>Your Business</p>

            <div>
              <label style={lbl}>Business Name *</label>
              <input style={inp} value={form.business_name} onChange={e => set("business_name", e.target.value)} placeholder="Your business name" required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lbl}>Business Type</label>
                <select style={{ ...inp, cursor: "pointer" }} value={form.business_type} onChange={e => set("business_type", e.target.value)}>
                  <option value="">Select one</option>
                  {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>City / Location</label>
                <input style={inp} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Hammond, LA" />
              </div>
            </div>

            <div>
              <label style={lbl}>What Are We Promoting?</label>
              <textarea
                style={{ ...inp, minHeight: 90, resize: "vertical" }}
                value={form.what_to_promote}
                onChange={e => set("what_to_promote", e.target.value)}
                placeholder="New location opening, menu launch, event, sale, new collection — tell us what this promo is about."
              />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.has_footage}
                onChange={e => set("has_footage", e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#e50914", cursor: "pointer" }}
              />
              <span style={{ color: "#888", fontSize: "0.88rem" }}>I already have video footage to provide</span>
            </label>
          </div>

          {/* Contact */}
          <div style={{ background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 16, padding: 20, display: "grid", gap: 14 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444" }}>Contact</p>

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
            {phase === "submitting" ? "Submitting…" : "Book My Promo Slot"}
          </button>

          <p style={{ textAlign: "center", color: "#333", fontSize: "0.78rem", lineHeight: 1.6 }}>
            We'll follow up within one business day to confirm your slot and collect payment. $200 flat fee, no surprises.
          </p>
        </form>
      </main>
    </div>
  );
}
