# 🚀 UI Improvement & Feature Proposals

This document outlines proposed aesthetic, interactive, and functional enhancements to elevate the **Stitch Nexus LLM Gateway Showcase** from a static prototype to an advanced, fully operational dashboard.

---

## 1. Functional Enhancements (Live Controls)

### 🎛️ Active Parameter Binding (Tuning Panel)
* **Current State:** The Chat panel has styling-only sliders for *Temperature* and *Top P*.
* **Proposal:** Bind these sliders to React state. When the user sends a message, include the custom temperature and max tokens in the payload to the Go gateway.
* **Why:** Proves that the gateway respects client-defined configuration overrides dynamically.

### 🔌 Manual Circuit Breaker Injection
* **Current State:** The circuit breaker is simulated programmatically via presets.
* **Proposal:** Add a toggle in the sidebar called `"Simulate Gemini Downtime"` or `"Force Open Gemini Breaker"`.
* **Why:** Allows developers to instantly test and visualize the fallback path (switching from Gemini to Groq) during live chat sessions.

### 👁️ Presidio PII Masking Preview
* **Current State:** Redacted prompts are sent to the LLM, but the user doesn't see the before/after details.
* **Proposal:** If PII is detected, display a diff block in the chat timeline (e.g., showing original text in red/strike-through, and masked text `[EMAIL]` in green).
* **Why:** Demonstrates the presidio sidecar filter operating in real-time.

---

## 2. Telemetry & Charts (Aesthetics & Data)

### 📈 Live SVG Sparklines
* **Proposal:** Instead of static bar indicators, render lightweight, self-updating SVG sparkline charts showing a rolling history of the last 10 gateway requests.
* **Why:** Enhances the hardware-readout aesthetic with dynamic, live-updating visual components.

### 📋 Experiment Log Streamer
* **Proposal:** Add a dedicated "Telemetry Logs" view that polls or streams entries from `/logs/experiment_log.jsonl`. It will show request IDs, hash tokens, and backend providers as they execute.
* **Why:** Adds a core portfolio feature proving database logging capability.

---

## 3. Aesthetic & Micro-Interaction Polish

### 💻 CRT Scanline & Grid Overlays
* **Proposal:** Add a toggleable CRT scanline filter or dot-matrix animation. When switching themes (e.g. from *Gateway OS* to *Neon Tokyo*), trigger a short 300ms screen-glitch overlay animation.
* **Why:** Heavily reinforces the retro-futurism "Nothing-style" visual theme.

### 🎨 Theme-Aware Interactive Canvas
* **Proposal:** For the *Neon Tokyo* theme, inject a lightweight HTML5 canvas script that draws faint, floating node networks. When the user moves the mouse, the nodes gently attract to the cursor.
* **Why:** Adds a premium, responsive touch without impacting performance.

### 🛸 Technical Hover Bloom
* **Proposal:** Wire up custom cursor tracking to all major buttons. A subtle inner spotlight will track the mouse pointer inside the card boundaries, emitting a faint green glow for *Gateway OS* and hot pink for *Neon Tokyo*.
