import { NextRequest, NextResponse } from "next/server";
import { getServerDatabase } from "@/utils/firebase-server";

type EventProps = Record<string, string | number | boolean>;

type EventEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const eventStore = new Map<string, EventEntry>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = eventStore.get(ip);

  if (!existing || existing.resetAt < now) {
    eventStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  eventStore.set(ip, existing);
  return false;
}

function isValidEventName(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 80 &&
    /^[a-zA-Z0-9:_-]+$/.test(value)
  );
}

function toValidProps(value: unknown): EventProps {
  if (!value || typeof value !== "object") {
    return {};
  }

  const props: EventProps = {};
  for (const [key, propValue] of Object.entries(value)) {
    if (
      key.length <= 60 &&
      (typeof propValue === "string" || typeof propValue === "number" || typeof propValue === "boolean")
    ) {
      props[key] = propValue;
    }
  }

  return props;
}

function toMaskedIp(ip: string): string {
  if (ip.includes(".")) {
    const parts = ip.split(".");
    return `${parts[0]}.${parts[1]}.x.x`;
  }

  if (ip.includes(":")) {
    const parts = ip.split(":");
    return `${parts.slice(0, 3).join(":")}:xxxx`;
  }

  return "unknown";
}

function getPathFromReferer(referer: string | null): string {
  if (!referer) {
    return "unknown";
  }

  try {
    return new URL(referer).pathname || "unknown";
  } catch {
    return "unknown";
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many events" }, { status: 429 });
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const record = body as Record<string, unknown>;
    if (!isValidEventName(record.event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const props = toValidProps(record.props);
    const path = getPathFromReferer(request.headers.get("referer"));
    const timestamp = Date.now();

    const eventPayload = {
      event: record.event,
      props,
      path,
      timestamp,
      ip: toMaskedIp(ip),
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    let persisted = true;

    try {
      const db = getServerDatabase();
      const eventsRef = db.ref("analytics/events");
      const eventRef = eventsRef.push();
      await eventRef.set(eventPayload);
    } catch (error) {
      // Event persistence should never break user flows.
      persisted = false;
      console.warn("Failed to write analytics event to Firebase", error);
    }

    console.info("Analytics event", {
      event: eventPayload.event,
      props,
      path,
      ip: eventPayload.ip,
      userAgent: eventPayload.userAgent,
    });

    return NextResponse.json(
      { ok: true, persisted },
      { status: persisted ? 200 : 202 },
    );
  } catch (error) {
    console.error("Events API error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
