"use client";

import { SnippetPreset } from "@/lib/types";

type SnippetGridProps = {
  snippets: SnippetPreset[];
  loadingId: string;
  onRun: (snippet: SnippetPreset) => void;
};

export function SnippetGrid({ snippets, loadingId, onRun }: SnippetGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {snippets.map((snippet) => (
        <article key={snippet.id} className="glass-panel technical-card p-6 rounded-xl flex flex-col justify-between hover:border-primary/50 transition-all gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-lg font-bold text-primary">{snippet.title}</h3>
              <span className="font-technical-sm text-[9px] px-2 py-0.5 border border-outline-variant/40 bg-surface-container-lowest text-secondary uppercase tracking-widest rounded-sm font-semibold">
                {snippet.model.toUpperCase()}
              </span>
            </div>
            <p className="font-technical-sm text-sm text-on-surface-variant leading-relaxed">
              {snippet.description}
            </p>
            <p className="mt-3 font-technical-sm text-[11px] uppercase tracking-wider text-outline">
              EXPECTED: <span className="text-on-surface font-semibold">{snippet.expected}</span>
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <button
              disabled={loadingId === snippet.id}
              onClick={() => onRun(snippet)}
              className="px-4 py-2 border border-outline-variant bg-surface-container-lowest hover:border-primary hover:text-primary disabled:opacity-50 font-display text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
            >
              {loadingId === snippet.id ? "Executing..." : "Run Snippet"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
