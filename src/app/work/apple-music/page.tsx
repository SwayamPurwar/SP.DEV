"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ProjectsFooter from "@/components/ProjectsFooter";

gsap.registerPlugin(ScrollTrigger);

export default function AppleMusic() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Wrap all GSAP code in a context for easy React cleanup
    let ctx = gsap.context(() => {
      // Entrance Animations
      gsap.fromTo(
        ".p-title",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.2 },
      );
      gsap.fromTo(
        ".p-img-container",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "bottom",
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.4,
        },
      );
      gsap.fromTo(
        ".p-desc, .p-info",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.8,
        },
      );

      // Parallax Scroll Trigger
      gsap.to(".p-img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".p-img-container",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    // CRITICAL: Cleanup function runs when leaving the page
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={containerRef}>
        {/* <-- ADDED GRID BACKGROUND HERE --> */}
        <div className="grid-bg"></div>
        <div className="ambient-glow-red"></div>

        <main>
          <section className="p-hero">
            <h1 className="p-title" style={{ opacity: 0 }}>
              APPLE MUSIC
              <br />
              <span className="outline-sub">REDESIGN</span>
            </h1>

            <div className="p-img-container" style={{ transform: "scaleY(0)" }}>
              <Image
                src="https://www.apple.com/v/apple-music/af/images/shared/og__ckjrh2mu8b2a_image.png"
                className="p-img"
                alt="Apple Music iOS interface redesign"
                width={1200}
                height={630}
                style={{ width: "100%", height: "auto" }}
                priority={true}
              />
            </div>

            <div className="p-content">
              <article className="p-desc glass-card" style={{ opacity: 0 }}>
                <h3>The Vision</h3>
                <div>
                  <p>
                    Music apps often feel cluttered. This project was a UI/UX
                    case study aimed at simplifying the Apple Music experience
                    while introducing fluid, gesture-based interactions.
                  </p>
                  <p>
                    I focused on "Glassmorphism" and dynamic color extraction,
                    where the interface adapts to the album art in real-time.
                    The result is a cleaner, more immersive listening
                    experience.
                  </p>
                </div>
                <div className="btn-group">
                  <Link
                    href="/work/apple-music-casestudy"
                    className="btn mouse-hover"
                  >
                    View Case Study
                  </Link>
                  <a
                    href="https://github.com/SwayamPurwar/Apple-Music.git"
                    target="_blank"
                    rel="noreferrer"
                    className="btn mouse-hover"
                  >
                    GitHub Code
                  </a>
                </div>
              </article>

              <aside className="p-info" style={{ opacity: 0 }}>
                <h4>Role</h4>
                <ul>
                  <li>UI/UX Researcher</li>
                  <li>Visual Designer</li>
                </ul>
                <h4>Tools Used</h4>
                <ul>
                  <li>Figma</li>
                  <li>Spline 3D</li>
                  <li>Protopie</li>
                </ul>
                <h4>Year</h4>
                <ul>
                  <li>2025</li>
                </ul>
              </aside>
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
                href="/"
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
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",

                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#fc3c44"} // Apple Music Red
                onMouseOut={(e) => e.currentTarget.style.color = "#fff"}
              >
                &larr; Back to Home
              </Link>
            </div>
            {/* The old hardcoded footer was removed from here to prevent duplication */}
          </section>
        </main>
      </div>

      {/* THE NEW PREMIUM FOOTER */}
      <ProjectsFooter currentProject="apple-music" />
    </>
  );
}