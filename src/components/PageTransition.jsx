import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
// src/components/PageTransition.jsx
export default function PageTransition() {
  const { pathname } = useLocation();
  const curtainRef = useRef(null);

  useEffect(() => {
    if (window.location.hash) return;

    let ctx = gsap.context(() => {
      if (curtainRef.current) {
        // Ensure the curtain starts "Full" if we manually triggered it
        // and then animate it down to 0
        gsap.fromTo(curtainRef.current, 
          { scaleY: 1 }, 
          { 
            scaleY: 0, 
            duration: 1.2, // Match the duration for consistency
            ease: 'expo.inOut',
            delay: 0.1 
          }
        );
      }
    }, curtainRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div 
      ref={curtainRef} 
      className="page-transition-curtain" 
      style={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
        background: '#050505', zIndex: 999999, pointerEvents: 'none', 
        transformOrigin: 'top', // Crucial for opening downward
        transform: 'scaleY(0)' 
      }}
    ></div>
  );
}