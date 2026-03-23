import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Resume() {
  const [clientCity, setClientCity] = useState('Scanning...');
  const [clientIp, setClientIp] = useState('***.***.*.*');
  const [clientTime, setClientTime] = useState('--:--');
  const [hostTime, setHostTime] = useState('--:--');
  const [distance, setDistance] = useState('0 km');
  const [ping, setPing] = useState('0 ms');
  const [os, setOs] = useState('Analyzing...');

  // Smooth, high-performance mouse tracking for minimal glow
  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.querySelectorAll('.minimal-card').forEach((card) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Telemetry Logic
  useEffect(() => {
    const HOST_LAT = 23.2599;
    const HOST_LON = 77.4126;

    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error("API Limit");
        setClientCity(data.city || 'Unknown');
        setClientIp(data.ip ? data.ip.split('.').map((p, i) => (i > 1 ? '***' : p)).join('.') : 'Hidden');
        
        if (data.latitude && data.longitude) {
          const R = 6371;
          const dLat = (data.latitude - HOST_LAT) * (Math.PI / 180);
          const dLon = (data.longitude - HOST_LON) * (Math.PI / 180);
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(HOST_LAT * (Math.PI / 180)) * Math.cos(data.latitude * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const dist = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
          setDistance(`${dist.toLocaleString()} km`);
          setPing(`${Math.round(dist / 500 + 8)} ms`);
        } else {
          setDistance('Unknown'); setPing('Unknown ms');
        }
      })
      .catch(() => {
        setClientCity('Stealth Mode'); setClientIp('127.0.0.1');
      });

    setOs(navigator.platform || 'Unknown OS');
    const timer = setInterval(() => {
      const now = new Date();
      setHostTime(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setClientTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black min-h-screen text-zinc-400 selection:bg-white selection:text-black overflow-x-hidden font-['Plus_Jakarta_Sans']">
      <SEO title="Swayam Purwar - MERN Full Stack" description="Minimal & Premium Resume and Portfolio of Swayam Purwar." />

      {/* --- MINIMAL PREMIUM STYLES --- */}
      <style>{`
        .minimal-card {
          background: #050505;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 1.5rem;
          transition: border-color 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .minimal-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
        }
        /* Subtle radial glow effect on hover tracking mouse */
        .minimal-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255, 255, 255, 0.03), transparent 40%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 1;
        }
        .minimal-card:hover::before { opacity: 1; }

        .solid-btn {
          background: #fff;
          color: #000;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .solid-btn:hover {
          background: #e4e4e7;
          transform: translateY(-1px);
        }

        .outline-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          transition: all 0.3s ease;
        }
        .outline-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.2);
        }

        .animate-enter {
          animation: fadeUpMinimal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes fadeUpMinimal {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Pure noise, no colored blobs */
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.03] mix-blend-overlay noise-bg"></div>

      <main className="relative z-10 max-w-6xl mx-auto p-6 md:p-12 lg:p-16 mt-12 md:mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
          
          {/* PROFILE CARD */}
          <section className="minimal-card col-span-1 md:col-span-2 row-span-2 p-8 md:p-10 flex flex-col justify-between animate-enter" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-start mb-12">
              <img src="/assets/images/profile/profile.webp" alt="Swayam Purwar" className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover grayscale border border-white/10" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                </span>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Available</span>
              </div>
            </div>

            <div className="space-y-6 z-10">
              <div>
                <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-2">Swayam Purwar.</h1>
                <p className="text-sm md:text-base text-zinc-400 font-medium">MERN Full Stack Engineer</p>
              </div>

              <p className="text-zinc-500 leading-relaxed text-sm md:text-base max-w-md font-light">
                Architecting high-performance web applications. I bridge the gap between sophisticated design and robust backend architecture, focusing on clean code and minimal interfaces.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 flex-wrap no-print">
                <a href="/assets/docs/Swayam-Purwar-Resume.pdf" download className="solid-btn px-6 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2">
                  Download Resume
                </a>
                <div className="flex gap-3">
                  <a href="https://github.com/SwayamPurwar" target="_blank" rel="noreferrer" aria-label="GitHub" className="outline-btn w-12 h-12 rounded-full flex items-center justify-center">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                  <a href="https://linkedin.com/in/swayam-purwar" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="outline-btn w-12 h-12 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.306c0-4.613 9.289-5.124 9.289 0v8.306h5v-10.306c0-6.117-7.025-6.32-9.632-3.132v-2.56z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* TELEMETRY DASHBOARD */}
          <section className="minimal-card col-span-1 row-span-2 p-8 flex flex-col justify-between h-auto min-h-[380px] animate-enter" style={{ animationDelay: '0.2s' }}>
            <div className="mb-6 pb-5 border-b border-white/5">
              <h3 className="text-[10px] font-medium text-white uppercase tracking-widest mb-1.5">System Status</h3>
              <p className="text-[9px] text-zinc-600 font-mono tracking-wider">SECURE CONNECTION</p>
            </div>
            
            <div className="w-full my-6 z-10 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Client</span>
                <div className="text-right">
                  <span className="block text-xs font-medium text-white">{clientCity}</span>
                  <span className="block text-[10px] text-zinc-600 font-mono mt-1">{clientTime}</span>
                </div>
              </div>

              {/* Minimal Line */}
              <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-white/20 animate-[sweep_2s_ease-in-out_infinite]"></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Host</span>
                <div className="text-right">
                  <span className="block text-xs font-medium text-white">Bhopal, IND</span>
                  <span className="block text-[10px] text-zinc-600 font-mono mt-1">{hostTime}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto z-10 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.02]">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">IP</span>
                <span className="text-[10px] text-white font-mono">{clientIp}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.02]">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">OS</span>
                <span className="text-[10px] text-white font-mono">{os}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.02]">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Dist</span>
                <span className="text-[10px] text-white font-mono">{distance}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Ping</span>
                <span className="text-[10px] text-white font-mono">{ping}</span>
              </div>
            </div>
          </section>

          {/* TECH STACK CARD */}
          <section className="minimal-card col-span-1 md:col-span-3 p-8 md:p-12 animate-enter" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-[10px] font-medium text-white uppercase tracking-widest mb-8">Technical Arsenal</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                  <h4 className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Front-End</h4>
                  <ul className="flex flex-col gap-3 text-sm text-zinc-300">
                      <li>React.js / Next.js</li>
                      <li>Tailwind CSS</li>
                      <li>GSAP / Framer</li>
                      <li>Three.js / WebGL</li>
                  </ul>
              </div>

              <div className="space-y-4">
                  <h4 className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Back-End</h4>
                  <ul className="flex flex-col gap-3 text-sm text-zinc-300">
                      <li>Node.js</li>
                      <li>Express.js</li>
                      <li>RESTful APIs</li>
                      <li>WebSockets</li>
                  </ul>
              </div>

              <div className="space-y-4">
                  <h4 className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Database</h4>
                  <ul className="flex flex-col gap-3 text-sm text-zinc-300">
                      <li>MongoDB</li>
                      <li>MySQL</li>
                      <li>Redis</li>
                      <li>Prisma ORM</li>
                  </ul>
              </div>

              <div className="space-y-4">
                  <h4 className="text-zinc-500 text-xs uppercase tracking-widest mb-4">Tools</h4>
                  <ul className="flex flex-col gap-3 text-sm text-zinc-300">
                      <li>Git / GitHub</li>
                      <li>Vercel / AWS</li>
                      <li>Docker</li>
                      <li>Figma</li>
                  </ul>
              </div>
            </div>
          </section>

          <div className="col-span-1 md:col-span-3 mt-12 mb-2 animate-enter" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-lg font-medium text-white tracking-tight">Selected Works</h2>
          </div>

          {/* PROJECT CARDS - Stripped Back */}
          <Link to="/work/apple-music" className="minimal-card col-span-1 md:col-span-1 group block animate-enter" style={{ animationDelay: '0.5s' }}>
            <article className="p-8 h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest mb-4 block">01</span>
                <h3 className="text-lg font-medium text-white mb-3 group-hover:text-zinc-300 transition-colors">Apple Music Clone</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Pixel-perfect replication of the Apple Music web player featuring full audio playback.</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs text-zinc-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                <span>View Case Study</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </article>
          </Link>

          <Link to="/work/instagram" className="minimal-card col-span-1 md:col-span-1 group block animate-enter" style={{ animationDelay: '0.6s' }}>
            <article className="p-8 h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest mb-4 block">02</span>
                <h3 className="text-lg font-medium text-white mb-3 group-hover:text-zinc-300 transition-colors">Instagram Clone</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Responsive social media interface with complex grid layouts, feeds, and modern interactions.</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs text-zinc-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                <span>View Case Study</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </article>
          </Link>

          <Link to="/work/kite" className="minimal-card col-span-1 md:col-span-1 group block animate-enter" style={{ animationDelay: '0.7s' }}>
            <article className="p-8 h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest mb-4 block">03</span>
                <h3 className="text-lg font-medium text-white mb-3 group-hover:text-zinc-300 transition-colors">Kite Zerodha Replica</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">A high-performance trading dashboard interface with complex state management.</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs text-zinc-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                <span>View Case Study</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </article>
          </Link>

          {/* New Project: CodeSense AI SaaS */}
          <Link to="/work/codesense-ai-saas" className="minimal-card col-span-1 md:col-span-1 group block animate-enter" style={{ animationDelay: '0.8s' }}>
            <article className="p-8 h-full flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest mb-4 block">04</span>
                <h3 className="text-lg font-medium text-white mb-3 group-hover:text-zinc-300 transition-colors">CodeSense AI SaaS</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">Intelligent code analysis platform with secure authentication, AI integration, and a modern dashboard.</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs text-zinc-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                <span>View Case Study</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </article>
          </Link>

          {/* New Project: This Portfolio Meta Card */}
          <article className="minimal-card col-span-1 md:col-span-2 group block animate-enter" style={{ animationDelay: '0.9s' }}>
            <div className="p-8 h-full flex flex-col justify-between relative z-10">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest mb-4 block">05 — META</span>
                <h3 className="text-lg font-medium text-white mb-3 group-hover:text-zinc-300 transition-colors">This Portfolio Architecture</h3>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">Designed from the ground up for performance and aesthetic minimalism. Built entirely using React, styled purely with Tailwind CSS, and optimized for seamless page transitions without relying on heavy external animation libraries.</p>
              </div>
              <div className="mt-8 flex items-center gap-3 text-[10px] text-zinc-400 font-mono tracking-wider uppercase">
                 <span className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">React 18</span>
                 <span className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">Tailwind CSS</span>
                 <span className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">Vite</span>
              </div>
            </div>
          </article>

          {/* EXPERIENCE SECTION */}
          <section className="minimal-card col-span-1 md:col-span-3 p-8 md:p-12 mt-6 animate-enter" style={{ animationDelay: '1.0s' }}>
             <h3 className="text-[10px] font-medium text-white uppercase tracking-widest mb-10">Experience</h3>
             
             <div className="space-y-12">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-12 border-b border-white/5">
                  <div className="md:w-1/4">
                    <span className="text-xs text-zinc-500 font-mono">Oct 2025 — Nov 2025</span>
                  </div>
                  <div className="md:w-3/4">
                    <h4 className="text-white font-medium text-lg mb-1">SDE Intern</h4>
                    <p className="text-sm text-zinc-400 mb-4">Bluestock Fintech</p>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
                        Engineered frontend modules for a high-traffic fintech dashboard. Integrated secure REST APIs for real-time stock data visualization. Optimized render cycles for financial charts.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="md:w-1/4">
                    <span className="text-xs text-zinc-500 font-mono">2024 — Present</span>
                  </div>
                  <div className="md:w-3/4">
                    <h4 className="text-white font-medium text-lg mb-1">Creative Developer</h4>
                    <p className="text-sm text-zinc-400 mb-4">Freelance</p>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
                        Architected highly interactive 3D portfolios and high-conversion landing pages. Focused on semantic HTML, accessibility, and modern minimalist design systems.
                    </p>
                  </div>
                </div>
             </div>
          </section>

          {/* EDUCATION & CERTIFICATIONS */}
          <section className="minimal-card col-span-1 md:col-span-3 p-8 md:p-12 animate-enter" style={{ animationDelay: '1.1s' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-[10px] font-medium text-white uppercase tracking-widest mb-8">Education</h3>
                <div className="space-y-8">
                    <div>
                      <h4 className="font-medium text-white text-base mb-1">Bachelor of Computer Applications</h4>
                      <p className="text-sm text-zinc-500">LNCT University (Pursuing)</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-base mb-1">Senior Secondary (XII)</h4>
                      <p className="text-sm text-zinc-500">Satya Niketan Higher Secondary (2023)</p>
                    </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-medium text-white uppercase tracking-widest mb-8">Certifications</h3>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-medium text-white text-base mb-1">MERN Full Stack</h4>
                        <p className="text-sm text-zinc-500">Sheryians Coding School</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-white text-base mb-1">React JS Development</h4>
                        <p className="text-sm text-zinc-500">Sheryians Coding School</p>
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONNECT SECTION */}
          <section className="col-span-1 md:col-span-3 mt-12 mb-6 animate-enter" style={{ animationDelay: '1.2s' }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 py-8 border-t border-white/5">
                <h3 className="text-lg font-medium text-white">Let's build something.</h3>
                <div className="flex flex-wrap gap-6 text-sm">
                  <a href="mailto:swayampurwar111104@gmail.com" className="text-zinc-400 hover:text-white transition-colors">Email</a>
                  <a href="https://linkedin.com/in/swayam-purwar" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">LinkedIn</a>
                  <a href="https://github.com/SwayamPurwar" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">GitHub</a>
                  <a href="tel:+919993900688" className="text-zinc-400 hover:text-white transition-colors">Phone</a>
                </div>
              </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="flex justify-center mt-12 mb-8 animate-enter" style={{ animationDelay: '1.3s' }}>
          <Link to="/" className="outline-btn px-6 py-3 rounded-full text-xs font-medium uppercase tracking-widest flex items-center gap-3 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            <span>Return</span>
          </Link>
        </div>
      </main>
    </div>
  );
}