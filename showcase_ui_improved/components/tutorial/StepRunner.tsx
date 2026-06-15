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
  const [result, setResult] = useState<string>("Initiate any pipeline step to see telemetry readout.");
  const [status, setStatus] = useState<string>("-");
  const [lastStep, setLastStep] = useState<string>("-");
  const [completed, setCompleted] = useState<number>(0);

  const runStep = async (step: TutorialStep) => {
    setRunningId(step.id);
    setLastStep(step.title);
    setResult(`Executing API request: POST /v1/chat...\nPayload: ${JSON.stringify(step.payload, null, 2)}`);
    
    const res = await callGateway(step.payload);
    if (res.ok) {
      setStatus(String(res.status));
      setCompleted((n) => Math.min(steps.length, n + 1));
      setResult(`PASS: ${step.explanation}\n\n[RESPONSE]:\n${JSON.stringify(res.data, null, 2)}`);
    } else {
      setStatus(String(res.error.status));
      setResult(`BLOCKED/FAILED: status code ${res.error.status}\n\n[MESSAGE]:\n${res.error.message}\n\n[EXPL]:\n${step.explanation}`);
    }
    setRunningId("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
      <div className="space-y-4">
        {steps.map((step) => (
          <ChallengeCard key={step.id} step={step} onRun={runStep} isRunning={runningId === step.id} />
        ))}
      </div>
      <div className="glass-panel p-6 rounded-xl space-y-6 lg:sticky lg:top-24">
        <div>
          <h3 className="font-display text-lg font-bold text-primary">Live Output Readout</h3>
          <p className="font-technical-sm text-[10px] uppercase tracking-widest text-on-surface-variant">Real-time metrics from gateway middleware</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 font-technical-sm text-xs text-on-surface-variant">
          <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded">
            <div className="text-[9px] uppercase tracking-wider text-outline mb-1">Last Action</div>
            <div className="text-on-surface font-bold truncate">{lastStep}</div>
          </div>
          <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded">
            <div className="text-[9px] uppercase tracking-wider text-outline mb-1">Status Code</div>
            <div className={`font-bold ${status === "200" ? "text-primary" : status === "-" ? "text-on-surface" : "text-red-400"}`}>
              {status}
            </div>
          </div>
          <div className="col-span-2 border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded">
            <div className="flex justify-between text-[9px] uppercase tracking-wider text-outline mb-1">
              <span>Steps Accomplished</span>
              <span>{completed} / {steps.length}</span>
            </div>
            <div className="h-1.5 w-full bg-outline-variant/20 rounded overflow-hidden">
              <div 
                className="h-full bg-primary rounded transition-all duration-500" 
                style={{ width: `${(completed / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Telemetry Log</span>
          <pre className="whitespace-pre-wrap border border-outline-variant/30 bg-surface-container-lowest/70 p-4 text-[11px] font-technical-sm leading-relaxed text-on-surface-variant rounded-lg overflow-x-auto min-h-[160px] custom-scrollbar">
            {result}
          </pre>
        </div>
      </div>
    </div>
  );
}
