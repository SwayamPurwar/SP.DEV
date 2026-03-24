import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../../components/SEO";
import CaseStudyFooter from "../../components/CaseStudyFooter";

gsap.registerPlugin(ScrollTrigger);

export default function CodeSenseAiSaasCaseStudy() {
  const containerRef = useRef(null);
  const [streamText, setStreamText] = useState("");

  // Terminal AI Streaming Simulation
  useEffect(() => {
    const codeSnippet = `// Analyzing context...\n// Generating optimized component...\n\nexport const CodeBlock = ({ code }) => {\n  const [copied, setCopied] = useState(false);\n  \n  const handleCopy = async () => {\n    await navigator.clipboard.writeText(code);\n    setCopied(true);\n    setTimeout(() => setCopied(false), 2000);\n  };\n  \n  return (\n    <div className="relative bg-gray-900 rounded-lg p-4">\n      <pre className="text-sm text-green-400">{code}</pre>\n      <CopyButton onClick={handleCopy} success={copied} />\n    </div>\n  );\n};`;
    
    let index = 0;
    const interval = setInterval(() => {
      setStreamText((prev) => prev + codeSnippet.charAt(index));
      index++;
      if (index >= codeSnippet.length) {
        clearInterval(interval);
        // Loop the animation after a delay
        setTimeout(() => {
          setStreamText("");
          index = 0;
        }, 5000);
      }
    }, 30); // Typing speed

    return () => clearInterval(interval);
  }, [streamText === ""]); // Re-runs when streamText is reset

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

        // Floating effect for architecture nodes
        gsap.to(".node-card", {
          y: -6,
          duration: 2.5,
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
      <SEO
        title="CodeSense AI SaaS | Case Study"
        description="Engineering deep dive into building an AI-powered code generation SaaS platform."
      />
      <div ref={containerRef} style={{ position: "relative" }}>
        
        {/* --- TOP BACK BUTTON --- */}
        <div 
          className="cs-top-back" 
          style={{ position: "absolute", top: "120px", left: "5vw", zIndex: 20 }}
        >
          <Link
            to="/work/codesense-ai-saas"
            className="mouse-hover"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontFamily: "var(--font-code)",
              fontSize: "0.85rem",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              opacity: 0.6,
              transition: "opacity 0.3s ease",
              textTransform: "uppercase"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 1}
            onMouseOut={(e) => e.currentTarget.style.opacity = 0.6}
          >
            &larr; Back to Overview
          </Link>
        </div>

        {/* AI Theme Background Elements */}
        <div className="grid-bg"></div>
        <div className="orb orb-purple" style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)" }}></div>
        <div className="orb orb-orange" style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)", top: "60%", right: "10%" }}></div>

        <header className="cs-hero">
          <h1 
            className="cs-title"
            style={{
              background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            CODESENSE AI
            <br />
            <span
              className="outline-sub"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)", color: "transparent" }}
            >
              SAAS PLATFORM
            </span>
          </h1>
          <div className="cs-meta">
            <div className="meta-item">
              <h4>Timeline</h4>
              <p>5 Weeks</p>
            </div>
            <div className="meta-item">
              <h4>Role</h4>
              <p>Lead Engineer</p>
            </div>
            <div className="meta-item">
              <h4>Core Integration</h4>
              <p>OpenAI GPT-4 API</p>
            </div>
            <div className="meta-item">
              <h4>Stack</h4>
              <p>Next.js + Stripe</p>
            </div>
          </div>
        </header>

        <div className="cs-content">
          {/* SECTION 1: THE ARCHITECTURE */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>01. System Architecture</h3>
              <p>
                Building an AI-driven SaaS requires a highly robust edge-computing setup. CodeSense uses Next.js API routes to handle authentication and securely relay prompts to the OpenAI models.
              </p>
              <p>
                To maintain conversation history and context, user sessions and prompt metadata are stored in Prisma/PostgreSQL, while Stripe handles the subscription tiering logic.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Next.js 14</span>
                <span className="cs-tag">Prisma ORM</span>
                <span className="cs-tag">Microservices</span>
              </div>
            </div>
            <div className="cs-image arch-box" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="arch-grid" style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                  <div className="node-card" style={{ padding: "1.2rem", border: "1px solid #3b82f6", borderRadius: "8px", textAlign: "center", background: "#0a0a0a", width: "140px" }}>
                    <span style={{ display: "block", color: "#fff", fontWeight: "bold" }}>Next.js UI</span>
                    <span style={{ color: "#a0a0a0", fontSize: "0.75rem" }}>Tailwind + React</span>
                  </div>
                  <div style={{ color: "#666" }}>⟷</div>
                  <div className="node-card" style={{ padding: "1.2rem", border: "1px solid #8b5cf6", borderRadius: "8px", textAlign: "center", background: "#0a0a0a", width: "140px" }}>
                    <span style={{ display: "block", color: "#fff", fontWeight: "bold" }}>Edge API</span>
                    <span style={{ color: "#a0a0a0", fontSize: "0.75rem" }}>Serverless Funcs</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "4rem", color: "#666" }}>
                  <span>↓</span>
                  <span>↓</span>
                </div>
                <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                  <div className="node-card" style={{ padding: "1.2rem", border: "1px solid #10b981", borderRadius: "8px", textAlign: "center", background: "#0a0a0a", width: "140px" }}>
                    <span style={{ display: "block", color: "#fff", fontWeight: "bold" }}>OpenAI</span>
                    <span style={{ color: "#a0a0a0", fontSize: "0.75rem" }}>GPT-4 / Embeddings</span>
                  </div>
                  <div className="node-card" style={{ padding: "1.2rem", border: "1px solid #f59e0b", borderRadius: "8px", textAlign: "center", background: "#0a0a0a", width: "140px" }}>
                    <span style={{ display: "block", color: "#fff", fontWeight: "bold" }}>Database</span>
                    <span style={{ color: "#a0a0a0", fontSize: "0.75rem" }}>Supabase + Prisma</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: AI INTEGRATION */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>02. The AI Context Engine</h3>
              <p>
                To provide meaningful code suggestions, the LLM needs context. I engineered a prompt-chaining system that automatically injects the user's selected framework, language, and surrounding code into the hidden system prompt.
              </p>
              <p>
                This ensures the generated code matches the exact syntax and architecture of the user's existing project without requiring them to manually explain it every time.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Prompt Engineering</span>
                <span className="cs-tag">OpenAI API</span>
              </div>
            </div>
            
            <div className="cs-image code-window" style={{ background: "#0d1117", borderRadius: "12px", border: "1px solid #30363d", overflow: "hidden" }}>
              <div style={{ background: "#161b22", padding: "10px 15px", borderBottom: "1px solid #30363d", display: "flex", gap: "6px" }}>
                <span style={{ color: "#8b949e", fontSize: "0.8rem", fontFamily: "var(--font-code)" }}>api/generate/route.ts</span>
              </div>
              <div style={{ padding: "20px", fontFamily: "var(--font-code)", fontSize: "0.85rem", color: "#c9d1d9", overflowX: "auto", lineHeight: "1.6" }}>
                <span style={{ color: "#ff7b72" }}>export async function</span> <span style={{ color: "#d2a8ff" }}>POST</span>(req: Request) &#123;<br/>
                &nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>const</span> &#123; prompt, framework, codeContext &#125; = <span style={{ color: "#ff7b72" }}>await</span> req.<span style={{ color: "#d2a8ff" }}>json</span>();<br/><br/>
                &nbsp;&nbsp;<span style={{ color: "#8b949e", fontStyle: "italic" }}>// Construct contextual prompt</span><br/>
                &nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>const</span> systemMessage = `<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a5d6ff" }}>You are an expert ${framework} developer.</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a5d6ff" }}>Analyze this existing code: \n${codeContext}\n</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a5d6ff" }}>Generate a solution for: ${prompt}</span><br/>
                &nbsp;&nbsp;`;<br/><br/>
                &nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>const</span> response = <span style={{ color: "#ff7b72" }}>await</span> openai.<span style={{ color: "#d2a8ff" }}>createChatCompletion</span>(&#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;model: <span style={{ color: "#a5d6ff" }}>"gpt-4-turbo"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;messages: [&#123; role: <span style={{ color: "#a5d6ff" }}>"system"</span>, content: systemMessage &#125;],<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;stream: <span style={{ color: "#79c0ff" }}>true</span>,<br/>
                &nbsp;&nbsp;&#125;);<br/><br/>
                &nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>return new</span> <span style={{ color: "#79c0ff" }}>StreamingTextResponse</span>(response);<br/>
                &#125;
              </div>
            </div>
          </section>

          {/* SECTION 3: REAL-TIME STREAMING */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>03. Stream Processing</h3>
              <p>
                Waiting for an AI model to generate 500 lines of code causes massive UX friction. To solve this, I implemented <code>StreamingTextResponse</code> from the Vercel AI SDK.
              </p>
              <p>
                Chunks of data are streamed directly from the OpenAI server to the edge, and finally painted onto the user's React DOM in real-time, giving a typing effect that feels instant and responsive.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Vercel AI SDK</span>
                <span className="cs-tag">Edge Streaming</span>
              </div>
            </div>
            
            {/* Live Streaming Terminal */}
            <div className="cs-image arch-box" style={{ background: "#050505", border: "1px solid #333", borderRadius: "12px", minHeight: "300px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ background: "#111", padding: "10px 15px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#888", fontSize: "0.8rem", fontFamily: "var(--font-code)" }}>CodeSense Output Stream</span>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", animation: "pulse 1.5s infinite" }}></span>
                  <span style={{ color: "#3b82f6", fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "1px" }}>GENERATING</span>
                </div>
              </div>
              <div style={{ padding: "20px", fontFamily: "var(--font-code)", fontSize: "0.9rem", color: "#10b981", overflowY: "auto", flexGrow: 1 }}>
                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                  {streamText}
                  <span className="cursor-blink" style={{ borderRight: "2px solid #10b981", marginLeft: "2px", animation: "blink 1s step-end infinite" }}>&nbsp;</span>
                </pre>
              </div>
              <style>{`
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
              `}</style>
            </div>
          </section>

          {/* SECTION 4: MONETIZATION & SUBSCRIPTIONS */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>04. Stripe SaaS Integration</h3>
              <p>
                A SaaS is only a hobby until it can process payments. I integrated Stripe Webhooks to handle the complex logic of subscription states (Active, Past Due, Canceled).
              </p>
              <p>
                When a user upgrades to the Pro Tier, a webhook hits the Next.js API, updates the user's Prisma record, and instantly unlocks unlimited GPT-4 queries on the frontend via React state re-validation.
              </p>
              <div className="cs-tags">
                <span className="cs-tag">Stripe Webhooks</span>
                <span className="cs-tag">SaaS Monetization</span>
              </div>
            </div>
            
            <div className="cs-image arch-box" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ padding: "0.5rem 1rem", background: "#635bff", borderRadius: "20px", color: "#fff", fontSize: "0.8rem", fontWeight: "bold", letterSpacing: "1px" }}>
                STRIPE EVENT: invoice.payment_succeeded
              </div>
              <div style={{ color: "#666" }}>↓</div>
              <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                <div style={{ flex: 1, padding: "1.5rem", background: "#0a0a0a", border: "1px solid #333", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ color: "#a0a0a0", fontSize: "0.8rem", marginBottom: "0.5rem" }}>Database</div>
                  <div style={{ color: "#10b981", fontWeight: "bold" }}>isPro = true</div>
                </div>
                <div style={{ flex: 1, padding: "1.5rem", background: "#0a0a0a", border: "1px solid #333", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ color: "#a0a0a0", fontSize: "0.8rem", marginBottom: "0.5rem" }}>API Limits</div>
                  <div style={{ color: "#3b82f6", fontWeight: "bold" }}>Token Cap Removed</div>
                </div>
              </div>
            </div>
          </section>

          {/* --- BOTTOM BACK BUTTON (STYLED AS A BUTTON) --- */}
          <div 
            style={{ 
              width: "100%",
              marginTop: "6rem", 
              display: "flex", 
              justifyContent: "center"
            }}
          >
            <Link
              to="/work/codesense-ai-saas" 
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
                e.currentTarget.style.color = "#3b82f6"; // CodeSense Blue
                e.currentTarget.style.borderColor = "#3b82f6"; 
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)"; 
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

        <CaseStudyFooter currentProject="codesense" />
      </div>
    </>
  );
}