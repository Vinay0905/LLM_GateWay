"use client";

import { useState } from "react";
import { OutputPanel } from "@/components/playground/OutputPanel";
import { SnippetGrid } from "@/components/playground/SnippetGrid";
import { NeonCard } from "@/components/ui/NeonCard";
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
    <div className="space-y-6">
      <NeonCard title="Snippet Playground" subtitle="One-click experiments to demo safety, retry, timeout, and routing behavior.">
        <p className="text-sm text-neon-text">Each snippet sends a real request through your gateway and shows raw output plus optional debug headers.</p>
      </NeonCard>
      <SnippetGrid snippets={SNIPPETS} loadingId={loadingId} onRun={runSnippet} />
      <OutputPanel status={status} provider={provider} body={body} debug={debug} />
    </div>
  );
}
