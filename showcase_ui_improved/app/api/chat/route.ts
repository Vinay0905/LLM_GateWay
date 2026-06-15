import { NextRequest, NextResponse } from "next/server";
import { gatewayApiKey, gatewayBaseUrl } from "@/app/api/_shared";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    
    // Call sidecar for PII metadata (so frontend can show before/after preview)
    let maskedPrompt = "";
    let piiTypes: string[] = [];
    try {
      const parsed = JSON.parse(body);
      const prompt = parsed.prompt || "";
      if (prompt) {
        const sidecarRes = await fetch(`${process.env.SIDECAR_BASE_URL || "http://localhost:8000"}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
          cache: "no-store"
        });
        if (sidecarRes.ok) {
          const sidecarData = await sidecarRes.json();
          maskedPrompt = sidecarData.masked_prompt || "";
          piiTypes = sidecarData.pii_types_detected || [];
        }
      }
    } catch (e) {
      // Fallback/Fail-safe: do not fail request if sidecar is unavailable
      console.warn("Failed sidecar analysis:", e);
    }

    const upstream = await fetch(`${gatewayBaseUrl()}/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": gatewayApiKey()
      },
      body,
      cache: "no-store"
    });

    const text = await upstream.text();
    const res = new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "text/plain"
      }
    });

    [
      "x-debug-primary-provider",
      "x-debug-selected-provider",
      "x-debug-fallback",
      "x-debug-fallback-from",
      "x-debug-breaker-state-before",
      "x-debug-breaker-state-after"
    ].forEach((h) => {
      const value = upstream.headers.get(h);
      if (value) res.headers.set(h, value);
    });

    if (maskedPrompt) {
      res.headers.set("X-Masked-Prompt", encodeURIComponent(maskedPrompt));
    }
    if (piiTypes.length > 0) {
      res.headers.set("X-PII-Types", piiTypes.join(","));
    }

    return res;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Gateway Offline",
        message: `Could not reach LLM Gateway backend at ${gatewayBaseUrl()}. Verify the Go server is running.`
      },
      { status: 502 }
    );
  }
}
