"use client";

import { FormEvent, useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage, ChatWindow } from "@/components/chat/ChatWindow";
import { callGateway } from "@/lib/gateway-client";
import LatencySparkline from "@/components/LatencySparkline";


function makeMessage(role: ChatMessage["role"], content: string, meta?: string): ChatMessage {
  return { id: `${Date.now()}-${Math.random()}`, role, content, meta };
}

export default function ChatPage() {
  const [model, setModel] = useState("gemini");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastStatus, setLastStatus] = useState("-");
  const [lastProvider, setLastProvider] = useState("-");
  
  // Model Parameters state
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(256);

  // Failure simulation state
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);

  // Resilience headers state
  const [resilience, setResilience] = useState({
    breakerBefore: "-",
    breakerAfter: "-",
    fallback: "NO",
    fallbackFrom: "-"
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    makeMessage("system", "Welcome to LLM Gateway Chat. All prompts are validated, redacted, and routed dynamically.")
  ]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    
    const userMsgId = `${Date.now()}-${Math.random()}`;
    const userMsg = {
      id: userMsgId,
      role: "user" as const,
      content: trimmed,
      meta: `model=${model}`
    };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");

    const res = await callGateway({
      model,
      prompt: trimmed,
      max_tokens: maxTokens,
      temperature: temperature,
      metadata: simulateFailure ? { simulate_mode: "permanent" } : undefined
    });

    const maskedPromptHeader = res.headers.get("x-masked-prompt");
    const piiTypesHeader = res.headers.get("x-pii-types");
    const maskedPrompt = maskedPromptHeader ? decodeURIComponent(maskedPromptHeader) : undefined;
    const piiTypes = piiTypesHeader ? piiTypesHeader.split(",") : undefined;

    if (maskedPrompt && maskedPrompt !== trimmed) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId
            ? { ...msg, maskedPrompt, piiTypes }
            : msg
        )
      );
    }

    if (res.ok) {
      setLastStatus(String(res.status));
      setLastProvider(res.data.provider ?? "-");
      
      const isFallback = res.headers.get("x-debug-fallback") === "true";
      setResilience({
        breakerBefore: res.headers.get("x-debug-breaker-state-before") || "CLOSED",
        breakerAfter: res.headers.get("x-debug-breaker-state-after") || "CLOSED",
        fallback: isFallback ? "YES (Fallback Active)" : "NO",
        fallbackFrom: res.headers.get("x-debug-fallback-from") || "-"
      });

      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", res.data.output, `provider=${res.data.provider} status=${res.status}`)
      ]);
    } else {
      setLastStatus(String(res.error.status));
      setLastProvider("-");
      
      const isFallback = res.headers.get("x-debug-fallback") === "true";
      setResilience({
        breakerBefore: res.headers.get("x-debug-breaker-state-before") || "-",
        breakerAfter: res.headers.get("x-debug-breaker-state-after") || "-",
        fallback: isFallback ? "YES" : "NO",
        fallbackFrom: res.headers.get("x-debug-fallback-from") || "-"
      });

      setMessages((prev) => [...prev, makeMessage("system", res.error.message, `status=${res.error.status}`)]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <header className="glass-panel p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 font-display text-[60px] text-secondary/10 select-none font-bold uppercase leading-none">
          NEURAL_LINK
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-on-surface font-bold">
          Neural <span className="text-primary">Link</span>
        </h1>
        <p className="mt-4 max-w-3xl text-on-surface-variant font-technical-sm text-sm sm:text-base leading-relaxed">
          Live chat interface connected directly to your Go gateway backend server. View response headers, provider status codes, and active route selections.
        </p>
      </header>

      {/* Columns */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
        {/* Chat window & Input */}
        <div className="space-y-4">
          <ChatWindow messages={messages} />
          <div className="glass-panel p-5 rounded-xl">
            <ChatInput
              prompt={prompt}
              model={model}
              loading={loading}
              onPromptChange={setPrompt}
              onModelChange={setModel}
              onSubmit={onSubmit}
            />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-4 lg:sticky lg:top-24">
          
          {/* Model Parameters Panel */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="font-display text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Model Parameters
            </h3>
            <div className="space-y-4 font-technical-sm text-xs text-on-surface-variant">
              {/* Temperature Slider */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Temperature</span>
                  <span className="text-primary font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Max Tokens Slider */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Max Tokens</span>
                  <span className="text-primary font-bold">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="64"
                  max="1024"
                  step="16"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full h-1 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Outage Simulation / Fault Injection */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="font-display text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">report</span>
              Fault Injection
            </h3>
            <div className="flex items-center justify-between p-3 border border-red-500/20 bg-red-500/5 rounded-lg">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-on-surface">Simulate Gemini Outage</span>
                <span className="text-[10px] text-on-surface-variant/70">Force permanent error responses</span>
              </div>
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="h-4 w-4 bg-surface-container border-outline rounded text-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* Telemetry Sidebar */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="font-display text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              Route Telemetry
            </h3>
            <div className="grid gap-3 font-technical-sm text-xs text-on-surface-variant">
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                <span>Model Target</span>
                <span className="text-secondary font-bold uppercase">{model}</span>
              </div>
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                <span>Last Response Code</span>
                <span className={`font-bold ${lastStatus === "200" ? "text-primary" : lastStatus === "-" ? "text-on-surface" : "text-red-400"}`}>
                  {lastStatus}
                </span>
              </div>
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                <span>Served Provider</span>
                <span className="text-secondary font-bold uppercase">{lastProvider}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-outline-variant/20">
              <LatencySparkline />
            </div>
          </div>

          {/* Resilience Header Monitoring */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="font-display text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">resilience</span>
              Gateway Breaker Telemetry
            </h3>
            <div className="grid gap-3 font-technical-sm text-xs text-on-surface-variant">
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                <span>Breaker State Before</span>
                <span className="text-on-surface font-bold uppercase">{resilience.breakerBefore}</span>
              </div>
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                <span>Breaker State After</span>
                <span className="text-on-surface font-bold uppercase">{resilience.breakerAfter}</span>
              </div>
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                <span>Provider Fallback?</span>
                <span className={`font-bold ${resilience.fallback !== "NO" ? "text-red-400" : "text-on-surface"}`}>{resilience.fallback}</span>
              </div>
              {resilience.fallbackFrom !== "-" && (
                <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                  <span>Fallback From</span>
                  <span className="text-red-400 font-bold uppercase">{resilience.fallbackFrom}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
