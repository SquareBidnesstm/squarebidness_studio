"use client";
import { useState } from "react";

export function EmbedCopy({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 8 }}>
        Embed this video
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        <input
          readOnly
          value={code}
          style={{
            flex: 1, background: "#0a0a0a", border: "1px solid #1e1e1e",
            borderRadius: 8, padding: "9px 12px", color: "#666",
            fontSize: "0.75rem", fontFamily: "monospace", outline: "none",
            minWidth: 0,
          }}
          onClick={e => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={copy}
          style={{
            background: copied ? "#166534" : "#111", color: copied ? "#4ade80" : "#aaa",
            border: "1px solid #222", borderRadius: 8, padding: "9px 16px",
            fontSize: "0.8rem", fontWeight: 800, cursor: "pointer",
            whiteSpace: "nowrap", transition: "all 0.2s",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
