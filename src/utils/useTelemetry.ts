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

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    city: "Scanning...",
    ip: "***.***.*.*",
    distance: "0 km",
    ping: "0 ms",
    os: "Analyzing...",
    org: "Identifying...",
  });
  
  const [time, setTime] = useState<TimeData>({ 
    host: "--:--", 
    client: "--:--" 
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;
    const HOST_LAT = 23.2599;
    const HOST_LON = 77.4126;

    const processTelemetryData = (data: any) => {
      const R = 6371;
      const dLat = ((data.latitude - HOST_LAT) * Math.PI) / 180;
      const dLon = ((data.longitude - HOST_LON) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((HOST_LAT * Math.PI) / 180) *
          Math.cos((data.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const dist = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

      if (isMounted) {
        setTelemetry({
          city: data.city || "Unknown",
          ip: data.ip
            ? data.ip.includes(":")
              ? data.ip.split(":").map((p: string, i: number) => (i > 2 ? "****" : p)).join(":")
              : data.ip.split(".").map((p: string, i: number) => (i > 1 ? "***" : p)).join(".")
            : "Hidden",
          distance: `${dist.toLocaleString()} km`,
          ping: `${Math.round(dist / 500 + 20)} ms`,
          os: navigator.platform,
          org: data.org || "Unknown ISP",
        });
      }
    };

    const cachedData = sessionStorage.getItem("telemetry_cache");

    if (cachedData) {
      try {
        processTelemetryData(JSON.parse(cachedData));
      } catch (e) {
        console.error("Cache parse error", e);
      }
    } else {
      fetch("https://ipapi.co/json/")
        .then((r) => r.json())
        .then((data) => {
          if (!isMounted) return;
          if (data.error || !data.latitude || !data.longitude) {
            throw new Error("Rate limited or tracking blocked");
          }
          sessionStorage.setItem("telemetry_cache", JSON.stringify(data));
          processTelemetryData(data);
        })
        .catch(() => {
          if (isMounted) {
            setTelemetry((prev) => ({
              ...prev,
              city: "Stealth Mode",
              os: navigator.platform,
              ip: "Hidden",
              distance: "Unknown",
              ping: "N/A",
              org: "Encrypted",
            }));
          }
        });
    }

    const timer = setInterval(() => {
      if (!isMounted) return;
      const now = new Date();
      setTime({
        host: now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        }),
        client: now.toLocaleTimeString("en-US", { hour12: false }),
      });
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  return { telemetry, time };
}