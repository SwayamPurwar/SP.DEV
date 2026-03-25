import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/SEO";
import ProjectCard from "../components/ProjectCard"; // Make sure this is imported
import { lockScroll, unlockScroll } from "../utils/animations";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const previewRef = useRef(null);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const location = useLocation();
  // --- 🔥 NEW: Animated Role Cycler ---
const roles = [
  "SOFTWARE ENGINEER", 
  "FRONTEND ARCHITECT", 
  "UI/UX INNOVATOR", 
"FULL-STACK DEVELOPER",
]; 
  const [currentRole, setCurrentRole] = useState(0);
  const roleRef = useRef(null);
  useEffect(() => {
    // Only run this after the initial preloader animation finishes
    // so it doesn't mess with your opening sequence!
    const interval = setInterval(() => {
      if (roleRef.current) {
        // 1. Animate text out (slide up & fade out)
        gsap.to(roleRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            // 2. Change the word in React state
            setCurrentRole((prev) => (prev + 1) % roles.length);

            // 3. Animate text back in (slide from bottom & fade in)
            gsap.fromTo(
              roleRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
            );
          },
        });
      }
    }, 2500); // Changes every 2.5 seconds

    return () => clearInterval(interval);
  }, []);
  // High-performance GSAP trackers for the preview image
  const xTo = useRef(null);
  const yTo = useRef(null);
  const lastX = useRef(0);

  // 🚀 ENHANCEMENT #2: PRELOAD PROJECT HOVER IMAGES
  useEffect(() => {
    const imagesToPreload = [
      "/assets/images/project/apple-music-preview.webp",
      "/assets/images/project/instagram-preview.webp",
      "/assets/images/project/kite-preview.webp",
      "/assets/images/project/codesense-ai-saas-preview.webp",
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Smooth scroll to hash anchor on load
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location.hash]);

  // --- Handlers for Hover Effects ---
  const handleMouseEnter = (imgUrl, isSecret = false) => {
    if (window.matchMedia("(hover: none)").matches) return;

    if (imgUrl && previewRef.current) {
      previewRef.current.style.backgroundImage = `url('${imgUrl}')`;
      const filterStr = isSecret
        ? "blur(20px) contrast(150%) grayscale(80%)"
        : "blur(0px) contrast(100%) grayscale(0%)";
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        filter: filterStr, // 👈 Applies the visual obfuscation
        duration: 0.5,
        ease: "power3.out",
      });
    }
  };

  const handleMouseLeave = (e) => {
    if (window.matchMedia("(hover: none)").matches) return;

    if (previewRef.current) {
      gsap.to(previewRef.current, {
        opacity: 0,
        scale: 0.7,
        rotationZ: 0, // Reset rotation on leave
        duration: 0.4,
        ease: "power3.in",
      });
    }

    const inner = e.currentTarget.querySelector(".project");
    if (inner && !prefersReducedMotion) {
      gsap.to(inner, {
        transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    }
  };

  const handleMouseMove = (e) => {
    if (window.matchMedia("(hover: none)").matches) return;

    // 1. Fluid Image Tracking using quickTo
    if (xTo.current && yTo.current) {
      xTo.current(e.clientX);
      yTo.current(e.clientY - 20);
    }

    // 2. Velocity-based rotation
    if (previewRef.current && !prefersReducedMotion) {
      const deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;
      const rotate = Math.max(-15, Math.min(15, deltaX * 0.4)); // Clamp rotation

      gsap.to(previewRef.current, {
        rotationZ: rotate,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    // 3. 3D Card Tilt Effect
    if (!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;

      const inner = e.currentTarget.querySelector(".project");
      if (inner) {
        gsap.to(inner, {
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        inner.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
        inner.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
      }
    }
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    const isFirstVisit = sessionStorage.getItem("visited") !== "true";

    let ctx = gsap.context(() => {
      gsap.set(".reveal-text", { y: 50, opacity: 0 });

      // Initialize quickTo for buttery smooth image follow
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
        // Target each project card for scroll-based highlighting
        gsap.utils.toArray(".project-scratch").forEach((project) => {
          const fill = project.querySelector(".svg-text-fill");
          const bar = project.querySelector(".scratch-progress-bar");

          gsap
            .timeline({
              scrollTrigger: {
                trigger: project,
                start: "top 80%", // Starts when the item is 80% down the screen
                end: "top 30%", // Ends when it reaches 30% from the top
                toggleActions: "play reverse play reverse", // Animates in and out
              },
            })
            .to(fill, {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.8,
              ease: "power2.out",
            })
            .to(
              bar,
              {
                width: "100%",
                duration: 0.8,
                ease: "power2.out",
              },
              "-=0.8",
            ); // Runs at the same time as the fill
        });
        // Scroll Highlight & Line Draw for Projects
        gsap.utils.toArray(".project").forEach((project) => {
          ScrollTrigger.create({
            trigger: project,
            start: "top 85%", // Triggers slightly before it enters the viewport
            end: "bottom 35%",
            toggleClass: "is-active", // Mobile highlight
            onEnter: () => project.classList.add("is-visible"), // Desktop line draw
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

          document
            .querySelectorAll(".reveal-container")
            .forEach((container) => {
              const curtain = container.querySelector(".reveal-curtain");
              const img = container.querySelector("img");

              let tl = gsap.timeline({
                scrollTrigger: { trigger: container, start: "top 75%" },
              });

              tl.fromTo(
                curtain,
                { scaleY: 1 },
                { scaleY: 0, duration: 1.2, ease: "expo.inOut" },
              ).fromTo(
                img,
                { scale: 1.2, filter: "blur(10px) grayscale(100%)" },
                {
                  scale: 1,
                  filter: "blur(0px) grayscale(0%)",
                  duration: 1.5,
                  ease: "power3.out",
                },
                "-=1.2",
              );
            });
        } else {
          gsap.set(".reveal-text", { y: 0, opacity: 1 });
        }
      };

      if (isFirstVisit) {
        lockScroll();
        gsap.set(document.querySelector("#main-nav"), { y: -50, opacity: 0 });
        gsap.set(".hero-text", { y: 100, rotateX: -20, opacity: 0 });
        gsap.set(".hero-sub, .cv-wrapper", { y: 30, opacity: 0 });

        const tl = gsap.timeline({
          onComplete: () => {
            unlockScroll();
            sessionStorage.setItem("visited", "true");
            gsap.set(".preloader-container", { display: "none" });
            initScrollAnimations();
          },
        });

        tl.to(".loader-text", {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });

        tl.to(
          { value: 0 },
          {
            value: 100,
            duration: 1.5,
            ease: "power3.inOut",
            onUpdate: function () {
              if (counterRef.current)
                counterRef.current.textContent = Math.floor(
                  this.targets()[0].value,
                );
            },
          },
        );

        tl.to(".loader-text, .loader-meta", { opacity: 0, duration: 0.3 });
        tl.to(".preloader-container", {
          yPercent: -100,
          duration: 1.2,
          ease: "expo.inOut",
        });

        if (!prefersReducedMotion) {
          tl.to(
            ".hero-text",
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.1,
              ease: "expo.out",
            },
            "-=0.6",
          )
            .to(
              ".hero-sub",
              { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
              "-=0.9",
            )
            .to(
              ".cv-wrapper",
              { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
              "-=0.8",
            )
            .to(
              document.querySelector("#main-nav"),
              { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
              "-=1.0",
            );
        } else {
          tl.set(".hero-text, .hero-sub, .cv-wrapper", {
            y: 0,
            opacity: 1,
            rotateX: 0,
          });
          gsap.set(document.querySelector("#main-nav"), { y: 0, opacity: 1 });
        }
      } else {
        unlockScroll();
        gsap.set(".preloader-container", { display: "none" });

        gsap.fromTo(
          ".hero-text",
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            delay: 0.2,
          },
        );
        gsap.fromTo(
          ".hero-sub, .cv-wrapper",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 },
        );
        gsap.fromTo(
          document.querySelector("#main-nav"),
          { y: -50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.1 },
        );

        setTimeout(initScrollAnimations, 100);
      }
    }, containerRef);

    return () => {
      gsap.killTweensOf("#preview-img, .project");
      ctx.revert();
      unlockScroll();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <SEO
        title="Swayam Purwar - Creative Developer"
        description="Swayam Purwar is a MERN stack developer and BCA student at LNCT University, specialized in React and high-performance UI."
        image="/assets/images/profile/swayam-purwar.webp"
      />

      <div
        className="preloader-container"
        role="status"
        aria-label="Loading assets"
      >
        <div className="loader-content">
          <div className="counter-wrap">
            <span className="counter" ref={counterRef}>
              0
            </span>
            <span className="percent">%</span>
          </div>
          <div className="loader-text">INITIALIZING SYSTEM</div>
        </div>
        <div className="loader-meta top-left">SWAYAM.DEV</div>
        <div className="loader-meta top-right">PORTFOLIO ©2026</div>
        <div className="loader-meta bottom-left">LOADING ASSETS</div>
        <div className="loader-meta bottom-right">PLEASE WAIT</div>
      </div>
      <div
        ref={previewRef}
        className="project-preview-img"
        role="img"
        aria-label="Project Preview"
        id="preview-img"
        style={{ willChange: "transform, opacity, rotationZ" }}
      ></div>
      <main style={{ perspective: "1000px" }}>
        <section id="hero">
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
                display: "inline-block", // Required for GSAP to translate 'y' properly
              }}
            >
              {roles[currentRole]}
            </span>
          </div>
          <p className="hero-sub">
            Based in Bhopal, India &bull;{" "}
            <span id="live-clock">--:--:-- IST</span> &bull; Available for
            Freelance
          </p>
          <div className="cv-wrapper">
            <Link
              to="/resume"
              className="cv-btn mouse-hover"
              data-strength="25"
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
            <span>SELECTED WORKS</span>
            <span>(2025-2026)</span>
          </div>

          <ProjectCard
            index={0}
            title="APPLE MUSIC APP"
            category="iOS / UI Redesign"
            year="Early '25"
            link="/work/apple-music"
            imgSrc="/assets/images/project/apple-music-preview.webp"
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />

          <ProjectCard
            index={2}
            title="KITE ZERODHA APP"
            category="Web Sockets / FinTech"
            year="Early '26"
            link="/work/kite"
            imgSrc="/assets/images/project/kite-preview.webp"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <div className="section-header upcoming">
            <span>CURRENTLY DEVELOPING</span>
            <span>(WIP)</span>
          </div>

          <ProjectCard
            index={3}
            title="CodeSense AI"
            category="AI-Powered Code Assistant + SaaS"
            year="Mid '26"
            link="/work/CodeSenseAiSaas"
            imgSrc="/assets/images/project/codesense-ai-saas-preview.webp"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <div className="section-header upcoming">
            <span>UPCOMING PROJECTS</span>
            <span>(IN LABS)</span>
          </div>
          <ProjectCard
            index={4}
            title="PROJECT: CHROMA"
            category="Three.js / WebGL Experience"
            year="In Labs"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <ProjectCard
            index={5}
            title="AURA STUDIOS"
            category="Headless E-Commerce"
            year="In Labs"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <ProjectCard
            index={6}
            title="Project X"
            category="Top Secret / Stay Tuned"
            year="Coming Soon"
            imgSrc="/assets/images/project/placeholder-preview.webp"
            isSecret={true}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
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
            <img
              src="/assets/images/profile/swayam-purwar.webp"
              width="600"
              height="800"
              loading="lazy"
              alt="Swayam Purwar profile"
              style={{ willChange: "transform, filter" }}
            />
          </div>
          <div className="about-text">
            <h2 className="reveal-text">
              Code meets
              <br />
              Creativity.
            </h2>
            <p className="reveal-text">
              I am Swayam, a developer building high-end digital experiences
              using React, Node.js, and GSAP.
            </p>
            <Link
              to="/about"
              className="btn mouse-hover reveal-text"
              data-strength="30"
            >
              Read More
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
