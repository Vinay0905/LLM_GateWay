import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        tag="project context"
        title="About The Gateway Showcase"
        subtitle="A portfolio-grade interface built to explain system design decisions and prove runtime behavior."
      />
      <NeonCard title="About This Showcase">
        <p className="text-sm text-neon-text">
          This frontend demonstrates the complete LLM gateway system built phase-by-phase: auth, safety sidecar, multi-provider routing,
          resilience controls, and observability.
        </p>
      </NeonCard>
      <div className="grid gap-4 md:grid-cols-2">
        <NeonCard title="Engineering Journey">
          <ul className="list-disc space-y-2 pl-5 text-sm text-neon-text">
            <li>Phase 1-3: baseline gateway + auth + safety policy.</li>
            <li>Phase 4-5: sidecar split + multi-provider routing.</li>
            <li>Phase 6: timeout/retry/circuit-breaker behavior.</li>
            <li>Phase 7: logs, metrics, and replay evaluation readiness.</li>
          </ul>
        </NeonCard>
        <NeonCard title="What This UI Proves">
          <ul className="list-disc space-y-2 pl-5 text-sm text-neon-text">
            <li>Client traffic is abstracted through a unified gateway endpoint.</li>
            <li>Safety checks can block harmful prompts before upstream generation.</li>
            <li>Provider routing can switch backends without changing API contract.</li>
            <li>Resilience policy surfaces retry/timeout/fallback behavior clearly.</li>
            <li>Metrics and structured logs support operational insight.</li>
          </ul>
        </NeonCard>
      </div>
      <NeonCard title="Demo Tips">
        <ul className="list-disc space-y-2 pl-5 text-sm text-neon-text">
          <li>Use Playground snippets first to show deterministic scenarios.</li>
          <li>Use Tutorial mode for storytelling during interviews.</li>
          <li>Use Chat mode to prove practical everyday usage.</li>
          <li>Show /metrics updates live to validate observability story.</li>
        </ul>
      </NeonCard>
    </div>
  );
}
