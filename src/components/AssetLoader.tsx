"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AssetLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const container = containerRef.current;

      if (!container) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      let hasVisited = false;

      try {
        hasVisited =
          sessionStorage.getItem("visited") === "true";
      } catch {
        // Continue without session storage if unavailable.
      }

      if (hasVisited || prefersReducedMotion) {
        gsap.set(container, { display: "none" });
        return;
      }

      const counter = { value: 0 };

      const timeline = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem("visited", "true");
          } catch {
            // The loader can still finish without storage.
          }

          gsap.set(container, { display: "none" });
        },
      });

      timelineRef.current = timeline;

      timeline.to(".loader-text", {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });

      timeline.to(
        counter,
        {
          value: 100,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(
                Math.floor(counter.value)
              );
            }
          },
        },
        0
      );

      timeline.to(
        ".loader-text, .loader-meta",
        {
          opacity: 0,
          duration: 0.15,
        },
        "-=0.1"
      );

      timeline.to(container, {
        yPercent: -100,
        duration: 0.35,
        ease: "power3.inOut",
      });

      timeline.call(() => {
        try {
          sessionStorage.setItem("visited", "true");
        } catch {
          // Ignore storage errors.
        }
      });
    },
    { scope: containerRef }
  );

  const handleSkip = () => {
    const container = containerRef.current;

    if (!container) return;

    timelineRef.current?.kill();

    gsap.to(container, {
      yPercent: -100,
      duration: 0.2,
      ease: "power2.out",
      overwrite: true,
      onComplete: () => {
        try {
          sessionStorage.setItem("visited", "true");
        } catch {
          // Ignore storage errors.
        }

        gsap.set(container, { display: "none" });
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="preloader-container"
      role="status"
      aria-label="Portfolio introduction"
      style={{ zIndex: 9999 }}
    >
      <div className="loader-content">
        <div className="counter-wrap">
          <span className="counter" ref={counterRef}>
            0
          </span>
          <span className="percent">%</span>
        </div>

        <div className="loader-text" style={{ opacity: 0 }}>
          INITIALIZING SYSTEM
        </div>
      </div>

      <div className="loader-meta top-left">SP.DEV</div>

      <div className="loader-meta top-right">
        PORTFOLIO ©{new Date().getFullYear()}
      </div>

      <div className="loader-meta bottom-left">
        LOADING EXPERIENCE
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="loader-meta bottom-right mouse-hover"
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          textDecoration: "underline",
          fontWeight: "bold",
        }}
      >
        [ SKIP SEQUENCE ]
      </button>
    </div>
  );
}