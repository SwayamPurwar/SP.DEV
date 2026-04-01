"use client";
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CaseStudyFooter from "@/components/CaseStudyFooter";

gsap.registerPlugin(ScrollTrigger);

export default function RepoSagePrimeAiSaasCaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const [streamText, setStreamText] = useState("");
  const [copied, setCopied] = useState(false);

  // Terminal AI Streaming Simulation
  useEffect(() => {
    const codeSnippet = `// Establishing secure edge connection...\n// Connecting to Neon Postgres pgvector...\n// Context retrieved. Generating component...\n\nexport const CodeBlock = ({ code }) => {\n  const [copied, setCopied] = useState(false);\n  \n  const handleCopy = async () => {\n    await navigator.clipboard.writeText(code);\n    setCopied(true);\n    setTimeout(() => setCopied(false), 2000);\n  };\n  \n  return (\n    <div className="relative bg-gray-900 rounded-lg p-4">\n      <pre className="text-sm text-green-400">{code}</pre>\n      <CopyButton onClick={handleCopy} success={copied} />\n    </div>\n  );\n};`;
    
    let intervalId: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      setStreamText("");
      let index = 0;
      
      intervalId = setInterval(() => {
        setStreamText((prev) => prev + codeSnippet.charAt(index));
        index++;
        
        // Auto-scroll the terminal window down
        if (terminalScrollRef.current) {
          terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
        }

        if (index >= codeSnippet.length) {
          clearInterval(intervalId);
          timeoutId = setTimeout(startTyping, 6000);
        }
      }, 25);
    };

    startTyping();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Entry Animations
      gsap.fromTo(".cs-top-back", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 });
      
      // Changed "all" to "transform,opacity"
      gsap.fromTo(".cs-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4, clearProps: "transform,opacity" });
      gsap.fromTo(".cs-meta", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6, clearProps: "transform,opacity" });

      // Ambient Orbs
      gsap.to(".orb-purple", { x: "random(-40, 40)", y: "random(-40, 40)", duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-orange", { x: "random(-40, 40)", y: "random(-40, 40)", duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });

      ScrollTrigger.refresh();

      // Section Fade-ins
      gsap.utils.toArray<HTMLElement>(".cs-section").forEach((section) => {
        gsap.fromTo(
          section,
          { y: 50, opacity: 0 },
          { scrollTrigger: { trigger: section, start: "top 85%" }, y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
        );
      });

      // Node Hover Animations
      gsap.to(".node-card", { y: -6, duration: 2.5, stagger: 0.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Safe Copy Function
  const handleCopyCode = async () => {
    const actualCode = "export async function POST(req: Request) {\n  const { prompt, framework, codeContext } = await req.json();\n\n  // Construct contextual prompt\n  const systemMessage = `\n    You are an expert ${framework} developer.\n    Analyze this existing code: \\n${codeContext}\\n\n    Generate a solution for: ${prompt}\n  `;\n\n  const response = await openai.createChatCompletion({\n    model: \"gpt-4-turbo\",\n    messages: [{ role: \"system\", content: systemMessage }],\n    stream: true,\n  });\n\n  return new StreamingTextResponse(response);\n}";
    
    try {
      await navigator.clipboard.writeText(actualCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <>
      <div ref={containerRef} style={{ position: "relative", overflowX: "hidden" }}>

        <div className="grid-bg"></div>
        <div className="orb orb-purple" style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)" }}></div>
        <div className="orb orb-orange" style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)", top: "60%", right: "10%" }}></div>

        <header className="cs-hero" style={{ paddingBottom: "10vh" }}>
          <h1 className="cs-title" style={{ background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "clamp(3rem, 5vw, 4.5rem)" }}>
            REPOSAGE PRIME<br />
            <span className="outline-sub" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)", color: "transparent" }}>SAAS PLATFORM</span>
          </h1>
          <div className="cs-meta" style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
            <div className="meta-item"><h4>Timeline</h4><p>5 Weeks</p></div>
            <div className="meta-item"><h4>Role</h4><p>Lead Engineer</p></div>
            <div className="meta-item"><h4>Core Integration</h4><p>OpenAI GPT-4 API</p></div>
            <div className="meta-item"><h4>Stack</h4><p>Next.js + Stripe</p></div>
          </div>
        </header>

        <div className="cs-content">
          {/* SECTION 1: ARCHITECTURE */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>01. System Architecture</h3>
              <p>Building an AI-driven SaaS requires a highly robust edge-computing setup. CodeSense uses Next.js API routes to handle authentication and securely relay prompts to the OpenAI models.</p>
              <p>To maintain conversation history and context, user sessions and prompt metadata are stored in Prisma/PostgreSQL, while Stripe handles the subscription tiering logic.</p>
              <div className="cs-tags" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "1rem" }}>
                <span className="cs-tag" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#60a5fa", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem" }}>Next.js 14</span>
                <span className="cs-tag" style={{ background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.3)", color: "#c084fc", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem" }}>Prisma ORM</span>
                <span className="cs-tag" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem" }}>Microservices</span>
              </div>
            </div>
            <div className="cs-image arch-box" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "clamp(1rem, 4vw, 2rem)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", width: "100%" }}>
              <div className="arch-grid" style={{ display: "flex", flexDirection: "column", gap: "clamp(1.5rem, 4vw, 2rem)", alignItems: "center", width: "100%" }}>
                
                {/* --- Top Row --- */}
                <div style={{ display: "flex", gap: "clamp(0.5rem, 3vw, 2rem)", alignItems: "center", justifyContent: "center", width: "100%" }}>
                  <div className="node-card" style={{ padding: "clamp(0.8rem, 2vw, 1.2rem)", border: "1px solid #3b82f6", borderRadius: "12px", textAlign: "center", background: "#0a0a0a", width: "clamp(115px, 35vw, 150px)", boxShadow: "0 10px 30px -10px rgba(59,130,246,0.2)" }}>
                    <span style={{ display: "block", color: "#fff", fontWeight: "bold", fontSize: "clamp(0.8rem, 2.5vw, 1rem)" }}>Next.js UI</span>
                    <span style={{ color: "#a0a0a0", fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)" }}>Tailwind + React</span>
                  </div>
                  
                  <div style={{ color: "#666", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>⟷</div>
                  
                  <div className="node-card" style={{ padding: "clamp(0.8rem, 2vw, 1.2rem)", border: "1px solid #8b5cf6", borderRadius: "12px", textAlign: "center", background: "#0a0a0a", width: "clamp(115px, 35vw, 150px)", boxShadow: "0 10px 30px -10px rgba(139,92,246,0.2)" }}>
                    <span style={{ display: "block", color: "#fff", fontWeight: "bold", fontSize: "clamp(0.8rem, 2.5vw, 1rem)" }}>Edge API</span>
                    <span style={{ color: "#a0a0a0", fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)" }}>Serverless Funcs</span>
                  </div>
                </div>
                
                {/* --- Vertical Arrows --- */}
                <div style={{ display: "flex", gap: "clamp(4.5rem, 20vw, 8rem)", color: "#666", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
                  <span>↓</span>
                  <span>↓</span>
                </div>
                
                {/* --- Bottom Row --- */}
                <div style={{ display: "flex", gap: "clamp(1rem, 5vw, 2rem)", alignItems: "center", justifyContent: "center", width: "100%" }}>
                  <div className="node-card" style={{ padding: "clamp(0.8rem, 2vw, 1.2rem)", border: "1px solid #10b981", borderRadius: "12px", textAlign: "center", background: "#0a0a0a", width: "clamp(115px, 35vw, 150px)", boxShadow: "0 10px 30px -10px rgba(16,185,129,0.2)" }}>
                    <span style={{ display: "block", color: "#fff", fontWeight: "bold", fontSize: "clamp(0.8rem, 2.5vw, 1rem)" }}>OpenAI</span>
                    <span style={{ color: "#a0a0a0", fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)" }}>GPT-4 / Vectors</span>
                  </div>
                  
                  <div className="node-card" style={{ padding: "clamp(0.8rem, 2vw, 1.2rem)", border: "1px solid #f59e0b", borderRadius: "12px", textAlign: "center", background: "#0a0a0a", width: "clamp(115px, 35vw, 150px)", boxShadow: "0 10px 30px -10px rgba(245,158,11,0.2)" }}>
                    <span style={{ display: "block", color: "#fff", fontWeight: "bold", fontSize: "clamp(0.8rem, 2.5vw, 1rem)" }}>Database</span>
                    <span style={{ color: "#a0a0a0", fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)" }}>Neon + Prisma</span>
                  </div>
                </div>
                
              </div>
            </div>
          </section>

          {/* SECTION 2: CONTEXT ENGINE */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>02. The Context Engine</h3>
              <p>To provide meaningful code suggestions, the LLM needs context. I engineered a prompt-chaining system that automatically injects the user's selected framework, language, and surrounding code into the hidden system prompt.</p>
              <p>This ensures the generated code matches the exact syntax and architecture of the user's existing project without requiring them to manually explain it every time.</p>
              <div className="cs-tags" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "1rem" }}>
                <span className="cs-tag" style={{ background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.3)", color: "#a78bfa", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem" }}>Prompt Engineering</span>
                <span className="cs-tag" style={{ background: "rgba(236, 72, 153, 0.1)", border: "1px solid rgba(236, 72, 153, 0.3)", color: "#f472b6", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem" }}>OpenAI API</span>
              </div>
            </div>
            
            <div className="cs-image code-window" style={{ background: "#0d1117", borderRadius: "12px", border: "1px solid #30363d", overflow: "hidden", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }}>
              <div style={{ background: "#161b22", padding: "12px 15px", borderBottom: "1px solid #30363d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }}></div>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }}></div>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f" }}></div>
                </div>
                <span style={{ color: "#8b949e", fontSize: "0.8rem", fontFamily: "var(--font-code)" }}>api/generate/route.ts</span>
                <button onClick={handleCopyCode} className="mouse-hover" style={{ background: "transparent", border: "none", color: copied ? "#10b981" : "#8b949e", fontSize: "0.7rem", fontFamily: "var(--font-code)", cursor: "pointer", transition: "color 0.2s" }}>
                  {copied ? "✓ COPIED" : "COPY"}
                </button>
              </div>
              <div style={{ padding: "20px", fontFamily: "var(--font-code)", fontSize: "0.85rem", color: "#c9d1d9", overflowX: "auto", lineHeight: "1.6" }}>
                <span style={{ color: "#ff7b72" }}>export async function</span> <span style={{ color: "#d2a8ff" }}>POST</span>(req: Request) &#123;<br/>
                &nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>const</span> &#123; prompt, framework, codeContext &#125; = <span style={{ color: "#ff7b72" }}>await</span> req.<span style={{ color: "#d2a8ff" }}>json</span>();<br/><br/>
                &nbsp;&nbsp;<span style={{ color: "#8b949e", fontStyle: "italic" }}>// Construct contextual prompt</span><br/>
                &nbsp;&nbsp;<span style={{ color: "#ff7b72" }}>const</span> systemMessage = `<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a5d6ff" }}>You are an expert $&#123;framework&#125; developer.</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a5d6ff" }}>Analyze this existing code: \n$&#123;codeContext&#125;\n</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#a5d6ff" }}>Generate a solution for: $&#123;prompt&#125;</span><br/>
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

          {/* SECTION 3: STREAMING */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>03. Stream Processing</h3>
              <p>Waiting for an AI model to generate 500 lines of code causes massive UX friction. To solve this, I implemented <code>StreamingTextResponse</code> from the Vercel AI SDK.</p>
              <p>Chunks of data are streamed directly from the OpenAI server to the edge, and finally painted onto the user's React DOM in real-time, giving a typing effect that feels instant and responsive.</p>
              <div className="cs-tags" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "1rem" }}>
                <span className="cs-tag" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem" }}>Vercel AI SDK</span>
                <span className="cs-tag" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#60a5fa", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem" }}>Edge Streaming</span>
              </div>
            </div>
            
            <div className="cs-image arch-box" style={{ background: "#050505", border: "1px solid #333", borderRadius: "12px", height: "350px", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 40px -10px rgba(16,185,129,0.15)" }}>
              <div style={{ background: "#111", padding: "10px 15px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#888", fontSize: "0.8rem", fontFamily: "var(--font-code)" }}>bash — CodeSense Stream</span>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", background: "rgba(59, 130, 246, 0.1)", padding: "4px 10px", borderRadius: "12px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6", animation: "pulse 1.5s infinite" }}></span>
                  <span style={{ color: "#3b82f6", fontSize: "0.65rem", fontWeight: "bold", letterSpacing: "1px" }}>GENERATING</span>
                </div>
              </div>
              <div ref={terminalScrollRef} style={{ padding: "20px", fontFamily: "var(--font-code)", fontSize: "0.9rem", color: "#10b981", overflowY: "auto", flexGrow: 1, scrollBehavior: "smooth" }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                  {streamText}
                  <span className="cursor-blink" style={{ display: "inline-block", borderRight: "3px solid #10b981", marginLeft: "2px", height: "14px", verticalAlign: "baseline", animation: "blink 1s step-end infinite" }}></span>
                </pre>
              </div>
              <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
            </div>
          </section>

          {/* SECTION 4: STRIPE */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>04. Stripe SaaS Integration</h3>
              <p>A SaaS is only a hobby until it can process payments. I integrated Stripe Webhooks to handle the complex logic of subscription states (Active, Past Due, Canceled).</p>
              <p>When a user upgrades to the Pro Tier, a webhook hits the Next.js API, updates the user's Prisma record, and instantly unlocks unlimited GPT-4 queries on the frontend via React state re-validation.</p>
              <div className="cs-tags" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "1rem" }}>
                <span className="cs-tag" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#fbbf24", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem" }}>Stripe Webhooks</span>
                <span className="cs-tag" style={{ background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.3)", color: "#c084fc", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem" }}>Monetization</span>
              </div>
            </div>
            
            <div className="cs-image arch-box" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ padding: "0.8rem 1.2rem", background: "#635bff", borderRadius: "20px", color: "#fff", fontSize: "0.8rem", fontWeight: "bold", letterSpacing: "1px", boxShadow: "0 10px 20px -5px rgba(99,91,255,0.4)" }}>
                STRIPE EVENT: invoice.payment_succeeded
              </div>
              <div style={{ color: "#666" }}>↓</div>
              <div style={{ display: "flex", gap: "1.5rem", width: "100%", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 150px", padding: "1.5rem", background: "#0a0a0a", border: "1px solid #333", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ color: "#a0a0a0", fontSize: "0.8rem", marginBottom: "0.5rem", textTransform: "uppercase" }}>Database</div>
                  <div style={{ color: "#10b981", fontWeight: "bold", fontFamily: "var(--font-code)" }}>isPro = true</div>
                </div>
                <div style={{ flex: "1 1 150px", padding: "1.5rem", background: "#0a0a0a", border: "1px solid #333", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ color: "#a0a0a0", fontSize: "0.8rem", marginBottom: "0.5rem", textTransform: "uppercase" }}>API Limits</div>
                  <div style={{ color: "#3b82f6", fontWeight: "bold", fontFamily: "var(--font-code)" }}>Cap Removed</div>
                </div>
              </div>
            </div>
          </section>

          <div 
            style={{ 
              marginTop: "4rem", 
              paddingTop: "2rem",
              display: "flex", 
              justifyContent: "center", 
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              position: "relative",
              zIndex: 10
            }}
          >
            <Link
              href="/work/reposage-prime-aisaas" 
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
                padding: "1.2rem 2.5rem", 
                border: "1px solid rgba(255, 255, 255, 0.2)", 
                borderRadius: "50px", 
                transition: "all 0.3s ease", 
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(10px)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#3b82f6"; 
                e.currentTarget.style.borderColor = "#3b82f6"; 
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.08)"; 
                e.currentTarget.style.transform = "translateY(-3px)"; 
                e.currentTarget.style.boxShadow = "0 10px 20px -10px rgba(59, 130, 246, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              &larr; Back to Overview
            </Link>
          </div>

        </div>

        <CaseStudyFooter currentProject="reposage-prime-aisaas" />
      </div>
    </>
  );
}