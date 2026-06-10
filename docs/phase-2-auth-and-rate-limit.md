# Phase 2: API Key Auth and Rate Limiting

## Objective

Add tenant controls before expensive model calls:

- API key validation (`X-API-Key`)
- token bucket rate limit per key

## Create these files/folders in this phase

- `gateway/internal/middleware/auth.go`
- `gateway/internal/middleware/ratelimit.go`

## Theory to learn

- **Middleware chain:** reusable request guards at transport boundary
- **Tenant isolation:** one abusive key should not impact others
- **Fail-fast design:** reject unauthorized/exceeded requests before provider call

## Middleware order

1. Auth middleware
2. Rate limiter middleware
3. Chat handler

## Snippet 1: Auth middleware

Put in file: `gateway/internal/middleware/auth.go`

```go
func AuthMiddleware(validKeys map[string]struct{}, next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        key := r.Header.Get("X-API-Key")
        if _, ok := validKeys[key]; !ok {
            http.Error(w, "unauthorized", http.StatusUnauthorized)
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

What this snippet does:

- Reads client API key from header.
- Rejects unknown keys with `401`.
- Allows only trusted tenants to reach business logic.

## Snippet 2: Per-key token bucket map

Put in file: `gateway/internal/middleware/ratelimit.go`

```go
type LimiterStore struct {
    mu       sync.Mutex
    limiters map[string]*rate.Limiter
    rps      rate.Limit
    burst    int
}

func (s *LimiterStore) ForKey(key string) *rate.Limiter {
    s.mu.Lock()
    defer s.mu.Unlock()
    if l, ok := s.limiters[key]; ok {
        return l
    }
    l := rate.NewLimiter(s.rps, s.burst)
    s.limiters[key] = l
    return l
}
```

What this snippet does:

- Maintains isolated limiter state per API key.
- Creates limiters lazily when a new key appears.
- Uses lock to keep map access thread-safe.

## Snippet 3: Rate limit middleware

Put in file: `gateway/internal/middleware/ratelimit.go`

```go
func RateLimitMiddleware(store *LimiterStore, next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        key := r.Header.Get("X-API-Key")
        if !store.ForKey(key).Allow() {
            http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

What this snippet does:

- Enforces request budget before calling handler.
- Returns `429` for over-limit callers.
- Keeps behavior deterministic and easy to monitor.

## Snippet 4: Middleware composition

Put in file: `gateway/cmd/main.go`

```go
var chat http.Handler = http.HandlerFunc(chatHandler.HandleChat)
chat = RateLimitMiddleware(limiterStore, chat)
chat = AuthMiddleware(validKeys, chat)
mux.Handle("/v1/chat", chat)
```

What this snippet does:

- Applies wrappers around one endpoint.
- Preserves intended order: auth runs first, then rate limit, then handler.
- Keeps handler focused on chat logic only.

## Common mistakes and quick fixes

- **Symptom:** middleware assignment type errors.
  **Fix:** use `var chat http.Handler = http.HandlerFunc(chatHandler.HandleChat)` before wrapping.
- **Symptom:** rate limiter appears to throttle all users together.
  **Fix:** key limiter store by `X-API-Key`, not by a global limiter instance.
- **Symptom:** valid keys rejected as unauthorized.
  **Fix:** check exact header name `X-API-Key` and trim accidental whitespace in key list.
- **Symptom:** order is wrong (rate limit runs before auth unexpectedly).
  **Fix:** in wrapping chain, last wrapper added runs first; keep composition exactly as documented.

## Definition of done

- Missing/invalid key returns `401`.
- Burst and steady-state throttling works per key.
- Separate keys do not share limits.
- Error responses are stable and documented.

## Read next

- `adr/ADR-006-logging-and-privacy.md`
