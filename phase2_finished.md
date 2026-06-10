# Phase 2 Finished: Pre-Phase 3 Test Checklist

Use this checklist after Phase 2 implementation (auth + per-key rate limit + method guard) and before starting Phase 3.

## 0) Start server (macOS)

From `llm-gateway/gateway`:

```bash
ENV_FILE=../../../.env go run ./cmd
```

Expected:

- Server starts without panic
- Startup log prints gateway port (`:8080`)

## 1) Health endpoint

```bash
curl -i http://localhost:8080/health
```

Expected:

- Status: `200 OK`
- Body contains `{"status":"ok"}`

## 2) Method guard on `/v1/chat`

```bash
curl -i http://localhost:8080/v1/chat
```

Expected:

- Status: `405 Method Not Allowed`
- Body contains `method not allowed`

## 3) Auth checks

### 3.1 Missing API key

```bash
curl -i -X POST http://localhost:8080/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-1.5-flash","prompt":"hello","max_tokens":64,"temperature":0.2}'
```

Expected:

- Status: `401 Unauthorized`
- Body contains `unauthorized`

### 3.2 Invalid API key

```bash
curl -i -X POST http://localhost:8080/v1/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: wrong-key" \
  -d '{"model":"gemini-1.5-flash","prompt":"hello","max_tokens":64,"temperature":0.2}'
```

Expected:

- Status: `401 Unauthorized`

### 3.3 Valid API key

```bash
curl -i -X POST http://localhost:8080/v1/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-key" \
  -d '{"model":"gemini-1.5-flash","prompt":"hello","max_tokens":64,"temperature":0.2}'
```

Expected:

- Status: `200 OK`
- JSON contains:
  - `"provider":"gemini"`
  - `"model":"gemini-1.5-flash"`

## 4) Input validation checks

### 4.1 Invalid JSON

```bash
curl -i -X POST http://localhost:8080/v1/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-key" \
  -d '{"model":"gemini-1.5-flash","prompt":"hello"'
```

Expected:

- Status: `400 Bad Request`
- Body contains `invalid JSON`

### 4.2 Empty prompt

```bash
curl -i -X POST http://localhost:8080/v1/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-key" \
  -d '{"model":"gemini-1.5-flash","prompt":"   ","max_tokens":64,"temperature":0.2}'
```

Expected:

- Status: `400 Bad Request`
- Body contains `prompt required`

## 5) Rate limit behavior

Run burst requests with valid key:

```bash
for i in {1..25}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:8080/v1/chat \
    -H "Content-Type: application/json" \
    -H "X-API-Key: dev-key" \
    -d '{"model":"gemini-1.5-flash","prompt":"hello","max_tokens":64,"temperature":0.2}'
done
```

Expected:

- First chunk mostly `200`
- After bucket/burst is exhausted, you see `429`

## 6) Quick regression sanity

- `/health` still returns `200` after stress test.
- Valid key still recovers to `200` after waiting briefly.
- Missing/invalid key consistently returns `401` (not `429`).

## 7) Phase 2 completion gate

You are ready for Phase 3 only if all are true:

- [ ] `405` on non-POST `/v1/chat`
- [ ] auth checks pass (`401`, `401`, `200`)
- [ ] invalid JSON and empty prompt return `400`
- [ ] rate limiter returns `429` under burst
- [ ] normal valid request still returns `200`
- [ ] no unexpected server panic/errors in logs
