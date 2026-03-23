import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; 

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // --- 1. DYNAMIC ROUTE CONTEXTS ---
  const isHome = path === '/';
  const isCaseStudy = path.includes('-casestudy');
  const isProject = path.startsWith('/work/') && !isCaseStudy;
  
  // Hide nav entirely on specific pages
  if (path === '/resume' || path === '/success' || path === '/404') return null;

  // --- 2. SMART SCROLL LISTENER ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add frosted glass effect if scrolled past 50px
      setScrolled(currentScrollY > 50);

      // Hide nav on scroll down, show on scroll up (only if menu is closed)
      if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMenuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // --- 3. NAVIGATION HANDLER ---
  const handleNavClick = (e, targetPath, hash = '') => {
    setIsMenuOpen(false); 
    
    if (path !== '/') {
        navigate(`/${hash}`); 
    } else if (hash) {
        e.preventDefault();
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- 4. DYNAMIC DESKTOP LINKS ---
  const renderDesktopLinks = () => {
    if (isCaseStudy) {
      return <Link to="/" onClick={(e) => handleNavClick(e, '/', '#work')} className="nav-item mouse-hover">Exit Case Study</Link>;
    }
    if (isProject) {
      return <Link to="/" onClick={(e) => handleNavClick(e, '/', '#work')} className="nav-item mouse-hover">All Projects</Link>;
    }
    
    return (
      <>
        <a href="#work" onClick={(e) => handleNavClick(e, '/', '#work')} className="nav-item mouse-hover">Work</a>
        <Link to="/about" className="nav-item mouse-hover">About</Link>
        <Link to="/contact" className="nav-item mouse-hover">Contact</Link>
      </>
    );
  };

  // --- 5. DYNAMIC MOBILE LINKS ---
  const renderMobileLinks = () => {
    if (isCaseStudy) {
      return <Link to="/" onClick={(e) => handleNavClick(e, '/', '#work')} className="mobile-link">Exit Case Study</Link>;
    }
    if (isProject) {
      return <Link to="/" onClick={(e) => handleNavClick(e, '/', '#work')} className="mobile-link">All Projects</Link>;
    }
    
    return (
      <>
        <a href="#work" className="mobile-link" onClick={(e) => handleNavClick(e, '/', '#work')}>Work</a>
        <Link to="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>About</Link>
        <Link to="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
      </>
    );
  };

  // --- 6. RENDER NAV ---
  return (
    <>
      <nav id="main-nav" className={`${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}>
        <Link to="/" className="logo mouse-hover" aria-label="Home">SP.DEV</Link>
        
        <div className="nav-links" role="navigation">
          {renderDesktopLinks()}
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
        {renderMobileLinks()}
      </div>
    </>
  );
}