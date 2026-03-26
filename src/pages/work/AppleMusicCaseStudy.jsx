import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../../components/SEO";
import CaseStudyFooter from "../../components/CaseStudyFooter";

gsap.registerPlugin(ScrollTrigger);

export default function AppleMusicCaseStudy() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Top Back Button Animation
      gsap.fromTo(
        ".cs-top-back",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );

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

      // 2. Wait slightly for Page Transition, then map the Scroll Triggers
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

        // Glassmorphism Orb Animation
        gsap.to(".glass-orb-1", {
          x: 40,
          y: 30,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".glass-orb-2", {
          x: -40,
          y: -30,
          duration: 5,
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
        title="Apple Music Redesign | Case Study"
        description="UI/UX Case Study on the Apple Music iOS app redesign."
      />
      <div ref={containerRef} style={{ position: "relative" }}>
        
        {/* --- TOP BACK BUTTON --- */}
        

        <div className="grid-bg"></div>
        {/* The subtle red ambient glow in the background */}
        <div
          className="ambient-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(252, 60, 68, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        ></div>

        <header className="cs-hero">
          <h1 
            className="cs-title" 
            style={{ 
              color: "#fc3c44",
              textShadow: "0 0 40px rgba(252, 60, 68, 0.3)" // Added glowing effect
            }}
          >
            APPLE MUSIC
            <br />
            <span
              className="outline-sub"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)", color: "transparent" }}
            >
              CASE STUDY
            </span>
          </h1>
          <div className="cs-meta">
            <div className="meta-item">
              <h4>Timeline</h4>
              <p>3 Weeks</p>
            </div>
            <div className="meta-item">
              <h4>Role</h4>
              <p>Product Designer</p>
            </div>
            <div className="meta-item">
              <h4>Deliverables</h4>
              <p>Hi-Fi Prototypes</p>
            </div>
            <div className="meta-item">
              <h4>Tools</h4>
              <p>Figma & Protopie</p>
            </div>
          </div>
        </header>

        <div className="cs-content">
          {/* SECTION 1: DISCOVERY & RESEARCH */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>01. Discovery</h3>
              <p>
                While Apple Music is an industry leader, user feedback often
                points to a "sterile" interface. Navigating between lyrics,
                queues, and playlists requires too many taps.
              </p>
              <p>
                The goal was to eliminate friction and bring the album artwork
                to the forefront of the experience by mapping out a new, streamlined user journey.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">User Research</span>
                <span className="cs-tag">UX Flow</span>
              </div>
            </div>
            
            {/* Visual User Flow Map */}
            <div className="cs-image arch-box" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ padding: "0.8rem 1.5rem", background: "rgba(252, 60, 68, 0.1)", border: "1px solid #fc3c44", borderRadius: "8px", color: "#fc3c44", fontSize: "0.85rem", fontWeight: "bold" }}>Current Flow</div>
                <div style={{ color: "#666", fontSize: "0.8rem" }}>Tap Player &rarr; Tap Menu &rarr; Tap Lyrics &rarr; View</div>
              </div>
              <div style={{ height: "1px", width: "100%", background: "rgba(255,255,255,0.1)" }}></div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ padding: "0.8rem 1.5rem", background: "rgba(74, 222, 128, 0.1)", border: "1px solid #4ade80", borderRadius: "8px", color: "#4ade80", fontSize: "0.85rem", fontWeight: "bold" }}>New Gesture Flow</div>
                <div style={{ color: "#eee", fontSize: "0.8rem" }}>Swipe Up on Player &rarr; Seamless View</div>
              </div>
            </div>
          </section>

          {/* SECTION 2: THE SOLUTION (Glassmorphism) */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>02. The Solution</h3>
              <p>
                I introduced a Dynamic Glassmorphism System. Instead of a solid
                background, the player extracts the dominant colors from the
                album art and creates a fluid, animated mesh gradient.
              </p>
              <p>
                Controls were shifted to the lower third of the screen to
                improve reachability on larger iPhones.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">UI Design</span>
                <span className="cs-tag">Glassmorphism</span>
              </div>
            </div>
            
            {/* CSS Glassmorphism Simulator */}
            <div className="cs-image arch-box" style={{ position: "relative", overflow: "hidden", borderRadius: "16px", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Glowing animated orbs */}
              <div className="glass-orb-1" style={{ position: "absolute", width: "180px", height: "180px", background: "#fc3c44", borderRadius: "50%", filter: "blur(50px)", top: "10%", left: "10%", opacity: 0.6 }}></div>
              <div className="glass-orb-2" style={{ position: "absolute", width: "200px", height: "200px", background: "#5e5ce6", borderRadius: "50%", filter: "blur(60px)", bottom: "5%", right: "10%", opacity: 0.5 }}></div>
              
              {/* The Frosted Glass Card */}
              <div style={{ width: "240px", height: "160px", background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "1.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                <div style={{ width: "60%", height: "8px", background: "rgba(255,255,255,0.8)", borderRadius: "4px", marginBottom: "8px" }}></div>
                <div style={{ width: "40%", height: "6px", background: "rgba(255,255,255,0.4)", borderRadius: "4px" }}></div>
              </div>
            </div>
          </section>

          {/* SECTION 3: WIREFRAMING */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>03. Wireframing</h3>
              <p>
                Before jumping into high-fidelity designs, I mapped out the core
                user flows using low-fidelity wireframes.
              </p>
              <p>
                This allowed me to test the new gesture-based navigation (like
                swiping down to minimize the player) without getting distracted
                by colors and typography.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Wireframes</span>
                <span className="cs-tag">Prototyping</span>
              </div>
            </div>
            
            {/* Inline CSS Wireframe Phone */}
            <div className="cs-image arch-box" style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", minHeight: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "160px", height: "320px", border: "2px solid #444", borderRadius: "24px", padding: "10px", display: "flex", flexDirection: "column", gap: "10px", position: "relative" }}>
                {/* Notch */}
                <div style={{ width: "60px", height: "15px", background: "#444", borderRadius: "0 0 8px 8px", position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}></div>
                {/* Album Art Block */}
                <div style={{ width: "100%", height: "140px", background: "#222", borderRadius: "12px", marginTop: "20px" }}></div>
                {/* Title Lines */}
                <div style={{ width: "70%", height: "8px", background: "#333", borderRadius: "4px", marginTop: "10px" }}></div>
                <div style={{ width: "40%", height: "6px", background: "#222", borderRadius: "4px" }}></div>
                {/* Controls */}
                <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "auto", marginBottom: "20px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#222" }}></div>
                  <div style={{ width: "25px", height: "25px", borderRadius: "50%", background: "#444" }}></div>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#222" }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: FINAL POLISH & LOGIC */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>04. Interaction Logic</h3>
              <p>
                The final prototype was built to handle complex, logic-based micro-interactions. 
                Using spring physics rather than linear easing curves ensures the player feels alive, reacting naturally to the user's swipe velocity and touch.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Micro-Interactions</span>
                <span className="cs-tag">Spring Physics</span>
              </div>
            </div>
            
            {/* Physics Code Window */}
            <div className="cs-image code-window" style={{ background: "#111", borderRadius: "12px", border: "1px solid #333", overflow: "hidden" }}>
              <div style={{ background: "#222", padding: "10px 15px", borderBottom: "1px solid #333", display: "flex", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }}></div>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }}></div>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f" }}></div>
                <span style={{ marginLeft: "15px", color: "#888", fontSize: "0.8rem", fontFamily: "var(--font-code)" }}>AnimationController.ts</span>
              </div>
              <div style={{ padding: "20px", fontFamily: "var(--font-code)", fontSize: "0.85rem", color: "#abb2bf", overflowX: "auto", lineHeight: "1.6" }}>
                <span style={{ color: "#c678dd" }}>const</span> playerSpring = useSpring(&#123;<br/>
                &nbsp;&nbsp;damping: <span style={{ color: "#d19a66" }}>20</span>,<br/>
                &nbsp;&nbsp;stiffness: <span style={{ color: "#d19a66" }}>120</span>,<br/>
                &nbsp;&nbsp;mass: <span style={{ color: "#d19a66" }}>0.8</span>,<br/>
                &nbsp;&nbsp;restSpeedThreshold: <span style={{ color: "#d19a66" }}>0.01</span><br/>
                &#125;);<br/><br/>
                <span style={{ color: "#5c6370", fontStyle: "italic" }}>// Gesture handler for minimizing the player</span><br/>
                <span style={{ color: "#c678dd" }}>const</span> onSwipeDown = (velocity) =&gt; &#123;<br/>
                &nbsp;&nbsp;playerSpring.start(&#123; <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;y: <span style={{ color: "#d19a66" }}>800</span>, <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;scale: <span style={{ color: "#d19a66" }}>0.85</span>, <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;config: &#123; velocity &#125; <br/>
                &nbsp;&nbsp;&#125;);<br/>
                &#125;;
              </div>
            </div>
          </section>

          {/* --- BOTTOM BACK BUTTON (STYLED AS A BUTTON) --- */}
          <div 
            style={{ 
             width: "100%",
              marginTop: "6rem", 
                paddingTop: "2rem",
              display: "flex", 
               justifyContent: "center",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)"
              
            }}
          >
            <Link
              to="/work/apple-music"
              className="mouse-hover"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontFamily: "var(--font-code)",
                fontSize: "0.9rem",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "1rem 2rem", 
                border: "1px solid rgba(255, 255, 255, 0.2)", 
                borderRadius: "50px", 
                transition: "all 0.3s ease", 
                textTransform: "uppercase",
                background: "transparent"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#fc3c44"; // Apple Music Red
                e.currentTarget.style.borderColor = "#fc3c44"; 
                e.currentTarget.style.background = "rgba(252, 60, 68, 0.05)"; 
                e.currentTarget.style.transform = "translateY(-2px)"; 
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              &larr; Back to Overview
            </Link>
          </div>

        </div>

        {/* Note: backLink prop removed as requested */}
        <CaseStudyFooter currentProject="apple-music" />
      </div>
    </>
  );
}