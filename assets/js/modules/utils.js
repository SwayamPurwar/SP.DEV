import { interactiveSelector } from './constants.js';

export function initUtils() {
    // --- NAV SCROLL EFFECT ---
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });
    }

    // --- MOBILE MENU ---
    const menuToggle = document.querySelector(".menu-toggle");
    if (menuToggle) {
        const mobileMenu = document.querySelector(".mobile-menu");
        const mobileLinks = document.querySelectorAll(".mobile-link");
        let isMenuOpen = false;

        const toggleMenu = () => {
            if (!isMenuOpen) {
                gsap.to(mobileMenu, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power4.inOut" });
                gsap.fromTo(mobileLinks, { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.2 });
                menuToggle.classList.add("active");
                mobileMenu.classList.add("active");
                document.body.style.overflow = "hidden"; 
                isMenuOpen = true;
            } else {
                gsap.to(mobileMenu, { y: "-100%", autoAlpha: 0, duration: 0.6 });
                menuToggle.classList.remove("active");
                mobileMenu.classList.remove("active");
                document.body.style.overflow = ""; 
                isMenuOpen = false;
            }
        };

        menuToggle.addEventListener("click", toggleMenu);
        mobileLinks.forEach(link => link.addEventListener("click", toggleMenu));
    }

    // --- CUSTOM CURSOR ---
    const cursor = document.getElementById("cursor");
    if (cursor) {
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3.out" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3.out" });

        if (window.matchMedia("(pointer: fine)").matches) {
            window.addEventListener("mousemove", (e) => {
                const magnetTarget = e.target.closest(interactiveSelector);
                const isBigCard = magnetTarget ? magnetTarget.matches('.project-link, .project, .hero-text') : false;

                if (magnetTarget && !isBigCard) {
                    const rect = magnetTarget.getBoundingClientRect();
                    xTo(rect.left + rect.width / 2);
                    yTo(rect.top + rect.height / 2);
                } else {
                    xTo(e.clientX);
                    yTo(e.clientY);
                }
            });
            
            document.body.addEventListener('mouseover', (e) => {
                if (e.target.closest(interactiveSelector)) cursor.classList.add("hovered");
            });
            document.body.addEventListener('mouseout', (e) => {
                if (e.target.closest(interactiveSelector)) cursor.classList.remove("hovered");
            });
        }

        // Accessibility Fix: Hide cursor when tabbing
        window.addEventListener('keydown', (e) => { 
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
                cursor.style.display = 'none';
            }
        });
        window.addEventListener('mousemove', () => { 
            document.body.classList.remove('user-is-tabbing');
            cursor.style.display = 'block';
        });
    }

    // --- YEAR & CLOCK ---
    const yearSpan = document.getElementById("year");
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }

    function updateLiveClock() {
        const clockElement = document.getElementById("live-clock");
        if (clockElement) {
            clockElement.textContent = new Date().toLocaleTimeString("en-US", {
                timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"
            }) + " IST";
        }
    }
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // --- AMBIENT GLOW ---
    const glow = document.getElementById("ambient-glow");
    if (glow) {
        const glowX = gsap.quickTo(glow, "x", { duration: 1.5, ease: "power3.out" });
        const glowY = gsap.quickTo(glow, "y", { duration: 1.5, ease: "power3.out" });
        window.addEventListener("mousemove", (e) => { glowX(e.clientX); glowY(e.clientY); });
    }

    console.log("%c SWAYAM.DEV ", "color:#050505;background:#bfa5d8;font-size:20px;font-weight:bold;padding:10px;border-radius:5px;");
}