"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Prevent animation from triggering if we are just scrolling to a hash link (like #work)
    if (typeof window !== "undefined" && window.location.hash) return;

    let ctx = gsap.context(() => {
      if (curtainRef.current) {
        // Ensure curtain starts fully covering the screen, then animates away to reveal the new page
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
  }, [pathname]); // <-- This tells it to run the animation every time the page changes!

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