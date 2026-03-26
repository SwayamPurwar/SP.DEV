"use client"; 

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { sfx } from "../utils/audio-system"; 

const VALID_WORK_ROUTES = new Set([
  "/work/apple-music",
  "/work/instagram",
  "/work/kite",
  "/work/ai-saas",
  "/work/codesense-aisaas",
  "/work/codesense-aisaas-casestudy",
  "/work/apple-music-casestudy",
  "/work/instagram-casestudy",
  "/work/kite-casestudy",
]);

const HIDDEN_ROUTES = new Set(["/resume", "/success",]);
const KNOWN_BASE_ROUTES = new Set(["/", "/about", "/contact"]);

export default function Navbar() {
  const [isMuted, setIsMuted] = useState(sfx.isMuted);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // NEW: State and Ref for scroll-to-hide logic
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  const pathname = usePathname() || "/"; // Fallback to avoid null
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 1. Toggle frosted glass background
      setScrolled(currentScrollY > 50);
// Prevent iOS bounce effect at the top of the page from triggering hide
      if (currentScrollY <= 0) {
        setIsHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 80 && !isMenuOpen) {
        setIsHidden(true); // Scrolling down
      } else if (currentScrollY < lastScrollY.current) {
        setIsHidden(false); // Scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);
  
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // We type 'e' as Event, or CustomEvent if we want to be strict
    const handleMuteChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMuted(customEvent.detail);
    };

    window.addEventListener("audioMuteToggled", handleMuteChange);
    return () => window.removeEventListener("audioMuteToggled", handleMuteChange);
  }, []);

  const isKnownRoute = KNOWN_BASE_ROUTES.has(pathname) || VALID_WORK_ROUTES.has(pathname);
  if (HIDDEN_ROUTES.has(pathname) || !isKnownRoute) return null;

  const handleToggleSound = () => {
    const newMutedState = sfx.toggleMute();
    setIsMuted(newMutedState);
    if (!newMutedState) sfx.playHover(); 
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsMenuOpen(false);
    if (pathname !== "/") {
      router.push(`/${targetId}`);
    } else {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderLinks = (isMobile = false) => {
    const linkClass = isMobile ? "mobile-link" : "nav-item mouse-hover";
    const closeAction = () => setIsMenuOpen(false);

    if (pathname === "/about") {
      return (
        <Link href="/contact" className={linkClass} onClick={closeAction}>
          Contact
        </Link>
      );
    }
    if (pathname === "/contact") {
      return (
        <a href="mailto:your@email.com" className={linkClass} onClick={closeAction}>
          Email Directly
        </a>
      );
    }
    if (pathname.startsWith("/work/")) {
      const label = pathname.includes("casestudy") ? "Exit Case Study" : "All Projects";
      return (
        <Link href="/#work" className={linkClass} onClick={closeAction}>
          {label}
        </Link>
      );
    }

    return (
      <>
        <a
          href="#work"
          onClick={(e) => handleNavClick(e, "#work")}
          className={linkClass}
        >
          Work
        </a>
        <Link href="/about" className={linkClass} onClick={closeAction}>
          About
        </Link>
        <Link href="/contact" className={linkClass} onClick={closeAction}>
          Contact
        </Link>
      </>
    );
  };

  return (
    <>
      <nav
        id="main-nav"
        className={`${scrolled ? "scrolled" : ""} nav-${pathname.replace(/\//g, "") || "home"} ${isHidden ? "nav-hidden" : ""} `}
        // NEW: Inline style to transform the nav out of view. 
        // We override this if the mobile menu is open so it doesn't accidentally hide the close button!
        style={{
          transform: isHidden && !isMenuOpen ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <Link href="/" className="logo mouse-hover" onClick={() => setIsMenuOpen(false)}>
          SP.DEV
        </Link>

        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          <div className="nav-links" role="navigation">
            {renderLinks(false)}
          </div>

          <button
            onClick={handleToggleSound}
            className="sound-toggle mouse-hover"
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "none",
              display: "flex",
              alignItems: "center",
              opacity: 0.6,
              transition: "opacity 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
          </button>

          <button
            className={`menu-toggle mouse-hover ${isMenuOpen ? "active" : ""}`}
            aria-label="Toggle Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`} aria-hidden={!isMenuOpen}>
        <div className="mobile-links-container">{renderLinks(true)}</div>
      </div>
    </>
  );
}