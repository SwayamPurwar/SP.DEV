import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../../components/SEO';
gsap.registerPlugin(ScrollTrigger);

export default function Instagram() {
  const containerRef = useRef(null); // FIX: Added ref for GSAP scope

  useEffect(() => {
    // FIX: Wrapped animations in GSAP context for cleanup
    let ctx = gsap.context(() => {
      gsap.from(".p-title", { y: 50, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.2 });
      gsap.from(".p-img-container", { rotateX: 15, scale: 0.9, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.4 });
      gsap.from(".glass-card, .p-info", { y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.6 });

      gsap.to(".p-img", {
        yPercent: 20, ease: "none",
        scrollTrigger: { trigger: ".p-img-container", start: "top bottom", end: "bottom top", scrub: true }
      });
      gsap.to(".p-img-container", {
        rotateX: 0,
        scrollTrigger: { trigger: ".p-hero", start: "top top", scrub: 1 }
      });
    }, containerRef);

    return () => ctx.revert(); // FIX: Proper cleanup
  }, []);

  return (
    <div ref={containerRef}>
      <SEO 
        title="Instagram | Project Details" 
        description="Full-stack social media platform built with MERN stack and Real-time Socket.io."
        image="/assets/images/project/instagram-preview.webp"
      />
      <div className="grid-bg"></div>
      <div className="orb orb-purple"></div>
      <div className="orb orb-orange"></div>

      <main>
        <section className="p-hero">
          <h1 className="p-title text-gradient-ig">
            INSTAGRAM<br /><span className="outline-sub" style={{WebkitTextStroke: '1px rgba(255, 255, 255, 0.8)'}}>APP</span>
          </h1>

          <div className="p-img-wrapper">
            <div className="p-img-container">
              <img src="https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=1674&auto=format&fit=crop" className="p-img" alt="Instagram clone UI" />
            </div>
          </div>

          <div className="p-content">
            <article className="p-desc glass-card">
              <h3>The Challenge</h3>
              <div>
                <p>Building a fully functional social media platform is a complex architectural challenge. The goal was to replicate the core "addictive" features of Instagram—infinite scroll, instant likes, and real-time updates—within a scalable environment.</p>
                <p>I utilized <strong>MongoDB</strong> for the robust backend to handle user data schemas, while <strong>React</strong> provided a snappy, app-like experience on the frontend.</p>
              </div>
              <div className="btn-group">
                {/* FIX: Changed relative path to absolute React Router path */}
                <Link to="/work/instagram-casestudy" className="btn mouse-hover">View Case Study</Link>
                <a href="https://swayaminstagram.vercel.app" target="_blank" rel="noreferrer" className="btn mouse-hover">View Live Demo</a>
              </div>
            </article>

            <aside className="p-info">
              <h4>Role</h4>
              <p className="info-text">Full Stack Developer & UI Designer</p>
              <h4>Tech Stack</h4>
              <div className="tech-list" style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '3rem'}}>
                {['MongoDB', 'Express', 'React', 'Node.js', 'Redux', 'JWT Auth'].map(tech => (
                  <span key={tech} className="tech-pill mouse-hover" style={{padding: '6px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.8rem'}}>{tech}</span>
                ))}
              </div>
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
  );
}