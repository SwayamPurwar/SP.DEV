import { interactiveSelector } from './constants.js';

// ==========================================
// 🚨 BRUTE-FORCE SCROLL LOCK HELPERS 🚨
// ==========================================
function preventScroll(e) {
    // Block scroll keys (Spacebar, Arrows, Page Up/Down, etc.)
    const keys = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"];
    if (e.type === 'keydown' && !keys.includes(e.code)) return;
    
    // Kill the event
    e.preventDefault();
    e.stopPropagation();
    return false;
}

function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    
    // Actively block all scroll inputs at the browser level
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScroll, { passive: false });
}

function unlockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.height = '';
    document.documentElement.style.height = '';
    
    // Remove the blocks
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('keydown', preventScroll);
}
// ==========================================


export function initAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis;

    // --- SMOOTH SCROLLING ---
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    // --- PRELOADER & HERO ---
    const preloader = document.querySelector(".preloader-container");
    if (preloader) {
        const isReload = performance.getEntriesByType("navigation")[0]?.type === 'reload';

        if (sessionStorage.getItem("visited") === "true" && !isReload) {
            gsap.set(".preloader-container", { display: "none" });
            gsap.set(".hero-text", { y: 0, opacity: 1 });
            gsap.set(".hero-sub", { opacity: 1, y: 0 });
            if(document.querySelector(".cv-wrapper")) gsap.set(".cv-wrapper", { opacity: 1 });
            gsap.set("nav", { y: 0, opacity: 1 }); 
            unlockScroll(); // Ensure it's unlocked if we skip the loader
        } else {
            sessionStorage.setItem("visited", "true");
            
            // 1. Force scroll to top (Using Lenis if available, otherwise native)
            if (lenis) {
                lenis.scrollTo(0, { immediate: true });
                lenis.stop();
            } else {
                window.scrollTo(0, 0);
            }
            
            // 2. Activate the Brute-Force Lock
            lockScroll();
            
            gsap.set("nav", { y: -50, opacity: 0 });

            const tl = gsap.timeline();
            tl.to(".loader-text", { opacity: 1, duration: 0.5, ease: "power2.out" });
            
            const counterObj = { value: 0 };
            const counterEl = document.querySelector(".counter");
            
            tl.to(counterObj, {
                value: 100,
                duration: 1.5,
                ease: "power3.inOut",
                onUpdate: () => {
                    if(counterEl) counterEl.textContent = Math.floor(counterObj.value);
                }
            });

            tl.to(".loader-text, .loader-meta", { opacity: 0, duration: 0.3 }); 
            
            tl.to(".preloader-container", {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut",
                onStart: () => {
                    // Re-confirm lock is active during the slide-up transition
                    lockScroll();
                    if(document.getElementById("cursor")) {
                        document.getElementById("cursor").style.display = "none";
                    }
                },
                onComplete: () => {
                    // 3. Remove the lock and restore inputs
                    unlockScroll();
                    
                    document.querySelector(".preloader-container").classList.add("hidden");
                    if(document.getElementById("cursor")) {
                        document.getElementById("cursor").style.display = "block";
                    }
                    gsap.set(".preloader-container", { display: "none" });
                    
                    // 4. Turn Lenis back on
                    if (lenis) lenis.start();
                }
            });

            if (!prefersReducedMotion) {
                tl.from(".hero-text", { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" }, "-=0.8");
                tl.fromTo(".hero-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.6");
                if(document.querySelector(".cv-wrapper")) tl.from(".cv-wrapper", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8");
                tl.to("nav", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1.0");
            } else {
                gsap.set([".hero-text", ".hero-sub", ".cv-wrapper", "nav"], { y: 0, opacity: 1 });
            }
        }
    }

    // --- PAGE TRANSITIONS ---
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !link.hasAttribute('download') && link.target !== '_blank') {
                e.preventDefault();
                let curtain = document.querySelector('.page-transition-curtain');
                if (!curtain) {
                    curtain = document.createElement('div');
                    curtain.classList.add('page-transition-curtain');
                    curtain.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 10000; transform: scaleY(0); transform-origin: bottom; pointer-events: none;`;
                    document.body.appendChild(curtain);
                }
                gsap.to(curtain, { scaleY: 1, duration: 0.8, ease: "power4.inOut", onComplete: () => window.location.href = href });
            }
        });
    });

    if (!prefersReducedMotion) {
        // --- ANIMATIONS & REVEALS ---
        const hero = document.getElementById("hero");
        if (hero) gsap.to("#hero", { scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 }, y: 100, opacity: 0.5 });

        document.querySelectorAll(".project, .reveal-text").forEach((item) => {
            gsap.from(item, { scrollTrigger: { trigger: item, start: "top 90%" }, y: 50, opacity: 0, duration: 1, ease: "power3.out" });
        });

        document.querySelectorAll(".reveal-container").forEach((container) => {
            const curtain = container.querySelector(".reveal-curtain");
            const img = container.querySelector("img");
            let tl = gsap.timeline({ scrollTrigger: { trigger: container, start: "top 80%" } });
            tl.to(curtain, { scaleY: 0, duration: 1.5, ease: "power4.inOut" });
            if(img) tl.to(img, { scale: 1, filter: "grayscale(0%)", duration: 1.5, ease: "power4.out" }, "-=1.5");
        });

        // --- MAGNETIC BUTTONS ---
        document.querySelectorAll(interactiveSelector).forEach((magnet) => {
            if(!magnet.classList.contains('project-link')) {
                magnet.addEventListener("mousemove", (e) => {
                    const bounding = magnet.getBoundingClientRect();
                    const newX = (e.clientX - bounding.left) / magnet.offsetWidth - 0.5;
                    const newY = (e.clientY - bounding.top) / magnet.offsetHeight - 0.5;
                    gsap.to(magnet, { duration: 1, x: newX * 30, y: newY * 30, ease: "power4.out" });
                });
                magnet.addEventListener("mouseleave", () => {
                    gsap.to(magnet, { duration: 1, x: 0, y: 0, ease: "elastic.out(1, 0.3)" });
                });
            }
        });

        // --- HOLOGRAPHIC TILT EFFECT ---
        document.querySelectorAll(".project-link").forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height/2) / (rect.height/2)) * -10; 
                const rotateY = ((x - rect.width/2) / (rect.width/2)) * 10;

                const inner = card.querySelector(".project");
                gsap.to(inner, { transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`, duration: 0.1, ease: "power1.out" });
                inner.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                inner.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            });
            card.addEventListener("mouseleave", () => {
                const inner = card.querySelector(".project");
                gsap.to(inner, { transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`, duration: 0.5, ease: "elastic.out(1, 0.5)" });
            });
        });
    }

    // --- PROJECT PREVIEW (1:1 Movement) ---
    const previewEl = document.getElementById('preview-img');
    const projectLinks = document.querySelectorAll('.project-link');
    if (previewEl && projectLinks.length > 0) {
        projectLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const imgUrl = link.getAttribute('data-img');
                if (imgUrl) {
                    previewEl.style.backgroundImage = `url('${imgUrl}')`;
                    gsap.to(previewEl, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
                }
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(previewEl, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in" });
            });
            link.addEventListener('mousemove', (e) => {
                const x = e.clientX - window.innerWidth / 2;
                const y = e.clientY - window.innerHeight / 2;
                gsap.to(previewEl, { x: x, y: y, duration: 0.1, ease: "power2.out" });
            });
        });
    }
}