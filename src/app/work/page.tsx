"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "@/components/ProjectCard";
import { trackEvent } from "@/utils/analytics";

gsap.registerPlugin(ScrollTrigger);

type Phase = "live" | "landing" | "wip" | "labs";

type WorkProject = {
  title: string;
  category: string;
  year: string;
  link?: string;
  imgSrc?: string;
  isSecret?: boolean;
  phase: Phase;
  isExternal?: boolean; // <-- Add this new property
};

const PROJECTS: WorkProject[] = [
  {
    title: "APPLE MUSIC APP",
    category: "Music App / Full Stack",
    year: "Early '25",
    link: "/work/apple-music",
    imgSrc: "/assets/images/project/apple-music-preview.webp",
    phase: "live",
  },
  {
    title: "INSTAGRAM APP",
    category: "Full Stack",
    year: "Mid '25",
    link: "/work/instagram",
    imgSrc: "/assets/images/project/instagram-preview.webp",
    phase: "live",
  },
  {
    title: "KITE ZERODHA APP",
    category: "Web Sockets / FinTech",
    year: "Early '26",
    link: "/work/kite",
    imgSrc: "/assets/images/project/kite-preview.webp",
    phase: "live",
  },
  {
    title: 'Interactive Studio Portfolio',
    category: "Landing Page / Conversion",
    year: "Early '25",
    link: "https://swayampurwar-the-digital-agency-portfolio-awwwar.vercel.app",
    imgSrc: "/assets/images/project/interactive-studio-preview.webp",
    phase: "landing",
    isExternal: true, // <-- Add this
  },
  {
    title: 'Luxury E-Commerce',
    category: "Interactive Web App",
    year: "Mid '25",
    link: "https://swayampurwar-the-luxury-fashion-headless-e-comme.vercel.app",
    imgSrc: "/assets/images/project/luxury-ecommerce-preview.webp",
    phase: "landing",
    isExternal: true, // <-- Add this
  },
  {
    title: 'Signature Hardware Reveal',
    category: "Creative Engineering / Landing Page",
    year: "Early '26",
    link: "https://swayampurwar-the-apple-style-hardware-product.vercel.app",
    imgSrc: "/assets/images/project/signature-hardware-preview.webp",
    phase: "landing",
    isExternal: true, // <-- Add this
  },
   
  {
    title: "RepoSage Prime",
    category: "AI-Powered Code Assistant + SaaS",
    year: "Mid '26",
    link: "/work/reposage-prime-aisaas",
    imgSrc: "/assets/images/project/reposage-prime-preview.webp",
    phase: "wip",
  },
  {
    title: "Project X",
    category: "Top Secret / Stay Tuned",
    year: "Coming Soon",
    imgSrc: "/assets/images/project/placeholder-preview.webp",
    isSecret: true,
    phase: "labs",
  },
];

const FILTERS = ["all", "live", "landing", "wip", "labs"] as const;

export default function WorkPage() {
  const containerRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("all");

  useEffect(() => {
    const previewEl = previewRef.current;

    if (previewEl) {
      gsap.set(previewEl, { xPercent: -50, yPercent: -120 });
      xTo.current = gsap.quickTo(previewEl, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      yTo.current = gsap.quickTo(previewEl, "y", {
        duration: 0.45,
        ease: "power3.out",
      });
    }

    const preload = PROJECTS.map((project) => project.imgSrc).filter(
      (src): src is string => Boolean(src),
    );

    preload.forEach((src) => {
      const img = new globalThis.Image();
      img.src = src;
    });

    return () => {
      if (previewEl) {
        gsap.killTweensOf(previewEl);
      }
    };
  }, []);

  useEffect(() => {
    if (!globalThis.window || !containerRef.current) return;

    const mm = gsap.matchMedia();

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

        const sections = gsap.utils.toArray<HTMLElement>(".work-v3-section");

        if (reduceMotion) {
          gsap.set(sections, { y: 0, opacity: 1 });
          return;
        }

        // Parent only handles the overall section fade-ins now
        sections.forEach((sec) => {
          gsap.fromTo(
            sec,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sec,
                start: isMobile ? "top 95%" : "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      },
      containerRef
    );

    return () => mm.revert();
  }, [activeFilter]);

  // 🚨 ADD THIS: SMART SCROLL LISTENER 🚨
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    // Track global mouse position
    const mousePos = { x: 0, y: 0 };
    const updateMousePos = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const handleScroll = () => {
      // 1. Instantly hide the image when scrolling starts
      if (previewRef.current) {
        gsap.to(previewRef.current, { 
          opacity: 0, 
          scale: 0.7, 
          duration: 0.2, 
          overwrite: "auto" 
        });
      }

      // 2. Clear the timeout so it only fires when scrolling STOPS
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        // Ignore mobile devices (they don't have hover images anyway)
        if (window.matchMedia("(hover: none)").matches) return;

        // 3. Scroll has stopped. Check what element is under the mouse!
        const el = document.elementFromPoint(mousePos.x, mousePos.y);
        const projectLink = el?.closest('.project-link') as HTMLElement;

        if (projectLink && previewRef.current) {
          // Extract the data we added to ProjectCard
          const imgSrc = projectLink.getAttribute('data-image');
          const isSecret = projectLink.getAttribute('data-secret') === 'true';

          if (imgSrc) {
            previewRef.current.style.backgroundImage = `url('${imgSrc}')`;
            
            // Re-apply the GSAP animation to show it
            gsap.to(previewRef.current, {
              opacity: 1,
              scale: 1,
              filter: isSecret ? "blur(18px) contrast(140%) grayscale(80%)" : "blur(0px) contrast(100%) grayscale(0%)",
              duration: 0.4,
              ease: "power3.out",
              overwrite: "auto"
            });
          }
        }
      }, 150); // Waits 150ms after the last scroll event to check the mouse
    };

    window.addEventListener("mousemove", updateMousePos, { passive: true });
    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePos);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
  // 🚨 END SMART SCROLL LISTENER 🚨

  const visibleProjects = useMemo(() => {
    if (activeFilter === "all") return PROJECTS;
    return PROJECTS.filter((project) => project.phase === activeFilter);
  }, [activeFilter]);

  const getFilterLabel = (filter: (typeof FILTERS)[number]) => {
    if (filter === "all") return "All";
    if (filter === "wip") return "In Progress";
    if (filter === "landing") return "Landing Pages";
    return filter.toUpperCase();
  };

  const getSingleSectionMeta = () => {
    if (activeFilter === "wip") return { heading: "CURRENTLY DEVELOPING", rightLabel: "(WIP)" };
    if (activeFilter === "live") return { heading: "LIVE PROJECTS", rightLabel: "(SHIPPED)" };
    if (activeFilter === "landing") return { heading: "LANDING PAGES", rightLabel: "(CONVERSION)" };
    return { heading: "UPCOMING PROJECTS", rightLabel: "(IN LABS)" };
  };

  const handleProjectClick = (project: WorkProject) => {
    trackEvent("work_project_click", {
      title: project.title,
      link: project.link || "none",
      phase: project.phase,
      filter: activeFilter,
    }).catch(() => undefined);
  };

  const groupedProjects = useMemo(
    () => ({
      live: visibleProjects.filter((project) => project.phase === "live"),
      landing: visibleProjects.filter((project) => project.phase === "landing"),
      wip: visibleProjects.filter((project) => project.phase === "wip"),
      labs: visibleProjects.filter((project) => project.phase === "labs"),
    }),
    [visibleProjects]
  );

  const handleMouseEnter = (imgUrl: string | undefined, isSecret = false) => {
    if (globalThis.window?.matchMedia("(hover: none)").matches) return;
    if (!imgUrl || !previewRef.current) return;

    previewRef.current.style.backgroundImage = `url('${imgUrl}')`;
    gsap.to(previewRef.current, {
      opacity: 1,
      scale: 1,
      filter: isSecret
        ? "blur(18px) contrast(140%) grayscale(80%)"
        : "blur(0px) contrast(100%) grayscale(0%)",
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    if (globalThis.window?.matchMedia("(hover: none)").matches) return;

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.7,
        duration: 0.35,
        ease: "power3.in",
      });
    }

    const inner = e.currentTarget.querySelector(".project");
    if (inner) {
      gsap.to(inner, {
        transform: "none",
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    if (globalThis.window?.matchMedia("(hover: none)").matches) return;

    if (xTo.current && yTo.current) {
      xTo.current(e.clientX);
      yTo.current(e.clientY - 20);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inner = e.currentTarget.querySelector(".project");
    if (!(inner instanceof HTMLElement)) return;
    inner.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    inner.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
  };

  const renderSection = (
    heading: string,
    rightLabel: string,
    projects: WorkProject[],
    baseIndex: number
  ) => {
    if (projects.length === 0) return null;

    return (
      <section className="work-v3-section" key={heading}>
        <div className="section-header">
          <span>{heading}</span>
          <span>{rightLabel}</span>
        </div>
        {projects.map((project, idx) => (
          <ProjectCard
            key={`${heading}-${project.title}-${idx}`}
            index={baseIndex + idx}
            title={project.title}
            category={project.category}
            year={project.year}
            link={project.link}
            imgSrc={project.imgSrc}
            isSecret={project.isSecret}
            isExternal={project.isExternal}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </section>
    );
  };

  return (
    <main className="work-v3-shell" ref={containerRef}>
      <div className="work-hub-orb work-hub-orb-a"></div>
      <div className="work-hub-orb work-hub-orb-b"></div>

      <div ref={previewRef} className="project-preview-img work-preview-img" aria-hidden="true"></div>

      <div className="work-v3-hero">
        <span className="work-v3-kicker">Portfolio Archive</span>
        <h1 className="work-v3-title">WORK</h1>
        <p className="work-v3-sub">
          A curated selection of product builds, engineering experiments, and conversion-led landing pages.
        </p>

        <div className="work-v3-controls" aria-label="Work filters">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`work-v3-chip mouse-hover ${activeFilter === filter ? "active" : ""}`}
              onClick={() => {
                setActiveFilter(filter);
                trackEvent("work_filter_select", { filter }).catch(() => undefined);
              }}
            >
              {getFilterLabel(filter)}
            </button>
          ))}
        </div>
      </div>

      <div className="work-v3-grid">
        {(() => {
          if (activeFilter === "all") {
            const liveCount = groupedProjects.live.length;
            const landingCount = groupedProjects.landing.length;
            const wipCount = groupedProjects.wip.length;

            return (
              <>
                {renderSection("LIVE PROJECTS", "(SHIPPED)", groupedProjects.live, 0)}
                {renderSection("LANDING PAGES", "(CONVERSION)", groupedProjects.landing, liveCount)}
                {renderSection("CURRENTLY DEVELOPING", "(WIP)", groupedProjects.wip, liveCount + landingCount)}
                {renderSection(
                  "UPCOMING PROJECTS",
                  "(IN LABS)",
                  groupedProjects.labs,
                  liveCount + landingCount + wipCount
                )}
              </>
            );
          }

          const { heading, rightLabel } = getSingleSectionMeta();
          return renderSection(heading, rightLabel, visibleProjects, 0);
        })()}

        <div className="work-v3-footer-cta">
          <Link href="/" className="btn mouse-hover">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}