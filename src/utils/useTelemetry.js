import { useState, useEffect } from 'react';

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState({
    city: 'Scanning...', ip: '***.***.*.*', distance: '0 km', ping: '0 ms', os: 'Analyzing...', org: 'Identifying...'
  });
  const [time, setTime] = useState({ host: '--:--', client: '--:--' });

  useEffect(() => {
    let isMounted = true; 

    const HOST_LAT = 23.2599; 
    const HOST_LON = 77.4126;

    // Helper function to calculate distance and set state
    const processTelemetryData = (data) => {
        const R = 6371;
        const dLat = (data.latitude - HOST_LAT) * Math.PI / 180;
        const dLon = (data.longitude - HOST_LON) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(HOST_LAT * Math.PI / 180) * Math.cos(data.latitude * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const dist = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

        if (isMounted) {
            setTelemetry({
              city: data.city || 'Unknown',
             ip: data.ip 
  ? data.ip.includes(':') 
    // Handle IPv6 (e.g., 2001:0db8:85a3:****:****:****:****:****)
    ? data.ip.split(':').map((p, i) => i > 2 ? '****' : p).join(':')
    // Handle IPv4 (e.g., 192.168.***.***)
    : data.ip.split('.').map((p, i) => i > 1 ? '***' : p).join('.') 
  : 'Hidden',
              distance: `${dist.toLocaleString()} km`,
              ping: `${Math.round(dist / 500 + 20)} ms`,
              os: navigator.platform,
              org: data.org || 'Unknown ISP'
            });
        }
    };

    // FIX: Check session storage first to prevent API rate limiting
    const cachedData = sessionStorage.getItem('telemetry_cache');

    if (cachedData) {
        try {
            processTelemetryData(JSON.parse(cachedData));
        } catch (e) {
            console.error("Cache parse error", e);
        }
    } else {
        // Only fetch if no cache exists
        fetch('https://ipapi.co/json/')
          .then(r => r.json())
          .then(data => {
            if (!isMounted) return; 

            // Safely handle API rate limits or ad-blocker payload restrictions
            if (data.error || !data.latitude || !data.longitude) {
                throw new Error("Rate limited or tracking blocked");
            }

            // Save valid response to cache for this session
            sessionStorage.setItem('telemetry_cache', JSON.stringify(data));
            processTelemetryData(data);
          })
          .catch(() => {
            if (isMounted) {
                setTelemetry(prev => ({ 
                    ...prev, 
                    city: 'Stealth Mode', 
                    os: navigator.platform,
                    ip: 'Hidden',
                    distance: 'Unknown',
                    ping: 'N/A',
                    org: 'Encrypted'
                }));
            }
          });
    }

    const timer = setInterval(() => {
      if (!isMounted) return;
      const now = new Date();
      setTime({
        host: now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }),
        client: now.toLocaleTimeString('en-US', { hour12: false })
      });
    }, 1000);

    return () => {
      isMounted = false; 
      clearInterval(timer);
    };
  }, []);

  return { telemetry, time };
}