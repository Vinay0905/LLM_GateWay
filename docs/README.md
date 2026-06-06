# LLM Gateway Learning Pack

This documentation set is a hands-on curriculum to build the project in phases while learning system design and implementation.

## How to use this pack

1. Read `00-project-bootstrap.md` first and create the base structure.
2. Read `01-roadmap.md` to understand the full trajectory.
3. Complete one phase document at a time (`phase-1` to `phase-7`).
4. After each phase, read the linked ADR(s) and write your own notes.
5. Type the snippets manually on your implementation laptop and verify the "Definition of done" checklist.

## Documents

- `00-project-bootstrap.md` - exactly when/how to create files and folders
- `01-roadmap.md` - overall plan, milestones, and expected outcomes
- `phase-1-thin-gateway.md` - single-provider gateway baseline
- `phase-2-auth-and-rate-limit.md` - API key auth + per-key throttling
- `phase-3-safety-in-process.md` - internal safety checks before model call
- `phase-4-sidecar-split.md` - extract safety to FastAPI sidecar
- `phase-5-multi-provider-routing.md` - Gemini/Groq adapters + weighted routing
- `phase-6-resilience.md` - timeouts, retries, circuit breakers, fallback
- `phase-7-observability-and-evals.md` - logs, metrics, replay-based evaluation

## ADRs (architecture decision records)

- `adr/ADR-001-polyglot-sidecar-architecture.md`
- `adr/ADR-002-fail-open-vs-fail-closed.md`
- `adr/ADR-003-pii-block-vs-redact.md`
- `adr/ADR-004-routing-strategy.md`
- `adr/ADR-005-resilience-policy.md`
- `adr/ADR-006-logging-and-privacy.md`

## Suggested implementation order

Follow phases in order. Do not skip to sidecar/routing/resilience before phase 2 is stable.
