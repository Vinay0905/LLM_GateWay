import { NeonButton } from "@/components/ui/NeonButton";
import { TutorialStep } from "@/lib/types";

type ChallengeCardProps = {
  step: TutorialStep;
  isRunning: boolean;
  onRun: (step: TutorialStep) => void;
};

export function ChallengeCard({ step, isRunning, onRun }: ChallengeCardProps) {
  return (
    <div className="rounded-clean border border-neon-green/30 bg-neon-panel/70 p-4">
      <h3 className="text-base font-semibold text-neon-green">{step.title}</h3>
      <p className="mt-1 text-sm text-neon-text">{step.goal}</p>
      <p className="mt-2 text-xs text-neon-muted">Expected status: {step.expectedStatus}</p>
      <div className="mt-4 flex justify-end">
        <NeonButton variant="outline" onClick={() => onRun(step)} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Step"}
        </NeonButton>
      </div>
    </div>
  );
}
