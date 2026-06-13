import { NeonButton } from "@/components/ui/NeonButton";
import { TutorialStep } from "@/lib/types";

type ChallengeCardProps = {
  step: TutorialStep;
  isRunning: boolean;
  onRun: (step: TutorialStep) => void;
};

export function ChallengeCard({ step, isRunning, onRun }: ChallengeCardProps) {
  return (
    <div className="glass-panel technical-card p-4">
      <h3 className="font-display text-lg text-[#ccff80]">{step.title}</h3>
      <p className="mt-2 text-sm text-[#e5e2e1]">{step.goal}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#c2cab0]">Expected status: {step.expectedStatus}</p>
      <div className="mt-4 flex justify-end">
        <NeonButton variant="outline" onClick={() => onRun(step)} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Step"}
        </NeonButton>
      </div>
    </div>
  );
}
