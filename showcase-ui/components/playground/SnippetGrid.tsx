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
        <article key={snippet.id} className="rounded-clean border border-neon-green/30 bg-neon-panel/70 p-4">
          <h3 className="text-base font-semibold text-neon-green">{snippet.title}</h3>
          <p className="mt-1 text-sm text-neon-text">{snippet.description}</p>
          <p className="mt-2 text-xs text-neon-muted">Expected: {snippet.expected}</p>
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
