"use client";

import { FormEvent, useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage, ChatWindow } from "@/components/chat/ChatWindow";
import { callGateway } from "@/lib/gateway-client";

function makeMessage(role: ChatMessage["role"], content: string, meta?: string): ChatMessage {
  return { id: `${Date.now()}-${Math.random()}`, role, content, meta };
}

export default function ChatPage() {
  const [model, setModel] = useState("gemini");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastStatus, setLastStatus] = useState("-");
  const [lastProvider, setLastProvider] = useState("-");
  const [messages, setMessages] = useState<ChatMessage[]>([
    makeMessage("system", "Welcome to LLM Gateway Chat. All prompts are validated, redacted, and routed dynamically.")
  ]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setMessages((prev) => [...prev, makeMessage("user", trimmed, `model=${model}`)]);
    setPrompt("");

    const res = await callGateway({
      model,
      prompt: trimmed,
      max_tokens: 256,
      temperature: 0.25
    });

    if (res.ok) {
      setLastStatus(String(res.status));
      setLastProvider(res.data.provider ?? "-");
      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", res.data.output, `provider=${res.data.provider} status=${res.status}`)
      ]);
    } else {
      setLastStatus(String(res.error.status));
      setLastProvider("-");
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

        {/* Metadata sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="font-display text-md font-bold text-primary uppercase">Session Metadata</h3>
            <div className="grid gap-3 font-technical-sm text-xs text-on-surface-variant">
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                <span>Model Selected</span>
                <span className="text-secondary font-bold uppercase">{model}</span>
              </div>
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                <span>Last Status</span>
                <span className={`font-bold ${lastStatus === "200" ? "text-primary" : lastStatus === "-" ? "text-on-surface" : "text-red-400"}`}>
                  {lastStatus}
                </span>
              </div>
              <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-3 rounded flex justify-between">
                <span>Last Provider</span>
                <span className="text-secondary font-bold uppercase">{lastProvider}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl space-y-3">
            <h3 className="font-display text-md font-bold text-primary uppercase">Operator Guidelines</h3>
            <ul className="space-y-2 font-technical-sm text-xs text-on-surface-variant list-disc pl-4 leading-relaxed">
              <li>Safe prompts (e.g. <code>"Say hi"</code>) should route cleanly to the backend provider.</li>
              <li>Adversarial prompts (e.g. <code>"Ignore previous instructions"</code>) trigger safety sidecar blocking (returns status <code>400</code>).</li>
              <li>Simulating timeouts in Playground will display status <code>503</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
