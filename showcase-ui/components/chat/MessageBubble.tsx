type MessageBubbleProps = {
  role: "user" | "assistant" | "system";
  content: string;
  meta?: string;
};

export function MessageBubble({ role, content, meta }: MessageBubbleProps) {
  const isUser = role === "user";
  const roleLabel = role.toUpperCase();
  return (
    <div className={`rounded-clean border px-3 py-2 ${isUser ? "border-neon-cyan/40 bg-neon-cyan/10" : "border-neon-green/35 bg-neon-panel/75"}`}>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className={isUser ? "text-neon-cyan" : "text-neon-green"}>{roleLabel}</span>
        {meta ? <span className="text-neon-muted">{meta}</span> : null}
      </div>
      <p className="whitespace-pre-wrap text-sm text-neon-text">{content}</p>
    </div>
  );
}
