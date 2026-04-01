"use client"; // Required for browser APIs and global scripts

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Modules (Ensure these paths match your Next.js project structure)
import { initAudio } from "@/utils/audio-system";
import { initAnimations } from "@/utils/animations";
import { initUtils } from "@/utils/utils";
import { initEasterEggs } from "@/utils/easter-eggs";
import { initTerminal } from "@/utils/terminal";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Run global initializations on mount
  useEffect(() => {
    initAudio();
    const cleanupAnimations = initAnimations();
    const cleanupUtils = initUtils();
    const cleanupEasterEggs = initEasterEggs();

    // Timer ensures the DOM is fully painted before the terminal script searches for it
    const timer = setTimeout(() => {
      initTerminal();
    }, 100);
    

    return () => {
      clearTimeout(timer);
      if (typeof cleanupAnimations === "function") cleanupAnimations();
      if (typeof cleanupUtils === "function") cleanupUtils();
      if (typeof cleanupEasterEggs === "function") cleanupEasterEggs();
    };
  }, []);

// --- ADD THIS BLOCK TO PREVENT ZOOM ---
  useEffect(() => {
    // 1. Prevent multi-touch zoom (pinch-to-zoom)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 2. Prevent double-tap to zoom on specific elements (optional but recommended)
    let lastTouchTime = 0;
    const handleDoubleTap = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchTime < 300) {
        e.preventDefault();
      }
      lastTouchTime = now;
    };

    // 3. Prevent iOS "gesture" zooming
    const handleGestureStart = (e: Event) => {
      e.preventDefault();
    };

    // Passive: false is required to allow e.preventDefault() to work
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchstart", handleDoubleTap, { passive: false });
    document.addEventListener("gesturestart", handleGestureStart, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchstart", handleDoubleTap);
      document.removeEventListener("gesturestart", handleGestureStart);
    };
  }, []);
  // --------------------------------------
  
  
// SCROLL TO TOP AUTOMATICALLY WHEN ROUTE CHANGES (Bulletproof Version)
  useEffect(() => {
    const forceScrollToTop = () => {
      // 1. Force native browser scroll
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // 2. Force Lenis (Smooth Scroller) to reset instantly
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.scrollTo(0, { immediate: true });
      }
    };

    // Trigger 1: Fire instantly on click
    forceScrollToTop();

    // Trigger 2: Fire right after Next.js injects the new DOM nodes (50ms)
    const timer1 = setTimeout(() => {
      forceScrollToTop();
    }, 50);

    // Trigger 3: Fire when the GSAP curtain has fully covered the screen (400ms)
    // This guarantees the user is at the top before the curtain reveals the new page
    const timer2 = setTimeout(() => {
      forceScrollToTop();
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);
  
  useEffect(() => {
  const terminal = document.getElementById("cmd-terminal");
  if (!terminal) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        const isActive = terminal.classList.contains("active");
        // Force the body to lock/unlock
        document.body.style.overflow = isActive ? "hidden" : "";
        // document.body.style.touchAction = isActive ? "none" : "auto";
      }
    });
  });

  observer.observe(terminal, { attributes: true });
  return () => observer.disconnect();
}, []);

  return (
    <>
      <div id="ambient-glow" aria-hidden="true"></div>
      <div id="cursor" aria-hidden="true"></div>

      {/* --- GOD MODE TERMINAL HTML --- */}
      <div id="cmd-terminal" aria-hidden="true" inert={true as any}>
        <div className="cmd-header">
          <span>SWAYAM.OS [VERSION 1.0.0]</span>
          <span>ADMIN ACCESS: GRANTED</span>
          <span
            id="cmd-close-mobile"
            onClick={() =>
              document.getElementById("cmd-terminal")?.classList.remove("active")
            }
            style={{ cursor: "pointer" }}
          >
            X
          </span>
        </div>
        <div id="cmd-output" className="cmd-output" data-lenis-prevent="true">
          <div>
            Welcome to S.A.M. Terminal. Type 'help' to see available commands.
          </div>
        </div>
        <div className="cmd-input-line">
          <span className="cmd-prompt">user@swayam:~$</span>
          <input
            type="text"
            id="cmd-input"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
      {/* ------------------------------ */}

      {/* Render the actual page content here */}
      {children}
    </>
  );
}