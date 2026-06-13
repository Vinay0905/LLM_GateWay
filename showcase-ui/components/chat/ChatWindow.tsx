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
    <div className="glass-panel flex h-[520px] flex-col gap-3 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <p className="text-sm text-[#c2cab0]">No messages yet. Ask something in the panel below.</p>
      ) : (
        messages.map((msg) => <MessageBubble key={msg.id} role={msg.role} content={msg.content} meta={msg.meta} />)
      )}
    </div>
  );
}
