type OutputPanelProps = {
  status: string;
  provider: string;
  body: string;
  debug: string;
};

export function OutputPanel({ status, provider, body, debug }: OutputPanelProps) {
  return (
    <section className="rounded-clean border border-neon-green/30 bg-black/45 p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <p className="text-xs text-neon-muted">Status</p>
          <p className="font-semibold text-neon-text">{status}</p>
        </div>
        <div>
          <p className="text-xs text-neon-muted">Provider</p>
          <p className="font-semibold text-neon-text">{provider || "-"}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs text-neon-muted">Response Body</p>
          <pre className="mt-1 whitespace-pre-wrap rounded-clean border border-neon-green/25 bg-black/55 p-3 text-xs text-neon-text">{body}</pre>
        </div>
        <div>
          <p className="text-xs text-neon-muted">Debug Headers</p>
          <pre className="mt-1 whitespace-pre-wrap rounded-clean border border-neon-cyan/25 bg-black/55 p-3 text-xs text-neon-text">{debug}</pre>
        </div>
      </div>
    </section>
  );
}
