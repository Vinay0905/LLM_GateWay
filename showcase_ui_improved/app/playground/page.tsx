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
  const [body, setBody] = useState("Run a snippet preset to inspect Live output.");
  const [debug, setDebug] = useState("No debug headers captured yet.");

  const runSnippet = async (snippet: SnippetPreset) => {
    setLoadingId(snippet.id);
    setStatus("...");
    setProvider("...");
    setBody(`Requesting endpoint: POST /v1/chat...\nPayload: ${JSON.stringify(snippet.payload, null, 2)}`);
    setDebug("Waiting for gateway headers response...");

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
      setDebug(debugHeaders || "Debug headers not enabled. Set DEBUG_HEADERS=true in gateway config.");
    } else {
      setStatus(String(res.error.status));
      setProvider("-");
      setBody(res.error.body || res.error.message);
      setDebug(debugHeaders || "Debug headers not enabled. Set DEBUG_HEADERS=true in gateway config.");
    }

    setLoadingId("");
  };

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <header className="glass-panel p-8 rounded-xl relative overflow-hidden">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-on-surface font-bold">
          Playground <span className="text-primary">Console</span>
        </h1>
        <p className="mt-4 max-w-3xl text-on-surface-variant font-technical-sm text-sm sm:text-base leading-relaxed">
          Launch curated API scenarios against the gateway and inspect status returns, provider selection logic, and resilient debug headers in real-time.
        </p>
      </header>

      {/* Recommended steps */}
      <section className="glass-panel p-6 rounded-xl space-y-4">
        <h3 className="font-display text-xs text-primary uppercase tracking-widest font-bold">Recommended Execution Order</h3>
        <ol className="list-decimal space-y-2 pl-5 font-technical-sm text-sm text-on-surface-variant">
          <li>Run <strong>Safe Prompt</strong> first to verify healthy pipeline routing (Gemini).</li>
          <li>Run <strong>Safety Block Test</strong> to see prompt injection blocked pre-emptively (400 Bad Request).</li>
          <li>Run <strong>Retry Recovery</strong> to simulate transient API timeouts and witness automatic recovery.</li>
          <li>Run <strong>Timeout Drill</strong> to see bounded timeouts in action (503 Service Unavailable).</li>
        </ol>
      </section>

      <SnippetGrid snippets={SNIPPETS} loadingId={loadingId} onRun={runSnippet} />
      <OutputPanel status={status} provider={provider} body={body} debug={debug} />
    </div>
  );
}
