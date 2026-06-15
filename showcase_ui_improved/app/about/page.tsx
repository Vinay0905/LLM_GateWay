export default function AboutPage() {
  return (
    <div className="space-y-8 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="glass-panel p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 font-display text-[60px] text-primary/10 select-none font-bold uppercase leading-none">
          MANIFESTO
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-on-surface font-bold">
          Project <span className="text-primary">Manifesto</span>
        </h1>
        <p className="mt-4 max-w-3xl text-on-surface-variant font-technical-sm text-sm sm:text-base leading-relaxed">
          A portfolio-grade interface built to explain system design decisions and prove runtime behavior at the intersection of AI safety and distributed backend engineering.
        </p>
      </header>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Engineering Journey */}
        <section className="glass-panel p-6 rounded-xl hover:border-primary/50 transition-all space-y-4">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-bold uppercase tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">alt_route</span>
            Engineering Journey
          </h2>
          <ul className="space-y-3 font-technical-sm text-sm text-on-surface-variant">
            <li className="flex gap-2 items-start">
              <span className="text-secondary font-bold">•</span>
              <span><strong>Phase 1-3:</strong> Baseline Go gateway setup + client API key auth + in-process safety analysis middleware.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-secondary font-bold">•</span>
              <span><strong>Phase 4-5:</strong> Split off safety checks to an asynchronous Python FastAPI sidecar + introduced Groq/Gemini routing providers.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-secondary font-bold">•</span>
              <span><strong>Phase 6:</strong> Configured request timeout contexts, automatic retries, and active circuit-breaker failover paths.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-secondary font-bold">•</span>
              <span><strong>Phase 7:</strong> Observability suite, structured JSONL experiment logging, and test suite verification.</span>
            </li>
          </ul>
        </section>

        {/* What this UI Proves */}
        <section className="glass-panel p-6 rounded-xl hover:border-primary/50 transition-all space-y-4">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-bold uppercase tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">verified</span>
            What This UI Proves
          </h2>
          <ul className="space-y-3 font-technical-sm text-sm text-on-surface-variant">
            <li className="flex gap-2 items-start">
              <span className="text-secondary font-bold">•</span>
              <span>Unified abstraction of multiple client backends under a single REST contract.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-secondary font-bold">•</span>
              <span>Pre-emptive blocking of adversarial injections and jailbreaks before LLM generation.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-secondary font-bold">•</span>
              <span>Dynamic provider routing that switches backends seamlessly without breaking clients.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-secondary font-bold">•</span>
              <span>Active resilience controls rendering retry metrics and circuit-breaker flags.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Demo Tips */}
      <section className="glass-panel p-6 rounded-xl hover:border-primary/50 transition-all space-y-4">
        <h2 className="font-display text-xl sm:text-2xl text-primary font-bold uppercase tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">tips_and_updates</span>
          Demo tips & Guidelines
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 font-technical-sm text-sm text-on-surface-variant">
            <div className="p-3 bg-surface-container/50 border border-outline-variant/30 rounded">
              <h4 className="font-bold text-on-surface mb-1">1. Playground Sandbox</h4>
              <p className="text-xs">Run deterministic presets to showcase the system&apos;s exact response under safety blocks, timeouts, and rate limits.</p>
            </div>
            <div className="p-3 bg-surface-container/50 border border-outline-variant/30 rounded">
              <h4 className="font-bold text-on-surface mb-1">2. Interactive Tutorial</h4>
              <p className="text-xs">Walk through step-by-step request flows during interviews to visually demonstrate execution pipelines.</p>
            </div>
          </div>
          <div className="space-y-3 font-technical-sm text-sm text-on-surface-variant">
            <div className="p-3 bg-surface-container/50 border border-outline-variant/30 rounded">
              <h4 className="font-bold text-on-surface mb-1">3. Neural Link Chat</h4>
              <p className="text-xs">Conduct live queries against your backend Go server, showing parameter tuning and response telemetry in real-time.</p>
            </div>
            <div className="p-3 bg-surface-container/50 border border-outline-variant/30 rounded">
              <h4 className="font-bold text-on-surface mb-1">4. Live Observability</h4>
              <p className="text-xs">Watch the system status bar update at the bottom of the screen to verify liveness and latency indicators.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
