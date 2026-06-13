// src/app/template.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (curtainRef.current) {
        gsap.fromTo(
          curtainRef.current,
          { scaleY: 1 },
          {
            scaleY: 0,
            duration: 1.2,
            ease: "expo.inOut",
            delay: 0.1,
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={curtainRef}
        className="page-transition-curtain"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#050505", 
          zIndex: 999999,
          pointerEvents: "none",
          transformOrigin: "top", 
        }}
      />
      {children}
    </>
  );
}