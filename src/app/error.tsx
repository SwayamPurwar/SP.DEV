"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for your own diagnostics
    console.error("System Runtime Fault:", error);
  }, [error]);

  return (
    
    <main className="not-found-shell">
      {/* Unified System Background */}
      <div className="grid-bg"></div>
      <div className="vignette"></div>

      <div className="content-wrapper" style={{ 
        background: "rgba(10, 10, 10, 0.6)", 
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "24px",
        padding: "4rem",
        textAlign: "center"
      }}>
        <span className="system-tag" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
          FAULT_CODE: 500 // RUNTIME_EXCEPTION
        </span>
        
        <h1 className="glitch" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", margin: "1rem 0" }}>
          SYSTEM FAULT
        </h1>
        
        <p style={{ 
          fontFamily: "var(--font-main)", 
          color: "#888", 
          marginBottom: "3rem",
          maxWidth: "50ch"
        }}>
          A critical exception occurred within the local runtime environment. The system requires an integrity check.
          <code style={{ fontSize: "0.7rem", color: "#444", display: "block", marginTop: "1rem" }}>
  TRACE: {error.digest || "UNKNOWN_SOURCE"}
</code>
        </p>

        <div className="btn-group" style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button 
            onClick={() => reset()} 
            className="manual-btn" 
            style={{ fontFamily: "var(--font-code)", padding: "1rem 2rem" }}
          >
            [ REINITIALIZE_NODE ]
          </button>
        </div>
      </div>
    </main>
  );
}