import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import "../assets/css/resume.css";

export default function Resume() {
  const [clientCity, setClientCity] = useState("Scanning...");
  const [clientIp, setClientIp] = useState("***.***.*.*");
  const [clientTime, setClientTime] = useState("--:--");
  const [hostTime, setHostTime] = useState("--:--");
  const [distance, setDistance] = useState("0 km");
  const [ping, setPing] = useState("0 ms");
  const [os, setOs] = useState("Analyzing...");

  // Smooth, high-performance mouse tracking for minimal glow
  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.querySelectorAll(".minimal-card").forEach((card) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Telemetry Logic
  useEffect(() => {
    const HOST_LAT = 23.2599;
    const HOST_LON = 77.4126;

    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error("API Limit");
        setClientCity(data.city || "Unknown");
        setClientIp(
          data.ip
            ? data.ip.split(".").map((p, i) => (i > 1 ? "***" : p)).join(".")
            : "Hidden"
        );

        if (data.latitude && data.longitude) {
          const R = 6371;
          const dLat = (data.latitude - HOST_LAT) * (Math.PI / 180);
          const dLon = (data.longitude - HOST_LON) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(HOST_LAT * (Math.PI / 180)) *
              Math.cos(data.latitude * (Math.PI / 180)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const dist = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
          setDistance(`${dist.toLocaleString()} km`);
          setPing(`${Math.round(dist / 500 + 8)} ms`);
        } else {
          setDistance("Unknown");
          setPing("Unknown ms");
        }
      })
      .catch(() => {
        setClientCity("Stealth Mode");
        setClientIp("127.0.0.1");
      });

    setOs(navigator.platform || "Unknown OS");
    const timer = setInterval(() => {
      const now = new Date();
      setHostTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setClientTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="resume-page">
      <SEO
        title="Swayam Purwar - MERN Full Stack"
        description="Minimal & Premium Resume and Portfolio of Swayam Purwar."
      />

      {/* Background Noise */}
      <div className="noise-bg"></div>

      <main className="resume-main">
        <div className="resume-grid">
          
          {/* PROFILE CARD */}
          <section className="minimal-card profile-card animate-enter" style={{ animationDelay: "0.1s" }}>
            <div className="profile-header">
              <img
                src="/assets/images/profile/profile.webp"
                alt="Swayam Purwar"
                className="profile-img"
              />
              <div className="status-badge">
                <span className="status-dot-container">
                  <span className="status-dot-ping"></span>
                  <span className="status-dot"></span>
                </span>
                <span className="status-text">Available</span>
              </div>
            </div>

            <div className="profile-content">
              <div>
                <h1 className="profile-name">Swayam Purwar.</h1>
                <p className="profile-title">MERN Full Stack Engineer</p>
              </div>
              <p className="profile-bio">
                Architecting high-performance web applications. I bridge the gap
                between sophisticated design and robust backend architecture,
                focusing on clean code and minimal interfaces.
              </p>
              <div className="profile-actions no-print">
                <a href="/assets/docs/Swayam-Purwar-Resume.pdf" download className="solid-btn">
                  Download Resume
                </a>
                <div className="social-links">
                  <a href="https://github.com/SwayamPurwar" target="_blank" rel="noreferrer" className="outline-btn icon-btn">
                    <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                  <a href="https://linkedin.com/in/swayam-purwar" target="_blank" rel="noreferrer" className="outline-btn icon-btn">
                    <svg viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.306c0-4.613 9.289-5.124 9.289 0v8.306h5v-10.306c0-6.117-7.025-6.32-9.632-3.132v-2.56z" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* TELEMETRY DASHBOARD */}
          <section className="minimal-card telemetry-card animate-enter" style={{ animationDelay: "0.2s" }}>
            <div className="telemetry-header">
              <h3 className="section-subtitle">System Status</h3>
              <p className="status-indicator-text">SECURE CONNECTION</p>
            </div>

            <div className="telemetry-nodes">
              <div className="node-info">
                <span className="node-label">Client</span>
                <div className="node-details">
                  <span className="node-city">{clientCity}</span>
                  <span className="node-time">{clientTime}</span>
                </div>
              </div>
              
              <div className="connection-line">
                <div className="connection-sweep"></div>
              </div>

              <div className="node-info">
                <span className="node-label">Host</span>
                <div className="node-details">
                  <span className="node-city">Bhopal, IND</span>
                  <span className="node-time">{hostTime}</span>
                </div>
              </div>
            </div>

            <div className="telemetry-stats">
              <div className="stat-row">
                <span className="stat-label">IP</span>
                <span className="stat-value">{clientIp}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">OS</span>
                <span className="stat-value">{os}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Dist</span>
                <span className="stat-value">{distance}</span>
              </div>
              <div className="stat-row no-border">
                <span className="stat-label">Ping</span>
                <span className="stat-value">{ping}</span>
              </div>
            </div>
          </section>

          {/* TECH STACK CARD */}
          <section className="minimal-card full-width-card tech-card animate-enter" style={{ animationDelay: "0.3s" }}>
            <h3 className="section-subtitle">Technical Arsenal</h3>
            <div className="tech-grid">
              <div className="tech-col">
                <h4 className="tech-col-title">Front-End</h4>
                <ul className="tech-list">
                  <li>React.js / Next.js</li>
                  <li>Tailwind CSS / Vanilla CSS</li>
                  <li>GSAP / Framer</li>
                  <li>Three.js / WebGL</li>
                </ul>
              </div>
              <div className="tech-col">
                <h4 className="tech-col-title">Back-End</h4>
                <ul className="tech-list">
                  <li>Node.js</li>
                  <li>Express.js</li>
                  <li>RESTful APIs</li>
                  <li>WebSockets</li>
                </ul>
              </div>
              <div className="tech-col">
                <h4 className="tech-col-title">Database</h4>
                <ul className="tech-list">
                  <li>MongoDB</li>
                  <li>MySQL</li>
                  <li>Redis</li>
                  <li>Prisma ORM</li>
                </ul>
              </div>
              <div className="tech-col">
                <h4 className="tech-col-title">Tools</h4>
                <ul className="tech-list">
                  <li>Git / GitHub</li>
                  <li>Vercel / AWS</li>
                  <li>Docker</li>
                  <li>Figma</li>
                </ul>
              </div>
            </div>
          </section>

          {/* PROJECTS HEADER */}
          <div className="full-width-card projects-header animate-enter" style={{ animationDelay: "0.4s" }}>
            <h2 className="section-title">Selected Works</h2>
          </div>

          {/* PROJECT CARDS */}
          <Link to="/work/apple-music" className="minimal-card project-card animate-enter" style={{ animationDelay: "0.5s" }}>
            <article className="project-content">
              <div>
                <span className="project-number">01</span>
                <h3 className="project-title">Apple Music Clone</h3>
                <p className="project-desc">Pixel-perfect replication of the Apple Music web player featuring full audio playback.</p>
              </div>
              <div className="project-link">
                <span>View Case Study</span>
                <svg viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none"/></svg>
              </div>
            </article>
          </Link>

          <Link to="/work/instagram" className="minimal-card project-card animate-enter" style={{ animationDelay: "0.6s" }}>
            <article className="project-content">
              <div>
                <span className="project-number">02</span>
                <h3 className="project-title">Instagram Clone</h3>
                <p className="project-desc">Responsive social media interface with complex grid layouts, feeds, and modern interactions.</p>
              </div>
              <div className="project-link">
                <span>View Case Study</span>
                <svg viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none"/></svg>
              </div>
            </article>
          </Link>

          <Link to="/work/kite" className="minimal-card project-card animate-enter" style={{ animationDelay: "0.7s" }}>
            <article className="project-content">
              <div>
                <span className="project-number">03</span>
                <h3 className="project-title">Kite Zerodha Replica</h3>
                <p className="project-desc">A high-performance trading dashboard interface with complex state management.</p>
              </div>
              <div className="project-link">
                <span>View Case Study</span>
                <svg viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none"/></svg>
              </div>
            </article>
          </Link>

          <Link to="/work/codesense-ai-saas" className="minimal-card project-card animate-enter" style={{ animationDelay: "0.8s" }}>
            <article className="project-content">
              <div>
                <span className="project-number">04</span>
                <h3 className="project-title">CodeSense AI SaaS</h3>
                <p className="project-desc">Intelligent code analysis platform with secure authentication, AI integration, and a modern dashboard.</p>
              </div>
              <div className="project-link">
                <span>View Case Study</span>
                <svg viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none"/></svg>
              </div>
            </article>
          </Link>

          <article className="minimal-card project-card wide-project animate-enter" style={{ animationDelay: "0.9s" }}>
            <div className="project-content">
              <div>
                <span className="project-number">05 — META</span>
                <h3 className="project-title">This Portfolio Architecture</h3>
                <p className="project-desc max-w-xl">
                  Designed from the ground up for performance and aesthetic minimalism. Built entirely using React and optimized for seamless page transitions.
                </p>
              </div>
              <div className="tech-tags">
                <span className="tag">React 18</span>
                <span className="tag">Vanilla CSS</span>
                <span className="tag">Vite</span>
              </div>
            </div>
          </article>

          {/* EXPERIENCE SECTION */}
          <section className="minimal-card full-width-card experience-card animate-enter" style={{ animationDelay: "1.0s" }}>
            <h3 className="section-subtitle">Experience</h3>
            <div className="experience-list">
              <div className="experience-item">
                <div className="exp-date">Oct 2025 — Nov 2025</div>
                <div className="exp-details">
                  <h4 className="exp-role">SDE Intern</h4>
                  <p className="exp-company">Bluestock Fintech</p>
                  <p className="exp-desc">Engineered frontend modules for a high-traffic fintech dashboard. Integrated secure REST APIs for real-time stock data visualization. Optimized render cycles for financial charts.</p>
                </div>
              </div>
              <div className="experience-item no-border">
                <div className="exp-date">2024 — Present</div>
                <div className="exp-details">
                  <h4 className="exp-role">Creative Developer</h4>
                  <p className="exp-company">Freelance</p>
                  <p className="exp-desc">Architected highly interactive 3D portfolios and high-conversion landing pages. Focused on semantic HTML, accessibility, and modern minimalist design systems.</p>
                </div>
              </div>
            </div>
          </section>

          {/* EDUCATION & CERTIFICATIONS */}
          <section className="minimal-card full-width-card edu-card animate-enter" style={{ animationDelay: "1.1s" }}>
            <div className="edu-grid">
              <div>
                <h3 className="section-subtitle">Education</h3>
                <div className="edu-list">
                  <div className="edu-item">
                    <h4 className="edu-degree">Bachelor of Computer Applications</h4>
                    <p className="edu-school">LNCT University (Pursuing)</p>
                  </div>
                  <div className="edu-item">
                    <h4 className="edu-degree">Senior Secondary (XII)</h4>
                    <p className="edu-school">Satya Niketan Higher Secondary (2023)</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="section-subtitle">Certifications</h3>
                <div className="edu-list">
                  <div className="edu-item">
                    <h4 className="edu-degree">MERN Full Stack</h4>
                    <p className="edu-school">Sheryians Coding School</p>
                  </div>
                  <div className="edu-item">
                    <h4 className="edu-degree">React JS Development</h4>
                    <p className="edu-school">Sheryians Coding School</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONNECT SECTION */}
          <section className="full-width-card connect-card animate-enter" style={{ animationDelay: "1.2s" }}>
            <div className="connect-content">
              <h3 className="section-title">Let's build something.</h3>
              <div className="connect-links">
                <a href="mailto:swayampurwar111104@gmail.com">Email</a>
                <a href="https://linkedin.com/in/swayam-purwar" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="https://github.com/SwayamPurwar" target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="footer-nav animate-enter" style={{ animationDelay: "1.3s" }}>
          <Link to="/" className="outline-btn return-btn">
            <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Return</span>
          </Link>
        </div>
      </main>
    </div>
  );
}