"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition() {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safe window check for Next.js SSR
    if (typeof window !== "undefined" && window.location.hash) return;

    let ctx = gsap.context(() => {
      if (curtainRef.current) {
        // Ensure the curtain starts "Full" if we manually triggered it
        // and then animate it down to 0
        gsap.fromTo(
          curtainRef.current,
          { scaleY: 1 },
          {
            scaleY: 0,
            duration: 1.2, 
            ease: "expo.inOut",
            delay: 0.1,
          },
        );
      }
    }, curtainRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
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
        transform: "scaleY(0)",
      }}
    ></div>
  );
}