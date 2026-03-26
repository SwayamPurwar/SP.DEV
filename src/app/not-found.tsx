"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import gsap from "gsap";
import * as THREE from "three";

interface LogMessage {
  text: string;
  delay: number;
  type: string;
}

export default function NotFound() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [progressWidth, setProgressWidth] = useState("0%");
  const [rebootAborted, setRebootAborted] = useState(false);

  const glitchTextRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); 
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // --------------------------------------------------
    // 1. TERMINAL LOGIC
    // --------------------------------------------------
    const timeouts: NodeJS.Timeout[] = [];
    const terminalLogs: LogMessage[] = [
      { text: "> SYSTEM_CHECK: FAILED", delay: 500, type: "log-error" },
      { text: "> ATTEMPTING_RESTORE...", delay: 1200, type: "" },
      { text: "> SECTOR_7G: UNSTABLE", delay: 2000, type: "log-error" },
      { text: "> REBOOT_INITIATED.", delay: 4800, type: "log-success" },
    ];

    terminalLogs.forEach((log) => {
      const id = setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, log.delay);
      timeouts.push(id);
    });

    const progressTimer = setTimeout(() => {
      setProgressWidth("100%");
    }, 500);
    timeouts.push(progressTimer);

    redirectTimerRef.current = setTimeout(() => {
      if (!rebootAborted) router.push("/");
    }, 5500);
    timeouts.push(redirectTimerRef.current);

    // --------------------------------------------------
    // 2. GSAP PARALLAX
    // --------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      if (!glitchTextRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;

      gsap.to(glitchTextRef.current, {
        x: xPos,
        y: yPos,
        duration: 0.5,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --------------------------------------------------
    // 3. THREE.JS PARTICLES (Corrupted Data Effect)
    // --------------------------------------------------
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500; 
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xff3333,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial,
    );
    scene.add(particlesMesh);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.02;

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
    window.addEventListener("resize", handleResize);

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------
    return () => {
      timeouts.forEach((id) => clearTimeout(id));
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [router, rebootAborted]);

  const handleAbort = () => {
    setRebootAborted(true);
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    setProgressWidth("0%");
    setLogs((prev) => [
      ...prev,
      { text: "> REBOOT_ABORTED_BY_USER.", delay: 0, type: "log-error" },
    ]);
  };

  return (
    <>
      {/* ADDED: Global style block to hide layout nav/footer and lock scrolling */}
      <style dangerouslySetInnerHTML={{ __html: `
        nav, header, footer { display: none !important; }
        body { overflow: hidden !important; }
      `}} />

      <div
        ref={containerRef}
        style={{
          // CHANGED: From relative to fixed to perfectly overlay the layout
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99999,
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#050505",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div className="vignette" style={{ zIndex: 1, pointerEvents: "none" }}></div>

        <div className="content-wrapper" ref={glitchTextRef} style={{ zIndex: 2 }}>
          <h1 className="glitch" data-text="SYSTEM FAILURE">
            SYSTEM FAILURE
          </h1>
          <div className="sub-glitch">ERROR 404 // DATA_CORRUPTED</div>

          <div className="terminal-container" id="console">
            {logs.map((log, index) => (
              <div key={index} className={`log-line ${log.type}`}>
                {log.text}
              </div>
            ))}
          </div>

          {!rebootAborted && (
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: progressWidth, transition: "width 5s linear" }}
              ></div>
            </div>
          )}

          <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
            <Link href="/" className="manual-btn mouse-hover">
              [ MANUAL_OVERRIDE ]
            </Link>

            {!rebootAborted && (
              <button
                onClick={handleAbort}
                className="manual-btn mouse-hover"
                style={{
                  background: "transparent",
                  border: "1px solid #ff3333",
                  color: "#ff3333",
                  cursor: "pointer",
                }}
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