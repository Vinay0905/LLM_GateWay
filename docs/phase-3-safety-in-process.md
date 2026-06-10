# Phase 3: Safety Checks In-Process

## Objective

Before splitting into sidecar, implement safety logic directly inside gateway:

- prompt injection heuristic
- jailbreak phrase detection
- PII detection and policy decision

## Create these files/folders in this phase

- `gateway/internal/safety/analyzer.go`

## Theory to learn

- **Policy before model:** safety should run before provider invocation
- **Deterministic first:** begin with explainable rule-based checks
- **Verdict envelope:** one object that captures decision and reason

## Snippet 1: Safety verdict model

Put in file: `gateway/internal/safety/analyzer.go`

```go
type SafetyVerdict struct {
    Verdict    string   `json:"verdict"`     // PASS or BLOCK
    ThreatType string   `json:"threat_type"` // injection, jailbreak, pii
    Score      float64  `json:"score"`
    Reasons    []string `json:"reasons"`
}
```

What this snippet does:

- Standardizes safety output structure.
- Allows policy tuning later via score thresholds.
- Supports user-facing and logging use cases.

## Snippet 2: Injection heuristic

Put in file: `gateway/internal/safety/analyzer.go`

```go
func DetectInjection(prompt string) (bool, float64, []string) {
    lowered := strings.ToLower(prompt)
    patterns := []string{
        "ignore previous instructions",
        "reveal system prompt",
        "developer message",
        "bypass safety",
    }

    var hits []string
    for _, p := range patterns {
        if strings.Contains(lowered, p) {
            hits = append(hits, p)
        }
    }
    if len(hits) == 0 {
        return false, 0.0, nil
    }
    score := math.Min(1.0, 0.3+float64(len(hits))*0.2)
    return true, score, hits
}
```

What this snippet does:

- Uses clear lexical patterns as first-line filter.
- Produces score tied to number of suspicious matches.
- Returns exact triggers for explainability.

## Snippet 3: Policy gate in handler flow

Put in file: `gateway/internal/handlers/chat.go`

```go
verdict := safety.Analyze(req.Prompt)
if verdict.Verdict == "BLOCK" {
    w.WriteHeader(http.StatusBadRequest)
    _ = json.NewEncoder(w).Encode(map[string]any{
        "error":       "blocked_by_safety",
        "threat_type": verdict.ThreatType,
        "score":       verdict.Score,
        "reasons":     verdict.Reasons,
    })
    return
}
```

What this snippet does:

- Enforces safety before any provider call.
- Returns structured block reason to client.
- Prevents unsafe prompt leakage upstream.

## Snippet 4: PII redaction helper (optional mode)

Put in file: `gateway/internal/safety/analyzer.go`

```go
var emailRe = regexp.MustCompile(`[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`)

func MaskPII(text string) string {
    return emailRe.ReplaceAllString(text, "[REDACTED_EMAIL]")
}
```

What this snippet does:

- Demonstrates redact policy path (instead of hard block).
- Keeps raw sensitive content out of downstream logs/providers.
- Creates base for richer Presidio-based detection in sidecar phase.

## Common mistakes and quick fixes

- **Symptom:** obvious injection prompts pass through.
  **Fix:** normalize input with `strings.ToLower` before pattern checks.
- **Symptom:** false positives block harmless prompts.
  **Fix:** lower initial threshold and log matched patterns before tightening policy.
- **Symptom:** masked prompt is computed but original prompt still sent upstream.
  **Fix:** replace request prompt with masked value before provider call.
- **Symptom:** safety decision is hard to debug.
  **Fix:** always include `threat_type`, `score`, and trigger reasons in logs.

## Definition of done

- Safety verdict exists for every request.
- Known prompt injection phrases are blocked.
- PII policy is explicit: block or redact (document your choice).
- Safety decision is visible in logs.

## Read next

- `adr/ADR-003-pii-block-vs-redact.md`
- `adr/ADR-002-fail-open-vs-fail-closed.md`
