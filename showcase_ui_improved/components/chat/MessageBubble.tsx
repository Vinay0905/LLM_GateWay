"use client";

type MessageBubbleProps = {
  role: "user" | "assistant" | "system";
  content: string;
  meta?: string;
  maskedPrompt?: string;
  piiTypes?: string[];
};

export function MessageBubble({ role, content, meta, maskedPrompt, piiTypes }: MessageBubbleProps) {
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

  const hasPii = isUser && maskedPrompt && maskedPrompt !== content;

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
        
        {hasPii && (
          <div className="mt-3 border border-red-500/20 bg-background/60 rounded-lg p-3 text-xs font-technical-sm space-y-2 text-left">
            <div className="flex items-center justify-between text-[10px] text-primary uppercase font-bold tracking-wider">
              <span className="flex items-center gap-1 text-red-400">
                <span className="material-symbols-outlined text-[12px]">security</span>
                Sidecar PII Redaction
              </span>
              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[8px]">Shield Active</span>
            </div>
            
            <div className="grid gap-2">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/70">Original Input (Redacted local path):</span>
                <div className="p-2 border border-red-500/20 bg-red-500/5 rounded text-red-300/80 line-through decoration-red-500 font-mono">
                  {content}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/70">Anonymized payload sent to LLM:</span>
                <div className="p-2 border border-primary/20 bg-primary/5 rounded text-primary font-mono">
                  {maskedPrompt}
                </div>
              </div>
            </div>

            {piiTypes && piiTypes.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center pt-1">
                <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 mr-1">Masked Types:</span>
                {piiTypes.map((type) => (
                  <span key={type} className="px-1.5 py-0.5 bg-outline-variant/20 border border-outline-variant/30 text-on-surface-variant rounded text-[9px] font-bold tracking-wider">
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
