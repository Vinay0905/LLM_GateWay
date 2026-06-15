"use client";

import { FormEvent } from "react";
import { MODEL_OPTIONS } from "@/lib/constants";

type ChatInputProps = {
  prompt: string;
  model: string;
  loading: boolean;
  onPromptChange: (v: string) => void;
  onModelChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
};

export function ChatInput({ prompt, model, loading, onPromptChange, onModelChange, onSubmit }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !loading) {
        onSubmit(e as any);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[200px,1fr]">
        {/* Model Selector Selector */}
        <div className="relative flex flex-col justify-center">
          <label className="text-[9px] font-bold text-outline uppercase tracking-wider mb-1 px-1">Active Backend</label>
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full border border-outline-variant/50 bg-surface-container-lowest text-xs font-technical-sm px-3 py-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-lg transition-all"
          >
            {MODEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Input Textarea */}
        <div className="flex flex-col">
          <label className="text-[9px] font-bold text-outline uppercase tracking-wider mb-1 px-1">Message Stream</label>
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Establish secure command query..."
            className="h-16 md:h-20 border border-outline-variant/50 bg-surface-container-lowest text-xs font-technical-sm px-3 py-2 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-lg resize-none custom-scrollbar transition-all"
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        <span className="hidden sm:inline text-[9px] text-on-surface-variant/40 uppercase tracking-[0.2em] font-technical-sm">Press Enter to Send</span>
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-6 py-2.5 bg-primary text-background font-display text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <span className="h-2 w-2 bg-background rounded-full animate-ping"></span>
              <span>Running...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              <span>Send Query</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
