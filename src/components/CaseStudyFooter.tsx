"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

const CASE_STUDIES = [
  { id: "kite", title: "KITE ZERODHA", link: "/work/kite-casestudy" },
  { id: "apple-music", title: "APPLE MUSIC", link: "/work/apple-music-casestudy" },
  { id: "instagram", title: "INSTAGRAM", link: "/work/instagram-casestudy" },
  { id: "codesense", title: "CODESENSE AI", link: "/work/codesense-aisaas-casestudy" }, 
];

interface CaseStudyFooterProps {
  currentProject?: string;
}

export default function CaseStudyFooter({ currentProject }: CaseStudyFooterProps) {
  const router = useRouter();
  const otherCaseStudies = CASE_STUDIES.filter((project) => project.id !== currentProject);

  // 🚀 CINEMATIC TRANSITION LOGIC
  const handleProjectClick = (e: React.MouseEvent<HTMLDivElement>, link: string) => {
    e.preventDefault();

    const curtain = document.querySelector(".page-transition-curtain");

    if (curtain) {
      gsap.set(curtain, { transformOrigin: "bottom" });

      gsap.to(curtain, {
        scaleY: 1,
        duration: 1.2,
        ease: "expo.inOut",
        onComplete: () => {
          router.push(link);
          window.scrollTo(0, 0);
          gsap.set(curtain, { transformOrigin: "top" });
        },
      });
    } else {
      router.push(link);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div 
      className="cs-next-footer" 
      style={{ 
        borderTop: "none", 
        paddingTop: "2rem",
        marginTop: "8rem"
      }}
    >
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
    </div>
  );
}