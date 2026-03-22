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
    // Cinematic stagger reveal for the left column content
    gsap.fromTo(
      leftColRef.current.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power4.out' }
    );

    // Smooth entrance for the glass card on the right
    gsap.fromTo(
      rightColRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );

    // Staggered pop-in for form fields
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.6 }
      );
    }

    // Fade in the bottom back button last
    if (backBtnRef.current) {
      gsap.fromTo(
        backBtnRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1 }
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => navigate('/success'), 600); 
  };

  return (
    <>
      <SEO title="Contact | Swayam Purwar" description="Get in touch with Swayam Purwar. Let's build something amazing together." />
      
      {/* Immersive Background Ambient Layers */}
      <div className="grid-bg"></div>
      <div className="orb orb-1" style={{ opacity: 0.15, filter: 'blur(100px)' }}></div>
      <div className="orb orb-2" style={{ opacity: 0.1, filter: 'blur(120px)', background: 'radial-gradient(circle, var(--accent), transparent 60%)' }}></div>

      <div className="contact-container" style={{ paddingBottom: '5vh' }}>
        
        {/* LEFT COLUMN: INFO & SOCIALS */}
        <div className="contact-info-block" ref={leftColRef}>
          
          <div>
            <div className="status-badge">
              <div className="status-dot"></div>
              SYSTEM ONLINE
            </div>
            {/* Massive Hollow-to-Solid Title */}
            <h1 className="contact-title-massive">
              LET'S COLLAB
            </h1>
            <p style={{ color: '#aaa', lineHeight: '1.8', fontSize: '1.1rem', maxWidth: '90%', fontFamily: 'var(--font-code)' }}>
              &gt; I'm actively seeking new challenges and opportunities. Whether you have a project idea, a full-time role, or just want to connect, my inbox is open.
            </p>
          </div>

          <div className="contact-method">
            <h3>Direct Transmission</h3>
            <a href="mailto:swayampurwar111104@gmail.com" className="contact-link-large mouse-hover" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
              swayampurwar111104<br/>@gmail.com
            </a>
          </div>

          <div className="contact-method">
            <h3>Digital Footprint</h3>
            <div className="social-links-grid">
              
              <a href="https://www.linkedin.com/in/SwayamPurwar" target="_blank" rel="noreferrer" className="cyber-social-card mouse-hover">
                <span className="social-sub">// 01 _ Professional</span>
                <span className="social-name">LinkedIn</span>
                <span className="social-arrow">↗</span>
              </a>

              <a href="https://github.com/SwayamPurwar/" target="_blank" rel="noreferrer" className="cyber-social-card mouse-hover">
                <span className="social-sub">// 02 _ Open Source</span>
                <span className="social-name">GitHub</span>
                <span className="social-arrow">↗</span>
              </a>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CYBER FORM CARD */}
        <div ref={rightColRef}>
          <div className="cyber-contact-card">
            <div className="cyber-grid-overlay"></div>
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', textTransform: 'uppercase', letterSpacing: '2px' }}>DATA UPLOAD</h2>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-code)', fontSize: '0.8rem' }}>[ SECURE_CHANNEL ]</span>
              </div>

              <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
                
                <div className="input-floating">
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    required 
                    placeholder=" " 
                    className="mouse-hover"
                    autoComplete="off"
                  />
                  <label htmlFor="name" className="floating-label">[ IDENTIFIER / NAME ]</label>
                </div>

                <div className="input-floating">
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required 
                    placeholder=" " 
                    className="mouse-hover"
                    autoComplete="off"
                  />
                  <label htmlFor="email" className="floating-label">[ RETURN_ADDRESS / EMAIL ]</label>
                </div>

                <div className="input-floating">
                  <textarea 
                    id="message" 
                    name="message"
                    rows="5" 
                    required 
                    placeholder=" " 
                    className="mouse-hover"
                  ></textarea>
                  <label htmlFor="message" className="floating-label">[ MESSAGE_PAYLOAD ]</label>
                </div>

                <button type="submit" className="cyber-submit-btn mouse-hover">
                  <span>TRANSMIT_DATA</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM BACK BUTTON --- */}
      <div 
        ref={backBtnRef}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          paddingBottom: '10vh', 
          position: 'relative', 
          zIndex: 10 
        }}
      >
        <button 
          onClick={() => navigate(-1)} 
          className="manual-btn mouse-hover"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#888',
            fontFamily: 'var(--font-code)',
            fontSize: '0.9rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '15px 40px',
            transition: 'all 0.3s ease',
            cursor: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'black';
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#888';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          [ RETURN ]
        </button>
      </div>
      
    </>
  );
}