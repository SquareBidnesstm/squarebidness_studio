const ERRORS: Record<string, string> = {
  invalid: "Wrong password.",
  rate_limited: "Too many attempts. Try again later.",
  server_error: "Server error. Check ADMIN_PASSWORD env var.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const msg = error ? (ERRORS[error] ?? "An error occurred.") : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#000" }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/studio-192.png" alt="SB Studio" style={{ height: 72, width: 72, objectFit: "contain", margin: "0 auto 12px" }} />
          <p style={{ color: "#555", fontSize: "0.8rem", marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Admin Access
          </p>
        </div>

        {msg && (
          <div style={{
            background: "#1a0505", border: "1px solid #7f1d1d",
            borderRadius: 8, padding: "10px 14px", marginBottom: 16,
            color: "#fca5a5", fontSize: "0.88rem", textAlign: "center",
          }}>
            {msg}
          </div>
        )}

        <form action="/api/admin/login" method="POST" style={{ display: "grid", gap: 14 }}>
          <div className="form-group">
            <label className="label">Password</label>
            <input name="password" type="password" className="input" required autoFocus placeholder="Admin password" />
          </div>
          <button type="submit" className="btn btn--red btn--wide" style={{ marginTop: 4 }}>
            Sign In
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20 }}>
          <a href="/" style={{ color: "#444", fontSize: "0.8rem" }}>← Back to Studio</a>
        </p>
      </div>
    </div>
  );
}
