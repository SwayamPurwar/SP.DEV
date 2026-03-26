import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { sfx } from "../utils/audio-system";

const VALID_WORK_ROUTES = new Set([
  "/work/apple-music",
  "/work/instagram",
  "/work/kite",
  "/work/ai-saas",
  "/work/CodeSenseAiSaas",
  "/work/CodeSenseAiSaas-casestudy",
  "/work/apple-music-casestudy",
  "/work/instagram-casestudy",
  "/work/kite-casestudy",
]);

const HIDDEN_ROUTES = new Set(["/resume", "/success"]);
const KNOWN_BASE_ROUTES = new Set(["/", "/about", "/contact"]);

export default function Navbar() {
  const [isMuted, setIsMuted] = useState(sfx.isMuted);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Handle scroll state for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll for focused mobile experience
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Listen for global mute toggles (e.g., from ResumeNavbar)
  useEffect(() => {
    const handleMuteChange = (e) => {
      setIsMuted(e.detail);
    };

    window.addEventListener("audioMuteToggled", handleMuteChange);
    return () => window.removeEventListener("audioMuteToggled", handleMuteChange);
  }, []);

  // Route Guarding
  const isKnownRoute =
    KNOWN_BASE_ROUTES.has(path) || VALID_WORK_ROUTES.has(path);
  if (HIDDEN_ROUTES.has(path) || !isKnownRoute) return null;

  const handleToggleSound = () => {
    const newMutedState = sfx.toggleMute();
    setIsMuted(newMutedState);
    if (!newMutedState) sfx.playHover(); // Audio feedback on activation
  };

  const handleNavClick = (e, targetId) => {
    setIsMenuOpen(false);
    if (path !== "/") {
      navigate(`/${targetId}`);
    } else {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderLinks = (isMobile = false) => {
    const linkClass = isMobile ? "mobile-link" : "nav-item mouse-hover";
    const closeAction = () => setIsMenuOpen(false);

    if (path === "/about") {
      return (
        <Link to="/contact" className={linkClass} onClick={closeAction}>
          Contact
        </Link>
      );
    }
    if (path === "/contact") {
      return (
        <a
          href="mailto:your@email.com"
          className={linkClass}
          onClick={closeAction}
        >
          Email Directly
        </a>
      );
    }
    if (path.startsWith("/work/")) {
      const label = path.includes("casestudy")
        ? "Exit Case Study"
        : "All Projects";
      return (
        <Link to="/#work" className={linkClass} onClick={closeAction}>
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
        <Link to="/about" className={linkClass} onClick={closeAction}>
          About
        </Link>
        <Link to="/contact" className={linkClass} onClick={closeAction}>
          Contact
        </Link>
      </>
    );
  };

  return (
    <>
      <nav
        id="main-nav"
        className={`${scrolled ? "scrolled" : ""} nav-${path.replace(/\//g, "") || "home"}`}
      >
        <Link
          to="/"
          className="logo mouse-hover"
          onClick={() => setIsMenuOpen(false)}
        >
          SP.DEV
        </Link>

        <div
          className="nav-right"
          style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}
        >
          <div className="nav-links" role="navigation">
            {renderLinks(false)}
          </div>

          {/* AUDIO TOGGLE BUTTON */}
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
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.6)}
          >
            {isMuted ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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

      <div
        className={`mobile-menu ${isMenuOpen ? "active" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-links-container">{renderLinks(true)}</div>
      </div>
    </>
  );
}