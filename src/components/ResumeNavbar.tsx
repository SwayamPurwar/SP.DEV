"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { sfx } from "@/utils/audio-system"; // Ensure path matches

export default function ResumeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(sfx.isMuted);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMuteChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMuted(customEvent.detail);
    };

    window.addEventListener("audioMuteToggled", handleMuteChange);
    return () => window.removeEventListener("audioMuteToggled", handleMuteChange);
  }, []);

  const handleToggleSound = () => {
    const newMutedState = sfx.toggleMute();
    setIsMuted(newMutedState);
    if (!newMutedState) sfx.playHover();
  };

  return (
    <nav
      id="main-nav"
      className={`${scrolled ? "scrolled" : ""} no-print`}
      style={{
        zIndex: 200000,
        mixBlendMode: "normal", 
      }}
    >
      <Link href="/" className="logo mouse-hover" onClick={() => window.scrollTo(0, 0)}>
        SP.DEV
      </Link>

      <div className="nav-right" style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={handleToggleSound}
          className="sound-toggle mouse-hover"
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          style={{
            background: "none",
            border: "none",
            color: "#fff", 
            display: "flex",
            alignItems: "center",
            opacity: 0.6,
            transition: "opacity 0.3s",
            cursor: "pointer",
            padding: "0" 
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
        >
          {isMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}