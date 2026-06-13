import { FormEvent } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
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
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-[180px,1fr]">
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="rounded-clean border border-neon-green/40 bg-black/60 px-3 py-2 text-sm text-neon-text focus:outline-none focus:ring-2 focus:ring-neon-green"
        >
          {MODEL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Ask gateway-backed AI..."
          className="h-24 rounded-clean border border-neon-green/40 bg-black/60 px-3 py-2 text-sm text-neon-text placeholder:text-neon-muted focus:outline-none focus:ring-2 focus:ring-neon-green"
        />
      </div>
      <div className="flex justify-end">
        <NeonButton type="submit" disabled={loading || !prompt.trim()}>
          {loading ? "Running..." : "Send"}
        </NeonButton>
      </div>
    </form>
  );
}
