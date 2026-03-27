import { NextRequest, NextResponse } from "next/server";
import { get, limitToLast, query, ref } from "firebase/database";
import { getServerDatabase } from "@/utils/firebase-server";

type StoredEvent = {
  event: string;
  props?: Record<string, string | number | boolean>;
  path?: string;
  timestamp?: number;
  ip?: string;
  userAgent?: string;
};

type RecentEvent = {
  id: string;
  event: string;
  path: string;
  timestamp: number;
  props: Record<string, string | number | boolean>;
};

const SUMMARY_EVENT_LIMIT = 1000;
const RECENT_EVENT_LIMIT = 30;

function isAuthorized(request: NextRequest): boolean {
  const configuredKey = process.env.ANALYTICS_DASHBOARD_KEY;
  if (!configuredKey) {
    return false;
  }

  const incomingKey = request.headers.get("x-dashboard-key") || "";
  return incomingKey === configuredKey;
}

function toSafeEvent(input: unknown): StoredEvent | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const record = input as Record<string, unknown>;
  if (typeof record.event !== "string" || !record.event) {
    return null;
  }

  const props: Record<string, string | number | boolean> = {};
  if (record.props && typeof record.props === "object") {
    for (const [key, value] of Object.entries(record.props as Record<string, unknown>)) {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        props[key] = value;
      }
    }
  }

  return {
    event: record.event,
    props,
    path: typeof record.path === "string" ? record.path : "unknown",
    timestamp: typeof record.timestamp === "number" ? record.timestamp : 0,
    ip: typeof record.ip === "string" ? record.ip : "unknown",
    userAgent: typeof record.userAgent === "string" ? record.userAgent : "unknown",
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getServerDatabase();
    const eventsQuery = query(ref(db, "analytics/events"), limitToLast(SUMMARY_EVENT_LIMIT));
    const snapshot = await get(eventsQuery);

    const records = snapshot.val() as Record<string, unknown> | null;
    if (!records) {
      return NextResponse.json({
        ok: true,
        totalEvents: 0,
        uniquePaths: 0,
        eventCounts: {},
        topProjects: [],
        contactConversion: {
          attempts: 0,
          success: 0,
          failure: 0,
          successRate: 0,
        },
        recentEvents: [],
      });
    }

    const eventCounts: Record<string, number> = {};
    const projectClicks: Record<string, number> = {};
    const uniquePaths = new Set<string>();
    const recentEvents: RecentEvent[] = [];

    let attempts = 0;
    let success = 0;
    let failure = 0;

    for (const [id, raw] of Object.entries(records)) {
      const event = toSafeEvent(raw);
      if (!event) {
        continue;
      }

      eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
      uniquePaths.add(event.path || "unknown");

      if (event.event === "project_click") {
        const title = typeof event.props?.title === "string" ? event.props.title : "Unknown Project";
        projectClicks[title] = (projectClicks[title] || 0) + 1;
      }

      if (event.event === "contact_submit_attempt") attempts += 1;
      if (event.event === "contact_submit_success") success += 1;
      if (event.event === "contact_submit_failure") failure += 1;

      recentEvents.push({
        id,
        event: event.event,
        path: event.path || "unknown",
        timestamp: event.timestamp || 0,
        props: event.props || {},
      });
    }

    recentEvents.sort((a, b) => b.timestamp - a.timestamp);

    const topProjects = Object.entries(projectClicks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, clicks]) => ({ title, clicks }));

    const successRate = attempts > 0 ? Number(((success / attempts) * 100).toFixed(2)) : 0;

    return NextResponse.json({
      ok: true,
      totalEvents: recentEvents.length,
      uniquePaths: uniquePaths.size,
      eventCounts,
      topProjects,
      contactConversion: {
        attempts,
        success,
        failure,
        successRate,
      },
      recentEvents: recentEvents.slice(0, RECENT_EVENT_LIMIT),
    });
  } catch (error) {
    console.error("Analytics summary error", error);
    return NextResponse.json({ error: "Failed to fetch analytics summary" }, { status: 500 });
  }
}
