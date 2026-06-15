import { NextResponse } from "next/server";
import { gatewayBaseUrl } from "@/app/api/_shared";

export async function GET() {
  try {
    const upstream = await fetch(`${gatewayBaseUrl()}/metrics`, { cache: "no-store" });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "application/json"
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Gateway Offline",
        message: `Could not retrieve metrics from backend LLM Gateway at ${gatewayBaseUrl()}`
      },
      { status: 502 }
    );
  }
}
