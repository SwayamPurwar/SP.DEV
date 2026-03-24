import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Footer() {
  const location = useLocation();
  const path = location.pathname;
  const [time, setTime] = useState(new Date());

  // Ticking Live Clock Logic
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isWorkPage = path.startsWith("/work/");

  // 1. REMOVED '/contact' from this hidden list so we can render a custom one
  if (
    path === "/resume" ||
    path === "/success" ||
    path === "/404" ||
    isWorkPage
  ) {
    return null;
  }

  // ==========================================
  // CUSTOM FOOTER FOR 'CONTACT' PAGE
  // ==========================================
  if (path === "/contact") {
    return (
      <footer
        id="footer"
        className="footer-contact"
        style={{
          minHeight: "auto",
          padding: "2rem 5vw",
          background: "transparent", // Blends with the contact page background
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div
          className="footer-copyright"
          style={{ marginTop: "0", borderTop: "none", paddingTop: "0" }}
        >
          <span>
            © {new Date().getFullYear()} Swayam Purwar. All rights reserved.
          </span>

          {/* Minimal Social Links for Contact Page */}

          <span style={{ fontFamily: "var(--font-code)", color: "#666" }}>
            [ LOC: BHOPAL, IN ]
          </span>
        </div>
      </footer>
    );
  }

  // ==========================================
  // CUSTOM FOOTER FOR 'ABOUT' PAGE
  // ==========================================
  if (path === "/about") {
    return (
      <footer
        id="footer"
        className="footer-about"
        style={{ minHeight: "auto", paddingTop: "2rem" }}
      >
        <div className="footer-content" style={{ borderTop: "none" }}>
          <div className="footer-top">
            <span className="footer-sub">NEXT_CHAPTER</span>
            <Link to="/#work" className="footer-cta mouse-hover">
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
                {time.toLocaleTimeString("en-US", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}{" "}
                IST
              </p>
              <span
                style={{
                  fontFamily: "var(--font-code)",
                  fontSize: "0.8rem",
                  color: "#666",
                }}
              >
                [ LOC: BHOPAL, IN ]
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
          <Link to="/contact" className="footer-cta mouse-hover">
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
              {time.toLocaleTimeString("en-US", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}{" "}
              IST
            </p>
            <span
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "0.8rem",
                color: "#666",
              }}
            >
              [ LOC: BHOPAL, IN ]
            </span>
          </div>
        </div>

        <div className="footer-copyright">
          <span>
            © {new Date().getFullYear()} Swayam Purwar. All rights reserved.
          </span>
          <span>SYSTEM // VITE + REACT 19 + GSAP</span>
        </div>
      </div>
    </footer>
  );
}
