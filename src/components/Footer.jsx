import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Footer() {
  const location = useLocation();
  const path = location.pathname;
  const [time, setTime] = useState(new Date());

  // Ticking Live Clock Logic
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Hide footer on 404, resume, success, and the new contact page
  if (path === '/resume' || path === '/success' || path === '/contact' || path === '/404') return null;

  return (
    <footer id="footer">
      
      {/* SLANTED NEON MARQUEE */}
      <div className="footer-marquee">
        <div className="marquee-inner">
          {/* Duplicated text to create a seamless infinite loop */}
          <span>OPEN FOR OPPORTUNITIES</span>
          <span>✦</span>
          <span>AVAILABLE FOR FREELANCE</span>
          <span>✦</span>
          <span>CREATIVE DEVELOPER</span>
          <span>✦</span>
          <span>OPEN FOR OPPORTUNITIES</span>
          <span>✦</span>
          <span>AVAILABLE FOR FREELANCE</span>
          <span>✦</span>
          <span>CREATIVE DEVELOPER</span>
          <span>✦</span>
        </div>
      </div>

      <div className="footer-content">
        {/* MASSIVE HOLLOW-TO-SOLID CTA */}
<div className="footer-top">
  <span className="footer-sub">INITIATE_PROJECT</span>
  <Link to="/contact" className="footer-cta mouse-hover">
    LET'S TALK 
    <span className="cta-arrow">
      {/* Replaced text arrow with premium SVG */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
      </svg>
    </span>
  </Link>
</div>

        <div className="footer-grid">
          
          {/* SOCIAL LINKS */}
          <div className="footer-col">
            <h4>Social Network</h4>
            <div className="footer-socials">
              <a href="https://www.linkedin.com/in/SwayamPurwar" target="_blank" rel="noreferrer" className="footer-social-link mouse-hover">LinkedIn</a>
              <a href="https://github.com/SwayamPurwar/" target="_blank" rel="noreferrer" className="footer-social-link mouse-hover">GitHub</a>
              <a href="https://x.com/" target="_blank" rel="noreferrer" className="footer-social-link mouse-hover">Twitter / X</a>
            </div>
          </div>

          {/* LIVE TERMINAL CLOCK */}
          <div className="footer-col right-align" style={{ textAlign: 'right' }}>
            <h4>System Time</h4>
            <p className="mouse-hover" style={{ fontFamily: 'var(--font-code)', fontSize: '1.2rem', color: '#fff', fontWeight: '500', margin: '0 0 5px 0', letterSpacing: '1px' }}>
              {time.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute:'2-digit', second:'2-digit' })} IST
            </p>
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: '#666' }}>[ LOC: BHOPAL, IN ]</span>
          </div>

        </div>

        {/* COPYRIGHT & META */}
        <div className="footer-copyright">
          <span>© {new Date().getFullYear()} Swayam Purwar. All rights reserved.</span>
          <span>SYSTEM // VITE + REACT 19 + GSAP</span>
        </div>
      </div>

    </footer>
  );
}