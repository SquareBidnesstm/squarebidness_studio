// src/app/subscribe/success/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribed — SB Studio",
  robots: { index: false },
};

export default function SubscribeSuccess() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>

        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(229,9,20,.12)", border: "2px solid rgba(229,9,20,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 24px" }}>
          ✓
        </div>

        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 950, letterSpacing: "-0.04em", color: "#fff", marginBottom: 12 }}>
          You're in.
        </h1>

        <p style={{ color: "#888", lineHeight: 1.65, marginBottom: 8, fontSize: "1rem" }}>
          SB Studio Premium is active. Check your email for confirmation.
        </p>

        <p style={{ color: "#555", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: 32 }}>
          To watch premium content, click <strong style={{ color: "#aaa" }}>"I'm a subscriber"</strong> on any video and enter the email you subscribed with.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block", background: "#e50914", color: "#fff",
            padding: "14px 28px", borderRadius: "999px", fontWeight: 900,
            textDecoration: "none", fontSize: "1rem", letterSpacing: "-0.01em",
          }}
        >
          ▶ Start Watching
        </Link>

        <p style={{ marginTop: 20 }}>
          <a href="/api/stripe/portal" style={{ color: "#444", fontSize: "0.8rem" }}>
            Manage subscription
          </a>
        </p>
      </div>
    </div>
  );
}
