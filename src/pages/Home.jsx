import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO';
import { lockScroll, unlockScroll } from '../utils/animations';
import { useEffect } from 'react'; 
import { useLocation } from 'react-router-dom';


gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const previewRef = useRef(null);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Handlers for Hover Effects ---
  const handleMouseEnter = (imgUrl) => {
    if (imgUrl && previewRef.current) {
        previewRef.current.style.backgroundImage = `url('${imgUrl}')`;
        gsap.to(previewRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.hash]);
  
  const handleMouseLeave = (e) => {
    if(previewRef.current) gsap.to(previewRef.current, { opacity: 0, scale: 0.7, duration: 0.4, ease: "power3.in" });
    
    const inner = e.currentTarget.querySelector(".project");
    if(inner && !prefersReducedMotion) {
        gsap.to(inner, { 
            transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`, 
            duration: 0.8, 
            ease: "elastic.out(1, 0.5)" 
        });
    }
  };

  const handleMouseMove = (e) => {
    if(previewRef.current) {
      gsap.to(previewRef.current, { x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2, duration: 0.8, ease: "power3.out" });
    }
    if(!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height/2) / (rect.height/2)) * -8; 
      const rotateY = ((x - rect.width/2) / (rect.width/2)) * 8;

      const inner = e.currentTarget.querySelector(".project");
      if(inner) {
        gsap.to(inner, { transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        inner.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        inner.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      }
    }
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    const isFirstVisit = sessionStorage.getItem("visited") !== "true";

    let ctx = gsap.context(() => {
      gsap.set(".reveal-text", { y: 50, opacity: 0 });
      
      const initScrollAnimations = () => {
        ScrollTrigger.refresh();
        
        // --- ADDED: Mobile Scroll Highlight for Projects ---
        gsap.utils.toArray('.project').forEach((project) => {
          ScrollTrigger.create({
            trigger: project,
            start: "top 65%",   // Triggers when the top of the project hits 65% down the screen
            end: "bottom 35%",  // Ends when the bottom of the project passes 35%
            toggleClass: "is-active", // Adds your pre-styled CSS class
          });
        });
        
        if (!prefersReducedMotion) {
            gsap.to("#hero", { 
                scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }, 
                y: 150, 
                scale: 0.9,
                opacity: 0 
            });

            document.querySelectorAll(".reveal-text").forEach((item) => {
                gsap.to(item, { 
                    scrollTrigger: { trigger: item, start: "top 85%" }, 
                    y: 0, 
                    opacity: 1, 
                    duration: 1, 
                    ease: "power3.out" 
                });
            });

            document.querySelectorAll(".reveal-container").forEach((container) => {
                const curtain = container.querySelector(".reveal-curtain");
                const img = container.querySelector("img");
                
                let tl = gsap.timeline({ scrollTrigger: { trigger: container, start: "top 75%" } });

                tl.fromTo(curtain, { scaleY: 1 }, { scaleY: 0, duration: 1.2, ease: "expo.inOut" })
                  .fromTo(img, { scale: 1.2, filter: "blur(10px) grayscale(100%)" }, { scale: 1, filter: "blur(0px) grayscale(0%)", duration: 1.5, ease: "power3.out" }, "-=1.2");
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
              }
          });

          tl.to(".loader-text", { opacity: 1, duration: 0.5, ease: "power2.out" });
          
          tl.to({ value: 0 }, {
              value: 100,
              duration: 1.5,
              ease: "power3.inOut",
              onUpdate: function() { 
                if(counterRef.current) counterRef.current.textContent = Math.floor(this.targets()[0].value); 
              }
          });

          tl.to(".loader-text, .loader-meta", { opacity: 0, duration: 0.3 }); 
          tl.to(".preloader-container", { yPercent: -100, duration: 1.2, ease: "expo.inOut" });

          if (!prefersReducedMotion) {
              tl.to(".hero-text", { y: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "expo.out" }, "-=0.6")
                .to(".hero-sub", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.9")
                .to(".cv-wrapper", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
                .to(document.querySelector("#main-nav"), { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1.0"); 
          } else {
             tl.set(".hero-text, .hero-sub, .cv-wrapper", { y: 0, opacity: 1, rotateX: 0 });
             gsap.set(document.querySelector("#main-nav"), { y: 0, opacity: 1 });
          }
      } else {
          unlockScroll();
          gsap.set(".preloader-container", { display: "none" });
          
          gsap.fromTo(".hero-text", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "expo.out", delay: 0.2 });
          gsap.fromTo(".hero-sub, .cv-wrapper", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 });
          gsap.fromTo(document.querySelector("#main-nav"), { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.1 }); 
          
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
      
      <div className="preloader-container" role="status" aria-label="Loading assets">
        <div className="loader-content">
          <div className="counter-wrap"><span className="counter" ref={counterRef}>0</span><span className="percent">%</span></div>
          <div className="loader-text">INITIALIZING SYSTEM</div>
        </div>
        <div className="loader-meta top-left">SWAYAM.DEV</div>
        <div className="loader-meta top-right">PORTFOLIO ©2026</div>
        <div className="loader-meta bottom-left">LOADING ASSETS</div>
        <div className="loader-meta bottom-right">PLEASE WAIT</div>
      </div>

      <main style={{ perspective: "1000px" }}>
        <section id="hero">
          <div className="hero-line">
            <h1 className="hero-text hero-name" style={{ willChange: "transform, opacity" }}>SWAYAM PURWAR</h1>
          </div>
          <div className="hero-line">
            <span className="hero-text outline-text" style={{ willChange: "transform, opacity" }}>DEVELOPER</span>
          </div>
          <p className="hero-sub">Based in Bhopal, India &bull; <span id="live-clock">--:--:-- IST</span> &bull; Available for Freelance</p>
          <div className="cv-wrapper">
            <Link to="/resume" className="cv-btn mouse-hover" data-strength="25">
              <span>VIEW Resume</span>
              <svg className="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
            </Link>
          </div>
        </section>

        <section id="work">
          <div ref={previewRef} className="project-preview-img" role="img" aria-label="Project Preview" id="preview-img" style={{ willChange: "transform, opacity" }}></div>
          <div className="section-header"><span>SELECTED WORKS</span><span>(2025-2026)</span></div>

          <Link to="/work/apple-music" className="project-link" onMouseEnter={() => handleMouseEnter('/assets/images/project/apple-music-preview.webp')} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
            <article className="project mouse-hover"><h2>APPLE MUSIC APP</h2><div className="project-meta"><p>iOS / UI Redesign</p><p>2025</p></div></article>
          </Link>

          <Link to="/work/instagram" className="project-link" onMouseEnter={() => handleMouseEnter('/assets/images/project/instagram-preview.webp')} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
            <article className="project mouse-hover"><h2>INSTAGRAM APP</h2><div className="project-meta"><p>Full Stack</p><p>2025</p></div></article>
          </Link>
          
          <div className="section-header upcoming"><span>CURRENTLY DEVELOPING</span><span>(WIP)</span></div>
          <Link to="/work/kite" className="project-link" onMouseEnter={() => handleMouseEnter('/assets/images/project/kite-preview.webp')} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
            <article className="project mouse-hover"><h2>KITE ZERODHA APP</h2><div className="project-meta"><p>Web Sockets / FinTech</p><p>2026</p></div></article>
          </Link>
          
          <div className="section-header upcoming"><span>UPCOMING PROJECTS</span><span>(IN LABS)</span></div>
          <Link to="/work/CodeSenseAiSaas" className="project-link" onMouseEnter={() => handleMouseEnter('/assets/images/project/codesense-ai-saas-preview.webp')} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
            <article className="project mouse-hover"><h2>CodeSense AI</h2><div className="project-meta"><p>AI-Powered Code Assistant + Saas</p><p>Coming Soon</p></div></article>
          </Link>
        </section>
 <section className="marquee-section" aria-hidden="true">
          <div className="marquee-content">
            <span>REACT &bull; GSAP &bull; UI/UX &bull; FIGMA &bull; THREE.JS &bull; NODE.JS &bull; MONGODB &bull; </span>
            <span>REACT &bull; GSAP &bull; UI/UX &bull; FIGMA &bull; THREE.JS &bull; NODE.JS &bull; MONGODB &bull; </span>
          </div>
        </section>
        <section id="about">
          <div className="about-img reveal-container" style={{ transformStyle: "preserve-3d" }}>
            <div className="reveal-curtain"></div>
            <img src="/assets/images/profile/swayam-purwar.webp" width="600" height="800" loading="lazy" alt="Swayam Purwar profile" style={{ willChange: "transform, filter" }} />
          </div>
          <div className="about-text">
            <h2 className="reveal-text">Code meets<br />Creativity.</h2>
            <p className="reveal-text">I am Swayam, a developer building high-end digital experiences using React, Node.js, and GSAP.</p>
            <Link to="/about" className="btn mouse-hover reveal-text" data-strength="30">Read More</Link>
          </div>
        </section>

       
      </main>
    </div>
  );
}