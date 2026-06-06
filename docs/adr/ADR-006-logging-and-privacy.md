# ADR-006: Logging and Privacy Baseline

## Status

Accepted

## Context

Gateway requires rich observability for debugging, routing analysis, and safety evaluation. Logging raw prompts or API keys creates privacy and compliance risk.

## Decision

Use structured JSONL logs with privacy controls:

- Log prompt hash, not raw prompt by default.
- Log API key hash, not raw API key.
- Include safety verdict, threat type, provider, latency, status code.
- Allow optional secure debug mode for raw prompt capture in local development only.

## Alternatives considered

1. Full raw logging
2. Minimal aggregate-only metrics
3. Structured hashed logging (chosen)

## Consequences

Positive:

- Stronger privacy posture with useful traceability.
- Supports replay and trend analysis safely.
- Compatible with later MLflow/warehouse ingestion.

Negative:

- Harder to debug content-specific incidents without raw text.
- Requires secure process for temporary debug override.

## Follow-ups

- Document retention and deletion policy.
- Add request ID propagation across gateway and sidecar logs.
