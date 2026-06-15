"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  meta?: string;
};

type ChatWindowProps = {
  messages: ChatMessage[];
};

export function ChatWindow({ messages }: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={containerRef}
      className="glass-panel flex h-[500px] flex-col gap-4 overflow-y-auto p-6 rounded-xl custom-scrollbar"
    >
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center p-6 space-y-2">
          <span className="material-symbols-outlined text-outline text-[48px] animate-pulse">forum</span>
          <p className="font-display text-sm font-bold text-on-surface-variant uppercase tracking-widest">Secure link idle</p>
          <p className="font-technical-sm text-xs text-outline">Establish a connection by asking the gateway an inference query below.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} content={msg.content} meta={msg.meta} />
        ))
      )}
    </div>
  );
}
