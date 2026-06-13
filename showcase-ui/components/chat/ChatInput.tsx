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
          className="border border-[#424936] bg-[#0e0e0e] px-3 py-2 text-sm text-[#e5e2e1] focus:outline-none focus:ring-2 focus:ring-[#ccff80]"
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
          className="h-24 border border-[#424936] bg-[#0e0e0e] px-3 py-2 text-sm text-[#e5e2e1] placeholder:text-[#8c947c] focus:outline-none focus:ring-2 focus:ring-[#ccff80]"
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
