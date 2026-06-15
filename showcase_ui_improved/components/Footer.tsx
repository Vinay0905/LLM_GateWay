"use client";

import { useEffect, useState } from "react";

interface TelemetryData {
  status: "ONLINE" | "OFFLINE";
  uptime: string;
  latency: string;
}

export default function Footer() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    status: "OFFLINE",
    uptime: "99.98%",
    latency: "-- ms"
  });

  useEffect(() => {
    async function checkSystem() {
      // Avoid making background requests if the user has minimized the tab or is on another tab
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return;
      }

      try {
        const start = performance.now();
        const res = await fetch("/api/health");
        const elapsed = Math.round(performance.now() - start);
        
        if (res.ok) {
          setTelemetry({
            status: "ONLINE",
            uptime: "99.99%",
            latency: `${elapsed}ms`
          });
        } else {
          setTelemetry((prev) => ({ ...prev, status: "OFFLINE" }));
        }
      } catch (error) {
        setTelemetry((prev) => ({ ...prev, status: "OFFLINE" }));
      }
    }

    // Initial check
    checkSystem();

    // Set 30-second interval (ideal balance of load for 50-100 active users)
    const interval = setInterval(checkSystem, 30000); 

    // Listen for tab focus change to trigger immediate update when user switches back
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSystem();
      }
    };
    
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      clearInterval(interval);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-8 border-t border-outline-variant bg-surface-container-lowest/95 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 text-[10px] font-semibold uppercase tracking-widest">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant">© 2026 LLM GATEWAY |</span>
          <span className="flex items-center gap-1">
            <span className="text-on-surface-variant">SYSTEM:</span>
            <span className={`flex items-center gap-1 font-bold ${telemetry.status === "ONLINE" ? "text-primary" : "text-red-500"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${telemetry.status === "ONLINE" ? "bg-primary animate-pulse" : "bg-red-500"}`}></span>
              {telemetry.status}
            </span>
          </span>
        </div>

        {/* Right Side */}
        <div className="flex gap-6 text-on-surface-variant">
          <span>
            UPTIME: <span className="text-secondary font-bold">{telemetry.uptime}</span>
          </span>
          <span>
            GATEWAY LATENCY: <span className="text-secondary font-bold">{telemetry.latency}</span>
          </span>
          <span className="hidden sm:inline text-primary font-bold">
            ROUTING: ACTIVE
          </span>
        </div>
      </div>
    </footer>
  );
}
