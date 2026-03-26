import { useLayoutEffect, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../../components/SEO";
import ProjectsFooter from "../../components/ProjectsFooter";

gsap.registerPlugin(ScrollTrigger);

export default function AiSaas() {
  const containerRef = useRef(null);

  // Neural Network Canvas Animation
  useEffect(() => {
    const canvas = document.getElementById("neural-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;
    let nodes = [];
    let animationFrame;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      nodes = [];
      for (let i = 0; i < 50; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#a855f7";
      ctx.strokeStyle = "rgba(168, 85, 247, 0.15)";

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x;
          const dy = nodes[j].y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      });
      animationFrame = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", init);
    init();
    draw();

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".system-tag",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.2 },
      );
      gsap.fromTo(
        ".p-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 },
      );

      // Animate the new buttons
      gsap.fromTo(
        ".cs-hero-btns",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.6 },
      );

      const scrollTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        gsap.utils
          .toArray(".bento-item, .pipeline-step, .tech-pill")
          .forEach((item, i) => {
            gsap.fromTo(
              item,
              { y: 30, opacity: 0 },
              {
                scrollTrigger: { trigger: item, start: "top 90%" },
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                delay: (i % 3) * 0.1,
                clearProps: "transform,opacity",
              },
            );
          });
      }, 500);

      return () => clearTimeout(scrollTimer);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO
        title="CodeSense AI"
        description="AI-powered GitHub repository analyzer built with RAG."
      />
      <div ref={containerRef}>
        <canvas id="neural-canvas"></canvas>
        <div className="ai-grid-bg"></div>

        <header
          className="cs-hero"
          style={{ borderBottom: "none", paddingBottom: "2vh" }}
        >
          <span className="system-tag">SYSTEM_ONLINE // v1.0.0</span>
          <h1
            className="p-title"
            style={{ color: "#a855f7", marginBottom: "2rem" }}
          >
            CODESENSE AI
          </h1>
          <div
            className="cs-meta"
            style={{ borderTop: "1px solid rgba(168, 85, 247, 0.2)" }}
          >
            <div className="meta-item">
              <h4>Core Engine</h4>
              <p>Llama 3.3 70B</p>
            </div>
            <div className="meta-item">
              <h4>Intelligence</h4>
              <p>RAG Pipeline</p>
            </div>
            <div className="meta-item">
              <h4>Database</h4>
              <p>Neon + pgvector</p>
            </div>
            <div className="meta-item">
              <h4>Deployment</h4>
              <p>Vercel Edge</p>
            </div>
          </div>

          {/* ADDED BUTTONS HERE   */}
          <div className="cs-hero-btns btn-group" style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/work/CodeSenseAiSaas-casestudy" className="btn mouse-hover">View Case Study</Link>
            {/* <a href="#" target="_blank" rel="noreferrer" className="btn mouse-hover">View Live Code</a> */}
          </div>
        
        </header>

        <div className="cs-content">
          {/* BENTO GRID: Features */}
          <div className="bento-grid">
            <div className="bento-item">
              <h3>01 // RAG-Powered Discovery</h3>
              <p>
                Index any GitHub repository with high-performance Nomic
                embeddings. The system understands project-wide context,
                enabling chat interactions that respect your unique
                architecture.
              </p>
            </div>

            <div
              className="bento-item ai-panel"
              style={{ background: "#050505" }}
            >
              <span className="viz-lab" style={{ color: "#a855f7" }}>
                Live Ingestion Stream (SSE)
              </span>
              <div className="code-line">
                <span>&gt;</span> URL: github.com/user/repo
              </div>
              <div className="code-line">
                <span>&gt;</span>{" "}
                <span style={{ color: "#00E396" }}>Chunking:</span> 45 files
                found
              </div>
              <div className="code-line">
                <span>&gt;</span>{" "}
                <span style={{ color: "#a855f7" }}>Embedding:</span> Vectorizing
                248 chunks...
              </div>
              <div
                className="progress-bar"
                style={{ height: "2px", background: "#222", marginTop: "1rem" }}
              >
                <div
                  style={{
                    width: "65%",
                    height: "100%",
                    background: "#a855f7",
                    boxShadow: "0 0 10px #a855f7",
                  }}
                ></div>
              </div>
              <div
                className="code-line"
                style={{ color: "#888", marginTop: "0.5rem" }}
              >
                65% Complete // Nomic Atlas v1.5
              </div>
            </div>

            <div className="bento-item side-viz">
              <span className="viz-lab">Similarity HNSW Indexing</span>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  height: "100px",
                  alignItems: "flex-end",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                  <div
                    key={bar}
                    className="viz-block"
                    style={{
                      flex: 1,
                      height: `${Math.random() * 80 + 20}%`,
                      background:
                        "linear-gradient(to top, rgba(168, 85, 247, 0.1), #a855f7)",
                      animation: `wave-height ${1 + Math.random()}s infinite ease-in-out alternate`,
                    }}
                  ></div>
                ))}
              </div>
            </div>

            <div className="bento-item">
              <h3>02 // Code Health & Reviews</h3>
              <p>
                Automated PR reviews and logical bug detection identify
                vulnerabilities before they ship. Instantly generate onboarding
                guides for new developers joining a complex codebase.
              </p>
            </div>
          </div>

          {/* PIPELINE SECTION: The 9 Steps from README */}
          {/* PIPELINE SECTION: The RAG Architecture */}
          <div style={{ marginTop: "10rem", position: "relative" }}>
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
              <span className="system-tag" style={{ marginBottom: "1rem" }}>Data Flow Architecture</span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  textTransform: "uppercase",
                  letterSpacing: "-0.03em",
                  margin: 0
                }}
              >
                The RAG Pipeline
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
                position: "relative",
              }}
            >
              {[
                {
                  step: "01",
                  title: "Ingestion",
                  desc: "URL submission & Octokit file fetching directly from the source repository.",
                },
                {
                  step: "02",
                  title: "Chunking",
                  desc: "Recursive splitting of code into semantic 500-token blocks for precise context.",
                },
                {
                  step: "03",
                  title: "Embedding",
                  desc: "High-dimensional (768-dim) vector generation mapped via Nomic v1.5.",
                },
                {
                  step: "04",
                  title: "Indexing",
                  desc: "Lightning-fast HNSW vector storage inside Neon serverless Postgres.",
                },
                {
                  step: "05",
                  title: "Similarity",
                  desc: "Cosine similarity search retrieves the Top-8 most relevant code blocks instantly.",
                },
                {
                  step: "06",
                  title: "Synthesis",
                  desc: "Deep context grounding and logic generation powered by Llama 3.3 70B.",
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="pipeline-step mouse-hover"
                  style={{
                    position: "relative",
                    padding: "3rem 2.5rem",
                    background: "rgba(255, 255, 255, 0.015)",
                    border: "1px solid rgba(168, 85, 247, 0.1)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(168, 85, 247, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.4)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(168, 85, 247, 0.15)";
                    e.currentTarget.querySelector('.bg-number').style.color = "rgba(168, 85, 247, 0.15)";
                    e.currentTarget.querySelector('.bg-number').style.transform = "scale(1.1) translate(10px, -10px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.015)";
                    e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.querySelector('.bg-number').style.color = "rgba(168, 85, 247, 0.04)";
                    e.currentTarget.querySelector('.bg-number').style.transform = "scale(1) translate(0, 0)";
                  }}
                >
                  {/* Massive Faded Background Number */}
                  <span 
                    className="bg-number"
                    style={{
                      position: "absolute",
                      top: "-15px",
                      right: "-10px",
                      fontSize: "10rem",
                      fontFamily: "var(--font-display)",
                      fontWeight: "900",
                      color: "rgba(168, 85, 247, 0.04)",
                      lineHeight: "1",
                      pointerEvents: "none",
                      transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
                      zIndex: 0
                    }}
                  >
                    {item.step}
                  </span>

                  {/* Content */}
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        background: "rgba(168, 85, 247, 0.1)",
                        color: "#a855f7",
                        fontFamily: "var(--font-code)",
                        fontSize: "0.75rem",
                        borderRadius: "50px",
                        marginBottom: "2rem",
                        letterSpacing: "1px",
                        textTransform: "uppercase"
                      }}
                    >
                      Phase // {item.step}
                    </div>
                    <h3
                      style={{
                        color: "white",
                        fontFamily: "var(--font-display)",
                        fontSize: "1.6rem",
                        marginBottom: "1rem",
                        letterSpacing: "1px"
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        color: "#999",
                        lineHeight: "1.8",
                        fontSize: "1.05rem",
                        margin: 0,
                        fontWeight: "300"
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TECH STACK GRID */}
          <div style={{ marginTop: "8rem", textAlign: "center" }}>
            <span className="viz-lab">Integrated Technologies</span>
            <div
              className="tech-container"
              style={{ justifyContent: "center", marginTop: "2rem" }}
            >
              {[
                "Next.js 15",
                "Tailwind 4.0",
                "Clerk Auth",
                "Neon DB",
                "Groq AI",
                "Octokit",
                "Nomic Atlas",
                "Three.js",
              ].map((tech) => (
                <span key={tech} className="tech-pill">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          {/* --- ADDED: BOTTOM BACK BUTTON FOR WORK PAGES --- */}
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
                to="/"
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
                  padding: "1rem 2rem", /* <-- ADDED: Space inside the button */
      border: "1px solid rgba(255, 255, 255, 0.2)", /* <-- ADDED: The visible outline */
      borderRadius: "50px", /* <-- ADDED: Rounded pill shape */
      transition: "all 0.3s ease", /* Changed to 'all' so the border animates too */
                  textTransform: "uppercase"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#fc3c44"} // Apple Music Red
                onMouseOut={(e) => e.currentTarget.style.color = "#fff"}
              >
                &larr; Back to Home
              </Link>
            </div>
        </div>
        
      </div>
      
      <ProjectsFooter currentProject="codesense" />
    </>
  );
}
