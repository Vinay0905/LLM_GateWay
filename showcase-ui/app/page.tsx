import Link from "next/link";
import { GatewayHeroGraphic } from "@/components/hero/GatewayHeroGraphic";
import { GatewayStatusPanel } from "@/components/status/GatewayStatusPanel";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatPill } from "@/components/ui/StatPill";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="glass-border overflow-hidden rounded-clean bg-gradient-to-b from-neon-panel/90 to-black/80 p-5 md:p-7">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr,1fr]">
          <div>
            <p className="font-dot text-xs uppercase tracking-[0.18em] text-neon-cyan">retrofuture llm platform</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-neon-text md:text-6xl">
              LLM Gateway
              <span className="block text-neon-green">Showcase Console</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-neon-muted md:text-base">
              A production-style gateway interface demonstrating safety filtering, multi-provider routing, resilience controls, and observability
              in one interactive experience.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/playground">
                <NeonButton>Enter Playground</NeonButton>
              </Link>
              <Link href="/tutorial">
                <NeonButton variant="outline">Run Guided Tour</NeonButton>
              </Link>
              <Link href="/chat">
                <NeonButton variant="outline">Open Chat Console</NeonButton>
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StatPill label="Unified Endpoint" value="POST /v1/chat" />
              <StatPill label="Providers" value="Gemini + Groq" />
              <StatPill label="Control Layers" value="Safety + Resilience" />
            </div>
          </div>
          <GatewayHeroGraphic />
        </div>
      </section>

      <SectionHeading
        tag="feature lanes"
        title="What You Can Showcase"
        subtitle="Each lane maps to your backend phases and gives you a repeatable demo flow for interviews and portfolio walkthroughs."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <NeonCard title="Tutorial Mode" subtitle="Narrated engineering demo">
          <p className="text-sm text-neon-text">Step-by-step guided tasks with live request outcomes and expected status checks.</p>
          <div className="mt-4">
            <Link href="/tutorial">
              <NeonButton variant="outline">Launch Tutorial</NeonButton>
            </Link>
          </div>
        </NeonCard>
        <NeonCard title="Playground" subtitle="Snippet + debug runner">
          <p className="text-sm text-neon-text">One-click snippets for safe, blocked, retry, and timeout scenarios with real output.</p>
          <div className="mt-4">
            <Link href="/playground">
              <NeonButton variant="outline">Open Playground</NeonButton>
            </Link>
          </div>
        </NeonCard>
        <NeonCard title="Real Chat" subtitle="Actual gateway chat path">
          <p className="text-sm text-neon-text">A practical chat interface with model picker, history, and metadata-rich responses.</p>
          <div className="mt-4">
            <Link href="/chat">
              <NeonButton variant="outline">Start Chat</NeonButton>
            </Link>
          </div>
        </NeonCard>
      </div>

      <GatewayStatusPanel />
    </div>
  );
}
