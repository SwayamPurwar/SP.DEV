import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react'; 

// 1. Move static lists OUTSIDE the component so they aren't recreated on every render.
// 2. Use a Set for O(1) performance lookups instead of O(n) Array.includes().
const VALID_WORK_ROUTES = new Set([
  '/work/apple-music', '/work/instagram', '/work/kite', '/work/ai-saas', 
  '/work/CodeSenseAiSaas', '/work/codesense-casestudy',
  '/work/apple-music-casestudy', '/work/instagram-casestudy', '/work/kite-casestudy'
]);

const HIDDEN_ROUTES = new Set(['/resume', '/success']);
const KNOWN_BASE_ROUTES = new Set(['/', '/about', '/contact']);

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  // Strict Dynamic Route Checking
  const isKnownRoute = KNOWN_BASE_ROUTES.has(path) || VALID_WORK_ROUTES.has(path);
    
  // HIDE NAV ON SPECIFIC PAGES OR 404 PAGES
  if (HIDDEN_ROUTES.has(path) || !isKnownRoute) {
    return null;
  }

  const handleNavClick = (e, targetId) => {
    setIsMenuOpen(false); // Close mobile menu if open
    
    if (path !== '/') {
        // Let React router navigate directly to the hash URL (e.g. /#work)
        navigate(`/${targetId}`); 
    } else {
        e.preventDefault();
        // Already on home page, just smooth scroll
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 3. DRY: Reusable Logo component to prevent repetitive code
  const Logo = () => (
    <Link to="/" className="logo mouse-hover" aria-label="Home">SP.DEV</Link>
  );

  // ==========================================
  // CUSTOM NAV FOR 'ABOUT' PAGE
  // ==========================================
  if (path === '/about') {
    return (
      <nav id="main-nav" className="nav-about">
        <Logo />
        <div className="nav-links">
          <Link to="/contact" className="nav-item mouse-hover">Contact</Link>
        </div>
      </nav>
    );
  }

  // ==========================================
  // CUSTOM NAV FOR 'CONTACT' PAGE
  // ==========================================
  if (path === '/contact') {
    return (
      <nav id="main-nav" className="nav-contact">
        <Logo />
        <div className="nav-links">
          <a href="mailto:your@email.com" className="nav-item mouse-hover">Email Directly</a>
        </div>
      </nav>
    );
  }
// ==========================================
  // CUSTOM NAV FOR 'CASE STUDIES'
  // ==========================================
  if (path.startsWith('/work/') && path.includes('casestudy')) {
    return (
      <nav id="main-nav" className="nav-casestudy">
        <Logo />
        <div className="nav-links">
           {/* Custom links specifically for reading a case study */}
           <Link to="/#work" className="nav-item mouse-hover">Exit Case Study</Link>
        </div>
      </nav>
    );
  }

  // ==========================================
  // CUSTOM NAV FOR 'WORK' PAGES
  // ==========================================
  if (path.startsWith('/work/') && !path.includes('casestudy')) {
    return (
      <nav id="main-nav" className="nav-work">
        <Logo />
        <div className="nav-links">
           {/* Custom links specifically for viewing a project */}
           <Link to="/#work" className="nav-item mouse-hover">All Projects</Link>
        </div>
      </nav>
    );
  }
  // ==========================================
  // DEFAULT NAV (HOME PAGE)
  // ==========================================
  return (
    <>
      <nav id="main-nav">
        <Logo />
        <div className="nav-links" role="navigation">
          <a href="#work" onClick={(e) => handleNavClick(e, '#work')} className="nav-item mouse-hover">Work</a>
          <Link to="/about" className="nav-item mouse-hover">About</Link>
          <Link to="/contact" className="nav-item mouse-hover">Contact</Link>
        </div>
        
        <button 
          className={`menu-toggle mouse-hover ${isMenuOpen ? 'active' : ''}`} 
          aria-label="Toggle Menu" 
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
        >
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} aria-hidden={!isMenuOpen}>
        <a href="#work" className="mobile-link" onClick={(e) => handleNavClick(e, '#work')}>Work</a>
        <Link to="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>About</Link>
        <Link to="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
      </div>
    </>
  );
}