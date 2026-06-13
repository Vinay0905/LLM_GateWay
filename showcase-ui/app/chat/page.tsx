"use client";

import { FormEvent, useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage, ChatWindow } from "@/components/chat/ChatWindow";
import { NeonCard } from "@/components/ui/NeonCard";
import { callGateway } from "@/lib/gateway-client";

function makeMessage(role: ChatMessage["role"], content: string, meta?: string): ChatMessage {
  return { id: `${Date.now()}-${Math.random()}`, role, content, meta };
}

export default function ChatPage() {
  const [model, setModel] = useState("gemini");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
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
      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", res.data.output, `provider=${res.data.provider} status=${res.status}`)
      ]);
    } else {
      setMessages((prev) => [...prev, makeMessage("system", res.error.message, `status=${res.error.status}`)]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <NeonCard title="Gateway Chat" subtitle="Real chat mode with model selection and response metadata.">
        <p className="text-sm text-neon-text">
          This chat is intentionally simple and transparent so you can demo the gateway behavior, not hide it.
        </p>
      </NeonCard>
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
  );
}
