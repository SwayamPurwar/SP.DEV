import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';

const ALL_PROJECTS = [
  { id: 'apple-music', title: 'APPLE MUSIC APP', type: 'iOS / UI Redesign', link: '/work/apple-music' },
  { id: 'instagram', title: 'INSTAGRAM APP', type: 'Full Stack', link: '/work/instagram' },
  { id: 'kite', title: 'KITE ZERODHA', type: 'Web Sockets / FinTech', link: '/work/kite' },
  { id: 'codesense', title: 'CodeSense AI', type: 'AI SaaS', link: '/work/CodeSenseAiSaas' }
];

export default function MoreProjectsFooter({ currentProject }) {
  const navigate = useNavigate();
  const displayedProjects = ALL_PROJECTS.filter(p => p.id !== currentProject);

  // 🚀 CINEMATIC TRANSITION LOGIC
  const handleProjectClick = (e, link) => {
    e.preventDefault(); // Stop the default React Router click
    
    // Target the curtain element defined in PageTransition.jsx
    const curtain = document.querySelector('.page-transition-curtain');
    
    if (curtain) {
      // 1. Set the curtain to stay at the bottom and cover the screen
      gsap.set(curtain, { transformOrigin: 'bottom' });
      
      gsap.to(curtain, {
        scaleY: 1,
        duration: 1.2,
        ease: 'expo.inOut',
        onComplete: () => {
          // 2. Once covered, change the route
          navigate(link);
          
          // 3. Scroll to top immediately for the new page
          window.scrollTo(0, 0);
          
          // 4. Reset origin so the opening animation in PageTransition.jsx works correctly
          gsap.set(curtain, { transformOrigin: 'top' });
        }
      });
    } else {
      // Fallback if curtain doesn't exist
      navigate(link);
    }
  };

  return (
    <footer className="mp-footer">
      <div className="mp-header">
        <span className="mp-dot"></span>
        EXPLORE OTHER WORKS
      </div>

      <div className="mp-list">
        {displayedProjects.map((project) => (
          /* Using <a> or a custom div here to handle the manual click */
          <div 
            key={project.id} 
            className="mp-item mouse-hover" 
            onClick={(e) => handleProjectClick(e, project.link)}
            style={{ cursor: 'none' }} 
          >
            <h3 className="mp-title">{project.title}</h3>
            
            <div className="mp-meta">
              <span className="mp-type">{project.type}</span>
              <span className="mp-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mp-bottom">
        <span>SYSTEM // END OF CASE STUDY</span>
        <div 
          onClick={(e) => handleProjectClick(e, '/contact')} 
          className="mouse-hover mp-back-link" 
          style={{ cursor: 'none' }}
        >
          INITIATE_CONTACT <span className="small-arrow">↗</span>
        </div>
      </div>
    </footer>
  );
}