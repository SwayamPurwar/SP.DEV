import { Link } from "react-router-dom";

export default function ProjectCard({ 
  title, category, year, link, imgSrc, 
  onMouseEnter, onMouseLeave, onMouseMove 
}) {
  return (
    <Link
      to={link}
      className="project-link"
      onMouseEnter={() => onMouseEnter(imgSrc)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <article className="project mouse-hover">
        <h2>{title}</h2>
        <div className="project-meta">
          <p>{category}</p>
          <p>{year}</p>
        </div>
      </article>
    </Link>
  );
}