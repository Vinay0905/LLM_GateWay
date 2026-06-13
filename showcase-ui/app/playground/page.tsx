"use client";

import { useState } from "react";
import { OutputPanel } from "@/components/playground/OutputPanel";
import { SnippetGrid } from "@/components/playground/SnippetGrid";
import { SNIPPETS } from "@/lib/constants";
import { callGateway } from "@/lib/gateway-client";
import { SnippetPreset } from "@/lib/types";

export default function PlaygroundPage() {
  const [loadingId, setLoadingId] = useState("");
  const [status, setStatus] = useState("-");
  const [provider, setProvider] = useState("-");
  const [body, setBody] = useState("Run a snippet to see live output.");
  const [debug, setDebug] = useState("No debug headers captured yet.");

  const runSnippet = async (snippet: SnippetPreset) => {
    setLoadingId(snippet.id);
    const res = await callGateway(snippet.payload);

    const debugHeaders = [
      ["x-debug-primary-provider", res.headers.get("x-debug-primary-provider")],
      ["x-debug-selected-provider", res.headers.get("x-debug-selected-provider")],
      ["x-debug-fallback", res.headers.get("x-debug-fallback")],
      ["x-debug-breaker-state-before", res.headers.get("x-debug-breaker-state-before")],
      ["x-debug-breaker-state-after", res.headers.get("x-debug-breaker-state-after")]
    ]
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    if (res.ok) {
      setStatus(String(res.status));
      setProvider(res.data.provider || "-");
      setBody(JSON.stringify(res.data, null, 2));
      setDebug(debugHeaders || "Debug headers not enabled. Set DEBUG_HEADERS=true in gateway.");
    } else {
      setStatus(String(res.error.status));
      setProvider("-");
      setBody(res.error.body || res.error.message);
      setDebug(debugHeaders || "Debug headers not enabled. Set DEBUG_HEADERS=true in gateway.");
    }

    setLoadingId("");
  };

  return (
    <div className="space-y-8">
      <header className="glass-panel p-6">
        <h1 className="font-display text-5xl uppercase tracking-tight text-[#e5e2e1]">
          Playground <span className="text-[#ccff80]">Console</span>
        </h1>
        <p className="mt-3 max-w-3xl text-[#c2cab0]">Launch curated scenarios and inspect status, provider selection, and debug headers in one panel.</p>
      </header>
      <section className="glass-panel p-5">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[#ccff80]">recommended execution order</p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-[#e5e2e1]">
          <li>Run Safe Prompt first (baseline healthy route).</li>
          <li>Run Safety Block to show sidecar enforcement.</li>
          <li>Run Retry/Timeout scenarios to demonstrate resilience.</li>
        </ol>
      </section>
      <SnippetGrid snippets={SNIPPETS} loadingId={loadingId} onRun={runSnippet} />
      <OutputPanel status={status} provider={provider} body={body} debug={debug} />
    </div>
  );
}
