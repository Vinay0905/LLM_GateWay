type OutputPanelProps = {
  status: string;
  provider: string;
  body: string;
  debug: string;
};

export function OutputPanel({ status, provider, body, debug }: OutputPanelProps) {
  return (
    <section className="glass-panel p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#c2cab0]">Status</p>
          <p className="font-display text-lg text-[#e5e2e1]">{status}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#c2cab0]">Provider</p>
          <p className="font-display text-lg text-[#e5e2e1]">{provider || "-"}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#c2cab0]">Response Body</p>
          <pre className="mt-1 whitespace-pre-wrap border border-[#424936] bg-[#0e0e0e] p-3 text-xs text-[#e5e2e1]">{body}</pre>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#c2cab0]">Debug Headers</p>
          <pre className="mt-1 whitespace-pre-wrap border border-[#424936] bg-[#0e0e0e] p-3 text-xs text-[#5de6ff]">{debug}</pre>
        </div>
      </div>
    </section>
  );
}
