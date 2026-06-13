type MessageBubbleProps = {
  role: "user" | "assistant" | "system";
  content: string;
  meta?: string;
};

export function MessageBubble({ role, content, meta }: MessageBubbleProps) {
  const isUser = role === "user";
  const roleLabel = role.toUpperCase();
  return (
    <div className={`rounded-xl border px-3 py-2 ${isUser ? "border-[#2fd9f4]/30 bg-[#2fd9f4]/8" : "border-[#a3e635]/25 bg-[#a3e635]/7"}`}>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className={isUser ? "text-[#5de6ff]" : "text-[#ccff80]"}>{roleLabel}</span>
        {meta ? <span className="text-[#c2cab0]">{meta}</span> : null}
      </div>
      <p className="whitespace-pre-wrap text-sm text-[#e5e2e1]">{content}</p>
    </div>
  );
}
