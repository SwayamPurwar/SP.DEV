"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  index: number;
  link?: string;
isExternal?: boolean;
  imgSrc?: string;
  isSecret?: boolean;
  onClick?: () => void;
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
  onClick,
  isSecret = false,
  isExternal
}: ProjectCardProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");

  const cardRef = useRef<HTMLElement>(null);
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
      },
    });
  };

  // ALL animations for the card are now handled right here
  useEffect(() => {
    if (!cardRef.current) return;

    const mm = gsap.matchMedia();
    const fill = cardRef.current.querySelector(".svg-text-fill");
    const bar = cardRef.current.querySelector(".scratch-progress-bar");

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isMobile, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reduceMotion: boolean;
        };

        if (reduceMotion) {
          gsap.set(fill, { clipPath: "inset(0 0% 0 0)" });
          gsap.set(bar, { width: "100%" });
          return;
        }

        // 1. Number Fill & Progress Bar Animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardRef.current,
           start: isMobile ? "top 90%" : "top 80%", 
            end: isMobile ? "bottom 10%" : "top 30%",
            toggleActions: "play reverse play reverse",
          },
        });

        tl.to(fill, {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.8,
          ease: "power2.out",
        }).to(
          bar,
          {
            width: "100%",
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.8"
        );

        // 2. Scramble Animation for Mobile/Touch
        if (isSecret && isMobile) {
          ScrollTrigger.create({
            trigger: cardRef.current,
            start: "top 85%",
            onEnter: () => {
              scrambleText(titleRef.current, title);
              scrambleText(categoryRef.current, category);
            },
            onEnterBack: () => {
              scrambleText(titleRef.current, title);
              scrambleText(categoryRef.current, category);
            },
          });
        }
      }
    );

    return () => mm.revert();
  }, [isSecret, title, category]);

  const handleLocalMouseEnter = () => {
    if (onMouseEnter) onMouseEnter(imgSrc, isSecret);

    if (isSecret) {
      scrambleText(titleRef.current, title);
      scrambleText(categoryRef.current, category);
    }
  };

  const innerContent = (
    <article className="project-scratch" data-index={formattedIndex} ref={cardRef}>
      <div className="scratch-number-wrap">
        <svg viewBox="0 0 100 40" className="scratch-svg">
          <text x="0" y="32" className="svg-text-outline">
            {formattedIndex}
          </text>
          <text x="0" y="32" className="svg-text-fill">
            {formattedIndex}
          </text>
        </svg>
      </div>

      <div className="scratch-content">
        <div className="scratch-top">
          <div className="scratch-title-wrap">
            <h2 className="scratch-title" ref={titleRef}>
              {title}
            </h2>
            <div className="scratch-pill">{year}</div>
          </div>
          <div className="scratch-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </div>
        </div>

        <div className="scratch-bottom">
          <span className="scratch-category" ref={categoryRef}>
            {category}
          </span>
          <div className="scratch-progress-track">
            <div className="scratch-progress-bar"></div>
          </div>
        </div>
      </div>
    </article>
  );

  if (link) {
    return (
      <Link
       href={link || "#"} 
      target={isExternal ? "_blank" : undefined} 
      rel={isExternal ? "noopener noreferrer" : undefined}
        className="project-link"
        onMouseEnter={handleLocalMouseEnter}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <div
      className="project-link no-cursor-link"
      onMouseEnter={handleLocalMouseEnter}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={{ cursor: "crosshair" }}
    >
      {innerContent}
    </div>
  );
}