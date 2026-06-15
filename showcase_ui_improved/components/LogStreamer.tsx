"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAppTheme } from "@/app/ThemeContext";

interface LogEntry {
  Timestamp: string;
  RequestID: string;
  ApiKeyHash: string;
  PromptHash: string;
  Provider: string;
  Model: string;
  SafetyVerdict: string;
  ThreatType: string;
  LatencyMs: number;
  StatusCode: number;
}

export default function LogStreamer() {
  const { theme } = useAppTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const fetchLogs = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchLogs();
      }
    }, 4000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchLogs();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [autoRefresh, fetchLogs]);

  const formatTime = (tsStr: string) => {
    try {
      const d = new Date(tsStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "00:00:00";
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <h3 className="font-display text-base font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] animate-pulse">terminal</span>
            Live Audit Stream
          </h3>
          <p className="text-[11px] font-technical-sm text-on-surface-variant/70 mt-1">
            Real-time request trace of the Go Gateway backend pipeline
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1 border rounded-md text-[10px] uppercase font-bold tracking-wider font-technical-sm transition-all ${
              autoRefresh
                ? "border-primary bg-primary/10 text-primary"
                : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />
            {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
          </button>
          
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 border border-outline-variant hover:border-primary hover:text-primary rounded-md text-[10px] uppercase font-bold tracking-wider font-technical-sm disabled:opacity-50 transition-all"
          >
            <span className={`material-symbols-outlined text-[12px] ${loading ? "animate-spin" : ""}`}>
              refresh
            </span>
            Sync
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="overflow-x-auto rounded bg-surface-container-lowest/80 border border-outline-variant/20 p-2 scrollbar-thin">
        <table className="w-full text-left font-technical-sm text-[11px] min-w-[640px]">
          <thead>
            <tr className="border-b border-outline-variant/20 text-on-surface-variant/60 uppercase tracking-widest">
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Request ID</th>
              <th className="py-2.5 px-3">Model</th>
              <th className="py-2.5 px-3">Provider</th>
              <th className="py-2.5 px-3">Safety</th>
              <th className="py-2.5 px-3">Latency</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-on-surface-variant/40 italic">
                  No request trace entries found. Send prompt messages via the Neural Chat tab.
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => {
                const isSuccess = log.StatusCode === 200;
                const isBlocked = log.SafetyVerdict === "BLOCK";
                
                return (
                  <tr
                    key={log.RequestID || idx}
                    className="hover:bg-primary/5 transition-colors group"
                  >
                    <td className="py-2 px-3 text-on-surface/90 font-medium">
                      {formatTime(log.Timestamp)}
                    </td>
                    <td className="py-2 px-3 text-on-surface-variant/80">
                      <code>{log.RequestID ? `...${log.RequestID.slice(-6)}` : "-"}</code>
                    </td>
                    <td className="py-2 px-3 text-on-surface/80">
                      {log.Model || "-"}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`font-bold uppercase ${
                        log.Provider === "gemini" 
                          ? "text-secondary" 
                          : log.Provider === "groq" 
                          ? "text-primary-dark" 
                          : "text-on-surface-variant"
                      }`}>
                        {log.Provider || "-"}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {isBlocked ? (
                        <span className="text-red-400 font-bold uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">block</span>
                          BLOCK ({log.ThreatType})
                        </span>
                      ) : (
                        <span className="text-primary font-semibold uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          PASS
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-on-surface/90">
                      {log.LatencyMs}ms
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSuccess 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "bg-red-400/10 text-red-400 border border-red-400/20"
                      }`}>
                        {log.StatusCode || "500"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
