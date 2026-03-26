"use client";
import { useEffect, useState, useRef } from "react"; // <-- FIX 1: Added useRef here
import Link from "next/link";
import gsap from "gsap";

import ProjectsFooter from "@/components/ProjectsFooter";

export default function Kite() {
  const [price, setPrice] = useState(22450.0);
  const [toast, setToast] = useState(false);
  const [toastColor, setToastColor] = useState("#00e396");
  const toastTimer = useRef(null);

  const executeTrade = (type) => {
    setToastColor(type === "buy" ? "#00e396" : "#ff4560");
    setToast(true);

    // Clear previous timeout if user clicks rapidly
    if (toastTimer.current) clearTimeout(toastTimer.current);

    // Start new timeout
    toastTimer.current = setTimeout(() => setToast(false), 2000);
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".p-title", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2,
      });
      gsap.from(".p-img-container", {
        rotateX: 15,
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.4,
      });
      gsap.from(".glass-card, .p-info", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.6,
      });
    });

    // Canvas Logic
    const canvas = document.getElementById("candle-canvas");
    const bgCanvas = document.getElementById("market-chart");
    if (!canvas || !bgCanvas) return;

    const canvasCtx = canvas.getContext("2d");
    const bgCtx = bgCanvas.getContext("2d");
    let cw, ch, bw, bh, animationReq;
    let candles = [];
    let currentPrice = 22450;

    const resize = () => {
      cw = canvas.width = canvas.parentElement.clientWidth;
      ch = canvas.height = canvas.parentElement.clientHeight;
      bw = bgCanvas.width = window.innerWidth;
      bh = bgCanvas.height = window.innerHeight * 0.6;

      candles = [];
      let p = currentPrice;
      const count = Math.floor(cw / 12);
      for (let i = 0; i < count; i++) {
        const move = (Math.random() - 0.5) * 20;
        const open = p;
        const close = p + move;
        candles.push({
          open,
          close,
          high: Math.max(open, close) + Math.random() * 10,
          low: Math.min(open, close) - Math.random() * 10,
          x: i * 12 + 6,
        });
        p = close;
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const drawBg = () => {
      bgCtx.clearRect(0, 0, bw, bh);
      const g = bgCtx.createLinearGradient(0, 0, 0, bh);
      g.addColorStop(0, "rgba(0, 227, 150, 0.15)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      bgCtx.fillStyle = g;
      bgCtx.beginPath();
      bgCtx.moveTo(0, bh);
      for (let x = 0; x <= bw; x += 20) {
        bgCtx.lineTo(
          x,
          bh / 1.5 + Math.sin(x * 0.005 + Date.now() * 0.001) * 60,
        );
      }
      bgCtx.lineTo(bw, bh);
      bgCtx.fill();
      animationReq = requestAnimationFrame(drawBg);
    };
    drawBg();

    const candleInterval = setInterval(() => {
      const last = candles[candles.length - 1];
      if (!last) return;
      last.close += (Math.random() - 0.5) * 5;
      last.high = Math.max(last.high, last.close);
      last.low = Math.min(last.low, last.close);
      setPrice(last.close);

      canvasCtx.clearRect(0, 0, cw, ch);
      const minPrice = Math.min(...candles.map((c) => c.low));
      const range = Math.max(...candles.map((c) => c.high)) - minPrice;
      const padding = 20;

      candles.forEach((c) => {
        canvasCtx.fillStyle = canvasCtx.strokeStyle =
          c.close >= c.open ? "#00E396" : "#FF4560";
        const getY = (val) =>
          ch - ((val - minPrice) / range) * (ch - padding * 2) - padding;
        canvasCtx.beginPath();
        canvasCtx.moveTo(c.x, getY(c.high));
        canvasCtx.lineTo(c.x, getY(c.low));
        canvasCtx.stroke();
        canvasCtx.fillRect(
          c.x - 3,
          Math.min(getY(c.open), getY(c.close)),
          6,
          Math.max(Math.abs(getY(c.open) - getY(c.close)), 1),
        );
      });
    }, 100);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(candleInterval);
      cancelAnimationFrame(animationReq);
      ctx.revert(); // <-- FIX 2: Added GSAP cleanup
    };
  }, []);

  return (
    <>
      <canvas id="market-chart"></canvas>
      <div className="grid-bg"></div>

      <div className="ticker-wrap">
        <div className="ticker">
          <div className="t-item">
            NIFTY <span style={{ color: "#00e396" }}>▲ 22,450.00</span>
          </div>
          <div className="t-item">
            BANKNIFTY <span style={{ color: "#ff4560" }}>▼ 47,800.10</span>
          </div>
          <div className="t-item">
            RELIANCE <span style={{ color: "#00e396" }}>▲ 2,980.50</span>
          </div>
          <div className="t-item">
            HDFC <span style={{ color: "#ff4560" }}>▼ 1,450.00</span>
          </div>
          {/* Duplicated for smooth loop */}
          <div className="t-item">
            NIFTY <span style={{ color: "#00e396" }}>▲ 22,450.00</span>
          </div>
          <div className="t-item">
            BANKNIFTY <span style={{ color: "#ff4560" }}>▼ 47,800.10</span>
          </div>
        </div>
      </div>

      <main style={{ marginTop: "40px" }}>
        <section className="p-hero">
          <div style={{ marginBottom: "4rem" }}>
            <h1
              className="p-title"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #888888 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              KITE
              <br />
              <span
                className="outline-sub"
                style={{ WebkitTextStroke: "1px rgba(0, 227, 150, 0.8)" }}
              >
                TRADING
              </span>
            </h1>
          </div>

          <div className="p-img-wrapper">
            <div className="p-img-container" style={{ background: "#090909" }}>
              <div className="terminal-layout">
                <div className="terminal-bar">
                  <div className="window-dots">
                    <div className="w-dot wd-red"></div>
                    <div className="w-dot wd-yellow"></div>
                    <div className="w-dot wd-green"></div>
                  </div>
                  <span>kite-pro-v3.0.exe</span>
                </div>

                <div className="terminal-body">
                  <div className="chart-container">
                    <canvas id="candle-canvas"></canvas>
                    <div className="chart-overlay">
                      <div className="symbol-tag">NIFTY 50</div>
                      <div className="live-price-tag">
                        {price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div
                      className={`term-toast ${toast ? "show" : ""}`}
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "50%",
                        transform: toast
                          ? "translateX(-50%) translateY(0)"
                          : "translateX(-50%) translateY(20px)",
                        background: "#222",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        opacity: toast ? 1 : 0,
                        transition: "0.3s",
                        display: "flex",
                        gap: "8px",
                        color: "white",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: toastColor }}>●</span> ORDER
                      EXECUTED
                    </div>
                  </div>

                  <div className="order-panel">
                    <div className="ob-header">
                      <span>Price</span>
                      <span>Vol</span>
                    </div>
                    <div className="ob-list">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={`ask-${i}`} className="ob-row">
                          <span className="p-ask">
                            {(22450 + i * 0.5).toFixed(2)}
                          </span>
                          <span className="vol">
                            {Math.floor(Math.random() * 500)}
                          </span>
                        </div>
                      ))}
                      {[1, 2, 3, 4].map((i) => (
                        <div key={`bid-${i}`} className="ob-row">
                          <span className="p-bid">
                            {(22450 - i * 0.5).toFixed(2)}
                          </span>
                          <span className="vol">
                            {Math.floor(Math.random() * 500)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="trade-controls">
                      <div className="trade-btns">
                        <button
                          className="t-btn t-buy mouse-hover"
                          onClick={() => executeTrade("buy")}
                        >
                          BUY
                        </button>
                        <button
                          className="t-btn t-sell mouse-hover"
                          onClick={() => executeTrade("sell")}
                        >
                          SELL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-content">
            <article className="p-desc glass-card">
              <h3>The Architecture</h3>
              <p>
                Speed is the currency of modern trading. I engineered this
                platform to handle <strong>high-frequency data streams</strong>{" "}
                with sub-millisecond latency. By leveraging WebSockets, the
                dashboard updates in real-time without polling.
              </p>
              <div className="stats-grid">
                <div>
                  <h5 style={{ color: "#666", fontSize: "0.7rem" }}>LATENCY</h5>
                  <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {"< 50ms"}
                  </span>
                </div>
                <div>
                  <h5 style={{ color: "#666", fontSize: "0.7rem" }}>RPS</h5>
                  <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    1,240
                  </span>
                </div>
                <div>
                  <h5 style={{ color: "#666", fontSize: "0.7rem" }}>UPTIME</h5>
                  <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    99.9%
                  </span>
                </div>
              </div>
              <div className="btn-group">
                <Link href="/work/kite-casestudy" className="btn mouse-hover">
                  View Case Study
                </Link>
                <a
                  href="https://swayamzerodha.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn mouse-hover"
                >
                  View Live Demo
                </a>
              </div>
            </article>

            <aside className="p-info">
              <h4>Tech Stack</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["Node.js", "Socket.io", "Redis", "MongoDB", "React 19"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="tech-pill mouse-hover"
                      style={{
                        padding: "6px 14px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {tech}
                    </span>
                  ),
                )}
              </div>
            </aside>
          </div>
          {/* --- ADDED: BOTTOM BACK BUTTON FOR WORK PAGES --- */}
            <div 
              style={{ 
                width: "100%",
                marginTop: "6rem", 
                paddingTop: "2rem",
                display: "flex", 
                justifyContent: "center",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <Link
                href="/"
                className="mouse-hover"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontFamily: "var(--font-code)",
                  fontSize: "1rem",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                 padding: "1rem 2rem", /* <-- ADDED: Space inside the button */
      border: "1px solid rgba(255, 255, 255, 0.2)", /* <-- ADDED: The visible outline */
      borderRadius: "50px", /* <-- ADDED: Rounded pill shape */
      transition: "all 0.3s ease", /* Changed to 'all' so the border animates too */
                  textTransform: "uppercase"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#fc3c44"} // Apple Music Red
                onMouseOut={(e) => e.currentTarget.style.color = "#fff"}
              >
                &larr; Back to Home
              </Link>
            </div>
        </section>
      </main>
      <ProjectsFooter currentProject="kite" />
    </>
  );
}