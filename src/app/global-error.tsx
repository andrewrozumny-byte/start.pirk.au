"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F9F5F2", color: "#282726" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 400, background: "white", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", textAlign: "center" }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "#4D0121" }}>Something went wrong</h1>
            <p style={{ marginTop: 8, fontSize: 14, color: "#66645E" }}>
              A client-side error occurred. Check the browser console (F12 → Console) for details.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: 24,
                padding: "12px 24px",
                background: "#F2705C",
                color: "white",
                border: "none",
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
