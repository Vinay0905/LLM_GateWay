# Showcase Future Idea 1 - Directions Step 3

This step completes the frontend polish pass (no new backend dependency).

What was upgraded:

- better hero section with custom technical gateway graphic
- improved typography system (retro-futuristic + dotted accent labels)
- stronger visual hierarchy and spacing rhythm on all pages
- improved content structure for Tutorial, Playground, Chat, and About

---

## 1) What changed in code

### New visual/structure components

- `showcase-ui/components/hero/GatewayHeroGraphic.tsx`
- `showcase-ui/components/ui/SectionHeading.tsx`

### Updated app shell and theme

- `showcase-ui/app/layout.tsx` (font loading + font variables)
- `showcase-ui/app/globals.css` (font utilities, hero grid texture, glass border)

### Updated pages

- `showcase-ui/app/page.tsx` (new premium hero + feature lanes)
- `showcase-ui/app/tutorial/page.tsx` (mission briefing + scoring layout)
- `showcase-ui/app/playground/page.tsx` (sandbox flow + better onboarding)
- `showcase-ui/app/chat/page.tsx` (metadata side panel + operator notes)
- `showcase-ui/app/about/page.tsx` (journey framing + stronger storytelling)

### Updated nav

- `showcase-ui/components/layout/TopNav.tsx`

---

## 2) Run on Mac (same as before)

From project root, run 3 terminals:

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

## 3) Visual verification checklist

Mark complete if all pass:

- [ ] Home hero now has a custom technical graphic and stronger layout
- [ ] Typography has clear hierarchy (display vs body vs dotted labels)
- [ ] Buttons/cards are readable and non-blinding
- [ ] Tutorial page feels structured (brief + scoring + runner)
- [ ] Playground page gives clear test flow guidance
- [ ] Chat page has metadata side panel and operator notes
- [ ] About page tells a coherent portfolio story

---

## 4) If any page still feels weak

Send me:

1. page name
2. what feels wrong (example: "too empty", "text too small", "cards too flat")
3. one screenshot

I will do a targeted pass and create Step 4 directions.

