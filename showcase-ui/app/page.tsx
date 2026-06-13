import Link from "next/link";
import { GatewayStatusPanel } from "@/components/status/GatewayStatusPanel";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { StatPill } from "@/components/ui/StatPill";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <NeonCard title="LLM Gateway Showcase" subtitle="Cyber-retro experience proving safety, routing, resilience, and observability.">
        <p className="max-w-3xl text-sm text-neon-text">
          This app routes every AI request through your gateway so you can demonstrate provider abstraction, safety enforcement, retries,
          circuit breaker behavior, and telemetry in one polished UI.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/playground">
            <NeonButton>Try Playground</NeonButton>
          </Link>
          <Link href="/chat">
            <NeonButton variant="outline">Open Chat</NeonButton>
          </Link>
          <Link href="/tutorial">
            <NeonButton variant="outline">Run Tutorial</NeonButton>
          </Link>
        </div>
      </NeonCard>

      <div className="grid gap-4 md:grid-cols-3">
        <StatPill label="Core Path" value="Client -> Gateway -> Sidecar -> Provider" />
        <StatPill label="Main Endpoint" value="POST /v1/chat" />
        <StatPill label="Theme" value="Neon Green / Black Retro" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <NeonCard title="Tutorial Mode">
          <p className="text-sm text-neon-text">Step-by-step guided tasks with live request outcomes and expected status checks.</p>
        </NeonCard>
        <NeonCard title="Playground">
          <p className="text-sm text-neon-text">One-click snippets for safe, blocked, retry, and timeout scenarios with real output.</p>
        </NeonCard>
        <NeonCard title="Real Chat">
          <p className="text-sm text-neon-text">A practical chat interface with model picker, history, and metadata-rich responses.</p>
        </NeonCard>
      </div>

      <GatewayStatusPanel />
    </div>
  );
}
