"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGatewayHealth, fetchGatewayMetrics } from "@/lib/gateway-client";
import LatencySparkline from "@/components/LatencySparkline";
import LogStreamer from "@/components/LogStreamer";

export default function HomePage() {
  const [metrics, setMetrics] = useState<{
    requests: string;
    blocks: string;
    uptime: string;
    latency: string;
    status: string;
  }>({
    requests: "0",
    blocks: "0",
    uptime: "99.98%",
    latency: "42ms",
    status: "CHECKING..."
  });

  useEffect(() => {
    async function loadStats() {
      const [h, m] = await Promise.all([fetchGatewayHealth(), fetchGatewayMetrics()]);
      if (h === "200" && m) {
        setMetrics({
          requests: String(m.requests_total ?? 0),
          blocks: String(m.blocks_total ?? 0),
          uptime: "99.99%",
          latency: `${m.latency_avg_ms || 42}ms`,
          status: "ACTIVE"
        });
      } else {
        setMetrics((prev) => ({
          ...prev,
          status: h === "200" ? "ACTIVE" : "OFFLINE"
        }));
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center border border-outline-variant bg-surface/50 rounded-xl overflow-hidden px-6 py-20 text-center">
        {/* Dynamic Dotted Grid Canvas Accent */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="font-display text-primary uppercase leading-none tracking-tighter select-none hero-text-glow text-[72px] sm:text-[120px] md:text-[150px]">
            GATEWAY
          </h1>
          <p className="font-display text-secondary text-sm sm:text-lg md:text-xl tracking-[0.24em] uppercase max-w-2xl mx-auto">
            High-performance LLM routing, safety, and metrics orchestration.
          </p>
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/playground" className="px-8 py-3 bg-primary text-background font-display text-xs font-bold uppercase tracking-[0.2em] border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 rounded shadow-[0_0_15px_rgba(204,255,128,0.15)]">
              ENTER PLAYGROUND
            </Link>
            <Link href="/chat" className="px-8 py-3 border border-outline text-on-surface-variant font-display text-xs font-bold uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all duration-300 rounded">
              NEURAL CHAT
            </Link>
          </div>
        </div>

        {/* Floating schematic style accent */}
        <div className="absolute bottom-6 left-6 right-6 hidden md:flex justify-between items-center text-[10px] text-on-surface-variant/40 font-technical-sm tracking-widest border-t border-outline-variant/20 pt-4">
          <span>MODULE: CORE_SHIELD_V1</span>
          <span>UPSTREAM: [GEMINI // GROQ]</span>
        </div>
      </section>

      {/* Telemetry Metrics Panel */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="glass-panel p-6 flex flex-col justify-between rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-xs text-on-surface-variant uppercase tracking-widest">System Uptime</span>
            <div className="relative flex h-2 w-2">
              <span className="status-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl text-primary font-bold tracking-tight">{metrics.uptime}</div>
          <div className="mt-4 h-1 w-full bg-outline-variant/30 overflow-hidden rounded-full">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: metrics.uptime }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-6 flex flex-col justify-between rounded-xl hover:border-secondary/50 transition-all gap-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs text-on-surface-variant uppercase tracking-widest">Avg Latency</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">speed</span>
          </div>
          <div className="flex-grow flex items-center">
            <LatencySparkline />
          </div>
        </div>


        {/* Metric 3 */}
        <div className="glass-panel p-6 flex flex-col justify-between rounded-xl hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-xs text-on-surface-variant uppercase tracking-widest">Safety Shield</span>
            <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl text-primary font-bold tracking-tight">{metrics.status}</div>
          <div className="mt-4 flex gap-1">
            <div className="h-1 flex-1 bg-primary rounded-sm"></div>
            <div className="h-1 flex-1 bg-primary rounded-sm"></div>
            <div className={`h-1 flex-1 rounded-sm ${metrics.status === "ACTIVE" ? "bg-primary" : "bg-primary/20"}`}></div>
            <div className={`h-1 flex-1 rounded-sm ${metrics.status === "ACTIVE" ? "bg-primary/50" : "bg-primary/20"}`}></div>
          </div>
        </div>
      </section>

      {/* Bento Infrastructure Grid */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl text-primary uppercase tracking-tight">Infrastructure Layers</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Routing */}
          <div className="md:col-span-8 technical-card p-8 rounded-xl flex flex-col justify-between gap-6 group">
            <div className="space-y-4">
              <span className="font-display text-[10px] text-secondary uppercase tracking-[0.3em] font-bold block">01 / Logic Engine</span>
              <h3 className="font-display text-2xl text-on-surface font-bold">Model Routing</h3>
              <p className="font-technical-sm text-sm text-on-surface-variant leading-relaxed">
                Intelligent inference distribution between Gemini and Groq systems. Optimize for token efficiency, latency budgets, or maximum reasoning depth based on real-time shard availability.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-3 py-1 bg-surface-variant font-technical-sm text-xs border border-outline-variant text-on-surface-variant uppercase rounded">Gemini-1.5-Flash</span>
              <span className="px-3 py-1 bg-surface-variant font-technical-sm text-xs border border-outline-variant text-on-surface-variant uppercase rounded">Llama3-70b-8192</span>
              <span className="px-3 py-1 bg-surface-variant font-technical-sm text-xs border border-outline-variant text-on-surface-variant uppercase rounded">Weighted A/B Rules</span>
            </div>
          </div>

          {/* Card 2: Safety */}
          <div className="md:col-span-4 technical-card p-8 rounded-xl flex flex-col justify-between gap-6 group">
            <div className="space-y-4">
              <span className="font-display text-[10px] text-secondary uppercase tracking-[0.3em] font-bold block">02 / Validation</span>
              <h3 className="font-display text-xl text-on-surface font-bold uppercase">Safety Layers</h3>
              <p className="font-technical-sm text-sm text-on-surface-variant leading-relaxed">
                Multi-stage heuristic analysis and adversarial prompt injection detection in parallel safety pipelines.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4">
              <span className="text-xs font-technical-sm text-primary uppercase font-bold tracking-wider">Presidio Masking</span>
              <span className="material-symbols-outlined text-[32px] text-primary/40 group-hover:text-primary transition-colors">security</span>
            </div>
          </div>

          {/* Card 3: Resilience */}
          <div className="md:col-span-4 technical-card p-8 rounded-xl flex flex-col justify-between gap-6 group">
            <div className="space-y-4">
              <span className="font-display text-[10px] text-secondary uppercase tracking-[0.3em] font-bold block">03 / Resilience</span>
              <h3 className="font-display text-xl text-on-surface font-bold uppercase">Circuit Breakers</h3>
              <p className="font-technical-sm text-sm text-on-surface-variant leading-relaxed">
                Active thresholds that monitor upstream HTTP error rates and latency spikes to trigger failover provider fallbacks.
              </p>
            </div>
            <div className="border border-outline-variant/30 p-3 bg-surface-container-lowest/50 rounded font-technical-sm text-[10px] text-primary/80 tracking-widest uppercase">
              [SYSTEM_LOG]: BREAKER_STATUS_CLOSED
            </div>
          </div>

          {/* Card 4: Stats details */}
          <div className="md:col-span-8 technical-card p-8 rounded-xl flex flex-col justify-between gap-6 group">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <span className="font-display text-[10px] text-secondary uppercase tracking-[0.3em] font-bold block">04 / Stats telemetry</span>
                <h3 className="font-display text-2xl text-on-surface font-bold">Inference Telemetry</h3>
                <p className="font-technical-sm text-sm text-on-surface-variant leading-relaxed">
                  Real-time monitoring of metrics. Track request volume, block ratios, and detailed latency logs directly.
                </p>
              </div>
              <div className="space-y-4 bg-surface-container-low/50 p-4 rounded border border-outline-variant/30">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-technical-sm text-on-surface-variant">
                    <span>Active Requests</span>
                    <span className="text-primary font-bold">{metrics.requests}</span>
                  </div>
                  <div className="h-1 w-full bg-outline-variant/20 rounded">
                    <div className="h-full bg-primary rounded" style={{ width: `${Math.min(parseInt(metrics.requests) || 10, 100)}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-technical-sm text-on-surface-variant">
                    <span>Blocked Requests</span>
                    <span className="text-red-400 font-bold">{metrics.blocks}</span>
                  </div>
                  <div className="h-1 w-full bg-outline-variant/20 rounded">
                    <div className="h-full bg-red-400 rounded" style={{ width: `${Math.min(parseInt(metrics.blocks) || 2, 100)}%` }}></div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  </section>

      {/* Audit Log Streamer Section */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl text-primary uppercase tracking-tight">System Audit logs</h2>
        <LogStreamer />
      </section>
    </div>
  );
}
