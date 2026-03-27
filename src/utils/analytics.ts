"use client";

type AnalyticsPrimitive = string | number | boolean;
type AnalyticsPayload = Record<string, AnalyticsPrimitive>;

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: AnalyticsPayload }) => void;
  }
}

function normalizePayload(payload?: Record<string, unknown>): AnalyticsPayload {
  if (!payload) {
    return {};
  }

  const normalized: AnalyticsPayload = {};

  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      normalized[key] = value;
    }
  }

  return normalized;
}

export async function trackEvent(eventName: string, payload?: Record<string, unknown>): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const safeName = eventName.trim();
  if (!safeName) {
    return;
  }

  const props = normalizePayload(payload);

  if (typeof window.plausible === "function") {
    window.plausible(safeName, { props });
  }

  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: safeName, props }),
      keepalive: true,
    });
  } catch {
    // Ignore analytics failures so UX remains uninterrupted.
  }
}
