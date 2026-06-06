# ADR-002: Safety Service Failure Policy (Fail-Open vs Fail-Closed)

## Status

Accepted (default fail-closed for learning environment)

## Context

If sidecar is unavailable, gateway must choose between:

- Fail-open: continue to provider without safety verdict
- Fail-closed: reject request

This is a security vs availability tradeoff.

## Decision

Default to **fail-closed** for protected routes in v1 learning build:

- If sidecar call errors/timeouts, return `502` or policy-specific block response.
- Add config flag to allow fail-open only in controlled environments.

## Alternatives considered

1. Always fail-open
2. Always fail-closed (chosen baseline)
3. Tiered policy by route/tenant/risk

## Consequences

Positive:

- No unsafe prompt bypass when safety plane is unhealthy.
- Stronger security posture and easier reasoning.

Negative:

- Sidecar outages reduce gateway availability.
- Requires robust sidecar reliability and scaling.

## Follow-ups

- Add health probes and autoscaling for sidecar.
- Consider selective fail-open for low-risk internal tenants later.
