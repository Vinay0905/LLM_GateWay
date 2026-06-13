import { StepRunner } from "@/components/tutorial/StepRunner";
import { TUTORIAL_STEPS } from "@/lib/constants";

export default function TutorialPage() {
  return (
    <div className="space-y-8">
      <header className="glass-panel p-6">
        <div className="mb-3 inline-flex items-center gap-2 border border-[#ccff80]/20 bg-[#ccff80]/5 px-3 py-1">
          <span className="text-xs uppercase tracking-[0.16em] text-[#ccff80]">Documentation: Core v2.4</span>
        </div>
        <h1 className="font-display text-5xl uppercase tracking-tight text-[#e5e2e1]">
          System <span className="text-[#ccff80]">Integration</span>
        </h1>
        <p className="mt-3 max-w-3xl text-[#c2cab0]">
          A technical guide to implementing and validating gateway flow: lifecycle, safety, routing, and resilience.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        {["Step 1 200", "Step 2 400", "Step 3 200", "Step 4 503"].map((s) => (
          <div key={s} className="glass-panel p-3 text-center text-xs uppercase tracking-[0.14em] text-[#c2cab0]">
            {s}
          </div>
        ))}
      </div>
      <StepRunner steps={TUTORIAL_STEPS} />
    </div>
  );
}
