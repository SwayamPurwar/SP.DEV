import { interactiveSelector } from "./constants";
import gsap from "gsap";

let clockInterval: NodeJS.Timeout;

declare global {
  interface Window {
    initiateContact: () => string;
  }
}

export function initUtils() {
  if (typeof window === "undefined") return () => {};

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
  let xTo: gsap.QuickToFunc, yTo: gsap.QuickToFunc;

  const handleMouseMoveCursor = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isTerminal = target.closest("#cmd-terminal");
    
    if (cursor) {
        cursor.style.opacity = "1";
    }

    // Always follow the actual mouse coordinates smoothly
    if (xTo) xTo(e.clientX);
    if (yTo) yTo(e.clientY);
  };
  const handleMouseOverCursor = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(interactiveSelector) && !target.closest("#cmd-terminal")) {
      cursor?.classList.add("hovered");
    }
  };
  // Add this inside initUtils() where your other event listeners are
    const handleMouseClickReset = () => {
      if (cursor) cursor.classList.remove("hovered");
    };
    
    document.body.addEventListener("click", handleMouseClickReset);

  const handleMouseOutCursor = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(interactiveSelector)) cursor?.classList.remove("hovered");
  };

  const handleKeyDownTab = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      document.body.classList.add("user-is-tabbing");
      if (cursor) cursor.style.display = "none";
    }
  };

  const handleMouseMoveTabReset = () => {
    document.body.classList.remove("user-is-tabbing");
    if (cursor) cursor.style.display = "block";
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

    window.addEventListener("keydown", handleKeyDownTab);
    window.addEventListener("mousemove", handleMouseMoveTabReset);
  }

  // --- 3. YEAR & CLOCK ---
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear().toString();

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
  let handleGlowMove: (e: MouseEvent) => void;

  if (glow) {
    handleGlowMove = (e: MouseEvent) => {
      const xPct = (e.clientX / window.innerWidth) * 100;
      const yPct = (e.clientY / window.innerHeight) * 100;

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

  // --- 5. THE ULTIMATE SECRET CONSOLE EXPERIENCE ---
  const titleStyle = "color: #050505; background: #bfa5d8; font-size: 24px; font-weight: 900; padding: 10px 20px; border-radius: 6px; font-family: 'Fira Code', monospace; line-height: 2;";
  const subStyle = "color: #bfa5d8; font-size: 13px; font-style: italic; font-family: monospace; padding-bottom: 10px;";
  const textStyle = "color: #e2e8f0; font-size: 14px; font-family: sans-serif; line-height: 1.5;";
  const highlightStyle = "color: #050505; background: #bfa5d8; font-size: 14px; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-weight: bold;";

  setTimeout(() => {
    console.log(
      "%c SWAYAM PURWAR %c \n" +
      "%cWelcome to the developer tools. Let's build something beautiful.%c \n\n" +
      "Check out the terminal on the UI, or drop me a line.",
      "font-size: 50px; font-weight: 900; color: transparent; -webkit-text-stroke: 1px #bfa5d8; text-shadow: 3px 3px 0px #8a2387, 6px 6px 0px #050505; letter-spacing: 5px; line-height: 1.2;",
      "",
      "font-family: 'Inter', sans-serif; font-size: 14px; color: #e2e8f0; background: #1a1a1a; padding: 8px 16px; border-radius: 20px; border: 1px solid #333;",
      ""
    );

    console.log("%c✦ S.A.M. OS BY SP.DEV ✦", titleStyle);
    console.log("%c[SYSTEM MESSAGE]: Curious developer detected in the mainframe.", subStyle);
    console.log(
      "%cIf you are reading this, you are exactly the kind of curious person I want to work with.\n\n" +
      "Most people just look at the UI. You look under the hood. Let's build something incredible together.\n\n" +
      "To initiate a secure connection protocol, type %cinitiateContact()%c and hit Enter.",
      textStyle,
      highlightStyle,
      textStyle
    );
  }, 1000);

  window.initiateContact = () => {
    let dots = 0;
    console.log("%c[SYSTEM]: Bypassing security firewalls...", "color: #bfa5d8; font-family: monospace; font-size: 14px;");
    
    const loading = setInterval(() => {
      dots++;
      if (dots === 3) {
        clearInterval(loading);
        console.log("%c[SUCCESS]: Handshake complete. Launching comms link...", "color: #4ade80; font-family: monospace; font-size: 14px; font-weight: bold;");
        setTimeout(() => {
          window.open("mailto:swayampurwar111104@gmail.com?subject=S.A.M.%20OS%20Connection%20Established&body=Hey%20Swayam,%0A%0AI%20found%20your%20secret%20console%20command!%20Let's%20talk.");
        }, 1000);
      }
    }, 800);
    return "Executing protocol...";
  };

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