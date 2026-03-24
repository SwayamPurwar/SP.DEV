import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../../components/SEO";
import CaseStudyFooter from "../../components/CaseStudyFooter";
gsap.registerPlugin(ScrollTrigger);

export default function KiteCaseStudy() {
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState("architecture");
  const [orders, setOrders] = useState([]);

  // Simulate live order flow in the terminal
  useEffect(() => {
    const symbols = ["NIFTY", "RELIANCE", "HDFC", "TCS", "INFY"];
    const types = ["BUY", "SELL"];

    const interval = setInterval(() => {
      setOrders((prev) => {
        const newOrder = {
          id: Math.random().toString(36).substring(7).toUpperCase(),
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          type: types[Math.floor(Math.random() * types.length)],
          price: (Math.random() * 3000 + 1000).toFixed(2),
          qty: Math.floor(Math.random() * 500 + 1),
          time: new Date().toISOString().substring(11, 19),
        };
        // Keep only the last 8 orders to prevent overflow
        return [newOrder, ...prev].slice(0, 8);
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Animations
      gsap.fromTo(
        ".cs-title",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.4,
          clearProps: "all",
        },
      );

      gsap.fromTo(
        ".cs-meta",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.6,
          clearProps: "all",
        },
      );

      // 2. Scroll Triggers for Chapters
      const scrollTimer = setTimeout(() => {
        ScrollTrigger.refresh();

        gsap.utils.toArray(".chapter").forEach((chapter) => {
          gsap.fromTo(
            chapter,
            { y: 50, opacity: 0 },
            {
              scrollTrigger: {
                trigger: chapter,
                start: "top 85%",
              },
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              clearProps: "all",
            },
          );
        });
      }, 500);

      // 3. Setup Intersection Observer for the Sidebar TOC
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: "-20% 0px -70% 0px" },
      );

      document.querySelectorAll(".chapter").forEach((section) => {
        observer.observe(section);
      });

      return () => {
        clearTimeout(scrollTimer);
        observer.disconnect();
      };
    }, containerRef);

    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title="Kite Trading Architecture | Engineering Deep Dive"
        description="Deep dive into the high-frequency trading architecture of the Kite clone."
      />
      <div ref={containerRef}>
        <div className="grid-bg"></div>

        <header
          className="cs-hero"
          style={{ borderBottom: "none", paddingBottom: "5vh" }}
        >
          <h1
            className="cs-title"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #888888 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            KITE ENGINE
            <br />
            <span
              className="outline-sub"
              style={{ WebkitTextStroke: "1px #00E396", color: "transparent" }}
            >
              ARCHITECTURE
            </span>
          </h1>
          <div className="cs-meta">
            <div className="meta-item">
              <h4>Latency</h4>
              <p>{"< 50ms"}</p>
            </div>
            <div className="meta-item">
              <h4>Role</h4>
              <p>Systems Engineer</p>
            </div>
            <div className="meta-item">
              <h4>Focus</h4>
              <p>WebSockets & Redis</p>
            </div>
            <div className="meta-item">
              <h4>Stack</h4>
              <p>MERN + Socket.io</p>
            </div>
          </div>
        </header>

        {/* Technical Layout: Sidebar + Content */}
        <div className="case-layout">
          {/* Table of Contents Sidebar */}
          <aside className="toc-sidebar">
            <a
              href="#architecture"
              onClick={(e) => scrollToSection(e, "architecture")}
              className={`toc-link ${activeSection === "architecture" ? "active" : ""}`}
            >
              01. The Architecture
            </a>
            <a
              href="#execution"
              onClick={(e) => scrollToSection(e, "execution")}
              className={`toc-link ${activeSection === "execution" ? "active" : ""}`}
            >
              02. Order Execution
            </a>
            <a
              href="#data"
              onClick={(e) => scrollToSection(e, "data")}
              className={`toc-link ${activeSection === "data" ? "active" : ""}`}
            >
              03. Data Firehose
            </a>
          </aside>

          {/* Main Content Area */}
          <div className="content-area">
            {/* CHAPTER 1 */}
            <section id="architecture" className="chapter">
              <h2>
                <span>01 //</span> The Architecture
              </h2>
              <p
                style={{
                  color: "#b0b0b0",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                }}
              >
                Financial applications cannot rely on standard HTTP
                request/response cycles. If a user has to refresh the page to
                see a price change, the platform is already obsolete.
              </p>
              <p
                style={{
                  color: "#b0b0b0",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                }}
              >
                I designed a highly concurrent architecture using Node.js for
                the main server, Redis for fast in-memory pub/sub message
                brokering, and WebSockets (Socket.io) to push binary market data
                directly to the React client.
              </p>

              <div className="arch-diagram">
                <div className="arch-node" style={{ borderColor: "#00E396" }}>
                  React Client
                  <br />
                  <span style={{ fontSize: "0.7rem", color: "#888" }}>
                    UI / Charting
                  </span>
                </div>
                <div className="arch-arrow">⟷</div>
                <div className="arch-node">
                  Node.js API
                  <br />
                  <span style={{ fontSize: "0.7rem", color: "#888" }}>
                    Socket.io Server
                  </span>
                </div>
                <div className="arch-arrow">⟷</div>
                <div className="arch-node" style={{ borderColor: "#ff4560" }}>
                  Redis
                  <br />
                  <span style={{ fontSize: "0.7rem", color: "#888" }}>
                    Pub/Sub Broker
                  </span>
                </div>
              </div>
            </section>

            {/* CHAPTER 2 */}
            <section id="execution" className="chapter">
              <h2>
                <span>02 //</span> Order Execution
              </h2>
              <p
                style={{
                  color: "#b0b0b0",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                }}
              >
                When a user places a trade, speed and reliability are paramount.
                The order is instantly validated on the backend and pushed to
                the matching engine.
              </p>

              {/* Code Window */}
              <div className="code-window">
                <div className="cw-header">
                  <span style={{ color: "#666" }}>orderService.js</span>
                </div>
                <div className="cw-body">
                  <span style={{ color: "#c678dd" }}>const</span> processOrder ={" "}
                  <span style={{ color: "#c678dd" }}>async</span> (orderData)
                  =&gt; {"{"}
                  <span style={{ color: "#5c6370" }}>
                    // 1. Validate margin
                  </span>
                  <span style={{ color: "#c678dd" }}>const</span> user ={" "}
                  <span style={{ color: "#c678dd" }}>await</span>{" "}
                  User.findById(orderData.userId);
                  <span style={{ color: "#c678dd" }}>if</span> (user.margin &lt;
                  orderData.requiredMargin) {"{"}
                  <span style={{ color: "#c678dd" }}>throw new</span>{" "}
                  <span style={{ color: "#e5c07b" }}>Error</span>(
                  <span style={{ color: "#98c379" }}>'Insufficient Funds'</span>
                  );
                  {"}"}
                  <span style={{ color: "#5c6370" }}>
                    // 2. Publish to Redis Queue for Matching Engine
                  </span>
                  <span style={{ color: "#c678dd" }}>await</span>{" "}
                  redisClient.publish(
                  <span style={{ color: "#98c379" }}>'order_channel'</span>,{" "}
                  <span style={{ color: "#56b6c2" }}>JSON</span>
                  .stringify(orderData));
                  <span style={{ color: "#5c6370" }}>
                    // 3. Acknowledge receipt to client instantly
                  </span>
                  <span style={{ color: "#c678dd" }}>return</span> {"{"} status:{" "}
                  <span style={{ color: "#98c379" }}>'PENDING'</span>, orderId:
                  orderData.id {"}"};{"}"};
                </div>
              </div>

              {/* Live Terminal Simulation */}
              <div className="live-terminal">
                <div className="lt-header">Live Order Firehose (Simulated)</div>
                <div className="lt-body">
                  <div className="lt-order">
                    {orders.map((order, idx) => (
                      <div
                        key={idx}
                        className="eo-row"
                        style={{ opacity: 1 - idx * 0.1 }}
                      >
                        <span style={{ color: "#555" }}>[{order.time}]</span>
                        <span style={{ color: "#a855f7" }}>{order.id}</span>
                        <span
                          style={{
                            color: order.type === "BUY" ? "#00E396" : "#ff4560",
                          }}
                        >
                          {order.type}
                        </span>
                        <span style={{ color: "#fff" }}>{order.symbol}</span>
                        <span>
                          {order.qty} @ {order.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CHAPTER 3 */}
            <section id="data" className="chapter">
              <h2>
                <span>03 //</span> The Data Firehose
              </h2>
              <p
                style={{
                  color: "#b0b0b0",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                }}
              >
                Rendering thousands of data points on a frontend chart (like
                TradingView or custom Canvas charts) causes massive DOM
                bottlenecking if done incorrectly.
              </p>
              <p style={{ color: "#b0b0b0", lineHeight: 1.8 }}>
                To solve this, I completely bypassed React's standard rendering
                cycle for the charts. Instead, incoming socket data is fed
                directly into a raw HTML5 `&lt;canvas&gt;` context. This ensures
                steady 60FPS animations even when the market is highly volatile
                and receiving hundreds of ticks per second.
              </p>
            </section>
          </div>
        </div>
        <div className="cs-content" style={{ paddingBottom: 0, paddingTop: 0 }}>
          <div 
            style={{ 
              marginTop: "4rem", 
              paddingTop: "2rem",
              display: "flex", 
              justifyContent: "center", 
              borderTop: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <Link
              to="/work/kite"
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
                transition: "color 0.3s ease",
                textTransform: "uppercase"
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "#00E396"} // Kite Green
              onMouseOut={(e) => e.currentTarget.style.color = "#fff"}
            >
              &larr; Back to Overview
            </Link>
          </div>
        </div>
        <CaseStudyFooter currentProject="kite" />
      </div>
    </>
  );
}
