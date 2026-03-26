import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
// 1. Next.js Native SEO (Replaces your <SEO /> component)
export const metadata: Metadata = {
  title: "About Swayam Purwar | React Developer",
  description: "Learn more about Swayam Purwar, a BCA student and creative developer from Bhopal.",
  openGraph: {
    images: ["/assets/images/profile/swayam-purwar.webp"],
  },
};

export default function About() {


  return (
    <>
      <div className="grid-bg"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <main>
        <header className="a-hero">
          <h1 className="a-title" aria-label="The Mind Behind Swayam Purwar">
            THE MIND
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "1px white" }}>
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
              {/* Note: You can upgrade this to next/image later for even better performance! */}
              <Image
  src="/assets/images/profile/swayam-purwar.webp"
 alt="Swayam Purwar - Creative Developer based in Bhopal"
  className="profile-img"
  width={600} 
  height={800}
  priority={true} // 'priority' tells Next.js to preload this image immediately since it's "above the fold"
   className="bio-img"
/>
             
            </div>
          </div>

          <article className="bio-text">
            <div className="bio-content-wrapper">
              <p>
                Hello, I'm <strong>Swayam Purwar</strong>. A creative developer
                based in Bhopal, India.
              </p>
              <p>
                My journey started with a curiosity for how things work, leading
                me to pursue a <strong>BCA at LNCT University</strong>. I wanted
                to build interfaces that people could <em>feel</em>, not just
                use.
              </p>
              <p>
                I specialize in <strong>React and MongoDB</strong>, bridging the
                gap between powerful backend logic and fluid frontend
                interactivity.
              </p>
            </div>

            <div className="info-grid">
              <div className="info-col">
                <h3>Experience</h3>
                <div className="info-item">
                  <h4>
                    Bluestock Fintech{" "}
                    <span className="role-tag">SDE Intern</span>
                  </h4>
                  <p className="desc">
                    Contributed to core software development cycles and
                    financial API integrations.
                  </p>
                  <p className="date">Oct 2025 – Nov 2025</p>
                </div>
                <div className="info-item">
                  <h4>
                    Freelance <span className="role-tag">Creative Dev</span>
                  </h4>
                  <p className="desc">
                    Building high-performance portfolios and brand experiences
                    with 80+ Lighthouse scores.
                  </p>
                  <p className="date">2024 – Present</p>
                </div>

                <h3 style={{ marginTop: "4rem" }}>Education</h3>
                <div className="info-item">
                  <h4>LNCT University</h4>
                  <p className="desc">
                    Bachelor of Computer Applications (BCA)
                  </p>
                  <p className="date">2023 - Present (Pursuing)</p>
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
                    <span className="tech-pill mouse-hover">React</span>
                    <span className="tech-pill mouse-hover">JavaScript (ES6+)</span>
                    <span className="tech-pill mouse-hover">GSAP</span>
                    <span className="tech-pill mouse-hover">Three.js</span>
                    <span className="tech-pill mouse-hover">Node.js</span>
                    <span className="tech-pill mouse-hover">Express.js</span>
                    <span className="tech-pill mouse-hover">MongoDB</span>
                    <span className="tech-pill mouse-hover">Git & GitHub</span>
                  </div>
                </div>
                <div className="info-item">
                  <h4>Design</h4>
                  <div className="tech-container">
                    <span className="tech-pill mouse-hover">Figma</span>
                    <span className="tech-pill mouse-hover">Adobe XD</span>
                    <span className="tech-pill mouse-hover">UI/UX Principles</span>
                    <span className="tech-pill mouse-hover">Motion Design</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
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