# ADR-003: PII Handling Policy (Block vs Redact)

## Status

Accepted (redact by default, block on high-risk classes)

## Context

PII may appear in prompts. Hard blocking improves protection but may reduce usability. Redaction can preserve utility while reducing data exposure.

## Decision

Use mixed policy:

- High-risk PII (government IDs, payment credentials): block.
- Lower-risk PII (emails, phone numbers): redact then continue.

Sidecar returns `masked_prompt` and `threat_type` details.

## Alternatives considered

1. Block all PII
2. Redact all PII
3. Mixed severity policy (chosen)

## Consequences

Positive:

- Better user experience than universal block.
- Maintains stronger controls on highly sensitive fields.

Negative:

- More policy complexity and detector tuning required.
- Potential under-redaction/over-redaction edge cases.

## Follow-ups

- Add test corpus for PII classes.
- Version policy thresholds in config.
