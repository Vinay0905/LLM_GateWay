"use client";

import { useState } from "react";
import { ChallengeCard } from "@/components/tutorial/ChallengeCard";
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
  const [completed, setCompleted] = useState<number>(0);

  const runStep = async (step: TutorialStep) => {
    setRunningId(step.id);
    setLastStep(step.title);
    const res = await callGateway(step.payload);
    if (res.ok) {
      setStatus(String(res.status));
      setCompleted((n) => Math.min(steps.length, n + 1));
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
      <div className="glass-panel p-4">
        <h3 className="font-display text-xl text-[#ccff80]">Live Tutorial Output</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#c2cab0]">Real-time result from gateway calls</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.12em] text-[#c2cab0]">
          <div className="border border-[#424936] bg-[#0e0e0e] p-2">Last Step: {lastStep}</div>
          <div className="border border-[#424936] bg-[#0e0e0e] p-2">Status: {status}</div>
          <div className="col-span-2 border border-[#424936] bg-[#0e0e0e] p-2">
            Progress: {completed}/{steps.length}
          </div>
        </div>
        <pre className="mt-4 whitespace-pre-wrap border border-[#424936] bg-[#0e0e0e] p-3 text-xs text-[#e5e2e1]">{result}</pre>
      </div>
    </div>
  );
}
