"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SummaryResponse = {
  ok: boolean;
  totalEvents: number;
  uniquePaths: number;
  eventCounts: Record<string, number>;
  topProjects: Array<{ title: string; clicks: number }>;
  contactConversion: {
    attempts: number;
    success: number;
    failure: number;
    successRate: number;
  };
  recentEvents: Array<{
    id: string;
    event: string;
    path: string;
    timestamp: number;
    props: Record<string, string | number | boolean>;
  }>;
};

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "18px",
  padding: "1.25rem",
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
};

const statValueStyle: React.CSSProperties = {
  fontSize: "clamp(1.5rem, 4vw, 2rem)", // Scales down on smaller screens
  margin: "0.45rem 0 0",
  letterSpacing: "0.5px",
  fontFamily: "var(--font-display)",
};

function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return "-";

  const deltaSeconds = Math.floor((Date.now() - timestamp) / 1000);
  if (deltaSeconds < 60) return `${deltaSeconds}s ago`;

  const deltaMinutes = Math.floor(deltaSeconds / 60);
  if (deltaMinutes < 60) return `${deltaMinutes}m ago`;

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) return `${deltaHours}h ago`;

  const deltaDays = Math.floor(deltaHours / 24);
  return `${deltaDays}d ago`;
}

export default function AnalyticsAdminPage() {
  const router = useRouter();
  const [dashboardKey, setDashboardKey] = useState("");
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [activeEventFilter, setActiveEventFilter] = useState<string>("all");
  const [lastLoadedAt, setLastLoadedAt] = useState<number | null>(null);

  const sortedEventCounts = useMemo(() => {
    if (!summary) return [] as Array<[string, number]>;
    return Object.entries(summary.eventCounts).sort((a, b) => b[1] - a[1]);
  }, [summary]);

  const maxEventCount = useMemo(() => {
    if (!sortedEventCounts.length) return 1;
    return sortedEventCounts[0][1] || 1;
  }, [sortedEventCounts]);

  const filteredRecentEvents = useMemo(() => {
    if (!summary) return [];
    if (activeEventFilter === "all") return summary.recentEvents;
    return summary.recentEvents.filter((event) => event.event === activeEventFilter);
  }, [summary, activeEventFilter]);

  const handleLoad = async (event?: FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analytics/summary", {
        method: "GET",
        headers: {
          "x-dashboard-key": dashboardKey,
        },
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Unable to load analytics");
      }

      const payload = (await response.json()) as SummaryResponse;
      setSummary(payload);
      setLastLoadedAt(Date.now());

      if (activeEventFilter !== "all" && !payload.eventCounts[activeEventFilter]) {
        setActiveEventFilter("all");
      }
    } catch (loadError) {
      setSummary(null);
      setError(loadError instanceof Error ? loadError.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "70vh",
        padding: "clamp(5rem, 10vh, 7rem) 1.25rem 3rem", // Responsive padding
        width: "min(1100px, 100vw)",
        margin: "0 auto",
        overflowX: "hidden", // Prevents horizontal scroll on mobile
      }}
    >
      <section
        style={{
          ...cardStyle,
          marginBottom: "1rem",
          background:
            "radial-gradient(circle at 0% 0%, rgba(191,165,216,0.24), transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p
              style={{
                margin: 0,
                color: "#bfa5d8",
                fontFamily: "var(--font-code)",
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                fontSize: "0.78rem",
              }}
            >
              SP.DEV Metrics Console
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 5vw, 2.2rem)", margin: "0.4rem 0" }}>
              Analytics Dashboard
            </h1>
            <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.95rem" }}>
              Track project interest, CTA performance, and contact funnel health.
            </p>
          </div>
          <div style={{ color: "#9ca3af", fontFamily: "var(--font-code)", fontSize: "0.85rem", width: "100%", textAlign: "left", opacity: 0.8 }}>
            {lastLoadedAt ? `Last refresh: ${new Date(lastLoadedAt).toLocaleTimeString()}` : "No data loaded"}
          </div>
        </div>
      </section>

      <form onSubmit={handleLoad} style={{ ...cardStyle, display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "stretch" }}>
        <div style={{ flex: "1 1 100%", display: "flex", gap: "0.55rem" }}>
          <input
            type={showKey ? "text" : "password"}
            value={dashboardKey}
            onChange={(e) => setDashboardKey(e.target.value)}
            placeholder="Enter dashboard key"
            autoComplete="off"
            style={{
              flex: 1,
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              color: "white",
              padding: "0.75rem 0.9rem",
              fontFamily: "var(--font-code)",
              minWidth: 0, // Prevents flex blowout on small screens
            }}
          />
          <button
            type="button"
            onClick={() => setShowKey((value) => !value)}
            style={{
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
              color: "#d1d5db",
              padding: "0.75rem 0.9rem",
              fontFamily: "var(--font-code)",
              cursor: "pointer",
            }}
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading || !dashboardKey}
          style={{
            flex: "1 1 auto",
            borderRadius: "12px",
            border: "1px solid rgba(191,165,216,0.55)",
            background: "linear-gradient(90deg, rgba(191,165,216,0.35), rgba(191,165,216,0.2))",
            color: "white",
            padding: "0.75rem 1.1rem",
            fontFamily: "var(--font-code)",
            cursor: loading ? "not-allowed" : "pointer",
            minHeight: "44px", // Better mobile touch target
          }}
        >
          {loading ? "Loading..." : "Load Analytics"}
        </button>
        {summary ? (
          <button
            type="button"
            onClick={() => void handleLoad()}
            disabled={loading}
            style={{
              flex: "1 1 auto",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              padding: "0.75rem 1.1rem",
              fontFamily: "var(--font-code)",
              cursor: loading ? "not-allowed" : "pointer",
              minHeight: "44px", // Better mobile touch target
            }}
          >
            Refresh
          </button>
        ) : null}
      </form>

      {error ? (
        <p style={{ color: "#f87171", marginTop: "0.9rem", fontFamily: "var(--font-code)", padding: "0 1rem" }}>{error}</p>
      ) : null}

      {loading && !summary ? (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", // Responsive loading grid
            gap: "0.9rem",
            marginTop: "1.1rem",
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{ ...cardStyle, minHeight: "120px", opacity: 0.65 }}>
              <div style={{ width: "40%", height: "10px", background: "rgba(255,255,255,0.15)", borderRadius: "10px" }}></div>
              <div style={{ width: "65%", height: "26px", background: "rgba(255,255,255,0.12)", borderRadius: "10px", marginTop: "1rem" }}></div>
            </div>
          ))}
        </section>
      ) : null}

      {summary ? (
        <>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", // Responsive stat cards
              gap: "0.9rem",
              marginTop: "1.1rem",
            }}
          >
            <div style={cardStyle}>
              <p style={{ color: "#9ca3af", margin: 0 }}>Total Events</p>
              <h2 style={statValueStyle}>{summary.totalEvents}</h2>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#9ca3af", margin: 0 }}>Unique Paths</p>
              <h2 style={statValueStyle}>{summary.uniquePaths}</h2>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#9ca3af", margin: 0 }}>Contact Success Rate</p>
              <h2 style={statValueStyle}>
                {summary.contactConversion.successRate}%
              </h2>
              <p style={{ margin: "0.35rem 0 0", color: "#9ca3af", fontSize: "0.9rem" }}>
                {summary.contactConversion.success} success / {summary.contactConversion.attempts} attempts
              </p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#9ca3af", margin: 0 }}>Failed Submissions</p>
              <h2 style={statValueStyle}>{summary.contactConversion.failure}</h2>
              <p style={{ margin: "0.35rem 0 0", color: "#9ca3af", fontSize: "0.9rem" }}>
                Contact failures from network/server events
              </p>
            </div>
          </section>

          {/* This grid previously used rigid fr units, now wraps nicely on mobile */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: "0.9rem", marginTop: "0.9rem" }}>
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, fontSize: "1.25rem" }}>Event Breakdown</h3>
              {sortedEventCounts.length === 0 ? (
                <p style={{ color: "#9ca3af", marginBottom: 0 }}>No events available.</p>
              ) : (
                <div style={{ display: "grid", gap: "0.55rem" }}>
                  {sortedEventCounts.map(([eventName, count]) => (
                    <button
                      key={eventName}
                      onClick={() => setActiveEventFilter(eventName)}
                      style={{
                        border: "1px solid rgba(255,255,255,0.1)",
                        background:
                          activeEventFilter === eventName
                            ? "rgba(191,165,216,0.2)"
                            : "rgba(255,255,255,0.03)",
                        borderRadius: "12px",
                        padding: "0.75rem", // Increased touch target padding
                        cursor: "pointer",
                        textAlign: "left",
                        color: "white",
                        marginTop: 20,
                        minHeight: "44px", // Minimum mobile tap size
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <span style={{ fontFamily: "var(--font-code)", fontSize: "0.82rem", wordBreak: "break-all" }}>{eventName}</span>
                        <span style={{ color: "#d1d5db", fontSize: "0.82rem" }}>{count}</span>
                      </div>
                      <div
                        style={{
                          height: "8px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.1)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(8, (count / maxEventCount) * 100)}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, rgba(191,165,216,0.9), rgba(191,165,216,0.5))",
                          }}
                        ></div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, fontSize: "1.25rem" }}>Top Projects</h3>
              {summary.topProjects.length === 0 ? (
                <p style={{ color: "#9ca3af", marginBottom: 0 }}>No project clicks yet.</p>
              ) : (
                <div style={{ display: "grid", gap: "0.55rem" }}>
                  {summary.topProjects.map((project, index) => (
                    <div
                      key={project.title}
                      style={{
                        padding: "0.75rem 0.85rem", // Better padding for touch
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginTop: 20,
                      }}
                    >
                      <span style={{ color: "#bfa5d8", fontFamily: "var(--font-code)", minWidth: "2ch" }}>
                        #{index + 1}
                      </span>
                      <span style={{ flex: 1, fontSize: "0.92rem", lineHeight: "1.3" }}>{project.title}</span>
                      <span style={{ color: "#d1d5db", fontFamily: "var(--font-code)" }}>{project.clicks}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section style={{ ...cardStyle, marginTop: "0.9rem", padding: "1.25rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", padding: "0 1.25rem 1rem" }}>
              <h3 style={{ marginTop: 0, marginBottom: 0, fontSize: "1.25rem" }}>Recent Events</h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => setActiveEventFilter("all")}
                  style={{
                    borderRadius: "999px",
                    padding: "0.45rem 0.8rem", // Increased touch target
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: activeEventFilter === "all" ? "rgba(191,165,216,0.2)" : "transparent",
                    color: "white",
                    fontFamily: "var(--font-code)",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  All
                </button>
                {sortedEventCounts.slice(0, 3).map(([eventName]) => (
                  <button
                    key={eventName}
                    onClick={() => setActiveEventFilter(eventName)}
                    style={{
                      borderRadius: "999px",
                      padding: "0.45rem 0.8rem", // Increased touch target
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: activeEventFilter === eventName ? "rgba(191,165,216,0.2)" : "transparent",
                      color: "white",
                      fontFamily: "var(--font-code)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                    }}
                  >
                    {eventName.length > 15 ? eventName.substring(0, 15) + "..." : eventName}
                  </button>
                ))}
              </div>
            </div>

            {filteredRecentEvents.length === 0 ? (
              <p style={{ color: "#9ca3af", padding: "0 1.25rem" }}>
                No events found for this filter yet.
              </p>
            ) : null}

            <div style={{ overflowX: "auto", padding: "0 1.25rem", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.65rem 0.45rem", color: "#9ca3af", fontSize: "0.85rem" }}>Time</th>
                    <th style={{ textAlign: "left", padding: "0.65rem 0.45rem", color: "#9ca3af", fontSize: "0.85rem" }}>Event</th>
                    <th style={{ textAlign: "left", padding: "0.65rem 0.45rem", color: "#9ca3af", fontSize: "0.85rem" }}>Path</th>
                    <th style={{ textAlign: "left", padding: "0.65rem 0.45rem", color: "#9ca3af", fontSize: "0.85rem" }}>Props</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecentEvents.map((eventItem) => (
                    <tr key={eventItem.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <td style={{ padding: "0.65rem 0.45rem", color: "#d1d5db", verticalAlign: "top" }}>
                        {eventItem.timestamp ? (
                          <>
                            <div style={{ fontSize: "0.9rem" }}>{new Date(eventItem.timestamp).toLocaleDateString()}</div>
                            <div style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: "0.2rem" }}>
                              {formatRelativeTime(eventItem.timestamp)}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ padding: "0.65rem 0.45rem", fontFamily: "var(--font-code)", verticalAlign: "top" }}>
                        <span
                          style={{
                            background: "rgba(191,165,216,0.14)",
                            border: "1px solid rgba(191,165,216,0.45)",
                            borderRadius: "999px",
                            padding: "0.25rem 0.65rem",
                            display: "inline-block",
                            fontSize: "0.85rem",
                            wordBreak: "break-word"
                          }}
                        >
                          {eventItem.event}
                        </span>
                      </td>
                      <td style={{ padding: "0.65rem 0.45rem", color: "#d1d5db", fontSize: "0.9rem", verticalAlign: "top", wordBreak: "break-word" }}>{eventItem.path}</td>
                      <td style={{ padding: "0.65rem 0.45rem", color: "#9ca3af", fontSize: "0.85rem", verticalAlign: "top", fontFamily: "var(--font-code)", wordBreak: "break-all" }}>
                        {Object.keys(eventItem.props).length ? JSON.stringify(eventItem.props) : "{}"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {/* --- BOTTOM RETURN ZONE --- */}
      <div style={{ 
        textAlign: "center", 
        marginTop: "clamp(2.5rem, 6vw, 4rem)", 
        paddingTop: "clamp(2rem, 5vw, 3rem)", 
        borderTop: "1px solid rgba(255,255,255,0.1)" 
      }}>
        <button
          onClick={() => router.push("/")}
          className="mouse-hover"
          style={{
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "100px",
            color: "#888",
            fontFamily: "var(--font-code)",
            fontSize: "clamp(0.8rem, 2vw, 0.85rem)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            padding: "14px 32px", // Slightly larger padding for easier tapping
            transition: "all 0.3s ease",
            cursor: "pointer",
            width: "max-content",
            maxWidth: "100%"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "black";
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#888";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
          }}
        >
          ← Back To Home
        </button>
      </div>
    </main>
  );
}