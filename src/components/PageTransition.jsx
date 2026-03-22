import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransition() {
  const { pathname } = useLocation();
  const curtainRef = useRef(null);

 // AFTER:
  useEffect(() => {
    // FIX: Prevent curtain animation if we are just navigating to a hash/anchor on the same page
    if (window.location.hash) return;

    let ctx = gsap.context(() => {
      if (curtainRef.current) {
        gsap.fromTo(curtainRef.current, 
          { scaleY: 1 }, 
          { 
            scaleY: 0, 
            duration: 1.5,
            ease: 'expo.inOut',
            delay: 0.1 // Reduced delay for snappier feel
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
        transformOrigin: 'top',
        transform: 'scaleY(0)' 
      }}
    ></div>
  );
}