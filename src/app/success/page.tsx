"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

export default function Success() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [countdown, setCountdown] = useState(6);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 1. SECURITY & ANIMATION LOGIC
  useEffect(() => {
    if (typeof window === "undefined") return;

    // --- SECURITY GUARD ---
    const hasSubmitted = sessionStorage.getItem("contactSubmitted");
    if (!hasSubmitted) {
      // If they didn't submit the form, kick them out immediately
      router.replace("/");
      return;
    }

    // If they are authorized, clear the token so they can't just refresh the page
    sessionStorage.removeItem("contactSubmitted");
    setIsAuthorized(true);
    // ----------------------

    // Only run animations if authorized
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    }
  }, [router]);

  // 2. COUNTDOWN LOGIC
  useEffect(() => {
    if (!isAuthorized) return; // Don't count down if they are being kicked out

    if (countdown === 0) {
      router.push("/");
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, router, isAuthorized]);

  // Prevent flashing the UI before the security check finishes
  if (!isAuthorized) return null;

  return (
    <>
      <div className="grid-bg"></div>
      <div className="orb orb-1" style={{ opacity: 0.1, filter: "blur(100px)", background: "var(--accent)" }}></div>

      <main 
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem"
        }}
      >
        <div ref={containerRef} style={{ maxWidth: "600px" }}>
          <div 
            style={{ 
              width: "60px", 
              height: "60px", 
              borderRadius: "50%", 
              background: "rgba(255,255,255,0.1)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              margin: "0 auto 2rem auto",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "30px", height: "30px", color: "white" }}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", marginBottom: "1rem", color: "white" }}>
            Transmission<br/>Received.
          </h1>
          
          <p style={{ fontFamily: "var(--font-body)", color: "#888", fontSize: "1.1rem", marginBottom: "3rem", lineHeight: "1.6" }}>
            Your data payload has been successfully delivered to my system. 
            I typically respond within 24-48 hours. Looking forward to connecting.
          </p>

          <p style={{ fontFamily: "var(--font-code)", color: "var(--accent)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Auto-redirecting in {countdown}s...
          </p>

          <Link
            href="/"
            className="mouse-hover"
            style={{
              display: "inline-block",
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "100px",
              color: "#fff",
              fontFamily: "var(--font-code)",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "2px",
              padding: "16px 40px",
              transition: "all 0.3s ease",
              cursor: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "black";
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}