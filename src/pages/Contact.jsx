import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import gsap from 'gsap';

export default function Contact() {
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const formRef = useRef(null);
  const backBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Smooth, staggered reveal for Left Column
    gsap.fromTo(
      leftColRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
    );

    // 2. Elegant fade up for the Glass Card
    gsap.fromTo(
      rightColRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );

    // 3. Staggered pop-in for form fields inside the card
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.children,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.5 }
      );
    }

    // 4. Fade in the bottom Return button
    if (backBtnRef.current) {
      gsap.fromTo(
        backBtnRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 }
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => navigate('/success'), 500); 
  };

  return (
    <>
      <SEO title="Contact | Swayam Purwar" description="Get in touch with Swayam Purwar. Let's build something amazing." />
      
      {/* Native Ambient Background (Matches About & Work pages) */}
      <div className="grid-bg"></div>
      <div className="orb orb-1" style={{ opacity: 0.15 }}></div>
      <div className="orb orb-2" style={{ opacity: 0.1, background: 'radial-gradient(circle, var(--accent), transparent 60%)' }}></div>

      <div className="contact-grid">
        
        {/* LEFT COLUMN: Typography & Links */}
        <div ref={leftColRef}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-code)', color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              &gt; STATUS: OPEN FOR WORK
            </span>
          </div>

          <h1 className="contact-heading glitch" data-text="LET'S CONNECT">
            LET'S CONNECT
          </h1>
          
          <p className="contact-sub">
            I am currently looking for new opportunities. Whether you have a question, a project proposal, or just want to connect, my inbox is always open.
          </p>

          <div className="contact-links">
            <div className="c-link-group">
              <span className="c-link-label">Direct Email</span>
              <a href="mailto:swayampurwar111104@gmail.com" className="c-link-val mouse-hover">
                swayampurwar111104<br/>@gmail.com
              </a>
            </div>

            <div className="c-link-group">
              <span className="c-link-label">Socials</span>
              <a href="https://www.linkedin.com/in/SwayamPurwar" target="_blank" rel="noreferrer" className="c-link-val mouse-hover">LinkedIn ↗</a>
              <a href="https://github.com/SwayamPurwar/" target="_blank" rel="noreferrer" className="c-link-val mouse-hover">GitHub ↗</a>
              <a href="https://x.com/" target="_blank" rel="noreferrer" className="c-link-val mouse-hover">Twitter / X ↗</a>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: The Native Glass Card */}
        <div ref={rightColRef}>
          <div className="glass-card" style={{ padding: '3.5rem' }}>
            
            <h3 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', color: 'white', fontFamily: 'var(--font-display)' }}>
              Send a Message
            </h3>

            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              
              <input 
                type="text" 
                id="name" 
                name="name"
                required 
                placeholder="[ YOUR NAME ]" 
                className="c-input mouse-hover"
                autoComplete="off"
              />

              <input 
                type="email" 
                id="email" 
                name="email"
                required 
                placeholder="[ EMAIL ADDRESS ]" 
                className="c-input mouse-hover"
                autoComplete="off"
              />

              <textarea 
                id="message" 
                name="message"
                rows="4" 
                required 
                placeholder="[ MESSAGE PAYLOAD ]" 
                className="c-input mouse-hover"
              ></textarea>

              <button type="submit" className="btn mouse-hover" style={{ alignSelf: 'flex-start', marginTop: '1rem', padding: '16px 40px' }}>
                Transmit Data
              </button>

            </form>
          </div>
        </div>

      </div>

      {/* --- BOTTOM RETURN BUTTON --- */}
      <div 
        ref={backBtnRef}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          paddingBottom: '8vh',
          position: 'relative',
          zIndex: 10
        }}
      >
        <button 
          onClick={() => navigate(-1)} 
          className="btn mouse-hover"
          style={{
            background: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#888',
            fontFamily: 'var(--font-code)',
            fontSize: '0.85rem',
            letterSpacing: '2px',
            padding: '12px 35px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.borderColor = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#888';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          [ BACK TO HOME ]
        </button>
      </div>
      
    </>
  );
}