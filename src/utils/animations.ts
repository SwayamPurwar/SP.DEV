import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { interactiveSelector } from "./constants";

gsap.registerPlugin(ScrollTrigger);

// Tell TypeScript that window.lenis exists
declare global {
  interface Window {
    lenis: any;
  }
}

// ==========================================
// 🚨 EXPORTED SCROLL LOCK HELPERS 🚨
// ==========================================
function preventScroll(e: Event) {
  const keys = [
    "Space", "ArrowUp", "ArrowDown", "ArrowLeft", 
    "ArrowRight", "PageUp", "PageDown", "Home", "End",
  ];
  if (e.type === "keydown" && !keys.includes((e as KeyboardEvent).code)) return;
  e.preventDefault();
  e.stopPropagation();
  return false;
}

export function lockScroll() {
  if (typeof window === "undefined") return;
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("keydown", preventScroll, { passive: false });

  if (window.lenis) {
    window.lenis.stop();
  }
}

export function unlockScroll() {
  if (typeof window === "undefined") return;
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  window.removeEventListener("wheel", preventScroll);
  window.removeEventListener("touchmove", preventScroll);
  window.removeEventListener("keydown", preventScroll);

  if (window.lenis) {
    window.lenis.start();
  }
}

// ==========================================
// GLOBAL ANIMATIONS
// ==========================================
export function initAnimations() {
  if (typeof window === "undefined") return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenis: any;
  let tickerCallback: gsap.TickerCallback;

  // Set js-loaded class immediately since page.tsx handles the actual loader sequence
  document.body.classList.add("js-loaded");

  // --- BUTTERY SMOOTH SCROLLING ---
  if (!prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      infinite: false,
    });

    window.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
  }

  // --- ENHANCED MAGNETIC BUTTONS ---
  const handleMouseMove = (e: MouseEvent) => {
    const magnet = (e.target as HTMLElement).closest(interactiveSelector) as HTMLElement;
    if (magnet) {
      const strength = parseInt(magnet.getAttribute("data-strength") || "40", 10);
      const bounding = magnet.getBoundingClientRect();
      const newX = (e.clientX - bounding.left) / magnet.offsetWidth - 0.5;
      const newY = (e.clientY - bounding.top) / magnet.offsetHeight - 0.5;

      gsap.to(magnet, {
        duration: 0.6,
        x: newX * strength,
        y: newY * strength,
        ease: "power3.out",
      });
    }
  };

  const handleMouseOut = (e: MouseEvent) => {
    const magnet = (e.target as HTMLElement).closest(interactiveSelector) as HTMLElement;
    if (magnet && !magnet.classList.contains("project-link")) {
      gsap.to(magnet, {
        duration: 1.2,
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    }
  };

  if (!prefersReducedMotion) {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);
  }

  return () => {
    if (lenis) {
      lenis.destroy(); 
      delete window.lenis; 
      if (tickerCallback) gsap.ticker.remove(tickerCallback); 
    }
    if (!prefersReducedMotion) {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
    }
  };
}