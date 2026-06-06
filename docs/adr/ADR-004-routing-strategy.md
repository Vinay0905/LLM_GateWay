# ADR-004: Routing Strategy for Multiple Providers

## Status

Accepted (model map + weighted fallback)

## Context

Gateway must route requests to Gemini or Groq while balancing correctness, cost, and reliability.

## Decision

Adopt two-layer routing:

1. Deterministic `model -> provider` map for explicit model requests.
2. Weighted distribution for generic/default traffic.

Routing config remains externalized in YAML.

## Alternatives considered

1. Static single-provider routing
2. Cost-only dynamic routing
3. Model map + weighted strategy (chosen)

## Consequences

Positive:

- Predictable behavior for named models.
- Safe A/B experimentation for default traffic.
- Easy rollout/rollback via config change.

Negative:

- Weighted routing can add result variance.
- Needs observability to confirm actual split ratios.

## Follow-ups

- Add request-level routing trace field in logs.
- Evaluate latency-aware policy in future version.
