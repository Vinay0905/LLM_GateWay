# ADR-005: Resilience Policy (Timeout, Retry, Circuit Breaker)

## Status

Accepted

## Context

External provider APIs are not fully reliable. Gateway must keep predictable latency and avoid cascading failures.

## Decision

Use layered resilience policy:

- Per-upstream timeout budget (example: 8s)
- Bounded retries with backoff on retryable failures
- Circuit breaker per provider with cooldown and half-open probing
- Fallback to secondary provider where possible

## Alternatives considered

1. Retries only
2. Circuit breaker only
3. Layered policy (chosen)

## Consequences

Positive:

- Better uptime under intermittent provider failures.
- Reduced latency tails from hung calls.
- Lower blast radius during provider incidents.

Negative:

- More tuning parameters and state handling complexity.
- Poor retry rules can amplify load if misconfigured.

## Follow-ups

- Define retryable status/error classes.
- Add metrics per provider: error rate, breaker state, latency percentiles.
