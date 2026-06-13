import { StepRunner } from "@/components/tutorial/StepRunner";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TUTORIAL_STEPS } from "@/lib/constants";

export default function TutorialPage() {
  return (
    <div className="space-y-7">
      <SectionHeading
        tag="interactive training"
        title="Gateway Tutorial Mode"
        subtitle="Run each guided mission and compare observed behavior against expected architecture outcomes."
      />
      <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <NeonCard title="Mission Brief">
          <ul className="list-disc space-y-2 pl-5 text-sm text-neon-text">
            <li>Step 1 verifies baseline request lifecycle.</li>
            <li>Step 2 validates safety block enforcement.</li>
            <li>Step 3 confirms provider route behavior.</li>
            <li>Step 4 simulates resilience failure path.</li>
          </ul>
        </NeonCard>
        <NeonCard title="Scoring">
          <p className="font-dot text-xs uppercase tracking-[0.15em] text-neon-cyan">target status map</p>
          <div className="mt-3 space-y-2 text-sm text-neon-text">
            <p>Step 1 -> 200</p>
            <p>Step 2 -> 400</p>
            <p>Step 3 -> 200</p>
            <p>Step 4 -> 503</p>
          </div>
        </NeonCard>
      </div>
      <StepRunner steps={TUTORIAL_STEPS} />
    </div>
  );
}
