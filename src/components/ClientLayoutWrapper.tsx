// src/components/ClientLayoutWrapper.tsx
"use client"; // Required for browser APIs and global scripts

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis"; // Added Lenis import

// Modules
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

  // --- LENIS INITIALIZATION ---
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true, 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    });

    // Attach to window so your route change "scrollTo" logic can access it
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);
  // ----------------------------

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

  // Prevent Zoom
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTouchTime = 0;
    const handleDoubleTap = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchTime < 300) {
        e.preventDefault();
      }
      lastTouchTime = now;
    };

    const handleGestureStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchstart", handleDoubleTap, { passive: false });
    document.addEventListener("gesturestart", handleGestureStart, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchstart", handleDoubleTap);
      document.removeEventListener("gesturestart", handleGestureStart);
    };
  }, []);
  
  // SCROLL TO TOP AUTOMATICALLY WHEN ROUTE CHANGES
  useEffect(() => {
    const forceScrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.scrollTo(0, { immediate: true });
      }
    };

    forceScrollToTop();
    const timer1 = setTimeout(() => forceScrollToTop(), 50);
    const timer2 = setTimeout(() => forceScrollToTop(), 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);
  
  // Terminal Observer
  useEffect(() => {
    const terminal = document.getElementById("cmd-terminal");
    if (!terminal) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isActive = terminal.classList.contains("active");
          document.body.style.overflow = isActive ? "hidden" : "";
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

      {/* GOD MODE TERMINAL */}
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

      {children}
    </>
  );
}