import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import gsap from 'gsap';

export default function Contact() {
  const topInfoRef = useRef(null);
  const formCardRef = useRef(null);
  const formRef = useRef(null);
  const backBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Staggered fade up for the Top Section (Typography & Info)
    gsap.fromTo(
      topInfoRef.current.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
    );

    // 2. Smooth entrance for the Glass Form Card below it
    gsap.fromTo(
      formCardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
    );

    // 3. Inner stagger for form fields
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.6 }
      );
    }

    // 4. Fade in bottom return button
    if (backBtnRef.current) {
      gsap.fromTo(
        backBtnRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out', delay: 1 }
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => navigate('/success'), 500); 
  };

  return (
    <>
      <SEO title="Contact | Swayam Purwar" description="Get in touch. Open for freelance opportunities and full-time roles." />
      
      {/* Background Assets */}
      <div className="grid-bg"></div>
      <div className="orb orb-1" style={{ opacity: 0.15, filter: 'blur(100px)' }}></div>
      <div className="orb orb-2" style={{ opacity: 0.1, background: 'radial-gradient(circle, var(--accent), transparent 60%)', filter: 'blur(120px)' }}></div>

      <div className="contact-lux-wrapper">
        
        {/* The single-column stacked container */}
        <div className="contact-stacked-container">
          
          {/* TOP SECTION: Typography & Info */}
          <div className="lux-info-section" ref={topInfoRef}>
            
            <div>
              <span className="system-tag" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
                STATUS: ACCEPTING NEW PROJECTS
              </span>
              <h1 className="lux-title">Let's build<br/>something<br/>extraordinary.</h1>
              <p className="lux-subtitle">
                I partner with ambitious brands and individuals to build digital experiences that matter. Have a project in mind? Let's bring it to life.
              </p>
            </div>

            {/* Split Contact Info on Desktop */}
            <div className="lux-details-grid">
              <div>
                <h4 style={{ color: '#666', fontFamily: 'var(--font-code)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
                  Direct Transmission
                </h4>
                <a href="mailto:swayampurwar111104@gmail.com" className="lux-contact-link mouse-hover">
                  swayampurwar111104@gmail.com
                </a>
              </div>

              <div>
                <h4 style={{ color: '#666', fontFamily: 'var(--font-code)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
                  Social Network
                </h4>
                <div className="lux-social-list">
                  <a href="https://www.linkedin.com/in/SwayamPurwar" target="_blank" rel="noreferrer" className="lux-social-pill mouse-hover">
                    LinkedIn ↗
                  </a>
                  <a href="https://github.com/SwayamPurwar/" target="_blank" rel="noreferrer" className="lux-social-pill mouse-hover">
                    GitHub ↗
                  </a>
                  <a href="https://x.com/" target="_blank" rel="noreferrer" className="lux-social-pill mouse-hover">
                    Twitter ↗
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION: Premium Glass Form */}
          <div ref={formCardRef}>
            <div className="lux-form-card">
              
              <h3 style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'white', fontFamily: 'var(--font-display)' }}>
                Send a Message
              </h3>

              <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* 50/50 Grid for Name & Email on Desktop */}
                <div className="form-row">
                  <div className="lux-input-group">
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      required 
                      placeholder=" " 
                      className="lux-input mouse-hover"
                      autoComplete="off"
                    />
                    <label htmlFor="name" className="lux-label">Your Name</label>
                  </div>

                  <div className="lux-input-group">
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      required 
                      placeholder=" " 
                      className="lux-input mouse-hover"
                      autoComplete="off"
                    />
                    <label htmlFor="email" className="lux-label">Email Address</label>
                  </div>
                </div>

                <div className="lux-input-group">
                  <textarea 
                    id="message" 
                    name="message"
                    rows="5" 
                    required 
                    placeholder=" " 
                    className="lux-input mouse-hover"
                  ></textarea>
                  <label htmlFor="message" className="lux-label">Message Payload</label>
                </div>

                <button type="submit" className="lux-submit-btn mouse-hover">
                  Transmit Data
                </button>

              </form>
            </div>
          </div>

        </div>

        {/* --- BOTTOM RETURN ZONE --- */}
        <div className="lux-return-zone" ref={backBtnRef}>
          <button 
            onClick={() => navigate(-1)} 
            className="mouse-hover"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '100px',
              color: '#888',
              fontFamily: 'var(--font-code)',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              padding: '12px 30px',
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
            ← Back To Home
          </button>
        </div>

      </div>
    </>
  );
}