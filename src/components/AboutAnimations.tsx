"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text Reveal
      gsap.fromTo(".a-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(".bio-text p, .info-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.5 }
      );

      // 2. Profile Card Reveal (Initial Load)
      gsap.set(".bio-img-wrapper", { perspective: 1000 });
      gsap.set(".bio-img", { filter: "grayscale(100%) contrast(1)" });

      gsap.fromTo(".bio-img-wrapper", 
        { rotateY: 90, opacity: 0 },
        {
          scrollTrigger: { trigger: ".bio-section", start: "top 70%" },
          rotateY: 0, 
          opacity: 1, 
          duration: 1.5, 
          ease: "power3.out"
        }
      );

      gsap.to(".bio-img", {
        scrollTrigger: { trigger: ".bio-section", start: "top 70%" },
        filter: "grayscale(0%) contrast(1.1)", 
        duration: 2.5, 
        ease: "power2.out", 
        delay: 0.5
      });

      // 3. ULTRA-SUBTLE Scroll Parallax Rotation
      gsap.to(".bio-card", {
        scrollTrigger: {
          trigger: ".bio-section",
          start: "top top",
          end: "bottom bottom",
          scrub: 3, // Very slow catch-up time (3 seconds)
        },
        rotation: 2,  // BARELY ROTATES (Just 2 degrees total)
        y: 20,        // BARELY MOVES DOWN (Just 20px total)
        ease: "none"
      });

    });

    return () => ctx.revert();
  }, []);

  return null;
}