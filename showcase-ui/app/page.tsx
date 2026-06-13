import Link from "next/link";
import { GatewayHeroGraphic } from "@/components/hero/GatewayHeroGraphic";
import { GatewayStatusPanel } from "@/components/status/GatewayStatusPanel";
import { NeonButton } from "@/components/ui/NeonButton";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative min-h-[78vh] overflow-hidden rounded-xl border border-[#1e293b] bg-[#131313]/70 pt-8">
        <div className="absolute inset-0 opacity-25">
          <GatewayHeroGraphic />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
          <h1 className="font-display hero-text-glow text-[72px] leading-none tracking-tight text-[#ccff80] md:text-[140px]">GATEWAY</h1>
          <p className="mt-4 max-w-2xl text-sm uppercase tracking-[0.24em] text-[#5de6ff] md:text-base">
            High-performance llm routing, safety, and metrics orchestration.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/playground">
              <NeonButton>Enter Playground</NeonButton>
            </Link>
            <Link href="/about">
              <NeonButton variant="outline">Read Story</NeonButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel p-5">
          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-[#c2cab0]">System Uptime</div>
          <div className="font-display text-3xl text-[#ccff80]">99.98%</div>
          <div className="mt-4 h-1 w-full bg-[#424936]/30">
            <div className="h-full w-[99.98%] bg-[#ccff80]" />
          </div>
        </div>
        <div className="glass-panel p-5">
          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-[#c2cab0]">Avg Latency</div>
          <div className="font-display text-3xl text-[#5de6ff]">42ms</div>
          <div className="mt-4 flex items-end gap-1">
            <div className="h-2 w-1 bg-[#5de6ff]/40" />
            <div className="h-6 w-1 bg-[#5de6ff]" />
            <div className="h-4 w-1 bg-[#5de6ff]/60" />
            <div className="h-5 w-1 bg-[#5de6ff]" />
            <div className="h-3 w-1 bg-[#5de6ff]/40" />
          </div>
        </div>
        <div className="glass-panel p-5">
          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-[#c2cab0]">Safety Shield</div>
          <div className="font-display text-3xl text-[#ccff80]">ACTIVE</div>
          <div className="mt-4 flex gap-1">
            <div className="h-1 flex-1 bg-[#ccff80]" />
            <div className="h-1 flex-1 bg-[#ccff80]" />
            <div className="h-1 flex-1 bg-[#ccff80]/20" />
            <div className="h-1 flex-1 bg-[#ccff80]/20" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display mb-6 text-3xl uppercase tracking-tight text-[#ccff80]">Infrastructure Layers</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-panel technical-card p-5">
            <h3 className="font-display text-xl text-[#e5e2e1]">Tutorial Mode</h3>
            <p className="mt-2 text-sm text-[#c2cab0]">Guided phase-based walkthrough of gateway request behavior.</p>
          </div>
          <div className="glass-panel technical-card p-5">
            <h3 className="font-display text-xl text-[#e5e2e1]">Playground</h3>
            <p className="mt-2 text-sm text-[#c2cab0]">Run deterministic safety/routing/resilience snippets with outputs.</p>
          </div>
          <div className="glass-panel technical-card p-5">
            <h3 className="font-display text-xl text-[#e5e2e1]">Live Chat</h3>
            <p className="mt-2 text-sm text-[#c2cab0]">Real gateway-backed chat with provider and status metadata.</p>
          </div>
        </div>
      </section>

      <GatewayStatusPanel />
    </div>
  );
}
