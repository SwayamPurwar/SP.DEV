import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { interactiveSelector } from './constants.js';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 🚨 EXPORTED SCROLL LOCK HELPERS 🚨
// ==========================================
function preventScroll(e) {
    const keys = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"];
    if (e.type === 'keydown' && !keys.includes(e.code)) return;
    e.preventDefault();
    e.stopPropagation();
    return false;
}
// src/utils/animations.js

export function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScroll, { passive: false });

    // 🚨 NEW: Tell Lenis to completely pause
    if (window.lenis) {
        window.lenis.stop();
    }
}

export function unlockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('keydown', preventScroll);

    // 🚨 NEW: Tell Lenis to resume scrolling
    if (window.lenis) {
        window.lenis.start();
    }
}

// ==========================================
// GLOBAL ANIMATIONS
// ==========================================
export function initAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis;
    let tickerCallback;
    let loaderTl; // Declare here for cleanup
    
    // --- ENHANCED CINEMATIC LOADER ---
    const loaderContainer = document.querySelector(".preloader-container");
    
    // Only run if the loader exists and isn't already hidden
    if (loaderContainer && !loaderContainer.classList.contains("hidden")) {
        const counterElement = document.querySelector(".counter");
        const loaderText = document.querySelector(".loader-text");
        const blinds = document.querySelectorAll(".blind");
        
        // 1. Create a Master Timeline for the loader sequence
        loaderTl = gsap.timeline({
            onComplete: () => {
                loaderContainer.classList.add("hidden");
                // Add a class to body when loading is completely finished
                document.body.classList.add("js-loaded", "loader-finished"); 
            }
        });

        // 2. The Counting Animation (Stage 1)
        let currentCount = { value: 0 };
        loaderTl.to(currentCount, {
            value: 100,
            duration: 2.5, // Dramatic build
            ease: "power2.inOut",
            onUpdate: () => {
                if (counterElement) {
                    // Format the number to always show 3 digits (e.g., 007, 042, 100)
                    counterElement.textContent = Math.floor(currentCount.value).toString().padStart(3, '0');
                }
            }
        }, "start");

        // 3. Fade in the loader text slightly after counting starts
        if (loaderText) {
            loaderTl.to(loaderText, {
                opacity: 1,
                duration: 1,
                ease: "power1.out"
            }, "start+=0.5");
        }

        // 4. The "Glitch" or "Snap" before revealing (Stage 2)
        loaderTl.to(".counter-wrap", {
            scale: 1.05,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut"
        }, "+=0.2");

        // 5. The Reveal: Opening the blinds/curtains (Stage 3)
        if (blinds.length > 0) {
            loaderTl.to(blinds, {
                scaleY: 0,
                duration: 0.8,
                stagger: {
                    each: 0.05,
                    from: "center", // Opens from the middle outwards
                    grid: "auto"
                },
                ease: "power4.inOut"
            }, "+=0.1");
        }

        // 6. Fade out the text elements as the blinds open
        loaderTl.to([".counter-wrap", loaderText], {
            opacity: 0,
            y: -20, // Slight upward movement as they fade
            duration: 0.4,
            ease: "power2.in"
        }, "<"); 

        // 7. Finally, fade out the whole container
        loaderTl.to(loaderContainer, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
        }, "-=0.2");
    } else {
        // Fallback: If loader isn't present, ensure body has js-loaded class
        document.body.classList.add("js-loaded");
    }

    // --- BUTTERY SMOOTH SCROLLING ---
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
        lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // 🚨 CRITICAL FIX: Attach to window so ScrollToTop can reach it!
        window.lenis = lenis;

        lenis.on('scroll', ScrollTrigger.update);
        
        tickerCallback = (time) => {
            lenis.raf(time * 1000);
        };
        
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);
    }

    // --- ENHANCED MAGNETIC BUTTONS ---
    const handleMouseMove = (e) => {
        const magnet = e.target.closest(interactiveSelector);
        if (magnet) {
            const strength = magnet.getAttribute('data-strength') || 40;
            const bounding = magnet.getBoundingClientRect();
            const newX = (e.clientX - bounding.left) / magnet.offsetWidth - 0.5;
            const newY = (e.clientY - bounding.top) / magnet.offsetHeight - 0.5;
            
            gsap.to(magnet, { 
                duration: 0.6, 
                x: newX * strength, 
                y: newY * strength, 
                ease: "power3.out"
            });
        }
    };

    const handleMouseOut = (e) => {
        const magnet = e.target.closest(interactiveSelector);
        if (magnet && !magnet.classList.contains('project-link')) {
            gsap.to(magnet, { 
                duration: 1.2, 
                x: 0, 
                y: 0, 
                ease: "elastic.out(1, 0.4)", 
                overwrite: "auto" 
            });
        }
    };

    if (!prefersReducedMotion) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseout", handleMouseOut);
    }

    // 🚨 FIX: Return a clean-up function to prevent memory leaks in React
    return () => {
        if (loaderTl) loaderTl.kill(); // Kill the loader animation if unmounted
        if (lenis) {
            lenis.destroy(); // Safely destroy smooth scrolling
            delete window.lenis; // Clean up global reference
            if (tickerCallback) gsap.ticker.remove(tickerCallback); // Unbind from GSAP
        }
        if (!prefersReducedMotion) {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseout", handleMouseOut);
        }
    };
}