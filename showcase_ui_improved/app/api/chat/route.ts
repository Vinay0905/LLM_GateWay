import { NextRequest, NextResponse } from "next/server";
import { gatewayApiKey, gatewayBaseUrl } from "@/app/api/_shared";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
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
