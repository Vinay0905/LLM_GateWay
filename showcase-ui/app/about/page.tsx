export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header className="glass-panel p-6">
        <h1 className="font-display text-5xl uppercase tracking-tight text-[#e5e2e1]">
          Project <span className="text-[#ccff80]">Manifesto</span>
        </h1>
        <p className="mt-3 max-w-3xl text-[#c2cab0]">A portfolio-grade interface built to explain system design decisions and prove runtime behavior.</p>
      </header>
      <section className="glass-panel p-5">
        <h2 className="font-display text-2xl text-[#ccff80]">About This Showcase</h2>
        <p className="mt-3 text-sm text-[#e5e2e1]">
          This frontend demonstrates the complete LLM gateway system built phase-by-phase: auth, safety sidecar, multi-provider routing,
          resilience controls, and observability.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="glass-panel p-5">
          <h2 className="font-display text-2xl text-[#ccff80]">Engineering Journey</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#e5e2e1]">
            <li>Phase 1-3: baseline gateway + auth + safety policy.</li>
            <li>Phase 4-5: sidecar split + multi-provider routing.</li>
            <li>Phase 6: timeout/retry/circuit-breaker behavior.</li>
            <li>Phase 7: logs, metrics, and replay evaluation readiness.</li>
          </ul>
        </section>
        <section className="glass-panel p-5">
          <h2 className="font-display text-2xl text-[#ccff80]">What This UI Proves</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#e5e2e1]">
            <li>Client traffic is abstracted through a unified gateway endpoint.</li>
            <li>Safety checks can block harmful prompts before upstream generation.</li>
            <li>Provider routing can switch backends without changing API contract.</li>
            <li>Resilience policy surfaces retry/timeout/fallback behavior clearly.</li>
            <li>Metrics and structured logs support operational insight.</li>
          </ul>
        </section>
      </div>
      <section className="glass-panel p-5">
        <h2 className="font-display text-2xl text-[#ccff80]">Demo Tips</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#e5e2e1]">
          <li>Use Playground snippets first to show deterministic scenarios.</li>
          <li>Use Tutorial mode for storytelling during interviews.</li>
          <li>Use Chat mode to prove practical everyday usage.</li>
          <li>Show /metrics updates live to validate observability story.</li>
        </ul>
      </section>
    </div>
  );
}
