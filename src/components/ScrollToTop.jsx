// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Force native scroll
    window.scrollTo(0, 0);
    
    // 2. Force Lenis scroll (now that we attached it in animations.js!)
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }

    // 3. Wait a split second for lazy-loaded pages to render, then force top again
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
      ScrollTrigger.refresh(); // Tell GSAP we are at the top
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}