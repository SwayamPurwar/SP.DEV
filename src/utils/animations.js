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

export function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScroll, { passive: false });
}

export function unlockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('keydown', preventScroll);
}

// ==========================================
// GLOBAL ANIMATIONS
// ==========================================
export function initAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis;
    let tickerCallback;
    
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