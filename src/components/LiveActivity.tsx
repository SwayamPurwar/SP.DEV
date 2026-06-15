import React from "react";

async function getLatestCommit() {
  const username = "swayampurwar"; 
  
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public`,
      {
        next: { revalidate: 3600 }, 
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!res.ok) return null;

    const events = await res.json();
    if (!Array.isArray(events)) return null;

    const pushEvent = events.find((event: any) => event.type === "PushEvent");
    if (!pushEvent) return null;

    const repoName = pushEvent.repo.name;
    const commitMessage = pushEvent.payload?.commits?.[0]?.message || "Pushed updates to repository";
    const commitSha = pushEvent.payload?.commits?.[0]?.sha || pushEvent.payload?.head || "";
    const shortSha = commitSha ? commitSha.substring(0, 7) : "";
    
    const branch = pushEvent.payload?.ref?.replace("refs/heads/", "") || "main";
    const commitCount = pushEvent.payload?.size || 1;

    return {
      repo: repoName,
      message: commitMessage,
      url: commitSha ? `https://github.com/${repoName}/commit/${commitSha}` : `https://github.com/${repoName}`,
      date: pushEvent.created_at,
      branch: branch,
      shortSha: shortSha,
      commitCount: commitCount
    };
  } catch (error) {
    return null;
  }
}

export default async function LiveActivity() {
  const commit = await getLatestCommit();

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
      <div style={{
        position: "absolute",
        top: "-20%", right: "-10%",
        width: "150px", height: "150px",
        background: "radial-gradient(circle, rgba(46,160,67,0.15) 0%, transparent 70%)",
        filter: "blur(20px)",
        zIndex: 0,
        pointerEvents: "none"
      }}></div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem", position: "relative", zIndex: 1 }}>
        <div 
          className={commit ? "live-indicator" : ""}
          style={{ 
            width: "8px", 
            height: "8px", 
            borderRadius: "50%", 
            backgroundColor: commit ? "#2ea043" : "#8b949e", 
            boxShadow: commit ? "0 0 10px #2ea043" : "none",
          }} 
        />
        <h4 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          Live Activity
        </h4>
      </div>
      
      {commit ? (
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="desc" style={{ marginBottom: "0.8rem", fontSize: "0.95rem" }}>
            Pushed to{" "}
            <a 
              href={`https://github.com/${commit.repo}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: "#58a6ff", textDecoration: "none", fontWeight: 500 }}
            >
              {commit.repo}
            </a>
          </p>
          
          <a 
            href={commit.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ textDecoration: "none" }}
          >
            {/* Swapped inline JS hover for a CSS class */}
            <div 
              className="github-commit-box"
              style={{ 
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderLeft: "3px solid #2ea043", 
                padding: "0.8rem 1rem", 
                borderRadius: "6px",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontFamily: "monospace", color: "#e6edf3", fontSize: "0.85rem", lineHeight: "1.4", marginBottom: "0.8rem" }}>
                {commit.message}
              </div>

              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "0.75rem", fontFamily: "monospace" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(88,166,255,0.1)", color: "#58a6ff", padding: "3px 8px", borderRadius: "4px", border: "1px solid rgba(88,166,255,0.2)" }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM3.5 3.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z"></path></svg>
                  {commit.branch}
                </span>

                {commit.shortSha && (
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32Zm-1.43-.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path></svg>
                    {commit.shortSha}
                  </span>
                )}

                {commit.commitCount > 1 && (
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>
                    +{commit.commitCount - 1} more commit{commit.commitCount > 2 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </a>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.2rem" }}>
            <p className="date" style={{ margin: 0, fontSize: "0.8rem", opacity: 0.7 }}>
              {new Date(commit.date).toLocaleString(undefined, { 
                dateStyle: "medium", 
                timeStyle: "short" 
              })}
            </p>
            <a 
              href="https://github.com/swayampurwar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-profile-link"
              style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s ease" }}
            >
              View Profile &rarr;
            </a>
          </div>
        </div>
      ) : (
        <div className="desc" style={{ marginTop: "0.5rem", position: "relative", zIndex: 1 }}>
          <p style={{ marginBottom: "0.5rem" }}>Catching up on recent code...</p>
          <a 
            href="https://github.com/SwayamPurwar?tab=repositories" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: "#58a6ff", textDecoration: "none" }}
          >
            View repositories &rarr;
          </a>
        </div>
      )}
    </div>
  );
}