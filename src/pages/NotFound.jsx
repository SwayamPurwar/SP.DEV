import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import gsap from 'gsap';
import * as THREE from 'three'; // Import Three.js

export default function NotFound() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [progressWidth, setProgressWidth] = useState('0%');
  const [rebootAborted, setRebootAborted] = useState(false);
  
  const glitchTextRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null); // Ref for Three.js canvas
  const redirectTimerRef = useRef(null);

  useEffect(() => {
    // --------------------------------------------------
    // 1. TERMINAL LOGIC
    // --------------------------------------------------
    const timeouts = [];
    const terminalLogs = [
      { text: "> SYSTEM_CHECK: FAILED", delay: 500, type: "log-error" },
      { text: "> ATTEMPTING_RESTORE...", delay: 1200, type: "" },
      { text: "> SECTOR_7G: UNSTABLE", delay: 2000, type: "log-error" },
      { text: "> REBOOT_INITIATED.", delay: 4800, type: "log-success" },
    ];

    terminalLogs.forEach((log) => {
      const id = setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, log.delay);
      timeouts.push(id); 
    });

    const progressTimer = setTimeout(() => {
      setProgressWidth('100%'); 
    }, 500);
    timeouts.push(progressTimer);

    redirectTimerRef.current = setTimeout(() => {
      if (!rebootAborted) navigate('/');
    }, 5500);
    timeouts.push(redirectTimerRef.current);

    // --------------------------------------------------
    // 2. GSAP PARALLAX
    // --------------------------------------------------
    const handleMouseMove = (e) => {
      if (!glitchTextRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30; 
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to(glitchTextRef.current, {
        x: xPos,
        y: yPos,
        duration: 0.5,
        ease: "power2.out"
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --------------------------------------------------
    // 3. THREE.JS PARTICLES (Corrupted Data Effect)
    // --------------------------------------------------
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimization

    // Create Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500; // Number of particles
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      // Spread particles around randomly
      posArray[i] = (Math.random() - 0.5) * 15; 
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material for the particles (making them look like red/white error sparks)
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xff3333, // Red hue to match the system failure vibe
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Slowly rotate the particle cloud
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.02;

      // Slight pulsing effect on opacity
      particlesMaterial.opacity = 0.5 + Math.sin(elapsedTime * 2) * 0.3;

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };
    animate();

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------
    return () => {
      timeouts.forEach(id => clearTimeout(id));
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
      
      // Clean up Three.js memory
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [navigate, rebootAborted]);

  const handleAbort = () => {
    setRebootAborted(true);
    clearTimeout(redirectTimerRef.current);
    setProgressWidth('0%'); 
    setLogs(prev => [...prev, { text: "> REBOOT_ABORTED_BY_USER.", delay: 0, type: "log-error" }]);
  };

  return (
    <>
      <SEO title="404 - System Failure" description="Page not found." />
      <div 
        ref={containerRef}
        style={{ position: 'relative', height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', backgroundColor: '#050505', overflow: 'hidden' }}
      >
        {/* Three.js Canvas */}
        <canvas 
          ref={canvasRef} 
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
        />

        <div className="vignette" style={{ zIndex: 1, pointerEvents: 'none' }}></div>
        
        <div className="content-wrapper" ref={glitchTextRef} style={{ zIndex: 2 }}>
          <h1 className="glitch" data-text="SYSTEM FAILURE">SYSTEM FAILURE</h1>
          <div className="sub-glitch">ERROR 404 // DATA_CORRUPTED</div>

          <div className="terminal-container" id="console">
            {logs.map((log, index) => (
              <div key={index} className={`log-line ${log.type}`}>{log.text}</div>
            ))}
          </div>

          {!rebootAborted && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: progressWidth, transition: 'width 5s linear' }}></div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
            <Link to="/" className="manual-btn mouse-hover">[ MANUAL_OVERRIDE ]</Link>
            
            {!rebootAborted && (
              <button 
                onClick={handleAbort} 
                className="manual-btn mouse-hover" 
                style={{ background: 'transparent', border: '1px solid #ff3333', color: '#ff3333', cursor: 'pointer' }}
              >
                [ ABORT_REBOOT ]
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}