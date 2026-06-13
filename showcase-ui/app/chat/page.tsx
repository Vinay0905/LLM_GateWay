"use client";

import { FormEvent, useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage, ChatWindow } from "@/components/chat/ChatWindow";
import { NeonCard } from "@/components/ui/NeonCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatPill } from "@/components/ui/StatPill";
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
    <div className="space-y-7">
      <SectionHeading
        tag="live console"
        title="Gateway Chat Interface"
        subtitle="Use this for realistic conversation demos while still exposing technical metadata for reviewer trust."
      />
      <div className="grid gap-4 lg:grid-cols-[1.7fr,1fr]">
        <div className="space-y-4">
          <ChatWindow messages={messages} />
          <NeonCard title="Send Message">
            <ChatInput
              prompt={prompt}
              model={model}
              loading={loading}
              onPromptChange={setPrompt}
              onModelChange={setModel}
              onSubmit={onSubmit}
            />
          </NeonCard>
        </div>
        <div className="space-y-4">
          <NeonCard title="Session Metadata">
            <div className="grid gap-2">
              <StatPill label="Current Model" value={model} />
              <StatPill label="Last Status" value={lastStatus} />
              <StatPill label="Last Provider" value={lastProvider} />
            </div>
          </NeonCard>
          <NeonCard title="Operator Notes">
            <ul className="list-disc space-y-2 pl-5 text-sm text-neon-text">
              <li>Safe prompts should return 200.</li>
              <li>Blocked prompts return 400.</li>
              <li>Resilience simulations can return 503.</li>
              <li>Switch model to show routing abstraction.</li>
            </ul>
          </NeonCard>
        </div>
      </div>
    </div>
  );
}
