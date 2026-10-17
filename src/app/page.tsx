"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

import ProjectCard from "../components/ProjectCard";
import AssetLoader from "../components/AssetLoader";
import { trackEvent } from "@/utils/analytics";

// Lazy load the heavy WebGL canvas to clear the main thread
const ThreeHero = dynamic(() => import("../components/ThreeHero"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Safe window check for Next.js SSR
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const pathname = usePathname();

  // --- Animated Role Cycler ---
  const roles = [
    "SOFTWARE ENGINEER",
    "FRONTEND ARCHITECT",
    "UI / UX INNOVATOR",
    "FULL-STACK DEVELOPER",
  ];
  const [currentRole, setCurrentRole] = useState(0);
  const roleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (roleRef.current) {
        gsap.to(roleRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            setCurrentRole((prev) => (prev + 1) % roles.length);
            gsap.fromTo(
              roleRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
            );
          },
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [roles.length]);

  // High-performance GSAP trackers for the preview image
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const lastX = useRef(0);

  // Preload Project Hover Images
  useEffect(() => {
    const imagesToPreload = [
      "/assets/images/project/apple-music-preview.webp",
      "/assets/images/project/instagram-preview.webp",
      "/assets/images/project/swayam-capital-preview.webp",
      "/assets/images/project/reposage-prime-preview.webp",
    ];

    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Smooth scroll to hash anchor on load
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [pathname]);

  // 🚨 SMART SCROLL LISTENER 🚨
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const mousePos = { x: 0, y: 0 };
    const updateMousePos = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const handleScroll = () => {
      if (previewRef.current) {
        gsap.to(previewRef.current, { 
          opacity: 0, 
          scale: 0.7, 
          duration: 0.2, 
          overwrite: "auto" 
        });
      }

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (window.matchMedia("(hover: none)").matches) return;

        const el = document.elementFromPoint(mousePos.x, mousePos.y);
        const projectLink = el?.closest('.project-link') as HTMLElement;

        if (projectLink && previewRef.current) {
          const imgSrc = projectLink.getAttribute('data-image');
          const isSecret = projectLink.getAttribute('data-secret') === 'true';

          if (imgSrc) {
            previewRef.current.style.backgroundImage = `url('${imgSrc}')`;
            
            gsap.to(previewRef.current, {
              opacity: 1,
              scale: 1,
              filter: isSecret ? "blur(20px) contrast(150%) grayscale(80%)" : "blur(0px) contrast(100%) grayscale(0%)",
              duration: 0.4,
              ease: "power3.out",
              overwrite: "auto"
            });
          }
        }
      }, 150); 
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

  // --- Handlers for Hover Effects ---
  const handleMouseEnter = (imgUrl: string | undefined, isSecret = false) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    if (imgUrl && previewRef.current) {
      previewRef.current.style.backgroundImage = `url('${imgUrl}')`;
      const filterStr = isSecret
        ? "blur(20px) contrast(150%) grayscale(80%)"
        : "blur(0px) contrast(100%) grayscale(0%)";
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        filter: filterStr,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.7,
        duration: 0.4,
        ease: "power3.in",
      });
    }

    const inner = e.currentTarget.querySelector(".project");
    if (inner && !prefersReducedMotion) {
      gsap.to(inner, {
        transform: "none",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    if (xTo.current && yTo.current) {
      xTo.current(e.clientX);
      yTo.current(e.clientY - 20);
    }

    lastX.current = e.clientX;

    if (!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const inner = e.currentTarget.querySelector(".project") as HTMLElement;
      if (inner) {
        inner.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
        inner.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
      }
    }
  };

  const trackProjectClick = (title: string, link?: string, isSecret = false) => {
    void trackEvent("project_click", {
      title,
      link: link || "none",
      isSecret,
    });
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    let ctx = gsap.context(() => {
      ScrollTrigger.normalizeScroll(true);
      ScrollTrigger.config({ ignoreMobileResize: true });
      gsap.set(".reveal-text", { y: 50, opacity: 0 });

      if (previewRef.current) {
        gsap.set(previewRef.current, { xPercent: -50, yPercent: -125 });
        xTo.current = gsap.quickTo(previewRef.current, "x", {
          duration: 0.5,
          ease: "power3.out",
        });
        yTo.current = gsap.quickTo(previewRef.current, "y", {
          duration: 0.5,
          ease: "power3.out",
        });
      }

      const initScrollAnimations = () => {
        ScrollTrigger.refresh();
        gsap.utils.toArray<HTMLElement>(".project-scratch").forEach((project) => {
            const fill = project.querySelector(".svg-text-fill");
            const bar = project.querySelector(".scratch-progress-bar");

            gsap.timeline({
                scrollTrigger: {
                  trigger: project,
                  start: "top 80%",
                  end: "top 30%",
                  toggleActions: "play reverse play reverse",
                },
              })
              .to(fill, { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power2.out" })
              .to(bar, { width: "100%", duration: 0.8, ease: "power2.out" }, "-=0.8");
          });

        gsap.utils.toArray<HTMLElement>(".project").forEach((project) => {
          ScrollTrigger.create({
            trigger: project,
            start: "top 85%",
            end: "bottom 35%",
            toggleClass: "is-active",
            onEnter: () => project.classList.add("is-visible"),
          });
        });

        if (!prefersReducedMotion) {
          gsap.to("#hero", {
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
            y: 150,
            scale: 0.9,
            opacity: 0,
          });

          document.querySelectorAll(".reveal-text").forEach((item) => {
            gsap.to(item, {
              scrollTrigger: { trigger: item, start: "top 85%" },
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            });
          });

          document.querySelectorAll(".reveal-container").forEach((container) => {
              const curtain = container.querySelector(".reveal-curtain");
              const img = container.querySelector("img");

              let tl = gsap.timeline({
                scrollTrigger: { trigger: container, start: "top 75%" },
              });

              tl.fromTo(curtain, { scaleY: 1 }, { scaleY: 0, duration: 1.2, ease: "expo.inOut" })
                .fromTo(img, { scale: 1.2, filter: "blur(10px) grayscale(100%)" }, { scale: 1, filter: "blur(0px) grayscale(0%)", duration: 1.5, ease: "power3.out" }, "-=1.2");
            });
        } else {
          gsap.set(".reveal-text", { y: 0, opacity: 1 });
        }
      };

      // Optimistic Rendering Entry Animation (Does not block LCP)
      if (!prefersReducedMotion) {
        gsap.fromTo(
          ".hero-text",
          { y: 50, opacity: 0, rotateX: -10 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }
        );
        gsap.fromTo(
          ".hero-sub, .cv-wrapper, #main-nav",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.2 }
        );
      } else {
        gsap.set(".hero-text, .hero-sub, .cv-wrapper, #main-nav", { y: 0, opacity: 1, rotateX: 0 });
      }

      setTimeout(initScrollAnimations, 100);
    }, containerRef);

    return () => {
      gsap.killTweensOf("#preview-img, .project");
      ctx.revert();
    };
  }, [prefersReducedMotion]); 

  return (
    <div ref={containerRef}>
      {/* 1. Independent Overlay Loader */}
      <AssetLoader />

      <div
        ref={previewRef}
        className="project-preview-img"
        role="img"
        aria-label="Project Preview"
        id="preview-img"
        style={{ willChange: "transform, opacity" }}
      ></div>

      <main style={{ perspective: "1000px" }}>
        <section id="hero" className="relative z-10">
          <div className="absolute inset-0 z-[-1] pointer-events-auto">
            <ThreeHero />
          </div>
          
          <div className="hero-line">
            <h1
              className="hero-text hero-name"
              style={{ willChange: "transform, opacity" }}
            >
              SWAYAM PURWAR
            </h1>
          </div>
          <div className="hero-line" style={{ overflow: "hidden" }}>
            <span
              ref={roleRef}
              className="hero-text outline-text"
              style={{
                willChange: "transform, opacity",
                display: "inline-block",
              }}
            >
              {roles[currentRole]}
            </span>
          </div>
          <p className="hero-sub">
            Based in Pune, India &bull; Available for Freelance
          </p>
           <div className="cv-wrapper">
            <Link
              href="/resume"
              className="cv-btn mouse-hover"
              data-strength="25"
              onClick={() =>
                void trackEvent("resume_cta_click", { location: "hero" })
              }
            >
              <span>VIEW Resume</span>
              <svg
                className="cv-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Link>
          </div>
        </section>

        <section id="work">
          <div className="section-header">
            <span>FEATURED WORKS</span>
            <span>(VIEW ALL ON /WORK)</span>
          </div>

          <ProjectCard
            index={0}
            title="APPLE MUSIC APP"
            category="iOS / UI Redesign"
            year="Early '25"
            link="/work/apple-music"
            imgSrc="/assets/images/project/apple-music-preview.webp"
            onClick={() =>
              trackProjectClick("APPLE MUSIC APP", "/work/apple-music")
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <ProjectCard
            index={1}
            title="INSTAGRAM APP"
            category="Full Stack"
            year="Mid '25"
            link="/work/instagram"
            imgSrc="/assets/images/project/instagram-preview.webp"
            onClick={() =>
              trackProjectClick("INSTAGRAM APP", "/work/instagram")
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <ProjectCard
            index={2}
            title="SWAYAM CAPITAL APP"
            category="Web Sockets / FinTech"
            year="Early '26"
            link="/work/swayam-capital"
            imgSrc="/assets/images/project/swayam-capital-preview.webp"
            onClick={() => trackProjectClick("SWAYAM CAPITAL APP", "/work/swayam-capital")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "3rem",
            }}
          >
            <Link
              href="/work"
              className="btn mouse-hover"
              onClick={() =>
                void trackEvent("work_hub_cta_click", {
                  location: "home_featured",
                })
              }
            >
              Browse All Work
            </Link>
          </div>
        </section>

        <section className="marquee-section" aria-hidden="true">
          <div className="marquee-content">
            <span>
              REACT &bull; GSAP &bull; UI/UX &bull; FIGMA &bull; THREE.JS &bull;
              NODE.JS &bull; MONGODB &bull;{" "}
            </span>
            <span>
              REACT &bull; GSAP &bull; UI/UX &bull; FIGMA &bull; THREE.JS &bull;
              NODE.JS &bull; MONGODB &bull;{" "}
            </span>
          </div>
        </section>

        <section id="about">
          <div
            className="about-img reveal-container"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="reveal-curtain"></div>

            <Image
              src="/assets/images/profile/swayam-purwar.webp"
              alt="Swayam Purwar profile"
              style={{ willChange: "transform, filter" }}
              width={600}
              height={800}
              priority={true}
            />
          </div>
          <div className="about-text">
            <h2 className="reveal-text">
              Code meets
              <br />
              Creativity.
            </h2>
            <p className="reveal-text">
              I am a full-stack developer engineering high-performance web applications. During my tenure at Zorvyn FinTech Pvt. Ltd., I drove frontend analysis on platforms including MutaCryptor, and I recently executed a rigorous three-month development sprint at Zaalima Development Pvt. Ltd. I architect solutions that scale and solve complex operational bottlenecks.
            </p>
            <Link
              href="/about"
              className="btn mouse-hover reveal-text"
              data-strength="30"
              onClick={() =>
                void trackEvent("about_cta_click", {
                  location: "home_about_section",
                })
              }
            >
              Read More
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}