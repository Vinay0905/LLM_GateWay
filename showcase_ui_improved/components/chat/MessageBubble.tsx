"use client";

type MessageBubbleProps = {
  role: "user" | "assistant" | "system";
  content: string;
  meta?: string;
};

export function MessageBubble({ role, content, meta }: MessageBubbleProps) {
  const isUser = role === "user";
  const isSystem = role === "system";
  
  let bubbleClass = "chat-bubble-model border-l-4 border-primary/40";
  let roleColor = "text-primary";
  let iconName = "auto_awesome";
  
  if (isUser) {
    bubbleClass = "chat-bubble-user border-r-4 border-secondary/40 ml-auto";
    roleColor = "text-secondary";
    iconName = "person";
  } else if (isSystem) {
    bubbleClass = "border border-outline-variant/30 bg-surface-container-low/40";
    roleColor = "text-on-surface-variant";
    iconName = "info";
  }

  return (
    <div className={`flex flex-col space-y-1 max-w-[85%] ${isUser ? "ml-auto items-end" : "items-start"}`}>
      <div className="flex items-center gap-1.5 px-1 font-display text-[10px] tracking-wider uppercase font-semibold text-on-surface-variant">
        {!isUser && <span className={`material-symbols-outlined text-xs ${roleColor}`}>{iconName}</span>}
        <span className={roleColor}>{role.toUpperCase()}</span>
        {isUser && <span className={`material-symbols-outlined text-xs ${roleColor}`}>{iconName}</span>}
        {meta && <span className="opacity-60 text-[9px] tracking-normal font-technical-sm">({meta})</span>}
      </div>
      <div className={`p-4 rounded-xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap text-on-surface ${bubbleClass}`}>
        {content}
      </div>
    </div>
  );
}
