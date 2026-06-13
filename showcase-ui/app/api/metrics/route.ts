import { NextResponse } from "next/server";
import { gatewayBaseUrl } from "@/app/api/_shared";

export async function GET() {
  const upstream = await fetch(`${gatewayBaseUrl()}/metrics`, { cache: "no-store" });
  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "application/json"
    }
  });
}
