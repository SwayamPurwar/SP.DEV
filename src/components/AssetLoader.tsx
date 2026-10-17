// src/components/AssetLoader.tsx
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AssetLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const isFirstVisit = sessionStorage.getItem("visited") !== "true";
    
    if (!isFirstVisit) {
      gsap.set(containerRef.current, { display: "none" });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("visited", "true");
        gsap.set(containerRef.current, { display: "none" });
      },
    });

    tl.to(".loader-text", {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    tl.to(
      { value: 0 },
      {
        value: 100,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: function () {
          if (counterRef.current) {
            counterRef.current.textContent = Math.floor(
              this.targets()[0].value
            ).toString();
          }
        },
      }
    );

    tl.to(".loader-text, .loader-meta", { opacity: 0, duration: 0.3 });
    
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.inOut",
    });
  }, { scope: containerRef });

  // Add the manual override function
  const handleSkip = () => {
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.6,
      ease: "expo.inOut",
      onComplete: () => {
        sessionStorage.setItem("visited", "true");
        gsap.set(containerRef.current, { display: "none" });
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="preloader-container"
      role="status"
      aria-label="Loading assets"
      style={{ zIndex: 9999 }}
    >
      <div className="loader-content">
        <div className="counter-wrap">
          <span className="counter" ref={counterRef}>0</span>
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
      <div className="loader-meta bottom-left">LOADING ASSETS</div>
      
      {/* High-visibility skip button replacing the static text */}
      <button 
        onClick={handleSkip} 
        className="loader-meta bottom-right mouse-hover"
        style={{ 
          background: "transparent", 
          border: "none", 
          color: "#fff", 
          cursor: "pointer", 
          textDecoration: "underline",
          fontWeight: "bold"
        }}
      >
        [ SKIP SEQUENCE ]
      </button>
    </div>
  );
}