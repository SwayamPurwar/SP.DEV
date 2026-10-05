"use client";

import { useState, useEffect } from "react";

export interface TelemetryData {
  city: string;
  ip: string;
  distance: string;
  ping: string;
  os: string;
  org: string;
}

export interface TimeData {
  host: string;
  client: string;
}

// Host Coordinates (Pune, Maharashtra, India)
const HOST_LAT = 18.5204;
const HOST_LON = 73.8567;

function getCleanOS(): string {
  if (typeof window === "undefined") return "macOS";

  const ua = window.navigator.userAgent || "";
  
  if (/Macintosh|Mac OS X/i.test(ua)) {
    return window.navigator.maxTouchPoints > 1 ? "iPadOS" : "macOS";
  }
  if (/iPhone|iPod/i.test(ua)) return "iOS";
  if (/iPad/i.test(ua)) return "iPadOS";
  if (/Windows NT/i.test(ua)) return "Windows";
  if (/Android/i.test(ua)) return "Android";
  if (/Linux/i.test(ua)) return "Linux";

  return "macOS"; // Safe fallback
}

function calculateDistanceKm(lat: number, lon: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat - HOST_LAT);
  const dLon = toRad(lon - HOST_LON);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(HOST_LAT)) *
      Math.cos(toRad(lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function maskIp(ip?: string): string {
  if (!ip) return "Hidden";
  if (ip.includes(":")) {
    return ip
      .split(":")
      .map((part, i) => (i > 2 ? "****" : part))
      .join(":");
  }
  return ip
    .split(".")
    .map((part, i) => (i > 1 ? "***" : part))
    .join(".");
}

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    city: "Scanning...",
    ip: "***.***.*.*",
    distance: "Calculating...",
    ping: "0 ms",
    os: "macOS",
    org: "Identifying...",
  });

  const [time, setTime] = useState<TimeData>({
    host: "--:--",
    client: "--:--",
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const os = getCleanOS();

    // Set OS immediately so it never shows outdated states
    setTelemetry((prev) => ({ ...prev, os }));

    const updateDistance = (lat: number, lon: number) => {
      const dist = calculateDistanceKm(lat, lon);
      const distLabel = dist < 10 ? "Local (< 10 km)" : `${dist.toLocaleString()} km`;
      const estimatedPing = `${Math.max(5, Math.round(dist / 500 + 12))} ms`;

      if (isMounted) {
        setTelemetry((prev) => ({
          ...prev,
          distance: distLabel,
          ping: estimatedPing,
        }));
      }
    };

    const fetchIPData = async () => {
      try {
        // Clear any old session storage format
        sessionStorage.removeItem("telemetry_cache");
        sessionStorage.removeItem("telemetry_cache_v2");

        const cached = sessionStorage.getItem("telemetry_v3");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (isMounted) {
            setTelemetry((prev) => ({
              ...prev,
              city: parsed.city || "Pune",
              ip: maskIp(parsed.ip),
              org: parsed.connection?.isp || parsed.org || "Broadband",
              os,
            }));
            if (parsed.latitude && parsed.longitude) {
              updateDistance(parseFloat(parsed.latitude), parseFloat(parsed.longitude));
            }
          }
          return;
        }

        // ipwho.is is more reliable and doesn't aggressively rate-limit like ipapi
        const res = await fetch("https://ipwho.is/", { signal: controller.signal });
        const data = await res.json();

        if (data && data.success !== false) {
          sessionStorage.setItem("telemetry_v3", JSON.stringify(data));
          if (isMounted) {
            setTelemetry((prev) => ({
              ...prev,
              city: data.city || "Pune",
              ip: maskIp(data.ip),
              org: data.connection?.isp || data.org || "Internet Provider",
              os,
            }));

            if (data.latitude && data.longitude) {
              updateDistance(parseFloat(data.latitude), parseFloat(data.longitude));
            }
          }
        }
      } catch {
        if (isMounted) {
          setTelemetry((prev) => ({
            ...prev,
            city: "Pune",
            ip: "127.0.0.1",
            distance: "Local (< 10 km)",
            ping: "12 ms",
            os,
            org: "Local Network",
          }));
        }
      }
    };

    // 1. Try high-accuracy GPS coordinates first
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateDistance(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Denied or timed out - silently relies on IP lookup
        },
        { timeout: 4000, maximumAge: 60000 }
      );
    }

    // 2. Fetch IP and metadata
    fetchIPData();

    // 3. Live Clock
    const tick = () => {
      if (!isMounted) return;
      const now = new Date();
      setTime({
        host: now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        }),
        client: now.toLocaleTimeString("en-US", {
          hour12: false,
        }),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return { telemetry, time };
}