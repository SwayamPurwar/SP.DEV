"use client"; // Required for browser APIs and global scripts

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Global Components
import PageTransition from "./PageTransition";

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

  // Replace <ScrollToTop /> component: Scroll to top automatically when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
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
      <PageTransition />

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