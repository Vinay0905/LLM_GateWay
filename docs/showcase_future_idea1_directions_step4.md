# Showcase Future Idea 1 - Directions Step 4 (Stitch Replacement Pass)

This step is the hard switch to Stitch-style UI.

Your feedback was: remove old design and use Stitch designs as the base.

That is what this pass does.

---

## What changed

## 1) App shell switched to Stitch-style

- Dark dot-matrix background
- Glass panel system
- Technical card hover borders
- Uppercase nav labels with active underline
- Space Grotesk + Inter typography

Updated:

- `showcase-ui/app/layout.tsx`
- `showcase-ui/app/globals.css`
- `showcase-ui/components/layout/TopNav.tsx`

## 2) Home page replaced with Stitch-like structure

- Large hero headline (`GATEWAY`)
- technical hero visual panel
- status metrics row (uptime/latency/safety)
- infrastructure layer cards

Updated:

- `showcase-ui/app/page.tsx`
- `showcase-ui/components/hero/GatewayHeroGraphic.tsx`

## 3) Tutorial / Playground / Chat / About moved to Stitch visual language

- panel framing and typography switched
- metadata panels and status blocks styled in technical console form
- old “neon card” look de-emphasized

Updated:

- `showcase-ui/app/tutorial/page.tsx`
- `showcase-ui/components/tutorial/ChallengeCard.tsx`
- `showcase-ui/components/tutorial/StepRunner.tsx`
- `showcase-ui/app/playground/page.tsx`
- `showcase-ui/components/playground/SnippetGrid.tsx`
- `showcase-ui/components/playground/OutputPanel.tsx`
- `showcase-ui/app/chat/page.tsx`
- `showcase-ui/components/chat/ChatWindow.tsx`
- `showcase-ui/components/chat/MessageBubble.tsx`
- `showcase-ui/components/chat/ChatInput.tsx`
- `showcase-ui/app/about/page.tsx`

## 4) Backend mechanism unchanged

No routing/safety/resilience architecture changes were introduced for this UI replacement.

Frontend still uses the same endpoints:

- `/api/chat`
- `/api/health`
- `/api/metrics`

---

## How to run on Mac

### Terminal A (sidecar)

```bash
cd llm-gateway/safety_sidecar
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### Terminal B (gateway)

```bash
cd llm-gateway/gateway
set -a
source ../../../.env
set +a
export SAFETY_BASE_URL=http://127.0.0.1:8000
export DEBUG_HEADERS=true
go run ./cmd
```

### Terminal C (frontend)

```bash
cd showcase-ui
npm install
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

---

## Verification checklist

- [ ] Home page now looks like Stitch style, not old custom style
- [ ] Nav + cards + typography are consistent across all pages
- [ ] Tutorial, Playground, Chat, About all follow same design language
- [ ] Chat and snippets still hit backend and return responses
- [ ] Safety and timeout behavior still visible from UI

---

## If you want exact pixel matching next

For Step 5, send screenshots of:

1. your Stitch target page
2. current built page

for each route (`/`, `/tutorial`, `/playground`, `/chat`, `/about`).

I will then do pixel-tight matching page by page.

