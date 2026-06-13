# Showcase Future Idea 1 - Directions Step 2

This step includes two major upgrades:

1. **Design V2 polish** (less blinding neon, better retro-futuristic balance)
2. **Real provider integration** (Gemini + Groq API calls instead of stub "not implemented" responses)

---

## Why chat said "not implemented yet"

That message came from gateway provider stubs in:

- `gateway/internal/providers/gemini.go`
- `gateway/internal/providers/groq.go`

API keys alone were not enough because provider HTTP calls were not implemented previously.

Now implemented:

- real Gemini API request path
- real Groq API request path
- retry behavior kept
- Phase 6 simulation mode still supported via metadata (`simulate_mode`)

---

## Required API key setup (important)

Put keys in project root `.env`:

```env
GEMINI_API_KEY=your_real_gemini_key
GROQ_API_KEY=your_real_groq_key
GEMINI_DEFAULT_MODEL=gemini-3.1-flash-lite
GROQ_DEFAULT_MODEL=llama-3.1-8b-instant
```

Then start gateway with:

```bash
cd llm-gateway/gateway
export ENV_FILE=../../../.env
export SAFETY_BASE_URL=http://127.0.0.1:8000
export DEBUG_HEADERS=true
go run ./cmd
```

---

## Design changes applied

- Green neon intensity reduced to line-accent style
- Added cyan + purple secondary accents for retro depth
- Softer glow shadows and lower scanline opacity
- Cards use cleaner panel gradients instead of bright fills
- Nav/Buttons updated to reduce visual harshness

Main files updated:

- `showcase-ui/tailwind.config.ts`
- `showcase-ui/app/globals.css`
- `showcase-ui/components/ui/NeonButton.tsx`
- `showcase-ui/components/ui/NeonCard.tsx`
- `showcase-ui/components/ui/StatPill.tsx`
- `showcase-ui/components/layout/TopNav.tsx`

---

## How to verify Step 2 on Mac

1. Start sidecar
2. Start gateway (with env above)
3. Start frontend:

```bash
cd showcase-ui
npm install
npm run dev
```

4. In `/chat`, send a normal prompt with model `gemini`.
   - Expected: real response text (not "not implemented yet")
5. Switch model to `groq` and send prompt.
   - Expected: real response text from Groq
6. In `/playground`, run timeout snippet.
   - Expected: resilience behavior still works (`503` path)

---

## If you still see stub-like output

- Confirm gateway process is restarted after code changes
- Confirm `.env` loaded with real keys
- Confirm model names are supported:
  - Gemini: `gemini`, `gemini-3.1-flash-lite` (or any supported `gemini-*`)
  - Groq: `groq`, `llama-3.1-8b-instant` (or any supported `llama-*`/`mixtral-*`)
- Check gateway terminal for upstream status errors (`401`, `429`, `5xx`)

---

## Step 2 done criteria

- [ ] Neon look is comfortable (not overly bright)
- [ ] Chat returns real provider output for Gemini
- [ ] Chat returns real provider output for Groq
- [ ] Playground still demonstrates error/simulation scenarios
- [ ] Tutorial remains usable with updated style

