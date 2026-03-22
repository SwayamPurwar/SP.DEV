import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../../components/SEO';

import MoreProjectsFooter from '../../components/MoreProjectsFooter';

gsap.registerPlugin(ScrollTrigger);

export default function AppleMusic() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Wrap all GSAP code in a context for easy React cleanup
    let ctx = gsap.context(() => {
      // Entrance Animations
      gsap.fromTo(".p-title", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.2 });
      gsap.fromTo(".p-img-container", { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", duration: 1.2, ease: "power4.inOut", delay: 0.4 });
      gsap.fromTo(".p-desc, .p-info", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.8 });

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
     <SEO title="Apple Music Redesign | Case Study" description="UI/UX case study and redesign of Apple Music focusing on glassmorphism and fluid animations." />
    <div ref={containerRef}>
      <div className="ambient-glow-red"></div>

      <main>
        <section className="p-hero">
          <h1 className="p-title" style={{ opacity: 0 }}>
            APPLE MUSIC<br />
            <span className="outline-sub">REDESIGN</span>
          </h1>

          <div className="p-img-container" style={{ transform: "scaleY(0)" }}>
            <img
              src="https://www.apple.com/v/apple-music/af/images/shared/og__ckjrh2mu8b2a_image.png"
              className="p-img"
              alt="Apple Music iOS interface redesign"
            />
          </div>

          <div className="p-content">
            <article className="p-desc glass-card" style={{ opacity: 0 }}>
              <h3>The Vision</h3>
              <div>
                <p>
                  Music apps often feel cluttered. This project was a UI/UX case study aimed at simplifying the Apple Music experience while introducing fluid, gesture-based interactions.
                </p>
                <p>
                  I focused on "Glassmorphism" and dynamic color extraction, where the interface adapts to the album art in real-time. The result is a cleaner, more immersive listening experience.
                </p>
              </div>
              <div className="btn-group">
                <Link to="/work/apple-music-casestudy" className="btn mouse-hover">View Case Study</Link>
                <a href="https://github.com/SwayamPurwar/Apple-Music.git" target="_blank" rel="noreferrer" className="btn mouse-hover">GitHub Code</a>
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

          {/* FOOTER NAVIGATION */}
          <div style={{ textAlign: 'center', marginTop: '10rem', paddingBottom: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6rem' }}>
            <div style={{ marginBottom: '4rem' }}>
              <Link to="/" className="btn mouse-hover">&larr; Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
    
      <MoreProjectsFooter currentProject="apple-music" />
     </>
  );
 
}