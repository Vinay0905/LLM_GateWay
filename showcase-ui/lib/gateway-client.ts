import { GatewayChatRequest, GatewayChatResponse, GatewayError } from "@/lib/types";

export async function callGateway(
  payload: GatewayChatRequest
): Promise<{ ok: true; status: number; data: GatewayChatResponse; headers: Headers } | { ok: false; error: GatewayError; headers: Headers }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const bodyText = await res.text();
  const headers = res.headers;

  if (!res.ok) {
    return {
      ok: false,
      headers,
      error: {
        status: res.status,
        message: bodyText || "Gateway request failed",
        body: bodyText
      }
    };
  }

  try {
    const data = JSON.parse(bodyText) as GatewayChatResponse;
    return { ok: true, status: res.status, data, headers };
  } catch {
    return {
      ok: false,
      headers,
      error: {
        status: res.status,
        message: "Invalid JSON response from gateway",
        body: bodyText
      }
    };
  }
}

export async function fetchGatewayHealth(): Promise<string> {
  const res = await fetch("/api/health", { cache: "no-store" });
  return `${res.status}`;
}

export async function fetchGatewayMetrics(): Promise<Record<string, number> | null> {
  const res = await fetch("/api/metrics", { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as Record<string, number>;
}
