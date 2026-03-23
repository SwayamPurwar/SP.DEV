import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; 

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const isKnownRoute = KNOWN_BASE_ROUTES.has(path) || VALID_WORK_ROUTES.has(path);
    
  if (HIDDEN_ROUTES.has(path) || !isKnownRoute) {
    return null;
  }

  const handleNavClick = (e, targetId) => {
    setIsMenuOpen(false);
    if (path !== '/') {
        navigate(`/${targetId}`); 
    } else {
        e.preventDefault();
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const Logo = () => (
    <Link to="/" className="logo mouse-hover" aria-label="Home" onClick={() => setIsMenuOpen(false)}>
      SP.DEV
    </Link>
  );

  const getNavContent = (isMobile = false) => {
    const linkClass = isMobile ? "mobile-link" : "nav-item mouse-hover";
    const closeAction = () => setIsMenuOpen(false);

    if (path === '/about') {
      return <Link to="/contact" className={linkClass} onClick={closeAction}>Contact</Link>;
    }
    if (path === '/contact') {
      return <a href="mailto:your@email.com" className={linkClass} onClick={closeAction}>Email Directly</a>;
    }
    if (path.startsWith('/work/')) {
      const label = path.includes('casestudy') ? "Exit Case Study" : "All Projects";
      return <Link to="/#work" className={linkClass} onClick={closeAction}>{label}</Link>;
    }

    return (
      <>
        <a href="#work" onClick={(e) => handleNavClick(e, '#work')} className={linkClass}>Work</a>
        <Link to="/about" className={linkClass} onClick={closeAction}>About</Link>
        <Link to="/contact" className={linkClass} onClick={closeAction}>Contact</Link>
      </>
    );
  };

  return (
    <>
      <nav id="main-nav" className={`nav-${path.replace(/\//g, '') || 'home'}`}>
        <Logo />
        <div className="nav-links" role="navigation">
          {getNavContent(false)}
        </div>
        <button 
          className={`menu-toggle mouse-hover ${isMenuOpen ? 'active' : ''}`} 
          aria-label="Toggle Menu" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
        >
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} aria-hidden={!isMenuOpen}>
        {/* The container below allows us to target individual links for staggering */}
        <div className="mobile-links-container">
          {getNavContent(true)}
        </div>
      </div>
    </>
  );
}