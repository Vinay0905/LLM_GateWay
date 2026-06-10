# Phase 1: Thin Gateway Baseline

## Objective

Build the smallest useful gateway:

- `POST /v1/chat`
- one provider adapter (start with Gemini)
- request validation
- consistent response schema

No auth, no rate limiting, no sidecar yet.

## Create these files/folders in this phase

- `gateway/cmd/main.go`
- `gateway/internal/types/chat.go`
- `gateway/internal/handlers/chat.go`
- `gateway/internal/providers/provider.go`
- `gateway/internal/providers/gemini.go`
- `config/config.yaml`

## Theory to learn

- **Boundary-first design:** handler -> service -> provider adapter
- **Stable contract:** client should not care which provider is behind the gateway
- **Config-driven behavior:** keep model/provider choice in config where possible

## Step-by-step build

1. Create a Go HTTP server with health endpoint.
2. Add chat request/response structs.
3. Build a provider interface.
4. Implement one adapter (`GeminiProvider`).
5. Wire handler to adapter.

## Snippet 1: Request and response contract

Put in file: `gateway/internal/types/chat.go`

```go
type ChatRequest struct {
    Model       string            `json:"model"`
    Prompt      string            `json:"prompt"`
    MaxTokens   int               `json:"max_tokens"`
    Temperature float64           `json:"temperature"`
    Metadata    map[string]string `json:"metadata"`
}

type ChatResponse struct {
    Output   string `json:"output"`
    Provider string `json:"provider"`
    Model    string `json:"model"`
}
```

What this snippet does:

- Defines a stable API contract for inbound and outbound payloads.
- Keeps generation controls (`max_tokens`, `temperature`) explicit.
- Adds `metadata` for future tracing/experiments without changing core schema.

## Snippet 2: Provider interface (adapter boundary)

Put in file: `gateway/internal/providers/provider.go`

```go
type Provider interface {
    Generate(ctx context.Context, req ChatRequest) (ChatResponse, error)
}
```

What this snippet does:

- Decouples handler logic from vendor-specific SDK details.
- Enables later addition of Groq without rewriting handler code.
- Creates a test seam: mock `Provider` in unit tests.

## Snippet 3: Chat handler skeleton

Put in file: `gateway/internal/handlers/chat.go`

```go
func (h *ChatHandler) HandleChat(w http.ResponseWriter, r *http.Request) {
    var req ChatRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid JSON", http.StatusBadRequest)
        return
    }
    if strings.TrimSpace(req.Prompt) == "" {
        http.Error(w, "prompt required", http.StatusBadRequest)
        return
    }

    resp, err := h.provider.Generate(r.Context(), req)
    if err != nil {
        http.Error(w, "provider error", http.StatusBadGateway)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    _ = json.NewEncoder(w).Encode(resp)
}
```

What this snippet does:

- Validates transport-level correctness (`JSON`, required prompt).
- Delegates generation to adapter through interface.
- Normalizes provider failures to HTTP `502`.

## Snippet 4: Main wiring

Put in file: `gateway/cmd/main.go`

```go
func main() {
    mux := http.NewServeMux()

    provider := NewGeminiProvider(os.Getenv("GEMINI_API_KEY"))
    chatHandler := &ChatHandler{provider: provider}

    mux.HandleFunc("/v1/chat", chatHandler.HandleChat)
    mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
        w.WriteHeader(http.StatusOK)
        _, _ = w.Write([]byte(`{"status":"ok"}`))
    })

    log.Fatal(http.ListenAndServe(":8080", mux))
}
```

What this snippet does:

- Creates dependency graph in one place (composition root).
- Exposes minimal endpoints needed for development and health checks.
- Starts service on gateway port.

## Common mistakes and quick fixes

- **Symptom:** `cannot find package` or unresolved internal imports.
  **Fix:** ensure `go mod init llm-gateway/gateway` was run inside `gateway/`, then `go mod tidy`.
- **Symptom:** `POST /v1/chat` returns `404`.
  **Fix:** verify you registered route on the same mux passed to `ListenAndServe`.
- **Symptom:** JSON decode fails for valid input.
  **Fix:** confirm `Content-Type: application/json` and that request fields match struct tags.
- **Symptom:** provider call always fails at startup.
  **Fix:** verify `GEMINI_API_KEY` exists in environment before starting the service.

## Definition of done

- `POST /v1/chat` works with one model/provider.
- Empty/invalid payloads return clean `4xx`.
- Provider failures return `502`.
- `GET /health` returns `200`.

## Read next

- `adr/ADR-004-routing-strategy.md` (preview of multi-provider design)
