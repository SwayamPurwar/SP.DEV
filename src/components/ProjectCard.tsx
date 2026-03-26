"use client"; 

import { useRef } from "react";
import Link from "next/link"; 
import gsap from "gsap";

// 1. Define our TypeScript Interface for the props
interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  index: number;
  link?: string; // Optional because secret projects don't have links
  imgSrc?: string; // Optional
  isSecret?: boolean; // Optional
  onMouseEnter?: (imgUrl: string | undefined, isSecret: boolean) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
}

export default function ProjectCard({ 
  title, 
  category, 
  year, 
  link, 
  imgSrc, 
  index, 
  onMouseEnter, 
  onMouseLeave, 
  onMouseMove,
  isSecret = false 
}: ProjectCardProps) {
  
  const formattedIndex = String(index + 1).padStart(2, '0');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLSpanElement>(null);

  const scrambleText = (element: HTMLElement | null, targetText: string) => {
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
        element.innerText = targetText; 
      }
    });
  };

  const handleLocalMouseEnter = () => {
    if (onMouseEnter) onMouseEnter(imgSrc, isSecret); 
    
    if (isSecret) {
      scrambleText(titleRef.current, title);
      scrambleText(categoryRef.current, category);
    }
  };

  // Dynamically assign Next.js 'href' if a link exists, otherwise use a div
  const CardWrapper = link ? Link : "div";
  const wrapperProps = link ? { href: link } : {};

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