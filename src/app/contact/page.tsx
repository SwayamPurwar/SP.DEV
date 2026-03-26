"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
// Ensure this path matches your structure if you still use the SEO component in Client components
 

export default function Contact() {
  const topInfoRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const backBtnRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // 1. Staggered fade up for the Top Section (Typography & Info)
    if (topInfoRef.current) {
      gsap.fromTo(
        topInfoRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
      );
    }

    // 2. Smooth entrance for the Glass Form Card below it
    if (formCardRef.current) {
      gsap.fromTo(
        formCardRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
    }

    // 3. Inner stagger for form fields
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.6,
        }
      );
    }

    // 4. Fade in bottom return button
    if (backBtnRef.current) {
      gsap.fromTo(
        backBtnRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out", delay: 1 }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      // Calls the Next.js API route (or Vercel serverless function)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        sessionStorage.setItem("contactSubmitted", "true");
        router.push("/success");
      } else {
        console.error("Server Error");
        alert("Transmission failed on the server. Please try again.");
        setIsSending(false);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network transmission failed. Please check your connection and try again.");
      setIsSending(false);
    }
  };

  return (
    <>
     

      {/* Background Assets */}
      <div className="grid-bg"></div>
      <div className="orb orb-1" style={{ opacity: 0.15, filter: "blur(100px)" }}></div>
      <div
        className="orb orb-2"
        style={{
          opacity: 0.1,
          background: "radial-gradient(circle, var(--accent), transparent 60%)",
          filter: "blur(120px)",
        }}
      ></div>

      <div className="contact-lux-wrapper">
        <div className="contact-stacked-container">
          {/* TOP SECTION: Typography & Info */}
          <div className="lux-info-section" ref={topInfoRef}>
            <div>
              <span className="system-tag" style={{ marginBottom: "1.5rem", display: "inline-block" }}>
                STATUS: ACCEPTING NEW PROJECTS
              </span>
              <h1 className="lux-title">
                Let's build<br />something<br />extraordinary.
              </h1>
              <p className="lux-subtitle">
                I partner with ambitious brands and individuals to build digital
                experiences that matter. Have a project in mind? Let's bring it to life.
              </p>
            </div>

            <div className="lux-details-grid">
              <div>
                <h4
                  style={{
                    color: "#666",
                    fontFamily: "var(--font-code)",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "1rem",
                  }}
                >
                  Direct Transmission
                </h4>
                <a href="mailto:swayampurwar111104@gmail.com" className="lux-contact-link mouse-hover">
                  swayampurwar111104@gmail.com
                </a>
              </div>

              <div>
                <h4
                  style={{
                    color: "#666",
                    fontFamily: "var(--font-code)",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "1rem",
                  }}
                >
                  Social Network
                </h4>
                <div className="lux-social-list">
                  <a href="https://www.linkedin.com/in/swayam-purwar/" target="_blank" rel="noreferrer" className="lux-social-pill mouse-hover">
                    LinkedIn
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1em", height: "1em" }}>
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                  <a href="https://github.com/SwayamPurwar/" target="_blank" rel="noreferrer" className="lux-social-pill mouse-hover">
                    GitHub
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1em", height: "1em" }}>
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                  <a href="https://x.com/swayampurwar?s=21" target="_blank" rel="noreferrer" className="lux-social-pill mouse-hover">
                    Twitter
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1em", height: "1em" }}>
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Premium Glass Form */}
          <div ref={formCardRef}>
            <div className="lux-form-card">
              <h3 style={{ fontSize: "2rem", marginBottom: "2.5rem", color: "white", fontFamily: "var(--font-display)" }}>
                Send a Message
              </h3>

              <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                <div className="form-row">
                  <div className="lux-input-group">
                    <input type="text" id="name" name="name" required placeholder=" " className="lux-input mouse-hover" autoComplete="off" />
                    <label htmlFor="name" className="lux-label">Your Name</label>
                  </div>
                  <div className="lux-input-group">
                    <input type="email" id="email" name="email" required placeholder=" " className="lux-input mouse-hover" autoComplete="off" />
                    <label htmlFor="email" className="lux-label">Email Address</label>
                  </div>
                </div>

                <div className="lux-input-group">
                  <textarea id="message" name="message" rows={5} required placeholder=" " className="lux-input mouse-hover"></textarea>
                  <label htmlFor="message" className="lux-label">Message Payload</label>
                </div>

                <button type="submit" className="lux-submit-btn mouse-hover" disabled={isSending}>
                  {isSending ? "Transmitting..." : "Transmit Data"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- BOTTOM RETURN ZONE --- */}
        <div className="lux-return-zone" ref={backBtnRef}>
          <button
            onClick={() => router.push("/")} // Updated to Next.js router
            className="mouse-hover"
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "100px",
              color: "#888",
              fontFamily: "var(--font-code)",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "2px",
              padding: "12px 30px",
              transition: "all 0.3s ease",
              cursor: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "black";
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#888";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            ← Back To Home
          </button>
        </div>
      </div>
    </>
  );
}