"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);
useEffect(() => {
    // 1. Setup the interval to update state
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Separate effect for the actual redirect
  useEffect(() => {
    if (seconds === 0) {
      router.push("/");
    }
  }, [seconds, router]);
  return (
    <main className="not-found-shell">
      {/* Background components for premium depth */}
      <div className="grid-bg"></div>
      <div className="vignette"></div>

      <div className="content-wrapper">
        <span className="system-tag" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
          ERR_CODE: 404 // NODE_NULL
        </span>
        
        <h1 className="glitch" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
          SECTOR NOT FOUND
        </h1>
        
        <p style={{ 
          fontFamily: "var(--font-main)", 
          color: "#888", 
          marginTop: "2rem", 
          marginBottom: "2rem",
          fontSize: "1.1rem"
        }}>
          System node does not exist. Initiating auto-reroute to root in <strong style={{ color: "white" }}>{seconds}s</strong>.
        </p>

        {/* Progress Bar styled to match system terminal */}
        <div style={{ width: "240px", height: "2px", background: "#222", marginBottom: "3rem", borderRadius: "10px" }}>
            <div style={{ 
                height: "100%", 
                background: "var(--accent)", 
                width: `${(seconds / 5) * 100}%`,
                transition: "width 1s linear"
            }}></div>
        </div>
        
        <div className="btn-group">
          <Link href="/" className="manual-btn" style={{ fontFamily: "var(--font-code)", letterSpacing: "2px" }}>
            [ REROUTE_MANUALLY ]
          </Link>
        </div>
      </div>
    </main>
  );
}