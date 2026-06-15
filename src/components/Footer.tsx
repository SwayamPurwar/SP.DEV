"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const WORK_PROJECT_JUMPS = [
  { label: "Apple Music", href: "/work/apple-music" },
  { label: "Instagram", href: "/work/instagram" },
  { label: "Swayam Capital", href: "/work/swayam-capital" },
  { label: "RepoSage Prime", href: "/work/reposage-prime-aisaas" },
];

export default function Footer() {
  const pathname = usePathname() || "/";
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  // Ticking Live Clock Logic
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isWorkRootPage = pathname === "/work";
  const isWorkDetailPage = pathname.startsWith("/work/");
  const isAdminPage = pathname.startsWith("/admin/");

  useEffect(() => {
    const className = "work-route-active";

    if (isWorkRootPage) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }

    return () => {
      document.body.classList.remove(className);
    };
  }, [isWorkRootPage]);

  if (pathname === "/resume" || pathname === "/success") {
    return null;
  }

  if (isWorkRootPage) {
    return (
      <footer id="footer" className="footer-work">
        <div className="footer-work-content">
          <div className="footer-work-top">
            <div>
              <div className="footer-work-badges">
                <span className="footer-work-kicker">PROJECT ARCHIVE</span>
                <span className="footer-work-status">
                  AVAILABLE FOR Q2 COLLABS
                </span>
              </div>
              <h3 className="footer-work-title">BUILD SOMETHING BOLD</h3>
            </div>

            <div className="footer-work-links" aria-label="Quick links">
              <Link
                href="/contact"
                className="footer-work-link footer-work-cta mouse-hover"
              >
                Let&apos;s Build
              </Link>
              <Link href="/about" className="footer-work-link mouse-hover">
                About
              </Link>
              <Link href="/" className="footer-work-link mouse-hover">
                Home
              </Link>
            </div>
          </div>

          <div className="footer-work-meta">
            <p>
              Open to product design, full-stack builds, and experimental
              interfaces that blend engineering with cinematic interaction.
            </p>
            <div className="footer-work-clock mouse-hover">
              <span>SYSTEM TIME</span>
              <strong>
                {mounted
                  ? time.toLocaleTimeString("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})
                  : "--:--:--"}{" "}
                IST
              </strong>
            </div>
          </div>

          <div className="footer-work-bottom">
            <span>
              © {new Date().getFullYear()} Swayam Purwar. All rights reserved.
            </span>
            <span>[ LOC: CHENNAI, IN ]</span>
          </div>
        </div>
      </footer>
    );
  }

  // ==========================================
  // CUSTOM FOOTER FOR 'CONTACT' & 'WORK' PAGES
  // ==========================================
  if (pathname === "/contact" || isWorkDetailPage || isAdminPage) {
    return (
      <footer
        id="footer"
        className="footer-contact"
        style={{
          minHeight: "80px",
          padding: "2rem 5vw",
          background: "transparent",
        }}
      >
        <div
          className="footer-copyright"
          style={{ marginTop: "0", borderTop: "none", paddingTop: "0" }}
        >
          <span>
            © {new Date().getFullYear()} Swayam Purwar. All rights reserved.
          </span>

          <span style={{ fontFamily: "var(--font-code)", color: "#666" }}>
            [ LOC: CHENNAI, IN ]
          </span>
        </div>
      </footer>
    );
  }

  // ==========================================
  // CUSTOM FOOTER FOR 'ABOUT' PAGE
  // ==========================================
  if (pathname === "/about") {
    return (
      <footer
        id="footer"
        className="footer-about"
        style={{ minHeight: "auto", paddingTop: "2rem" }}
      >
        <div className="footer-content" style={{ borderTop: "none" }}>
          <div className="footer-top">
            <span className="footer-sub">NEXT_CHAPTER</span>
            <Link href="/work" className="footer-cta mouse-hover">
              VIEW PROJECTS
              <span className="cta-arrow">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </span>
            </Link>
          </div>

          <div className="footer-grid">
            <div className="footer-col">
              <h4>Social Network</h4>
              <div className="footer-socials">
                <a
                  href="https://www.linkedin.com/in/swayam-purwar/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link mouse-hover"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/SwayamPurwar/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link mouse-hover"
                >
                  GitHub
                </a>
                <a
                  href="https://x.com/swayampurwar?s=21"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link mouse-hover"
                >
                  Twitter / X
                </a>
              </div>
            </div>

            <div
              className="footer-col right-align"
              style={{ textAlign: "right" }}
            >
              <h4>System Time</h4>
              <p
                className="mouse-hover"
                style={{
                  fontFamily: "var(--font-code)",
                  fontSize: "1.2rem",
                  color: "#fff",
                  fontWeight: "500",
                  margin: "0 0 5px 0",
                  letterSpacing: "1px",
                }}
              >
                {mounted
                  ? time.toLocaleTimeString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })
                  : "--:--:--"}{" "}
                IST
              </p>
              <span
                style={{
                  fontFamily: "var(--font-code)",
                  fontSize: "0.8rem",
                  color: "#666",
                }}
              >
                [ LOC: CHENNAI, IN ]
              </span>
            </div>
          </div>

          <div className="footer-copyright">
            <span>
              © {new Date().getFullYear()} Swayam Purwar. All rights reserved.
            </span>
            <span>SYSTEM // READY FOR DEPLOYMENT</span>
          </div>
        </div>
      </footer>
    );
  }

  // ==========================================
  // DEFAULT FOOTER (HOME PAGE)
  // ==========================================
  return (
    <footer id="footer">
      <div className="footer-marquee">
        <div className="marquee-inner">
          <span>OPEN FOR OPPORTUNITIES</span>
          <span>✦</span>
          <span>AVAILABLE FOR FREELANCE</span>
          <span>✦</span>
          <span>CREATIVE DEVELOPER</span>
          <span>✦</span>
          <span>OPEN FOR OPPORTUNITIES</span>
          <span>✦</span>
          <span>AVAILABLE FOR FREELANCE</span>
          <span>✦</span>
          <span>CREATIVE DEVELOPER</span>
          <span>✦</span>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-top">
          <span className="footer-sub">INITIATE_PROJECT</span>
          <Link href="/contact" className="footer-cta mouse-hover">
            LET'S TALK
            <span className="cta-arrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </span>
          </Link>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h4>Social Network</h4>
            <div className="footer-socials">
              <a
                href="https://www.linkedin.com/in/swayam-purwar/"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link mouse-hover"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/SwayamPurwar/"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link mouse-hover"
              >
                GitHub
              </a>
              <a
                href="https://x.com/swayampurwar?s=21"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link mouse-hover"
              >
                Twitter / X
              </a>
            </div>
          </div>

          <div
            className="footer-col right-align"
            style={{ textAlign: "right" }}
          >
            <h4>System Time</h4>
            <p
              className="mouse-hover"
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "1.2rem",
                color: "#fff",
                fontWeight: "500",
                margin: "0 0 5px 0",
                letterSpacing: "1px",
              }}
            >
              {mounted
                ? time.toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })
                : "--:--:--"}{" "}
              IST
            </p>
            <span
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.8rem",
                color: "#666",
              }}
            >
              [ LOC: CHENNAI, IN ]
            </span>
          </div>
        </div>

        <div className="footer-copyright">
          <span>
            © {new Date().getFullYear()} Swayam Purwar. All rights reserved.
          </span>
          {/* Updated to Next.js! */}
          <span>SYSTEM // NEXT.JS + REACT 19 + GSAP</span>
        </div>
      </div>
    </footer>
  );
}
