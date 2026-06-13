# Showcase Future Idea 1 - Directions Step 1 (Beginner Friendly)

This file explains exactly what to do after the first full frontend build drop was added.

If you know nothing about frontend, follow this top to bottom without skipping.

---

## What I built in this step

A complete Next.js app scaffold is now created in:

- `showcase-ui/`

Main features already included:

- neon green + black retro visual system
- top navigation and clean card/button components
- `/tutorial` page with guided step runner
- `/playground` page with one-click snippets and output/debug panels
- `/chat` page with live chat UI and model selector
- `/about` page for portfolio storytelling
- live status panel (`/health` + `/metrics`)
- Next.js API proxy routes:
  - `/api/chat`
  - `/api/health`
  - `/api/metrics`

---

## Before you run (Mac prerequisites)

You need:

1. Node.js 18+ (or 20+) installed
2. npm available in terminal
3. Gateway + sidecar project already working (your existing phases)

Check versions:

```bash
node -v
npm -v
```

---

## A-Z run steps (Mac)

## 1) Open project root

```bash
cd "/path/to/LLM_GateWay_mastStyle"
```

## 2) Start sidecar (terminal 1)

```bash
cd llm-gateway/safety_sidecar
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

## 3) Start gateway (terminal 2)

```bash
cd llm-gateway/gateway
export SAFETY_BASE_URL="http://127.0.0.1:8000"
export ENV_FILE=../../../.env
export DEBUG_HEADERS=true
go run ./cmd
```

## 4) Prepare frontend env (terminal 3)

```bash
cd showcase-ui
cp .env.example .env.local
```

No change needed if gateway runs on `localhost:8080` with key `dev-key`.

## 5) Install frontend dependencies

```bash
npm install
```

## 6) Run frontend

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

---

## What to click/test first

1. Home page loads with neon theme
2. Open **Playground**
   - run Safe Prompt snippet
   - run Safety Block snippet
   - run Timeout snippet
3. Open **Tutorial**
   - run each step in order
4. Open **Chat**
   - send 2-3 prompts with different models
5. Return to Home
   - click Refresh on Gateway Status card

---

## Expected behavior quick map

- Safe snippets -> mostly `200`
- Blocked snippet -> `400 blocked_by_safety`
- Timeout/permanent failure simulations -> `503 upstream unavailable`
- Health card -> `200`
- Debug headers visible in Playground output when `DEBUG_HEADERS=true`

---

## If something fails

### `fetch failed` in frontend

- gateway not running or wrong `GATEWAY_BASE_URL` in `showcase-ui/.env.local`

### `401 unauthorized`

- wrong `GATEWAY_API_KEY` value in `.env.local`

### no debug headers

- gateway not started with `DEBUG_HEADERS=true`

### blocked snippet returns `200`

- sidecar rule not matching prompt (or sidecar not running expected version)

---

## Step 1 done criteria

Mark this step done only if all are true:

- [ ] frontend starts on port `3000`
- [ ] all pages render (`/`, `/tutorial`, `/playground`, `/chat`, `/about`)
- [ ] at least one successful gateway response appears in UI
- [ ] at least one blocked or failure response appears in UI
- [ ] neon style and hover effects are visible

---

## What comes in next step

After you confirm this works on Mac, I will create:

- Step 2 directions file for UI polish + mini-game enhancements
- Step 3 directions file for deployment-ready packaging (Docker + demo flow)

