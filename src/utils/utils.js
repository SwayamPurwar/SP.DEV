import { interactiveSelector } from "./constants.js";
import gsap from "gsap";

// To prevent interval stacking globally during HMR
let clockInterval;

export function initUtils() {
  // --- 1. NAV SCROLL EFFECT ---
  const nav = document.querySelector("nav");
  const handleScroll = () => {
    if (nav) {
      if (window.scrollY > 50) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);

  // --- 2. CUSTOM CURSOR ---
  const cursor = document.getElementById("cursor");
  let xTo, yTo;

  const handleMouseMoveCursor = (e) => {
    const isTerminal = e.target.closest("#cmd-terminal");
    if (isTerminal) {
      cursor.style.opacity = 0;
      return;
    } else {
      cursor.style.opacity = 1;
    }

    const magnetTarget = e.target.closest(interactiveSelector);
    const isBigCard = magnetTarget
      ? magnetTarget.matches(".project-link, .project, .hero-text")
      : false;

    if (magnetTarget && !isBigCard) {
      const rect = magnetTarget.getBoundingClientRect();
      xTo(rect.left + rect.width / 2);
      yTo(rect.top + rect.height / 2);
    } else {
      xTo(e.clientX);
      yTo(e.clientY);
    }
  };

  const handleMouseOverCursor = (e) => {
    if (
      e.target.closest(interactiveSelector) &&
      !e.target.closest("#cmd-terminal")
    ) {
      cursor.classList.add("hovered");
    }
  };

  const handleMouseOutCursor = (e) => {
    if (e.target.closest(interactiveSelector))
      cursor.classList.remove("hovered");
  };

  const handleKeyDownTab = (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("user-is-tabbing");
      cursor.style.display = "none";
    }
  };

  const handleMouseMoveTabReset = () => {
    document.body.classList.remove("user-is-tabbing");
    cursor.style.display = "block";
  };

  if (cursor) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3.out" });
    yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3.out" });

    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", handleMouseMoveCursor);
      document.body.addEventListener("mouseover", handleMouseOverCursor);
      document.body.addEventListener("mouseout", handleMouseOutCursor);
    }

    // Accessibility Fix
    window.addEventListener("keydown", handleKeyDownTab);
    window.addEventListener("mousemove", handleMouseMoveTabReset);
  }

  // --- 3. YEAR & CLOCK ---
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  function updateLiveClock() {
    const clockElement = document.getElementById("live-clock");
    if (clockElement) {
      clockElement.textContent =
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " IST";
    }
  }

  updateLiveClock();
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(updateLiveClock, 1000);

  // --- 4. UPDATED AMBIENT GLOW LOGIC ---
  const glow = document.getElementById("ambient-glow");
  let handleGlowMove;

  if (glow) {
    handleGlowMove = (e) => {
      // Convert mouse position to percentages
      const xPct = (e.clientX / window.innerWidth) * 100;
      const yPct = (e.clientY / window.innerHeight) * 100;

      // Use GSAP to smoothly animate the CSS variables
      gsap.to(glow, {
        "--mouse-x": `${xPct}%`,
        "--mouse-y": `${yPct}%`,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", handleGlowMove);
  }
  console.log(
    "%c SWAYAM.DEV ",
    "color:#050505;background:#bfa5d8;font-size:20px;font-weight:bold;padding:10px;border-radius:5px;",
  );

  // 🚨 CLEANUP FUNCTION (Crucial for React!)
  return () => {
    window.removeEventListener("scroll", handleScroll);
    if (clockInterval) clearInterval(clockInterval);

    if (cursor) {
      window.removeEventListener("mousemove", handleMouseMoveCursor);
      document.body.removeEventListener("mouseover", handleMouseOverCursor);
      document.body.removeEventListener("mouseout", handleMouseOutCursor);
      window.removeEventListener("keydown", handleKeyDownTab);
      window.removeEventListener("mousemove", handleMouseMoveTabReset);
    }

    if (glow && handleGlowMove) {
      window.removeEventListener("mousemove", handleGlowMove);
    }
  };
}
