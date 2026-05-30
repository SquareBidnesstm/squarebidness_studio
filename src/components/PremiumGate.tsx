"use client";
import { useState } from "react";

interface Props {
  slug: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
}

export function PremiumGate({ slug, title, thumbnail, embedUrl }: Props) {
  const [mode, setMode] = useState<"gate" | "check" | "unlocked" | "error">("gate");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  async function verify() {
    const e = email.trim().toLowerCase();
    if (!e || !e.includes("@")) { setErrMsg("Enter a valid email."); return; }
    setMode("check");
    setErrMsg("");

    try {
      const res = await fetch(`/api/subscriber/check?email=${encodeURIComponent(e)}`);
      const data = await res.json();
      if (data.active) {
        localStorage.setItem("sb_studio_email", e);
        setMode("unlocked");
      } else {
        setMode("gate");
        setErrMsg("No active subscription found for that email.");
      }
    } catch {
      setMode("gate");
      setErrMsg("Network error. Try again.");
    }
  }

  if (mode === "unlocked") {
    return (
      <div style={{ position: "relative", paddingTop: "56.25%", background: "#050505", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
        <iframe
          src={`${embedUrl}?autoplay=true&controls=true&muted=false&loop=false`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", paddingTop: "56.25%", background: "#050505", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
      {/* Blurred thumbnail */}
      {thumbnail && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(8px) brightness(0.25)",
        }} />
      )}

      {/* Gate overlay */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24, textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}>
        <p style={{ color: "#f59e0b", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
          ★ Premium Content
        </p>
        <h2 style={{ color: "#fff", fontSize: "clamp(1rem, 3vw, 1.4rem)", fontWeight: 900, marginBottom: 6, maxWidth: 400 }}>
          {title}
        </h2>
        <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: 24, maxWidth: 340 }}>
          This video requires an SB Studio Premium subscription.
        </p>

        {/* Already subscribed flow */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 16, width: "100%", maxWidth: 380 }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && verify()}
            style={{
              flex: 1, minWidth: 180, background: "#111", border: "1px solid #333",
              borderRadius: 8, padding: "10px 14px", color: "#fff",
              fontSize: "0.88rem", outline: "none",
            }}
          />
          <button
            onClick={verify}
            disabled={mode === "check"}
            style={{
              background: "#fff", color: "#000", border: "none",
              borderRadius: 8, padding: "10px 18px", fontWeight: 900,
              fontSize: "0.88rem", cursor: "pointer", whiteSpace: "nowrap",
              opacity: mode === "check" ? 0.6 : 1,
            }}
          >
            {mode === "check" ? "Checking…" : "I'm a subscriber"}
          </button>
        </div>

        {errMsg && (
          <p style={{ color: "#ef4444", fontSize: "0.78rem", marginBottom: 14 }}>{errMsg}</p>
        )}

        <a
          href="/api/stripe/checkout"
          style={{
            background: "#e50914", color: "#fff", padding: "11px 24px",
            borderRadius: "999px", fontWeight: 900, fontSize: "0.9rem",
            textDecoration: "none", display: "inline-block",
          }}
        >
          Subscribe — $7.99/mo
        </a>
      </div>
    </div>
  );
}
