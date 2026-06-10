# Phase 4: Split Safety into Python Sidecar

## Objective

Move safety logic out of gateway into a dedicated FastAPI service.

## Create these files/folders in this phase

- `gateway/internal/safety/client.go`
- `safety_sidecar/main.py`
- `safety_sidecar/detectors/injection.py`
- `safety_sidecar/detectors/jailbreak.py`
- `safety_sidecar/detectors/pii.py`

## Theory to learn

- **Service decomposition:** isolate high-change ML/safety logic from stable gateway concerns
- **Contract-first RPC:** define request/response schema between gateway and sidecar
- **Independent scaling:** gateway and sidecar can scale on separate bottlenecks

## Sidecar API contract

- Request: `{ "prompt": "..." }`
- Response: `{ "verdict": "PASS|BLOCK", "threat_type": "...", "score": 0.0, "masked_prompt": "..." }`

## Snippet 1: FastAPI sidecar endpoint

Put in file: `safety_sidecar/main.py`

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class AnalyzeRequest(BaseModel):
    prompt: str

class AnalyzeResponse(BaseModel):
    verdict: str
    threat_type: str
    score: float
    masked_prompt: str

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    # Placeholder: call detectors in parallel later
    blocked = "ignore previous instructions" in req.prompt.lower()
    if blocked:
        return AnalyzeResponse(
            verdict="BLOCK",
            threat_type="injection",
            score=0.9,
            masked_prompt=req.prompt,
        )
    return AnalyzeResponse(
        verdict="PASS",
        threat_type="none",
        score=0.1,
        masked_prompt=req.prompt,
    )
```

What this snippet does:

- Defines an explicit network contract for safety decisions.
- Keeps safety policy in one service boundary.
- Establishes migration path to richer detectors.

## Snippet 2: Go safety client

Put in file: `gateway/internal/safety/client.go`

```go
type SidecarVerdict struct {
    Verdict      string  `json:"verdict"`
    ThreatType   string  `json:"threat_type"`
    Score        float64 `json:"score"`
    MaskedPrompt string  `json:"masked_prompt"`
}

type SafetyClient struct {
    BaseURL string
    Client  *http.Client
}

func (s *SafetyClient) Analyze(ctx context.Context, prompt string) (SidecarVerdict, error) {
    body, err := json.Marshal(map[string]string{"prompt": prompt})
    if err != nil {
        return SidecarVerdict{}, err
    }
    req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.BaseURL+"/analyze", bytes.NewReader(body))
    if err != nil {
        return SidecarVerdict{}, err
    }
    req.Header.Set("Content-Type", "application/json")

    resp, err := s.Client.Do(req)
    if err != nil {
        return SidecarVerdict{}, err
    }
    defer resp.Body.Close()

    var verdict SidecarVerdict
    if err := json.NewDecoder(resp.Body).Decode(&verdict); err != nil {
        return SidecarVerdict{}, err
    }
    return verdict, nil
}
```

What this snippet does:

- Encapsulates sidecar HTTP call behind a client object.
- Keeps handler code clean and testable.
- Reuses context for cancellations/timeouts.

## Snippet 3: Gateway integration point

Put in file: `gateway/internal/handlers/chat.go`

```go
verdict, err := h.safetyClient.Analyze(r.Context(), req.Prompt)
if err != nil {
    http.Error(w, "safety service unavailable", http.StatusBadGateway)
    return
}
if verdict.Verdict == "BLOCK" {
    http.Error(w, "blocked_by_safety", http.StatusBadRequest)
    return
}
req.Prompt = verdict.MaskedPrompt
```

What this snippet does:

- Enforces networked safety check before provider call.
- Defines temporary fail behavior when sidecar is unavailable.
- Applies masked prompt output from sidecar policy.

## Common mistakes and quick fixes

- **Symptom:** gateway cannot reach sidecar (`connection refused`).
  **Fix:** verify sidecar is running on expected host/port and base URL matches config.
- **Symptom:** JSON decode errors in Go client.
  **Fix:** ensure sidecar response fields exactly match struct tags (`masked_prompt`, `threat_type`).
- **Symptom:** sidecar returns `422` on `/analyze`.
  **Fix:** send body as `{"prompt":"..."}` and set `Content-Type: application/json`.
- **Symptom:** safety outages cause random gateway behavior.
  **Fix:** implement one explicit policy path (fail-closed or fail-open) and document it.

## Definition of done

- Sidecar is independently runnable on `:8000`.
- Gateway calls sidecar before provider invocation.
- Sidecar verdict directly drives allow/block.
- Safety logic removed from gateway core.

## Read next

- `adr/ADR-001-polyglot-sidecar-architecture.md`
- `adr/ADR-002-fail-open-vs-fail-closed.md`
