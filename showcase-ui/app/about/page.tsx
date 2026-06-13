import { NeonCard } from "@/components/ui/NeonCard";

export default function AboutPage() {
  return (
    <div className="space-y-4">
      <NeonCard title="About This Showcase">
        <p className="text-sm text-neon-text">
          This frontend demonstrates the complete LLM gateway system built phase-by-phase: auth, safety sidecar, multi-provider routing,
          resilience controls, and observability.
        </p>
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
      <NeonCard title="Demo Tips">
        <ul className="list-disc space-y-2 pl-5 text-sm text-neon-text">
          <li>Use Playground snippets first to show deterministic scenarios.</li>
          <li>Use Tutorial mode for storytelling during interviews.</li>
          <li>Use Chat mode to prove practical everyday usage.</li>
        </ul>
      </NeonCard>
    </div>
  );
}
