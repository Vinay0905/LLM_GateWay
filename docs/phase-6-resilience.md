# Phase 6: Resilience (Timeouts, Retries, Circuit Breakers)

## Objective

Handle upstream failures without collapsing gateway reliability.

## Create these files/folders in this phase

- `gateway/internal/circuit/breaker.go`

## Theory to learn

- **Timeout budgets:** every outbound call must have bounded latency
- **Retry discipline:** retry only transient errors with limits
- **Circuit breaker:** stop sending traffic to unhealthy provider

## Snippet 1: Timeout wrapping

Put in file: `gateway/internal/handlers/chat.go`

```go
ctx, cancel := context.WithTimeout(r.Context(), 8*time.Second)
defer cancel()

resp, err := provider.Generate(ctx, req)
```

What this snippet does:

- Prevents hanging upstream calls from tying up gateway resources.
- Inherits cancellation from incoming request context.
- Applies per-request latency budget.

## Snippet 2: Retry helper (simplified)

Put in file: `gateway/internal/providers/gemini.go` (and similarly in `gateway/internal/providers/groq.go`)

```go
func Retry(attempts int, fn func() error) error {
    var err error
    for i := 0; i < attempts; i++ {
        err = fn()
        if err == nil {
            return nil
        }
        time.Sleep(time.Duration(i+1) * 150 * time.Millisecond)
    }
    return err
}
```

What this snippet does:

- Re-attempts transient failures with simple backoff.
- Limits retry count to avoid request amplification.
- Returns final error cleanly to caller.

## Snippet 3: Circuit breaker core

Put in file: `gateway/internal/circuit/breaker.go`

```go
type Breaker struct {
    failCount    int
    state        string // closed, open, half_open
    openedAt     time.Time
    threshold    int
    cooldown     time.Duration
}

func (b *Breaker) Allow() bool {
    if b.state != "open" {
        return true
    }
    if time.Since(b.openedAt) > b.cooldown {
        b.state = "half_open"
        return true
    }
    return false
}

func (b *Breaker) RecordFailure() {
    b.failCount++
    if b.failCount >= b.threshold {
        b.state = "open"
        b.openedAt = time.Now()
    }
}

func (b *Breaker) RecordSuccess() {
    b.failCount = 0
    b.state = "closed"
}
```

What this snippet does:

- Prevents repeated calls to a known failing provider.
- Supports cooldown window before probe retry.
- Encodes breaker state transitions in one object.

## Snippet 4: Fallback flow

Put in file: `gateway/internal/handlers/chat.go`

```go
primary := router.ResolveProvider(req.Model)
if !breakers[primary].Allow() {
    primary = router.Secondary(primary)
}
resp, err := providers[primary].Generate(ctx, req)
if err != nil {
    breakers[primary].RecordFailure()
    http.Error(w, "upstream unavailable", http.StatusServiceUnavailable)
    return
}
breakers[primary].RecordSuccess()
```

What this snippet does:

- Avoids dead provider when breaker is open.
- Records provider health based on outcomes.
- Returns `503` when no viable upstream succeeds.

## Common mistakes and quick fixes

- **Symptom:** retries overload provider and increase failures.
  **Fix:** retry only transient failures and keep retries bounded (for example, 2-3).
- **Symptom:** circuit never opens.
  **Fix:** call `RecordFailure()` on all retry-exhausted failures, not only some paths.
- **Symptom:** circuit opens but never recovers.
  **Fix:** ensure `Allow()` transitions to `half_open` after cooldown and success resets breaker.
- **Symptom:** request latency is too high under failure.
  **Fix:** reduce timeout budget and avoid retrying non-retryable errors.

## Definition of done

- Upstream hangs are capped by timeout.
- Temporary failures can recover with retries.
- Persistent failures open circuit and reduce blast radius.
- Fallback provider is attempted when policy allows.

## Read next

- `adr/ADR-005-resilience-policy.md`
