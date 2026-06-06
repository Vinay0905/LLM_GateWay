# ADR-001: Polyglot Sidecar Architecture

## Status

Accepted

## Context

The project needs high-performance request handling and fast iteration on safety detectors. Go is strong for gateway concurrency and control-plane behavior; Python has richer AI safety tooling.

## Decision

Adopt a two-service architecture:

- Go gateway for API handling, auth, rate limiting, routing, resilience, logging.
- Python FastAPI sidecar for safety analysis (`/analyze`).

Gateway must call sidecar before provider calls.

## Alternatives considered

1. Single Go monolith with all safety in Go
2. Single Python monolith
3. Polyglot split (chosen)

## Consequences

Positive:

- Clear ownership boundaries.
- Faster detector development using Python ecosystem.
- Independent scaling and deployments.

Negative:

- Extra network hop and additional failure mode.
- More operational complexity (two containers/services).

## Follow-ups

- Define sidecar timeout budget and retry policy (see ADR-005).
- Define sidecar outage policy (see ADR-002).
