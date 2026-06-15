"use client";

import { TutorialStep } from "@/lib/types";

type ChallengeCardProps = {
  step: TutorialStep;
  isRunning: boolean;
  onRun: (step: TutorialStep) => void;
};

export function ChallengeCard({ step, isRunning, onRun }: ChallengeCardProps) {
  return (
    <div className="glass-panel technical-card p-5 rounded-xl flex flex-col justify-between hover:border-primary/40 transition-all gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg font-bold text-primary">{step.title}</h3>
          <span className="font-technical-sm text-[10px] px-2 py-0.5 border border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant uppercase tracking-widest rounded-sm">
            EXPECTED: {step.expectedStatus}
          </span>
        </div>
        <p className="font-technical-sm text-sm text-on-surface-variant leading-relaxed">
          {step.goal}
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => onRun(step)}
          disabled={isRunning}
          className="px-4 py-2 border border-outline-variant bg-surface-container-lowest hover:border-primary hover:text-primary disabled:opacity-50 font-display text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
        >
          {isRunning ? "Running..." : "Run Step"}
        </button>
      </div>
    </div>
  );
}
