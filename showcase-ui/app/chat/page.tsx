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
    makeMessage("system", "Welcome to LLM Gateway Chat. All traffic goes through the gateway.")
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
    <div className="space-y-8">
      <header className="glass-panel p-6">
        <h1 className="font-display text-5xl uppercase tracking-tight text-[#e5e2e1]">
          Neural <span className="text-[#ccff80]">Link</span>
        </h1>
        <p className="mt-3 max-w-3xl text-[#c2cab0]">Live chat interface connected to your gateway runtime with metadata and route visibility.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-[1.7fr,1fr]">
        <div className="space-y-4">
          <ChatWindow messages={messages} />
          <div className="glass-panel p-4">
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
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="font-display text-xl text-[#ccff80]">Session Metadata</h3>
            <div className="mt-3 grid gap-2 text-sm text-[#e5e2e1]">
              <div className="border border-[#424936] bg-[#0e0e0e] p-2">Current Model: {model}</div>
              <div className="border border-[#424936] bg-[#0e0e0e] p-2">Last Status: {lastStatus}</div>
              <div className="border border-[#424936] bg-[#0e0e0e] p-2">Last Provider: {lastProvider}</div>
            </div>
          </div>
          <div className="glass-panel p-4">
            <h3 className="font-display text-xl text-[#ccff80]">Operator Notes</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#e5e2e1]">
              <li>Safe prompts should return 200.</li>
              <li>Blocked prompts return 400.</li>
              <li>Resilience simulations can return 503.</li>
              <li>Switch model to show routing abstraction.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
