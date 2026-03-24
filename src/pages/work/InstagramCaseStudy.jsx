import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../../components/SEO";
import CaseStudyFooter from "../../components/CaseStudyFooter";
gsap.registerPlugin(ScrollTrigger);

export default function InstagramCaseStudy() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Animations
      gsap.fromTo(
        ".cs-title",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.4,
          clearProps: "all",
        },
      );

      gsap.fromTo(
        ".cs-meta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.6,
          clearProps: "all",
        },
      );

      // 2. Scroll Triggers for Sections
      const scrollTimer = setTimeout(() => {
        ScrollTrigger.refresh();

        gsap.utils.toArray(".cs-section").forEach((section) => {
          gsap.fromTo(
            section,
            { y: 50, opacity: 0 },
            {
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
              },
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              clearProps: "all",
            },
          );
        });

        // Add a gentle hover floating effect to the architecture nodes
        gsap.to(".node-card", {
          y: -5,
          duration: 2,
          stagger: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, 500);

      return () => clearTimeout(scrollTimer);
    }, containerRef);

    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <SEO
        title="Instagram Clone | Architecture Case Study"
        description="Full-stack architecture and development of an Instagram clone."
      />
      <div ref={containerRef}>
        {/* Instagram Theme Background Elements */}
        <div className="grid-bg"></div>
        <div className="orb orb-purple"></div>
        <div className="orb orb-orange"></div>

        <header className="cs-hero">
          <h1 className="cs-title text-gradient-ig">
            INSTAGRAM
            <br />
            <span
              className="outline-sub"
              style={{ WebkitTextStroke: "1px white", color: "transparent" }}
            >
              CLONE
            </span>
          </h1>
          <div className="cs-meta">
            <div className="meta-item">
              <h4>Timeline</h4>
              <p>4 Weeks</p>
            </div>
            <div className="meta-item">
              <h4>Role</h4>
              <p>Full Stack Dev</p>
            </div>
            <div className="meta-item">
              <h4>Deliverables</h4>
              <p>Live Web App</p>
            </div>
            <div className="meta-item">
              <h4>Tools</h4>
              <p>MERN Stack</p>
            </div>
          </div>
        </header>

        <div className="cs-content">
          {/* SECTION 1: ARCHITECTURE (Pure CSS Diagram) */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>01. Architecture</h3>
              <p>
                Building a scalable social media clone requires a solid
                foundation. I opted for a decoupled architecture using Node.js
                and Express for the backend, serving RESTful APIs to the React
                frontend.
              </p>
              <p>
                This separation of concerns ensures that the client remains
                lightweight while the server handles the heavy lifting of
                authentication and data processing.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">System Design</span>
                <span className="cs-tag">REST API</span>
              </div>
            </div>
            <div className="cs-image arch-box">
              <div className="arch-grid">
                <div className="node-card">
                  <span className="node-title">Client</span>
                  <span className="node-val">React JS</span>
                </div>
                <div className="connection"></div>
                <div className="node-card">
                  <span className="node-title">Server</span>
                  <span className="node-val">Node API</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: DATABASE SCHEMA */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>02. Database Schema</h3>
              <p>
                Designing the NoSQL schema in MongoDB was tricky due to the
                highly relational nature of a social network (Users following
                Users, Posts belonging to Users, Comments belonging to Posts).
              </p>
              <p>
                I utilized Mongoose references to link collections, allowing for
                efficient `populate()` queries when fetching complex feed data
                without duplicating records.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">MongoDB</span>
                <span className="cs-tag">Mongoose</span>
              </div>
            </div>
            <div className="cs-image">
              <img
                src="/assets/images/project/instagram-preview.webp"
                alt="Database Schema phase"
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
          </section>

          {/* SECTION 3: REAL-TIME WEBSOCKETS */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>03. Real-Time WebSockets</h3>
              <p>
                A modern social app needs instant feedback to feel alive.
                Instead of relying on constant HTTP polling, I implemented
                Socket.io.
              </p>
              <p>
                This creates a persistent, two-way connection between the
                browser and the server, enabling instant notifications, direct
                messaging, and real-time "like" updates across all connected
                clients.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Socket.io</span>
                <span className="cs-tag">Real-time</span>
              </div>
            </div>
            <div className="cs-image">
              <img
                src="/assets/images/project/instagram-preview.webp"
                alt="WebSockets implementation"
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
          </section>

          {/* SECTION 4: STATE MANAGEMENT */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>04. State Management</h3>
              <p>
                With deeply nested components like feed posts, comment sections,
                and user profiles, "prop drilling" quickly became an
                anti-pattern.
              </p>
              <p>
                I integrated Redux Toolkit for global state management. This
                allowed the app to smoothly share the user's authentication
                state, cached feed data, and active socket connection globally.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Redux Toolkit</span>
                <span className="cs-tag">State</span>
              </div>
            </div>
            <div className="cs-image">
              <img
                src="/assets/images/project/instagram-preview.webp"
                alt="State Management implementation"
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
          </section>
          <div 
            style={{ 
              marginTop: "6rem", 
              paddingTop: "2rem",
              display: "flex", 
              justifyContent: "center",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <Link
              to="/work/instagram"
              className="mouse-hover"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontFamily: "var(--font-code)",
                fontSize: "1rem",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "color 0.3s ease",
                textTransform: "uppercase"
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "#bc2a8d"} // Instagram brand color hover
              onMouseOut={(e) => e.currentTarget.style.color = "#fff"}
            >
              &larr; Back to Overview
            </Link>
          </div>


          <CaseStudyFooter
            currentProject="instagram"
            backLink="/work/instagram"
          />
        </div>
      </div>
    </>
  );
}
