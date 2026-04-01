import { NextRequest, NextResponse } from "next/server";
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

type SummaryAccumulator = {
  eventCounts: Record<string, number>;
  projectClicks: Record<string, number>;
  uniquePaths: Set<string>;
  recentEvents: RecentEvent[];
  attempts: number;
  success: number;
  failure: number;
};

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

function emptySummary() {
  return {
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
  };
}

function createAccumulator(): SummaryAccumulator {
  return {
    eventCounts: {},
    projectClicks: {},
    uniquePaths: new Set<string>(),
    recentEvents: [],
    attempts: 0,
    success: 0,
    failure: 0,
  };
}

function updateProjectClicks(acc: SummaryAccumulator, event: StoredEvent) {
  if (event.event !== "project_click" && event.event !== "work_project_click") {
    return;
  }

  const title = typeof event.props?.title === "string" ? event.props.title : "Unknown Project";
  acc.projectClicks[title] = (acc.projectClicks[title] || 0) + 1;
}

function updateContactConversion(acc: SummaryAccumulator, eventName: string) {
  if (eventName === "contact_submit_attempt") acc.attempts += 1;
  if (eventName === "contact_submit_success") acc.success += 1;
  if (eventName === "contact_submit_failure") acc.failure += 1;
}

function pushRecentEvent(acc: SummaryAccumulator, id: string, event: StoredEvent) {
  acc.recentEvents.push({
    id,
    event: event.event,
    path: event.path || "unknown",
    timestamp: event.timestamp || 0,
    props: event.props || {},
  });
}

function summarizeRecords(records: Record<string, unknown>) {
  const acc = createAccumulator();

  for (const [id, raw] of Object.entries(records)) {
    const event = toSafeEvent(raw);
    if (!event) continue;

    acc.eventCounts[event.event] = (acc.eventCounts[event.event] || 0) + 1;
    acc.uniquePaths.add(event.path || "unknown");

    updateProjectClicks(acc, event);
    updateContactConversion(acc, event.event);
    pushRecentEvent(acc, id, event);
  }

  acc.recentEvents.sort((a, b) => b.timestamp - a.timestamp);

  const topProjects = Object.entries(acc.projectClicks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([title, clicks]) => ({ title, clicks }));

  const successRate = acc.attempts > 0 ? Number(((acc.success / acc.attempts) * 100).toFixed(2)) : 0;

  return {
    ok: true,
    totalEvents: acc.recentEvents.length,
    uniquePaths: acc.uniquePaths.size,
    eventCounts: acc.eventCounts,
    topProjects,
    contactConversion: {
      attempts: acc.attempts,
      success: acc.success,
      failure: acc.failure,
      successRate,
    },
    recentEvents: acc.recentEvents.slice(0, RECENT_EVENT_LIMIT),
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getServerDatabase();
    const snapshot = await db
      .ref("analytics/events")
      .orderByKey()
      .limitToLast(SUMMARY_EVENT_LIMIT)
      .once("value");

    const records = snapshot.val() as Record<string, unknown> | null;
    if (!records) {
      return NextResponse.json(emptySummary());
    }

    return NextResponse.json(summarizeRecords(records));
  } catch (error) {
    console.error("Analytics summary error", error);
    const message =
      error instanceof Error && error.message.includes("Firebase Admin credentials missing")
        ? "Analytics server is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY."
        : "Failed to fetch analytics summary";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
