import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Success() {
  const navigate = useNavigate();
  // 1. Create a state variable to track the countdown
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 2. Use setInterval to decrease the number every 1000ms (1 second)
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        // If we reach 1, clear the timer and redirect
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        // Otherwise, subtract 1 from the countdown
        return prevCount - 1;
      });
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <>
      <SEO
        title="Message Sent"
        description="Your message has been successfully sent to Swayam Purwar."
      />

      <main
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: "#050505",
          color: "#fff",
          padding: "20px",
        }}
      >
        <div className="success-content" style={{ maxWidth: "600px" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              marginBottom: "1.5rem",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            MESSAGE RECEIVED.
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.1rem",
              marginBottom: "2.5rem",
              lineHeight: "1.6",
            }}
          >
            Thank you for reaching out. Your transmission has been successfully
            encrypted and sent. I'll get back to you as soon as possible.
          </p>

          <div style={{ marginBottom: "2rem" }}>
            <span
              style={{
                fontSize: "0.9rem",
                color: "#6366f1",
                fontFamily: "Fira Code, monospace",
              }}
            >
              {/* 3. Use the state variable here to show the live countdown */}
              REDIRECTING TO TERMINAL IN {countdown} SECOND
              {countdown !== 1 ? "S" : ""}...
            </span>
          </div>

          <Link
            to="/"
            className="mouse-hover"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              border: "1px solid #334155",
              borderRadius: "100px",
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
              transition: "all 0.3s ease",
              background: "rgba(255, 255, 255, 0.05)",
            }}
          >
            RETURN IMMEDIATELY
          </Link>
        </div>
      </main>
    </>
  );
}
