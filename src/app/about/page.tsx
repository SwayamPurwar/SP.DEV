import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import AboutAnimations from "@/components/AboutAnimations";
import { createPageMetadata } from "@/utils/seo";
import Guestbook from "@/components/Guestbook"; // <-- 1. Import added here
import GitHubActivity from "@/components/GitHubActivity";


export const metadata: Metadata = {
  ...createPageMetadata({
    title: "About",
    description:
      "Learn more about Swayam Purwar, MCA student at SRM (KTR) Campus, Chennai, full-stack developer, and software engineer specializing in React, Next.js, Node.js, and modern web technologies.",
    path: "/about",
  }),
};

export default function About() {
  return (
    <>
      <div className="grid-bg"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <AboutAnimations />
      <main>
        <header className="a-hero">
          <h1 className="a-title" aria-label="The Mind Behind Swayam Purwar">
            THE MIND
            <br />
            <span
              style={{ color: "transparent", WebkitTextStroke: "1px white" }}
            >
              BEHIND
            </span>
          </h1>
          <p className="a-subtitle">
            I craft digital experiences where design meets logic. Driven by
            precision, powered by code.
          </p>
        </header>

        <section className="bio-section">
          <div className="bio-img-wrapper">
            <div className="bio-card">
              <Image
                src="/assets/images/profile/swayam-purwar.webp"
                alt="Swayam Purwar - Creative Developer based in Chennai"
                width={600}
                height={800}
                priority={true} 
                className="bio-img"
              />
            </div>
          </div>

          <article className="bio-text">
            <div className="bio-content-wrapper">
              <p>
                Hello, I'm <strong>Swayam Purwar</strong>, a Software Engineer
                and Full-Stack Developer based in Chennai, India. I specialize
                in building scalable web applications, real-time systems, and
                AI-powered products using modern web technologies.
              </p>

              <p>
                I am currently pursuing a{" "}
                <strong>Master of Computer Applications (MCA)</strong> at{" "}
                <strong>
                  SRM Institute of Science and Technology (KTR) Campus, Chennai
                </strong>
                . I build upon a strong foundation established during my{" "}
                <strong>Bachelor of Computer Applications (BCA)</strong> from
                LNCT University Bhopal, where I mastered core software
                engineering principles, data structures, and modern web
                technologies.
              </p>
              <p>
                My expertise lies in
                <strong>
                  {" "}
                  React.js, Next.js, Node.js, MongoDB, and JavaScript{" "}
                </strong>
                , with hands-on experience building full-stack applications,
                real-time systems, and AI-driven platforms using modern
                development practices.
              </p>

              <p>
                I enjoy solving complex problems, learning emerging
                technologies, and creating products that are performant,
                scalable, and user-focused.
              </p>
            </div>

            <div className="info-grid">
              <div className="info-col">
                <h3>Experience</h3>
              
              <div className="info-item" style={{ marginTop: "2rem" }}>
                
                  <h4>
                    Bluestock Fintech{" "}
                    <span className="role-tag">SDE Intern</span>
                  </h4>
                  <p className="desc">
                    Developed RESTful APIs, optimized database operations, and
                    contributed to fintech solutions using Node.js, Express.js,
                    and MongoDB.
                  </p>
                  <p className="date">1 Oct 2025 – 30 Nov 2025</p>
                </div>
                <div className="info-item">
                  <h4>
                    Freelance <span className="role-tag">Creative Dev</span>
                  </h4>
                  <p className="desc">
                    Designed and developed responsive web applications,
                    interactive portfolios, and business websites with a focus
                    on performance, accessibility, and user experience.
                  </p>
                  <p className="date">18 Sep 2024 – Present</p>
                    <GitHubActivity />
                </div>

                <h3 style={{ marginTop: "4rem" }}>Education</h3>
                <div className="info-item">
                  <h4>
                    SRM Institute of Science and Technology (KTR) Campus,
                    Chennai
                  </h4>
                  <p className="desc">Master of Computer Applications (MCA)</p>
                  <p className="date">2026 - 2028</p>
                </div>
                <div className="info-item">
                  <h4>LNCT University, Bhopal</h4>
                  <p className="desc">
                    Bachelor of Computer Applications (BCA)
                  </p>
                  <p className="date">CGPA: 8.21/10 | 2023 - 2026</p>
                </div>
                <div className="info-item">
                  <h4>Satya Niketan H.S. School</h4>
                  <p className="desc">Senior Secondary (XII) - Science/Maths</p>
                  <p className="date">2022 - 2023</p>
                </div>
                <div className="info-item">
                  <h4>Satya Niketan H.S. School</h4>
                  <p className="desc">Secondary (X) - All Subjects</p>
                  <p className="date">2020 - 2021</p>
                </div>
              </div>

              <div className="info-col">
                <h3>Tech Stack</h3>
                <div className="info-item">
                  <h4>Development</h4>
                  <div className="tech-container">
                    <span className="tech-pill mouse-hover">Java</span>
                    <span className="tech-pill mouse-hover">React.js</span>
                    <span className="tech-pill mouse-hover">
                      JavaScript (ES6+)
                    </span>
                    <span className="tech-pill mouse-hover">TypeScript</span>
                    <span className="tech-pill mouse-hover">Node.js</span>
                    <span className="tech-pill mouse-hover">Next.js</span>
                    <span className="tech-pill mouse-hover">Express.js</span>
                    <span className="tech-pill mouse-hover">MongoDB</span>
                    <span className="tech-pill mouse-hover">Socket.IO</span>
                    <span className="tech-pill mouse-hover">WebSockets</span>
                    <span className="tech-pill mouse-hover">GSAP</span>
                    <span className="tech-pill mouse-hover">Three.js</span>
                    <span className="tech-pill mouse-hover">
                      Deployment (Vercel, Render, Netlify)
                    </span>
                    <span className="tech-pill mouse-hover">Git & GitHub</span>
                  </div>
                </div>
                <div className="info-item">
                  <h4>Design</h4>
                  <div className="tech-container">
                    <span className="tech-pill mouse-hover">Figma</span>
                    <span className="tech-pill mouse-hover">
                      Responsive Design
                    </span>
                    <span className="tech-pill mouse-hover">
                      UI/UX Principles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* --- 2. NEW GUESTBOOK SECTION --- */}
        <section style={{ marginTop: "8rem", display: "flex", justifyContent: "center", width: "90vw", position: "relative", left: "50%", transform: "translateX(-50%)" }}>
          <Guestbook />
        </section>

        <div
          style={{
            textAlign: "center",
            marginTop: "6rem",
            paddingBottom: "4rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "6rem",
            width: "90vw",
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Link href="/" className="btn mouse-hover">
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
