# Showcase App + Future Idea 1 (Next.js)

This document is the implementation blueprint for Future Idea 1 from `docs/future.md`:

- Build a **Next.js showcase web app** that demonstrates the power of `LLM_GateWay`
- Keep the app demo-friendly, portfolio-ready, and fun to explore
- Include both guided tutorial experiences and real chat usage

This is a planning and direction document. Once approved, we can start building exactly from this spec.

---

## 1) Product Vision

Create a **cyber-retro demo app** (neon green + black aesthetic) where users can:

1. Learn what the gateway does via interactive tutorial cards and mini scenarios
2. Run pre-built prompt snippets and see live gateway behavior
3. Use a real chat panel backed only by your gateway endpoint
4. Inspect useful metadata (provider selection, safety blocks, latency, request id)

Outcome: one polished UI that proves routing, safety, resilience, and observability in action.

---

## 2) Core Principles

- **Gateway-first:** frontend never calls Gemini/Groq directly; all requests go through gateway.
- **Interactive learning:** each feature is shown as a hands-on experience, not static text.
- **Visual identity:** neon green on black, clean corners, subtle glow/shadow, retro-future vibe.
- **Portfolio clarity:** each section maps to your engineering phases and architectural decisions.

---

## 3) App Scope (V1)

### Must-have modules

1. **Landing / Hero**
   - Short explanation of LLM gateway value
   - CTA buttons: `Try Playground`, `Open Chat`, `Run Tutorial`

2. **Interactive Tutorial Mode**
   - Step cards explaining:
     - request lifecycle
     - safety check
     - routing decision
     - fallback behavior
   - "Run this step" buttons that fire real requests and display outcomes

3. **Snippet Playground**
   - curated prompt snippets users can run with one click
   - categories:
     - safe prompts
     - blocked prompts
     - retry/failure simulation prompts
   - real-time response panel with status + metadata + output

4. **Real Chat Mode**
   - chat input + history timeline
   - model selector (`gemini`, `groq`, and model aliases if supported)
   - optional metadata drawer (`provider`, `latency`, `request id`, status)
   - clear UI for safety blocks

5. **Gateway Status Pane**
   - quick health cards:
     - gateway health
     - metrics snapshot
     - latest request result

---

## 4) UX / UI Design Direction

## Theme: Neon Retro Future

- **Background:** near-black (`#05070A`)
- **Primary neon lines:** soft green (`#8AF28E`) not high-intensity
- **Secondary accents:** cool cyan (`#7DE8F5`) and synth purple (`#B89CFF`)
- **Text:** off-white (`#E8F5E9`) with muted green-gray for secondary copy
- **Borders:** thin glowing outlines on active controls

### Styling rules

- Clean rounded corners (`10px` to `14px`)
- Buttons have:
  - soft neon border
  - subtle drop shadow
  - stronger glow on hover
- Cards use glass/dark panel feel with low-opacity gradient
- Motion:
  - micro-interactions only (150ms-250ms)
  - no heavy flashy animations
- Accessibility:
  - maintain readable contrast
  - visible focus ring for keyboard nav

### Color combination options (choose one per release)

1. **Matrix Soft (default)**
   - line green: `#8AF28E`
   - accent cyan: `#7DE8F5`
   - panel: `#0B1117`
2. **Cyber Arcade**
   - line green: `#9EFF8F`
   - accent magenta: `#D98CFF`
   - panel: `#111025`
3. **Terminal Pro**
   - line green: `#7FDB7F`
   - accent amber: `#FFC66D`
   - panel: `#0F1412`

Guideline: never use full-bright green as a large fill. Keep neon primarily as border/line/glow accents.

---

## 5) Information Architecture

Suggested pages/routes:

- `/` -> Home + product overview + architecture mini-visual
- `/tutorial` -> guided learning flow with step runner
- `/playground` -> snippet runner + output inspector
- `/chat` -> real chat interface
- `/about` -> phase mapping, ADR links, architecture highlights

Shared top nav:

- Home
- Tutorial
- Playground
- Chat
- About

---

## 6) Functional Behavior

## Request contract from frontend

All request actions send to gateway:

- `POST /v1/chat`
- payload includes:
  - `model`
  - `prompt`
  - optional `max_tokens`
  - optional `temperature`
  - optional `metadata`

### Response handling in UI

Display and classify by status:

- `200` -> render assistant output + metadata
- `400 blocked_by_safety` -> show blocked panel with threat context when available
- `401` -> auth warning banner
- `429` -> rate-limit message with retry hint
- `502/503` -> upstream/service resilience warning panel

---

## 7) Mini Games / Tutorial Interactions

These are small "game-like" interactions (lightweight, not full games):

1. **Prompt Safety Challenge**
   - user guesses PASS/BLOCK before running
   - app reveals actual result from gateway

2. **Route Guess**
   - show model name, user guesses provider selected
   - run and compare with actual returned provider

3. **Failure Drill**
   - run prepared transient/permanent/timeout scenarios
   - display how gateway responds and what that means

4. **Latency Race**
   - run 3 snippet requests and compare latency stats in simple chart/bars

---

## 8) Technical Architecture (Frontend)

## Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS
- Optional UI helpers:
  - `framer-motion` (micro animations)
  - `lucide-react` (icons)
  - `zod` (response validation)

### Data flow

Preferred for security and flexibility:

- Next.js server route proxies to gateway:
  - `app/api/chat/route.ts` -> forwards to gateway `/v1/chat`
  - `app/api/health/route.ts` -> forwards `/health`
  - `app/api/metrics/route.ts` -> forwards `/metrics`

Benefits:

- keeps gateway base URL and auth handling centralized
- avoids exposing raw infra config in browser code
- easier future auth/session integration

---

## 9) Environment Setup

Create frontend env file (example):

```env
NEXT_PUBLIC_APP_NAME=LLM Gateway Showcase
GATEWAY_BASE_URL=http://localhost:8080
GATEWAY_API_KEY=dev-key
```

Notes:

- keep this frontend env separate from gateway `.env`
- if deploying publicly later, move secrets to server-only env vars and secure auth

---

## 10) Suggested Folder Structure (Next.js app)

```text
showcase-ui/
  app/
    page.tsx
    tutorial/page.tsx
    playground/page.tsx
    chat/page.tsx
    about/page.tsx
    api/
      chat/route.ts
      health/route.ts
      metrics/route.ts
  components/
    ui/
      NeonButton.tsx
      NeonCard.tsx
      StatPill.tsx
    chat/
      ChatWindow.tsx
      ChatInput.tsx
      MessageBubble.tsx
    tutorial/
      StepRunner.tsx
      ChallengeCard.tsx
    playground/
      SnippetGrid.tsx
      OutputPanel.tsx
  lib/
    gateway-client.ts
    formatters.ts
    constants.ts
  styles/
    theme.css
```

---

## 11) Build Plan (Phased)

### Phase A: Foundation UI

- scaffold Next.js app + Tailwind
- implement neon theme tokens and reusable components
- create page shells and navigation

### Phase B: Gateway Integration

- build `/api/chat`, `/api/health`, `/api/metrics` proxy routes
- connect playground and chat flows to real gateway responses

### Phase C: Tutorial + Mini Games

- add tutorial runner + challenge cards
- add snippet presets and scenario responses

### Phase D: Polish + Demo Readiness

- hover states, shadows, transitions, responsive layout
- error states + empty states + loading states
- final copywriting and screenshot-ready layout

---

## 12) Acceptance Criteria

App is approved when:

- [ ] all frontend interactions route through gateway only
- [ ] chat mode works end-to-end with model selection
- [ ] tutorial mode demonstrates safety/routing/resilience concepts
- [ ] snippet mode shows real responses and metadata
- [ ] visual style matches neon green/black retro-future direction
- [ ] hover shadows + clean corner system are consistently applied
- [ ] error handling exists for 400/401/429/502/503

---

## 13) Nice-to-Have (Post V1)

- session replay panel for recent requests
- tiny animated architecture diagram fed by live request state
- downloadable "demo report" JSON after a tutorial run
- dark/light toggle variant while keeping retro identity

---

## 14) Next Step

If you approve this plan, we start implementation with:

1. Next.js app bootstrap
2. neon design system (buttons/cards/layout)
3. gateway proxy routes
4. first working pages: `/playground` and `/chat`

