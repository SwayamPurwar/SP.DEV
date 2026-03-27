"use client";
import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CaseStudyFooter from "@/components/CaseStudyFooter";

gsap.registerPlugin(ScrollTrigger);

export default function InstagramCaseStudy() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Top Back Button Animation
      gsap.fromTo(
        ".cs-top-back",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );

      // Hero Animations
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

      // Scroll Triggers for Sections
      const scrollTimer = setTimeout(() => {
        ScrollTrigger.refresh();

        gsap.utils.toArray<HTMLElement>(".cs-section").forEach((section) => {
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
          stagger: 0.2,
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
      <div ref={containerRef} style={{ position: "relative" }}>
        
        {/* --- TOP BACK BUTTON --- */}
        

        {/* Instagram Theme Background Elements */}
        <div className="grid-bg"></div>
        <div className="orb orb-purple" style={{ background: "radial-gradient(circle, rgba(188, 42, 141, 0.15) 0%, transparent 70%)" }}></div>
        <div className="orb orb-orange" style={{ background: "radial-gradient(circle, rgba(240, 148, 51, 0.1) 0%, transparent 70%)", top: "60%", left: "10%" }}></div>

        <header className="cs-hero">
          <h1 
            className="cs-title"
            style={{
              background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            INSTAGRAM
            <br />
            <span
              className="outline-sub"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)", color: "transparent" }}
            >
              ARCHITECTURE
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
              <h4>Database</h4>
              <p>MongoDB NoSQL</p>
            </div>
            <div className="meta-item">
              <h4>Stack</h4>
              <p>MERN + Socket.io</p>
            </div>
          </div>
        </header>

        <div className="cs-content">
          {/* SECTION 1: ARCHITECTURE */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>01. Architecture</h3>
              <p>
                Building a scalable social media clone requires a solid foundation. I opted for a decoupled architecture using Node.js and Express for the backend, serving RESTful APIs to the React frontend.
              </p>
              <p>
                This separation of concerns ensures that the client remains lightweight while the server handles the heavy lifting of authentication (JWT) and data processing.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">System Design</span>
                <span className="cs-tag">REST API</span>
                <span className="cs-tag">JWT Auth</span>
              </div>
            </div>
            <div className="cs-image arch-box" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="arch-grid" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <div className="node-card" style={{ padding: "1.5rem", border: "1px solid #bc1888", borderRadius: "8px", textAlign: "center", background: "#0a0a0a" }}>
                  <span style={{ display: "block", color: "#fff", fontWeight: "bold", marginBottom: "0.5rem" }}>Client</span>
                  <span style={{ color: "#a0a0a0", fontSize: "0.85rem" }}>React + Redux</span>
                </div>
                <div style={{ color: "#666" }}>⟷</div>
                <div className="node-card" style={{ padding: "1.5rem", border: "1px solid #f09433", borderRadius: "8px", textAlign: "center", background: "#0a0a0a" }}>
                  <span style={{ display: "block", color: "#fff", fontWeight: "bold", marginBottom: "0.5rem" }}>API Server</span>
                  <span style={{ color: "#a0a0a0", fontSize: "0.85rem" }}>Node.js + Express</span>
                </div>
                <div style={{ color: "#666" }}>⟷</div>
                <div className="node-card" style={{ padding: "1.5rem", border: "1px solid #4ade80", borderRadius: "8px", textAlign: "center", background: "#0a0a0a" }}>
                  <span style={{ display: "block", color: "#fff", fontWeight: "bold", marginBottom: "0.5rem" }}>Database</span>
                  <span style={{ color: "#a0a0a0", fontSize: "0.85rem" }}>MongoDB Cloud</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: DATABASE SCHEMA */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>02. Database Schema</h3>
              <p>
                Designing the NoSQL schema was tricky due to the highly relational nature of a social network (Users following Users, Posts belonging to Users, Comments belonging to Posts).
              </p>
              <p>
                I utilized Mongoose references to link collections, allowing for efficient <code>.populate()</code> queries when fetching complex feed data without duplicating records.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">MongoDB</span>
                <span className="cs-tag">Mongoose</span>
              </div>
            </div>
            
            {/* Added a realistic Code Window instead of a generic image */}
            <div className="cs-image code-window" style={{ background: "#111", borderRadius: "12px", border: "1px solid #333", overflow: "hidden" }}>
              <div style={{ background: "#222", padding: "10px 15px", borderBottom: "1px solid #333", display: "flex", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }}></div>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }}></div>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f" }}></div>
                <span style={{ marginLeft: "15px", color: "#888", fontSize: "0.8rem", fontFamily: "var(--font-code)" }}>PostModel.js</span>
              </div>
              <div style={{ padding: "20px", fontFamily: "var(--font-code)", fontSize: "0.85rem", color: "#abb2bf", overflowX: "auto" }}>
                <span style={{ color: "#c678dd" }}>const</span> postSchema = <span style={{ color: "#c678dd" }}>new</span> mongoose.Schema(&#123;<br/>
                &nbsp;&nbsp;caption: &#123; type: <span style={{ color: "#e5c07b" }}>String</span>, required: <span style={{ color: "#d19a66" }}>true</span> &#125;,<br/>
                &nbsp;&nbsp;image: &#123; type: <span style={{ color: "#e5c07b" }}>String</span>, required: <span style={{ color: "#d19a66" }}>true</span> &#125;,<br/>
                &nbsp;&nbsp;creator: &#123; <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;type: mongoose.Schema.Types.<span style={{ color: "#e5c07b" }}>ObjectId</span>, <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;ref: <span style={{ color: "#98c379" }}>'User'</span> <br/>
                &nbsp;&nbsp;&#125;,<br/>
                &nbsp;&nbsp;likes: [&#123; type: mongoose.Schema.Types.<span style={{ color: "#e5c07b" }}>ObjectId</span>, ref: <span style={{ color: "#98c379" }}>'User'</span> &#125;],<br/>
                &nbsp;&nbsp;comments: [commentSchema]<br/>
                &#125;, &#123; timestamps: <span style={{ color: "#d19a66" }}>true</span> &#125;);
              </div>
            </div>
          </section>

          {/* SECTION 3: REAL-TIME WEBSOCKETS */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>03. Real-Time WebSockets</h3>
              <p>
                A modern social app needs instant feedback to feel alive. Instead of relying on constant HTTP polling, I implemented Socket.io.
              </p>
              <p>
                This creates a persistent, two-way connection between the browser and the server, enabling instant notifications, direct messaging, and real-time "like" updates across all connected clients.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Socket.io</span>
                <span className="cs-tag">Real-time Data</span>
              </div>
            </div>
            
            {/* Real-time Code Implementation */}
            <div className="cs-image code-window" style={{ background: "#111", borderRadius: "12px", border: "1px solid #333", overflow: "hidden" }}>
              <div style={{ background: "#222", padding: "10px 15px", borderBottom: "1px solid #333", display: "flex", gap: "6px" }}>
                <span style={{ color: "#888", fontSize: "0.8rem", fontFamily: "var(--font-code)" }}>socketEvents.js</span>
              </div>
              <div style={{ padding: "20px", fontFamily: "var(--font-code)", fontSize: "0.85rem", color: "#abb2bf", overflowX: "auto" }}>
                io.on(<span style={{ color: "#98c379" }}>'connection'</span>, (socket) =&gt; &#123;<br/>
                &nbsp;&nbsp;socket.on(<span style={{ color: "#98c379" }}>'like_post'</span>, <span style={{ color: "#c678dd" }}>async</span> (&#123; postId, userId &#125;) =&gt; &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#5c6370", fontStyle: "italic" }}>// 1. Update Database</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#c678dd" }}>await</span> Post.findByIdAndUpdate(postId, &#123; <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$push: &#123; likes: userId &#125; <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&#125;);<br/><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#5c6370", fontStyle: "italic" }}>// 2. Broadcast to all clients viewing this post</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;io.emit(<span style={{ color: "#98c379" }}>'post_updated'</span>, &#123; postId, newLike: userId &#125;);<br/>
                &nbsp;&nbsp;&#125;);<br/>
                &#125;);
              </div>
            </div>
          </section>

          {/* SECTION 4: STATE MANAGEMENT */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>04. Global State</h3>
              <p>
                With deeply nested components like feed posts, comment sections, and user profiles, "prop drilling" quickly became an anti-pattern.
              </p>
              <p>
                I integrated Redux Toolkit for global state management. This allowed the app to smoothly share the user's authentication state, cached feed data, and active socket connection globally.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Redux Toolkit</span>
                <span className="cs-tag">React Context</span>
              </div>
            </div>
            
            {/* Visualizing State instead of code here for variety */}
            <div className="cs-image arch-box" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ padding: "1rem 3rem", background: "linear-gradient(45deg, #764abc, #59368f)", borderRadius: "8px", color: "#fff", fontWeight: "bold", letterSpacing: "1px" }}>
                REDUX STORE
              </div>
              <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
                <div style={{ padding: "1rem", border: "1px solid #444", borderRadius: "8px", background: "#111", color: "#ddd", fontSize: "0.85rem", textAlign: "center" }}>Auth Slice<br/><span style={{ color: "#888", fontSize: "0.75rem" }}>JWT / UserData</span></div>
                <div style={{ padding: "1rem", border: "1px solid #444", borderRadius: "8px", background: "#111", color: "#ddd", fontSize: "0.85rem", textAlign: "center" }}>Feed Slice<br/><span style={{ color: "#888", fontSize: "0.75rem" }}>Posts / Cache</span></div>
                <div style={{ padding: "1rem", border: "1px solid #444", borderRadius: "8px", background: "#111", color: "#ddd", fontSize: "0.85rem", textAlign: "center" }}>UI Slice<br/><span style={{ color: "#888", fontSize: "0.75rem" }}>Modals / Theme</span></div>
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
              href="/work/instagram" 
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
                e.currentTarget.style.color = "#bc2a8d"; // Instagram pink/purple
                e.currentTarget.style.borderColor = "#bc2a8d"; 
                e.currentTarget.style.background = "rgba(188, 42, 141, 0.05)"; 
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

        <CaseStudyFooter currentProject="instagram" />
      </div>
    </>
  );
}