// src/components/ProjectCard.jsx
import { Link } from "react-router-dom";

export default function ProjectCard({ 
  title, category, year, link, imgSrc, index, 
  onMouseEnter, onMouseLeave, onMouseMove 
}) {
  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <Link
      to={link}
      className="project-link"
      onMouseEnter={() => onMouseEnter(imgSrc)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
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
              <h2 className="scratch-title">{title}</h2>
              <div className="scratch-pill">{year}</div>
            </div>
            <div className="scratch-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </div>
          </div>
          
          <div className="scratch-bottom">
            <span className="scratch-category">{category}</span>
            <div className="scratch-progress-track">
              <div className="scratch-progress-bar"></div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}