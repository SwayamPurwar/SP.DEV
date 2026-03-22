import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  // 1. ALL HOOKS MUST GO AT THE VERY TOP
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  const [btnText, setBtnText] = useState("SEND MESSAGE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. LOGIC & VARIABLES
  const validWorkRoutes = [
    '/work/apple-music-casestudy', '/work/instagram-casestudy', '/work/kite-casestudy'
  ];

  const isKnownRoute = 
    path === "/" || 
    path === "/about" || 
    path === "/resume" || 
    path === "/success" || 
    validWorkRoutes.includes(path);
    
  // 3. EARLY RETURN GOES AFTER ALL HOOKS
  // Hide the global footer on About, Case Studies, Resume, Success, and 404 pages
  if (
    path === "/about" || // <-- ADDED THIS
    path === "/resume" ||
    path === "/success" ||
    path.includes("-casestudy") ||
    !isKnownRoute
  ) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnText("SENDING...");
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://submit-form.com/vPN4ntpxv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate("/success"); 
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      alert("Failed to send message. Please email me directly.");
      setBtnText("SEND MESSAGE");
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="contact">
      <div className="footer-split">
        <div className="footer-left">
          <h2 className="footer-title">
            LET'S WORK
            <br />
            TOGETHER
          </h2>
          <p>Have a project in mind? Drop me a line.</p>
          <a href="mailto:swayampurwar111104@gmail.com" className="mouse-hover contact-email">
            hello@swayam.dev
          </a>
        </div>

        <div className="footer-right">
          <form onSubmit={handleSubmit} id="portfolio-form">
            <input type="hidden" name="_next" value="/success" />
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required placeholder="Your Name" autoComplete="name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="Your Email" autoComplete="email" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required placeholder="Tell me about your project"></textarea>
            </div>
            <button type="submit" className="submit-btn mouse-hover" disabled={isSubmitting}>
              {btnText}
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; <span id="year">{currentYear}</span> Swayam Purwar.</span>
        <div className="socials">
          <a href="https://www.instagram.com/swayam_purwar" target="_blank" rel="noopener noreferrer" className="mouse-hover">Instagram</a> &bull;{" "}
          <a href="https://www.linkedin.com/in/swayam-purwar" target="_blank" rel="noopener noreferrer" className="mouse-hover">LinkedIn</a> &bull;{" "}
          <a href="https://github.com/SwayamPurwar" target="_blank" rel="noopener noreferrer" className="mouse-hover">GitHub</a>
        </div>
      </div>
    </footer>
  );
}