"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { getDatabase, ref, onValue, off, push, serverTimestamp } from "firebase/database";

interface LogEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export default function Guestbook() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("LEAVE A TRACE ON THE SERVER.");
  
  const listRef = useRef<HTMLDivElement>(null);

  // 1. REAL-TIME LISTENER
  useEffect(() => {
    const db = getDatabase();
    const guestbookRef = ref(db, "guestbook");

    const unsubscribe = onValue(guestbookRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as any),
        }));
        // Sort newest first
        messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLogs(messages);
      }
    });

    return () => off(guestbookRef);
  }, []);

  // 2. STAGGERED ANIMATION
  useEffect(() => {
    if (listRef.current && logs.length > 0) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [logs]);

  // 3. TYPING/STATUS FLOW
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    
    setIsSubmitting(true);
    setStatusText("[ ACCESSING NODE... ]");
    
    await new Promise((r) => setTimeout(r, 800));
    setStatusText("[ ENCRYPTING PAYLOAD... ]");
    
    const db = getDatabase();
    const guestbookRef = ref(db, "guestbook");

    try {
      await push(guestbookRef, {
        name: name.trim().substring(0, 50),
        message: message.trim().substring(0, 500),
        timestamp: new Date().toISOString(),
      });

      setStatusText("[ TRANSMISSION SUCCESSFUL ]");
      setName("");
      setMessage("");
      setTimeout(() => setStatusText("LEAVE A TRACE ON THE SERVER."), 2000);
    } catch (err) {
      setStatusText("[ ERROR: TRANSMISSION FAILED ]");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="guestbook-wrapper" style={{ display: "flex", flexDirection: "column", gap: "5rem", width: "100%" }}>
      
      <div className="lux-form-card">
        <div style={{ marginBottom: "3rem" }}>
          <span className="system-tag" style={{ marginBottom: "1rem", display: "inline-block" }}>
            PUBLIC // GUESTBOOK
          </span>
          <h3 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", fontFamily: "var(--font-display)", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Leave a Trace.
          </h3>
          <p id="status-text" style={{ color: "var(--accent)", fontFamily: "var(--font-code)", marginTop: "0.8rem", fontSize: "0.9rem", letterSpacing: "1px" }}>
            {statusText}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <div className="lux-input-group">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder=" " className="lux-input mouse-hover" maxLength={50} />
            <label className="lux-label">Your Alias</label>
          </div>
          <div className="lux-input-group">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required placeholder=" " className="lux-input mouse-hover" maxLength={500} style={{ resize: "vertical" }}></textarea>
            <label className="lux-label">Transmission Payload</label>
          </div>
          <button type="submit" className="lux-submit-btn mouse-hover" disabled={isSubmitting}>
            {isSubmitting ? "TRANSMITTING..." : "EXECUTE"}
          </button>
        </form>
      </div>

      <div className="guestbook-logs scanline" ref={listRef} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {logs.map((log) => (
          <div key={log.id} className="glass-card mouse-hover" style={{ padding: "2rem" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "10px" }}>
              <span style={{ color: "white", fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: "700", letterSpacing: "-0.02em" }}>
                {log.name}
              </span>
              
              {/* UPDATED: Added Time display here */}
              <span style={{ color: "#666", fontFamily: "var(--font-code)", fontSize: "0.75rem", letterSpacing: "1px", textAlign: "right" }}>
                {new Date(log.timestamp).toLocaleDateString("en-IN", { 
                  day: "2-digit", 
                  month: "short", 
                  year: "numeric" 
                })}
                <br />
                {new Date(log.timestamp).toLocaleTimeString("en-IN", { 
                  hour: "2-digit", 
                  minute: "2-digit",
                  hour12: false
                })}
              </span>
            </div>

            <p style={{ color: "#aaa", fontFamily: "var(--font-main)", fontSize: "1.05rem", lineHeight: "1.7", margin: 0, fontWeight: 300 }}>
              {log.message}
            </p>
            
          </div>
        ))}
      </div>
      
    </div>
  );
}