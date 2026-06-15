export function gatewayBaseUrl() {
  return process.env.GATEWAY_BASE_URL || "http://localhost:8080";
}

export function gatewayApiKey() {
  return process.env.GATEWAY_API_KEY || "dev-key";
}
