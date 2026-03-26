// src/components/ProjectCard.jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export default function ProjectCard({ 
  title, category, year, link, imgSrc, index, 
  onMouseEnter, onMouseLeave, onMouseMove,
  isSecret // 👈 New prop to trigger special effects
}) {
  const formattedIndex = String(index + 1).padStart(2, '0');
  const titleRef = useRef(null);
  const categoryRef = useRef(null);

  // Custom scramble function using vanilla GSAP
  const scrambleText = (element, targetText) => {
    if (!element) return;
    const chars = "!<>-_\\/[]{}—=+*^?#_01";
    const obj = { value: 0 };
    
    gsap.to(obj, {
      value: targetText.length,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        const progress = Math.floor(obj.value);
        const scrambledPart = Array.from({ length: targetText.length - progress })
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join("");
        element.innerText = targetText.substring(0, progress) + scrambledPart;
      },
      onComplete: () => {
        element.innerText = targetText; // Ensure exact match at the end
      }
    });
  };

  const handleLocalMouseEnter = (e) => {
    // Pass imgSrc and the isSecret flag to Home.jsx
    if (onMouseEnter) onMouseEnter(imgSrc, isSecret); 
    
    // Trigger scramble effect if it is the secret project
    if (isSecret) {
      scrambleText(titleRef.current, title);
      scrambleText(categoryRef.current, category);
    }
  };

  // If there's no link (like a WIP project), render a div instead of a Link to prevent routing errors
  const CardWrapper = link ? Link : "div";
  const wrapperProps = link ? { to: link } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className={`project-link ${!link ? 'no-cursor-link' : ''}`}
      onMouseEnter={handleLocalMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={!link ? { cursor: "crosshair" } : {}}
    >
      <article className="project-scratch" data-index={formattedIndex}>
        <div className="scratch-number-wrap">
          <svg viewBox="0 0 100 40" className="scratch-svg">
            <text x="0" y="32" className="svg-text-outline">{formattedIndex}</text>
            <text x="0" y="32" className="svg-text-fill">{formattedIndex}</text>
          </svg>
        </div>

        <div className="scratch-content">
          <div className="scratch-top">
            <div className="scratch-title-wrap">
              <h2 className="scratch-title" ref={titleRef}>{title}</h2>
              <div className="scratch-pill">{year}</div>
            </div>
            <div className="scratch-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </div>
          </div>
          
          <div className="scratch-bottom">
            <span className="scratch-category" ref={categoryRef}>{category}</span>
            <div className="scratch-progress-track">
              <div className="scratch-progress-bar"></div>
            </div>
          </div>
        </div>
      </article>
    </CardWrapper>
  );
}