# Phase 7: Observability and Replay Evaluations

## Objective

Make the system measurable and improvable:

- structured logs
- metrics endpoint
- replay-based safety/routing evaluation

## Create these files/folders in this phase

- `gateway/internal/logger/experiment_log.go`
- `gateway/internal/handlers/metrics.go`
- `logs/experiment_log.jsonl`

## Theory to learn

- **Telemetry by design:** logs and metrics are product features, not afterthoughts
- **Privacy-aware observability:** hash prompts, avoid raw sensitive text
- **Evaluation loop:** replay historical inputs to test policy changes safely

## Snippet 1: Experiment log record

Put in file: `gateway/internal/logger/experiment_log.go`

```go
type ExperimentLog struct {
    Timestamp     time.Time `json:"timestamp"`
    RequestID     string    `json:"request_id"`
    ApiKeyHash    string    `json:"api_key_hash"`
    PromptHash    string    `json:"prompt_hash"`
    Provider      string    `json:"provider"`
    Model         string    `json:"model"`
    SafetyVerdict string    `json:"safety_verdict"`
    ThreatType    string    `json:"threat_type"`
    LatencyMs     int64     `json:"latency_ms"`
    StatusCode    int       `json:"status_code"`
}
```

What this snippet does:

- Captures critical dimensions for debugging and analysis.
- Avoids storing raw prompt/API key values.
- Supports offline eval and incident reviews.

## Snippet 2: Prompt hashing utility

Put in file: `gateway/internal/logger/experiment_log.go`

```go
func SHA256Hex(input string) string {
    sum := sha256.Sum256([]byte(input))
    return hex.EncodeToString(sum[:])
}
```

What this snippet does:

- Produces stable identifier for repeated prompt analysis.
- Preserves privacy while enabling dedup/counting workflows.
- Keeps raw user content out of logs by default.

## Snippet 3: JSONL append logger

Put in file: `gateway/internal/logger/experiment_log.go`

```go
func AppendJSONL(path string, v any) error {
    f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        return err
    }
    defer f.Close()
    b, err := json.Marshal(v)
    if err != nil {
        return err
    }
    _, err = f.Write(append(b, '\n'))
    return err
}
```

What this snippet does:

- Writes one JSON object per line for easy downstream tooling.
- Keeps logging implementation simple and durable.
- Supports local analysis with jq/pandas/MLflow adapters later.

## Snippet 4: Basic in-memory metrics endpoint

Put in file: `gateway/internal/handlers/metrics.go`

```go
type Metrics struct {
    RequestsTotal  atomic.Int64
    BlocksTotal    atomic.Int64
    UpstreamErrors atomic.Int64
}

func (m *Metrics) HandleMetrics(w http.ResponseWriter, _ *http.Request) {
    _ = json.NewEncoder(w).Encode(map[string]int64{
        "requests_total":  m.RequestsTotal.Load(),
        "blocks_total":    m.BlocksTotal.Load(),
        "upstream_errors": m.UpstreamErrors.Load(),
    })
}
```

What this snippet does:

- Tracks key health indicators for quick checks.
- Exposes operational counters in machine-readable form.
- Creates basis for later Prometheus integration.

## Snippet 5: Replay evaluation pseudocode

Put in file: `docs/replay-eval-notes.md` (design notes) or a script on your implementation laptop.

```text
for each sample in eval_dataset:
  call sidecar/gateway in dry-run mode
  compare observed verdict against expected verdict
  accumulate precision/recall and false-positive rate
publish report before policy rollout
```

What this snippet does:

- Prevents blind policy updates in production.
- Quantifies safety quality using repeatable dataset.
- Enables confidence-based deployments.

## Common mistakes and quick fixes

- **Symptom:** log file grows but analysis is difficult.
  **Fix:** keep each record one-line JSON (JSONL) and include stable keys across phases.
- **Symptom:** sensitive data appears in logs.
  **Fix:** log prompt/API key hashes only; gate raw logging behind explicit local debug flag.
- **Symptom:** metrics endpoint always returns zero.
  **Fix:** increment counters in request path and block/error branches, not only success path.
- **Symptom:** replay results vary wildly.
  **Fix:** freeze eval dataset, policy version, and thresholds for each replay run.

## Definition of done

- Every request emits structured log row.
- `/metrics` reflects live traffic behavior.
- Replay script runs and outputs quality stats.
- Log/privacy policy documented in ADR.

## Read next

- `adr/ADR-006-logging-and-privacy.md`
