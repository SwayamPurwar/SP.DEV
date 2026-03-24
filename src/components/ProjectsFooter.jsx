import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";

const ALL_PROJECTS = [
  { id: "apple-music", title: "APPLE MUSIC", link: "/work/apple-music" },
  { id: "instagram", title: "INSTAGRAM", link: "/work/instagram" },
  { id: "kite", title: "KITE ZERODHA", link: "/work/kite" },
  { id: "codesense", title: "CODESENSE AI", link: "/work/CodeSenseAiSaas" },
];

export default function MoreProjectsFooter({ currentProject }) {
  const navigate = useNavigate();
  const displayedProjects = ALL_PROJECTS.filter((p) => p.id !== currentProject);

  // 🚀 CINEMATIC TRANSITION LOGIC
  const handleProjectClick = (e, link) => {
    e.preventDefault();

    const curtain = document.querySelector(".page-transition-curtain");

    if (curtain) {
      gsap.set(curtain, { transformOrigin: "bottom" });

      gsap.to(curtain, {
        scaleY: 1,
        duration: 1.2,
        ease: "expo.inOut",
        onComplete: () => {
          navigate(link);
          window.scrollTo(0, 0);
          gsap.set(curtain, { transformOrigin: "top" });
        },
      });
    } else {
      navigate(link);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="cs-next-footer">
      {/* Premium Label */}
      <div className="cs-next-label">EXPLORE OTHER WORKS</div>

      {/* Stacked Hollow-to-Solid Links */}
      <div className="cs-options-list">
        {displayedProjects.map((project) => (
          <div
            key={project.id}
            onClick={(e) => handleProjectClick(e, project.link)}
            className="mouse-hover"
            style={{
              cursor: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 0",
              width: "100%",
              textAlign: "center",
            }}
          >
            <h2 className="cs-next-title">
              {project.title}
              <span className="cta-arrow">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </span>
            </h2>
          </div>
        ))}
      </div>

      {/* Optional: Back to Home or Contact Button */}
      <div
        className="cs-back-btn"
        style={{ marginTop: "5rem", marginBottom: 0 }}
      >
        <Link to="/" className="btn mouse-hover">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
