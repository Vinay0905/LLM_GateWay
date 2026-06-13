import { NeonButton } from "@/components/ui/NeonButton";
import { SnippetPreset } from "@/lib/types";

type SnippetGridProps = {
  snippets: SnippetPreset[];
  loadingId: string;
  onRun: (snippet: SnippetPreset) => void;
};

export function SnippetGrid({ snippets, loadingId, onRun }: SnippetGridProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {snippets.map((snippet) => (
        <article key={snippet.id} className="glass-panel technical-card p-4">
          <h3 className="font-display text-lg text-[#ccff80]">{snippet.title}</h3>
          <p className="mt-1 text-sm text-[#e5e2e1]">{snippet.description}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#c2cab0]">Expected: {snippet.expected}</p>
          <div className="mt-4">
            <NeonButton variant="outline" disabled={loadingId === snippet.id} onClick={() => onRun(snippet)}>
              {loadingId === snippet.id ? "Running..." : "Run Snippet"}
            </NeonButton>
          </div>
        </article>
      ))}
    </div>
  );
}
