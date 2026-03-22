import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react'; 

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  // Array of your actual valid project routes from App.jsx
  const validWorkRoutes = [
    '/work/apple-music', '/work/instagram', '/work/kite', '/work/ai-saas', 
    '/work/CodeSenseAiSaas', '/work/codesense-casestudy',
    '/work/apple-music-casestudy', '/work/instagram-casestudy', '/work/kite-casestudy'
  ];

  // Strict Dynamic Route Checking
  const isKnownRoute = 
    path === '/' || 
    path === '/about' || 
    path === '/resume' || 
    path === '/success' || 
    validWorkRoutes.includes(path);
    
  // Hide nav on resume, success, or 404 pages
  if (path === '/resume' || path === '/success' || !isKnownRoute) return null;

 const handleNavClick = (e, targetId) => {
  setIsMenuOpen(false); // Close mobile menu if open
  
  if (path !== '/') {
      // Let React router navigate directly to the hash URL (e.g. /#work)
      navigate(`/${targetId}`); 
  } else {
      e.preventDefault();
      // Already on home page, just smooth scroll
      const element = document.querySelector(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
  }
};

  // Back Button for About Page ONLY
 if (path === '/about') {
    return (
      <nav id="main-nav">
        <Link to="/" className="logo mouse-hover" aria-label="Home">SP.DEV</Link>
      </nav>
    );
  }

  // Work Pages AND Case Study Pages (Apple Music, Kite, Instagram, CodeSense, etc.)
  // Removed the "Back" buttons since they are handled at the bottom of the pages
  if (path.startsWith('/work/')) {
    return (
      <nav id="main-nav">
        <Link to="/" className="logo mouse-hover" aria-label="Home">SP.DEV</Link>
      </nav>
    );
  }

  // DEFAULT NAV (Home Page)
  return (
    <>
      <nav id="main-nav">
        <Link to="/" className="logo mouse-hover" aria-label="Home">SP.DEV</Link>
        <div className="nav-links" role="navigation">
          <a href="#work" onClick={(e) => handleNavClick(e, '#work')} className="nav-item mouse-hover">Work</a>
          <Link to="/about" className="nav-item mouse-hover">About</Link>
          <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="nav-item mouse-hover">Contact</a>
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
        <a href="#contact" className="mobile-link" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
      </div>
    </>
  );
}