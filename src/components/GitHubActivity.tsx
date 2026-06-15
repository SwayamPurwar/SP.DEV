import React from "react";

async function getLatestCommit() {
  const username = "swayampurwar"; 
  
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public`,
      {
        // Force fresh fetch so we don't see a cached error
        cache: "no-store", 
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Use token if available
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!res.ok) {
      return { error: `HTTP ${res.status}: ${res.statusText}. Double-check your GITHUB_TOKEN in .env.local and ensure you restarted the server.` };
    }

    const events = await res.json();
    
    if (!Array.isArray(events)) {
      return { error: `API Limit or Error: ${events.message || "Unknown response"}` };
    }

    const pushEvent = events.find((event: any) => 
      event.type === "PushEvent" && event.payload?.commits?.length > 0
    );

    if (!pushEvent) {
      return { error: "API succeeded, but no recent commits found in the last 90 days." };
    }

    const repoName = pushEvent.repo.name;
    const commit = pushEvent.payload.commits[0]; 

    return {
      repo: repoName,
      message: commit.message,
      url: `https://github.com/${repoName}/commit/${commit.sha}`,
      date: pushEvent.created_at,
    };
  } catch (error: any) {
    return { error: `App Crash: ${error.message}` };
  }
}

export default async function GitHubActivity() {
  const data = await getLatestCommit();

  // Check if we successfully got a repo back without errors
  const isSuccess = data && !data.error && data.repo;

  return (
    <div 
      className="info-item" 
      style={{ 
        marginTop: "2.5rem",
        padding: "1.5rem",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Ambient glow (Red for error, Green for success) */}
      <div style={{
        position: "absolute",
        top: "-20%", right: "-10%",
        width: "150px", height: "150px",
        background: isSuccess ? "radial-gradient(circle, rgba(46,160,67,0.15) 0%, transparent 70%)" : "radial-gradient(circle, rgba(248,81,73,0.15) 0%, transparent 70%)",
        filter: "blur(20px)",
        zIndex: 0,
        pointerEvents: "none"
      }}></div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem", position: "relative", zIndex: 1 }}>
        <div 
          className={isSuccess ? "live-indicator" : ""}
          style={{ 
            width: "8px", 
            height: "8px", 
            borderRadius: "50%", 
            backgroundColor: isSuccess ? "#2ea043" : "#f85149", 
            boxShadow: isSuccess ? "0 0 10px #2ea043" : "none",
          }} 
        />
        <h4 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          Live Activity
        </h4>
      </div>
      
      {isSuccess ? (
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="desc" style={{ marginBottom: "0.8rem", fontSize: "0.95rem" }}>
            Pushed to{" "}
            <a href={`https://github.com/${data.repo}`} target="_blank" rel="noopener noreferrer" style={{ color: "#58a6ff", textDecoration: "none", fontWeight: 500 }}>
              {data.repo}
            </a>
          </p>
          <a href={data.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} className="mouse-hover">
            <div style={{ background: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: "3px solid #2ea043", padding: "0.8rem 1rem", borderRadius: "6px", fontFamily: "monospace", color: "#e6edf3", fontSize: "0.85rem", lineHeight: "1.4", transition: "all 0.2s ease" }}>
              {data.message}
            </div>
          </a>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.2rem" }}>
            <p className="date" style={{ margin: 0, fontSize: "0.8rem", opacity: 0.7 }}>
              {new Date(data.date as string).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            </p>
            <a href="https://github.com/swayampurwar" target="_blank" rel="noopener noreferrer" className="mouse-hover" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
              View Profile &rarr;
            </a>
          </div>
        </div>
      ) : (
        <div className="desc" style={{ marginTop: "0.5rem", position: "relative", zIndex: 1 }}>
          {/* THE ON-SCREEN DEBUG BOX */}
          <div style={{ background: "rgba(248, 81, 73, 0.1)", border: "1px solid rgba(248, 81, 73, 0.4)", color: "#ff7b72", padding: "0.8rem", borderRadius: "6px", fontFamily: "monospace", fontSize: "0.8rem", marginBottom: "1rem" }}>
            <strong>Debug Info:</strong> {data?.error || "Component is not receiving data."}
          </div>
          <a href="https://github.com/SwayamPurwar?tab=repositories" target="_blank" rel="noopener noreferrer" style={{ color: "#58a6ff", textDecoration: "none" }}>
            View repositories &rarr;
          </a>
        </div>
      )}
    </div>
  );
}