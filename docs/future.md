# Future Roadmap Ideas

This document captures practical next steps after Phase 7 so the project can evolve from a learning build into a strong portfolio system.

## 1) Showcase App: Small AI Chatbot (Recommended next demo)

Build a tiny UI app that talks only to your gateway (`POST /v1/chat`), not directly to provider APIs.

Good options:

- **Streamlit app** (fastest)
- **Next.js mini web app** (better frontend portfolio value)
- **CLI chat client** (quickest engineering demo)

Minimum chatbot features:

- Text input + chat history
- Model selector (`gemini`, `groq`)
- "Safety blocked" message panel
- Toggle to show request metadata (`provider`, latency, request id)

Why this helps:

- Visibly proves your gateway abstraction works
- Demonstrates provider routing and safety control in one UI
- Makes interview/demo walkthrough much stronger than curl-only

## 2) Production-leaning Gateway Improvements

- Add config-driven API keys (not hardcoded `dev-key`)
- Add request ID propagation (`X-Request-ID`) and return it in response headers
- Add graceful shutdown and HTTP server timeouts
- Add stricter input validation (`max_tokens` bounds, temperature range)
- Add structured error schema instead of plain `http.Error` strings

## 3) Safety Sidecar Evolution

- Move from single placeholder rule to detector orchestration:
  - injection
  - jailbreak
  - pii
- Add confidence threshold config
- Add mode flag: fail-open vs fail-closed
- Add sidecar `/health` endpoint for easier ops checks

## 4) Better Observability

- Add counters by provider (`requests_by_provider`)
- Add latency histograms (p50/p95 approximation)
- Add block reasons count (`injection`, `jailbreak`, `pii`)
- Add a small log analysis notebook/script that reads `logs/experiment_log.jsonl`

## 5) Replay Evaluation Upgrade

- Create a frozen eval dataset (`docs/eval_dataset.jsonl`)
- Add expected labels for safety verdict and threat type
- Build a replay script that outputs:
  - precision
  - recall
  - false positive rate
  - confusion matrix
- Store outputs under `docs/eval_reports/`

## 6) Resilience Maturity

- Make retry policy provider-specific (attempts, backoff, retryable conditions)
- Add breaker metrics endpoint fields (open/closed counts)
- Add fallback policy config (allow or disallow fallback by model)
- Add optional jitter in backoff

## 7) Security and Compliance Hardening

- Hash or redact any potentially sensitive metadata fields
- Rotate API keys and move to env/config secrets manager
- Add basic audit logs for auth failures
- Add request size limits to prevent abuse

## 8) Deployment and DevEx

- Add Dockerfiles for gateway and sidecar
- Add `docker-compose.yml` for local two-service run
- Add Makefile tasks: `run`, `test`, `lint`, `replay-eval`
- Add CI pipeline for build + tests + basic smoke checks

## 9) "V1 Portfolio Release" Definition

Consider the project portfolio-ready when all are true:

- [ ] Chatbot demo app works through gateway only
- [ ] Multi-provider routing works with real APIs
- [ ] Safety sidecar has at least 2 real detectors
- [ ] Replay evaluation produces repeatable report artifact
- [ ] Metrics and logs are visible and documented
- [ ] One-click local startup (`docker-compose up`) works

## Suggested order (next 3 milestones)

1. **Milestone A:** Build showcase chatbot + request ID support
2. **Milestone B:** Improve safety detectors + replay eval report
3. **Milestone C:** Docker + CI + deploy to Cloud Run

