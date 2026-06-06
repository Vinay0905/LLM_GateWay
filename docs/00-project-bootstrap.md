# Project Bootstrap: When and How to Create Files/Folders

This is the source of truth for initial structure. Follow this before phase guides.

## What to create now (day 0)

Create only the base skeleton first:

```text
llm-gateway/
  gateway/
    cmd/
    internal/
      handlers/
      middleware/
      providers/
      router/
      safety/
      circuit/
      logger/
      types/
  safety_sidecar/
    detectors/
  config/
  logs/
```

## PowerShell commands (Windows)

```powershell
mkdir llm-gateway
cd llm-gateway

mkdir gateway, safety_sidecar, config, logs
mkdir gateway/cmd, gateway/internal
mkdir gateway/internal/handlers, gateway/internal/middleware, gateway/internal/providers
mkdir gateway/internal/router, gateway/internal/safety, gateway/internal/circuit
mkdir gateway/internal/logger, gateway/internal/types
mkdir safety_sidecar/detectors
```

## Minimal files to create immediately

```text
gateway/cmd/main.go
gateway/internal/types/chat.go
gateway/internal/handlers/chat.go
gateway/internal/providers/provider.go
config/config.yaml
```

## When to create the rest (phase mapping)

- **Phase 1:** `main.go`, `types/chat.go`, `handlers/chat.go`, `providers/provider.go`, `providers/gemini.go`
- **Phase 2:** `middleware/auth.go`, `middleware/ratelimit.go`
- **Phase 3:** `safety/analyzer.go`
- **Phase 4:** `safety/client.go`, `safety_sidecar/main.py`, `safety_sidecar/detectors/*.py`
- **Phase 5:** `providers/groq.go`, `router/model_router.go`
- **Phase 6:** `circuit/breaker.go`
- **Phase 7:** `logger/experiment_log.go`, `handlers/metrics.go`, `logs/experiment_log.jsonl`

## Suggested init commands

Go:

```powershell
cd gateway
go mod init llm-gateway/gateway
go mod tidy
```

Python:

```powershell
cd ../safety_sidecar
python -m venv .venv
.\.venv\Scripts\activate
pip install fastapi uvicorn pydantic
```

## Anti-derail checklist (do this every phase)

- Do not introduce a new folder unless the phase explicitly needs it.
- Keep package names aligned with folder names.
- Keep API response schema stable (`output`, `provider`, `model`) unless intentionally versioning.
- Run compile/start checks before moving to next phase.
