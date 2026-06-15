"use client";

type OutputPanelProps = {
  status: string;
  provider: string;
  body: string;
  debug: string;
};

export function OutputPanel({ status, provider, body, debug }: OutputPanelProps) {
  const isError = status !== "200" && status !== "-";
  
  return (
    <section className="glass-panel p-6 rounded-xl space-y-6">
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        <h2 className="font-display text-lg font-bold text-primary uppercase">Readout Metrics</h2>
        <span className="font-technical-sm text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Telemetry Teleport</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-4 rounded-lg">
          <p className="font-technical-sm text-[10px] uppercase tracking-wider text-outline mb-1">Response Status</p>
          <p className={`font-display text-2xl font-bold ${isError ? "text-red-400" : status === "200" ? "text-primary" : "text-on-surface"}`}>
            {status}
          </p>
        </div>
        <div className="border border-outline-variant/30 bg-surface-container-lowest/50 p-4 rounded-lg">
          <p className="font-technical-sm text-[10px] uppercase tracking-wider text-outline mb-1">Assigned Provider</p>
          <p className="font-display text-2xl font-bold text-secondary uppercase">
            {provider || "-"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <p className="font-technical-sm text-[10px] font-bold uppercase tracking-wider text-outline">Response Body</p>
          <pre className="whitespace-pre-wrap border border-outline-variant/30 bg-surface-container-lowest/70 p-4 text-xs font-technical-sm text-on-surface-variant rounded-lg overflow-x-auto min-h-[180px] max-h-[350px] custom-scrollbar">
            {body}
          </pre>
        </div>
        <div className="space-y-2">
          <p className="font-technical-sm text-[10px] font-bold uppercase tracking-wider text-outline">HTTP Debug Headers</p>
          <pre className="whitespace-pre-wrap border border-outline-variant/30 bg-surface-container-lowest/70 p-4 text-xs font-technical-sm text-secondary rounded-lg overflow-x-auto min-h-[180px] max-h-[350px] custom-scrollbar">
            {debug}
          </pre>
        </div>
      </div>
    </section>
  );
}
