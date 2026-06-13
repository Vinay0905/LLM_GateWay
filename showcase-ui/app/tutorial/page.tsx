import { StepRunner } from "@/components/tutorial/StepRunner";
import { NeonCard } from "@/components/ui/NeonCard";
import { TUTORIAL_STEPS } from "@/lib/constants";

export default function TutorialPage() {
  return (
    <div className="space-y-6">
      <NeonCard title="Interactive Tutorial" subtitle="Run guided scenarios and watch gateway behavior in real time.">
        <p className="text-sm text-neon-text">
          Each challenge represents one core product value: lifecycle clarity, safety enforcement, routing transparency, and resilience handling.
        </p>
      </NeonCard>
      <StepRunner steps={TUTORIAL_STEPS} />
    </div>
  );
}
