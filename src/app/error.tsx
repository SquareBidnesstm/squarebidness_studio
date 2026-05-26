"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: "1.1rem", color: "#a1a1aa" }}>Something went wrong.</p>
      <button onClick={reset} style={{ padding: "8px 20px", background: "#e50914", color: "#fff", border: "none", borderRadius: 999, cursor: "pointer", fontWeight: 800 }}>Try Again</button>
      <a href="/" style={{ color: "#444", fontSize: "0.85rem" }}>← Home</a>
    </div>
  );
}
