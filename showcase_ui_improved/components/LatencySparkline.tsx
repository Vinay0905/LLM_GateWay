import React, { useEffect, useState } from "react";
import { useAppTheme } from "@/app/ThemeContext";

export default function LatencySparkline() {
  const { theme } = useAppTheme();
  const isTokyo = theme === "neon-tokyo";
  const strokeColor = isTokyo ? "rgb(0, 255, 204)" : "rgb(93, 230, 255)";
  const glowShadow = isTokyo ? "drop-shadow-[0_0_4px_rgba(0,255,204,0.4)]" : "drop-shadow-[0_0_4px_rgba(93,230,255,0.4)]";
  
  const [history, setHistory] = useState<number[]>([45, 50, 48, 52, 47, 55, 52, 49, 44, 46, 50, 42]);

  useEffect(() => {
    async function updateLatency() {
      // Avoid polling when the page is not visible to save resources
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return;
      }

      try {
        const start = performance.now();
        const res = await fetch("/api/health");
        const elapsed = Math.round(performance.now() - start);
        
        if (res.ok) {
          setHistory((prev) => {
            const next = [...prev.slice(1), elapsed];
            return next;
          });
        }
      } catch (e) {
        // Fallback or append a 0 on failure to show downtime
        setHistory((prev) => [...prev.slice(1), 0]);
      }
    }

    // Poll every 5 seconds for a highly responsive chart
    const interval = setInterval(updateLatency, 5000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        updateLatency();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Calculate SVG points path
  const width = 220;
  const height = 36;
  const padding = 2;
  
  const minVal = Math.min(...history.filter(v => v > 0), 20);
  const maxVal = Math.max(...history, 80);
  const range = maxVal - minVal || 1;

  const points = history.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (history.length - 1);
    // Invert Y so higher latency is higher on screen. If val is 0 (outage), draw it at the baseline.
    const y = val === 0 
      ? height - padding 
      : height - padding - ((val - minVal) / range) * (height - padding * 2 - 8);
    return { x, y };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    : "";

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-outline px-1">
        <span>Signal Telemetry Stream</span>
        <span className="text-secondary font-bold font-technical-sm">{history[history.length - 1]} ms</span>
      </div>
      <div className="relative h-10 w-full border border-outline-variant/20 rounded bg-surface-container-lowest/50 overflow-hidden flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:12px_12px]"></div>
        
        {/* SVG Sparkline */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible z-10">
          <defs>
            <linearGradient id="sparklineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Fill Area under the line */}
          <path d={areaD} fill="url(#sparklineGrad)" />
          
          {/* Glowing Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={glowShadow}
          />
          
          {/* Dynamic pulsing endpoint node */}
          {points.length > 0 && history[history.length - 1] > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="2.5"
              fill={strokeColor}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
