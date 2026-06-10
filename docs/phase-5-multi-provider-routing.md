# Phase 5: Multi-Provider Routing (Gemini + Groq)

## Objective

Introduce provider abstraction and routing strategy:

- add Groq adapter
- route by model map or weighted policy
- keep external API unchanged

## Create these files/folders in this phase

- `gateway/internal/providers/groq.go`
- `gateway/internal/router/model_router.go`

## Theory to learn

- **Adapter pattern:** one interface, many provider implementations
- **Policy separation:** routing should be configurable, not hardcoded in handler
- **Incremental rollout:** weighted routing supports safe experimentation

## Snippet 1: Router policy model

Put in file: `gateway/internal/router/model_router.go`

```go
type WeightedProvider struct {
    Name    string
    Percent int
}

type RoutePolicy struct {
    DefaultProvider string
    Weights         []WeightedProvider
    ModelMap        map[string]string
}
```

What this snippet does:

- Supports multiple routing modes in one config shape.
- Enables deterministic model overrides with `ModelMap`.
- Enables A/B strategy through weighted distribution.

## Snippet 2: Weighted provider selection

Put in file: `gateway/internal/router/model_router.go`

```go
func ChooseByWeight(weights []WeightedProvider, r *rand.Rand) string {
    n := r.Intn(100)
    sum := 0
    for _, w := range weights {
        sum += w.Percent
        if n < sum {
            return w.Name
        }
    }
    return "gemini"
}
```

What this snippet does:

- Maps random number to cumulative weight ranges.
- Drives traffic split for experiments.
- Falls back to a default if config is imperfect.

## Snippet 3: Router service

Put in file: `gateway/internal/router/model_router.go`

```go
type Router struct {
    policy RoutePolicy
    rnd    *rand.Rand
}

func (rt *Router) ResolveProvider(model string) string {
    if p, ok := rt.policy.ModelMap[model]; ok {
        return p
    }
    if len(rt.policy.Weights) > 0 {
        return ChooseByWeight(rt.policy.Weights, rt.rnd)
    }
    return rt.policy.DefaultProvider
}
```

What this snippet does:

- Applies deterministic mapping first, then weighted strategy.
- Centralizes selection logic in one place.
- Keeps handlers thin and provider-agnostic.

## Snippet 4: Provider registry usage

Put in file: `gateway/internal/handlers/chat.go`

```go
providerName := router.ResolveProvider(req.Model)
provider, ok := h.providers[providerName]
if !ok {
    http.Error(w, "unknown provider", http.StatusBadRequest)
    return
}
resp, err := provider.Generate(r.Context(), req)
```

What this snippet does:

- Looks up adapter by router output.
- Validates runtime config and fails clearly on mismatch.
- Executes generation through same interface as phase 1.

## Common mistakes and quick fixes

- **Symptom:** weighted split is inconsistent between runs.
  **Fix:** seed `rand.Rand` once during startup; do not reseed per request.
- **Symptom:** router selects unknown provider.
  **Fix:** validate config at boot: every routed provider must exist in provider registry.
- **Symptom:** traffic distribution feels wrong.
  **Fix:** verify total weight sums to 100 and log selected provider per request.
- **Symptom:** model-specific routing never applies.
  **Fix:** ensure `ModelMap` lookup is checked before weighted/default routing.

## Definition of done

- Both Gemini and Groq adapters work.
- Router policy can switch behavior without handler edits.
- Weighted routing roughly matches configured percentages.
- Public API response schema remains unchanged.

## Read next

- `adr/ADR-004-routing-strategy.md`
