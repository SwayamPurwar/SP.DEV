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
    console.error("Application Runtime Error:", error);
  }, [error]);

  return (
    <main className="terminal-window" style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh", 
      padding: "2rem", 
      textAlign: "center",
      background: "var(--bg)"
    }}>
      <div className="glass-card" style={{ maxWidth: "600px", width: "100%", padding: "4rem 2rem" }}>
        <span className="system-tag" style={{ color: "#ff4560", borderColor: "#ff4560", display: "inline-block", marginBottom: "1rem" }}>
          500 // SYSTEM_FAULT_DETECTED
        </span>
        
        <h1 style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "clamp(2.5rem, 5vw, 4rem)", 
          color: "white", 
          marginTop: "1.5rem",
          lineHeight: 1.1,
          letterSpacing: "-0.02em"
        }}>
          Runtime Exception
        </h1>
        
        <p style={{ 
          color: "#aaa", 
          fontFamily: "var(--font-main)", 
          fontSize: "1.1rem", 
          margin: "1.5rem 0 2.5rem", 
          lineHeight: 1.6,
          fontWeight: 300
        }}>
          An unexpected application state exception was encountered on the server runtime.
        </p>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button onClick={() => reset()} className="lux-submit-btn mouse-hover">
            Retry Node
          </button>
        </div>
      </div>
    </main>
  );
}