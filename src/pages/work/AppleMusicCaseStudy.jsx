import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../../components/SEO';

gsap.registerPlugin(ScrollTrigger);

export default function AppleMusicCaseStudy() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Animations 
      gsap.fromTo(".cs-title", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4, clearProps: "all" }
      );

      gsap.fromTo(".cs-meta", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6, clearProps: "all" }
      );

      // 2. Wait slightly for Page Transition, then map the Scroll Triggers
      const scrollTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        
        gsap.utils.toArray(".cs-section").forEach(section => {
          gsap.fromTo(section,
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
              clearProps: "all"
            }
          );
        });

        // Add a floating animation to the CSS wireframe phone
        gsap.to(".wf-phone", {
            y: -15,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
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
      <SEO title="Apple Music UX Study" description="UI/UX Case Study on the Apple Music iOS app redesign." />
      <div ref={containerRef}>
        {/* The subtle red ambient glow in the background */}
        <div className="ambient-glow" style={{background: 'radial-gradient(circle, rgba(252, 60, 68, 0.15) 0%, rgba(0, 0, 0, 0) 70%)'}}></div>
        
        <header className="cs-hero">
          <h1 className="cs-title" style={{ color: '#fc3c44' }}>
            APPLE MUSIC<br /><span className="outline-sub" style={{WebkitTextStroke: '1px white', color: 'transparent'}}>CASE STUDY</span>
          </h1>
          <div className="cs-meta">
            <div className="meta-item"><h4>Timeline</h4><p>3 Weeks</p></div>
            <div className="meta-item"><h4>Role</h4><p>Product Designer</p></div>
            <div className="meta-item"><h4>Deliverables</h4><p>Hi-Fi Prototypes</p></div>
            <div className="meta-item"><h4>Tools</h4><p>Figma & Protopie</p></div>
          </div>
        </header>

        <div className="cs-content">
          
          {/* SECTION 1: DISCOVERY */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>01. Discovery</h3>
              <p>While Apple Music is an industry leader, user feedback often points to a "sterile" interface. Navigating between lyrics, queues, and playlists requires too many taps.</p>
              <p>The goal was to eliminate friction and bring the album artwork to the forefront of the experience.</p>
              <div className="cs-tags">
                <span className="cs-tag">User Research</span>
                <span className="cs-tag">Pain Points</span>
              </div>
            </div>
            <div className="cs-image">
               <img src="/assets/images/project/apple-music-preview.webp" alt="Discovery Phase" onLoad={() => ScrollTrigger.refresh()} />
            </div>
          </section>

          {/* SECTION 2: THE SOLUTION */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>02. The Solution</h3>
              <p>I introduced a Dynamic Glassmorphism System. Instead of a solid background, the player extracts the dominant colors from the album art and creates a fluid, animated mesh gradient.</p>
              <p>Controls were shifted to the lower third of the screen to improve reachability on larger iPhones.</p>
              <div className="cs-tags">
                <span className="cs-tag">UI Design</span>
                <span className="cs-tag">Glassmorphism</span>
              </div>
            </div>
            <div className="cs-image">
              <img src="/assets/images/project/apple-music-preview.webp" alt="Solution Phase" onLoad={() => ScrollTrigger.refresh()} />
            </div>
          </section>

          {/* SECTION 3: WIREFRAMING (Using the CSS classes from your styles.css) */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>03. Wireframing</h3>
              <p>Before jumping into high-fidelity designs, I mapped out the core user flows using low-fidelity wireframes.</p>
              <p>This allowed me to test the new gesture-based navigation (like swiping down to minimize the player) without getting distracted by colors and typography.</p>
              <div className="cs-tags">
                <span className="cs-tag">Wireframes</span>
                <span className="cs-tag">User Flow</span>
              </div>
            </div>
            <div className="cs-image wireframe-box" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div className="wf-phone">
                <div className="wf-header">
                  <div className="wf-blob"></div>
                </div>
                <div className="wf-art"></div>
                <div className="wf-lines">
                  <div className="wf-line"></div>
                  <div className="wf-line short"></div>
                </div>
                <div className="wf-controls">
                  <div className="wf-btn"></div>
                  <div className="wf-btn"></div>
                  <div className="wf-btn"></div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: FINAL POLISH */}
          <section className="cs-section">
            <div className="cs-text glass-card">
              <h3>04. Final Polish</h3>
              <p>The final prototype was built in Protopie to handle the complex, logic-based micro-interactions. The result is a player that feels alive, reacting to the music and the user's touch.</p>
            </div>
            <div className="cs-image">
              <img src="/assets/images/project/apple-music-preview.webp" alt="Final Prototype" onLoad={() => ScrollTrigger.refresh()} />
            </div>
          </section>

          {/* BOTTOM NAVIGATION WITH BACK BUTTON */}
          <div style={{ textAlign: 'center', marginTop: '10rem', paddingBottom: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6rem' }}>
            <div style={{ marginBottom: '4rem' }}>
              <Link to="/work/apple-music" className="btn mouse-hover">&larr; Back to Project</Link>
            </div>
            <p style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '1rem' }}>Next Project</p>
            <Link to="/work/instagram" className="mouse-hover" style={{ textDecoration: 'none' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'white', fontFamily: '"Syne", sans-serif' }}>INSTAGRAM CLONE &rarr;</h2>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}