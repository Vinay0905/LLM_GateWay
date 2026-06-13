"use client";

import { useState } from "react";
import { ChallengeCard } from "@/components/tutorial/ChallengeCard";
import { NeonCard } from "@/components/ui/NeonCard";
import { StatPill } from "@/components/ui/StatPill";
import { callGateway } from "@/lib/gateway-client";
import { TutorialStep } from "@/lib/types";

type StepRunnerProps = {
  steps: TutorialStep[];
};

export function StepRunner({ steps }: StepRunnerProps) {
  const [runningId, setRunningId] = useState<string>("");
  const [result, setResult] = useState<string>("Run a tutorial step to inspect live behavior.");
  const [status, setStatus] = useState<string>("-");
  const [lastStep, setLastStep] = useState<string>("-");

  const runStep = async (step: TutorialStep) => {
    setRunningId(step.id);
    setLastStep(step.title);
    const res = await callGateway(step.payload);
    if (res.ok) {
      setStatus(String(res.status));
      setResult(`PASS: ${step.explanation}\n\nOutput: ${res.data.output}`);
    } else {
      setStatus(String(res.error.status));
      setResult(`Observed error: ${res.error.message}\n\nTip: ${step.explanation}`);
    }
    setRunningId("");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-3">
        {steps.map((step) => (
          <ChallengeCard key={step.id} step={step} onRun={runStep} isRunning={runningId === step.id} />
        ))}
      </div>
      <NeonCard title="Live Tutorial Output" subtitle="Real-time result from gateway calls.">
        <div className="grid grid-cols-2 gap-2">
          <StatPill label="Last Step" value={lastStep} />
          <StatPill label="Status" value={status} />
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-clean border border-neon-green/30 bg-black/45 p-3 text-xs text-neon-text">{result}</pre>
      </NeonCard>
    </div>
  );
}
