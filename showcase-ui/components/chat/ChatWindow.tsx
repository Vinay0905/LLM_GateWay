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
  return (
    <div className="flex h-[460px] flex-col gap-3 overflow-y-auto rounded-clean border border-neon-green/30 bg-black/35 p-3">
      {messages.length === 0 ? (
        <p className="text-sm text-neon-muted">No messages yet. Ask something in the panel below.</p>
      ) : (
        messages.map((msg) => <MessageBubble key={msg.id} role={msg.role} content={msg.content} meta={msg.meta} />)
      )}
    </div>
  );
}
