import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import ScrollToTop from "./components/ScrollToTop";

// Modules
import { initAudio } from "./utils/audio-system.js";
import { initAnimations } from "./utils/animations.js";
import { initUtils } from "./utils/utils.js";
import { initEasterEggs } from "./utils/easter-eggs.js";
import { initTerminal } from "./utils/terminal.js";

// 🚀 LAZY LOADED PAGES
import Home from "./pages/Home";
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Resume = lazy(() => import("./pages/Resume"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Success = lazy(() => import("./pages/Success"));
const AppleMusic = lazy(() => import("./pages/work/AppleMusic"));
const Instagram = lazy(() => import("./pages/work/Instagram"));
const Kite = lazy(() => import("./pages/work/Kite"));
const CodeSenseAiSaas = lazy(() => import("./pages/work/CodeSenseAiSaas.jsx"));
const AppleMusicCaseStudy = lazy(
  () => import("./pages/work/AppleMusicCaseStudy"),
);
const InstagramCaseStudy = lazy(
  () => import("./pages/work/InstagramCaseStudy"),
);
const KiteCaseStudy = lazy(() => import("./pages/work/KiteCaseStudy"));

const PageLoader = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#050505",
      color: "#fff",
      fontFamily: "Fira Code",
    }}
  >
    Loading module...
  </div>
);

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    initAudio();
    const cleanupAnimations = initAnimations();
    const cleanupUtils = initUtils();
    const cleanupEasterEggs = initEasterEggs();

    // Timer ensures the DOM is fully painted before the terminal script searches for it
    const timer = setTimeout(() => {
      initTerminal();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupAnimations?.();
      cleanupUtils?.();
      cleanupEasterEggs?.();
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <PageTransition />

      <div id="ambient-glow" aria-hidden="true"></div>
      <div id="cursor" aria-hidden="true"></div>

      {/* --- GOD MODE TERMINAL HTML --- */}
     <div id="cmd-terminal" aria-hidden="true" inert="">
        <div className="cmd-header">
          <span>SWAYAM.OS [VERSION 1.0.0]</span>
          <span>ADMIN ACCESS: GRANTED</span>
          <span
            id="cmd-close-mobile"
            onClick={() =>
              document.getElementById("cmd-terminal").classList.remove("active")
            }
            style={{ cursor: "pointer" }}
          >
            X
          </span>
        </div>
        <div id="cmd-output" className="cmd-output">
          <div>
            Welcome to S.A.M. Terminal. Type 'help' to see available commands.
          </div>
        </div>
        <div className="cmd-input-line">
          <span className="cmd-prompt">user@swayam:~$</span>
          <input
            type="text"
            id="cmd-input"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
      {/* ------------------------------ */}

      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/success" element={<Success />} />
          <Route path="/work/apple-music" element={<AppleMusic />} />
          <Route path="/work/instagram" element={<Instagram />} />
          <Route path="/work/kite" element={<Kite />} />
          <Route path="/work/CodeSenseAiSaas" element={<CodeSenseAiSaas />} />
          <Route
            path="/work/apple-music-casestudy"
            element={<AppleMusicCaseStudy />}
          />
          <Route
            path="/work/instagram-casestudy"
            element={<InstagramCaseStudy />}
          />
          <Route path="/work/kite-casestudy" element={<KiteCaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
}

export default App;