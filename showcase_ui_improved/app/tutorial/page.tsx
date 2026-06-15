import { StepRunner } from "@/components/tutorial/StepRunner";
import { TUTORIAL_STEPS } from "@/lib/constants";

export default function TutorialPage() {
  return (
    <div className="space-y-8 py-8">
      <header className="glass-panel p-8 rounded-xl relative overflow-hidden">
        <div className="mb-3 inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1 rounded">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Documentation: Core v2.4</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-on-surface font-bold">
          System <span className="text-primary">Integration</span>
        </h1>
        <p className="mt-4 max-w-3xl text-on-surface-variant font-technical-sm text-sm sm:text-base leading-relaxed">
          A step-by-step interactive walkthrough to validate your Go API gateway lifecycle. Execute each challenge step to verify health, auth guards, safety middleware, routing, and circuit breaker actions.
        </p>
      </header>

      {/* Steps quick indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Step 1: Health & Lifecycle", code: "200 OK" },
          { label: "Step 2: Safety Middleware", code: "400 BLOCKED" },
          { label: "Step 3: Routed Backends", code: "200 OK" },
          { label: "Step 4: Timeout Resilience", code: "503 SERVICE UNAVAILABLE" }
        ].map((s, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl text-center space-y-1 hover:border-primary/30 transition-all">
            <div className="text-[9px] font-bold text-outline uppercase tracking-wider">{s.label}</div>
            <div className="font-display text-xs text-secondary font-bold uppercase tracking-widest">{s.code}</div>
          </div>
        ))}
      </div>

      <StepRunner steps={TUTORIAL_STEPS} />
    </div>
  );
}
