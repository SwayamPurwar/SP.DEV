import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";

// Array of all case studies mapped to their specific routes
const CASE_STUDIES = [
  { id: "kite", title: "KITE ZERODHA", link: "/work/kite-casestudy" },
  {
    id: "apple-music",
    title: "APPLE MUSIC",
    link: "/work/apple-music-casestudy",
  },
  { id: "instagram", title: "INSTAGRAM", link: "/work/instagram-casestudy" },
];

export default function CaseStudyFooter({ currentProject, backLink }) {
  const navigate = useNavigate();

  // Filter out the current case study so we only show the others
  const otherCaseStudies = CASE_STUDIES.filter(
    (project) => project.id !== currentProject,
  );

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
      {/* Premium Multiple Next Projects List */}
      <div className="cs-next-label">EXPLORE OTHER CASE STUDIES</div>

      <div className="cs-options-list">
        {otherCaseStudies.map((project) => (
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

      {/* Back to main project link (Moved to Bottom) */}
      {backLink && (
        <div className="cs-back-btn">
          <Link to={backLink} className="btn mouse-hover">
            &larr; Back to Overview
          </Link>
        </div>
      )}
    </div>
  );
}
