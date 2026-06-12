package handlers

import (
	"context"
	"encoding/json"
	"llm-gateway/gateway/internal/types"
	"strconv"
	"time"

	"net/http"
	"strings"
)

func (h *ChatHandler) HandleChat(w http.ResponseWriter, r *http.Request) {
	var req types.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Prompt) == "" {
		http.Error(w, "prompt required", http.StatusBadRequest)
		return
	}
	if h.safetyClient == nil {
		http.Error(w, "safety service unavailable", http.StatusBadGateway)
		return
	}

	verdict, err := h.safetyClient.Analyze(r.Context(), req.Prompt)
	if err != nil {
		http.Error(w, "safety service unavailable", http.StatusBadGateway)
		return
	}
	if verdict.Verdict == "BLOCK" {
		http.Error(w, "blocked_by_safety", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(verdict.MaskedPrompt) != "" {
		req.Prompt = verdict.MaskedPrompt
	}

	if h.router == nil {
		http.Error(w, "router unavailable", http.StatusBadGateway)
		return
	}

	requestedPrimary := h.router.ResolveProvider(req.Model)
	selectedProvider := requestedPrimary
	fallbackFrom := ""

	breaker, ok := h.breakers[selectedProvider]
	if !ok {
		http.Error(w, "unknown provider", http.StatusBadRequest)
		return
	}
	if !breaker.Allow() {
		fallbackFrom = selectedProvider
		selectedProvider = h.router.Secondary(selectedProvider)
		breaker, ok = h.breakers[selectedProvider]
		if !ok {
			http.Error(w, "unknown provider", http.StatusBadRequest)
			return
		}
	}

	provider, ok := h.providers[selectedProvider]
	if !ok {
		http.Error(w, "unknown provider", http.StatusBadRequest)
		return
	}

	// Debug headers to validate routing and breaker behavior during Phase 6 tests.
	w.Header().Set("X-Debug-Primary-Provider", requestedPrimary)
	w.Header().Set("X-Debug-Selected-Provider", selectedProvider)
	w.Header().Set("X-Debug-Fallback", strconv.FormatBool(fallbackFrom != ""))
	if fallbackFrom != "" {
		w.Header().Set("X-Debug-Fallback-From", fallbackFrom)
	}
	w.Header().Set("X-Debug-Breaker-State-Before", breaker.State())

	ctx, cancel := context.WithTimeout(r.Context(), 8*time.Second)
	defer cancel()

	resp, err := provider.Generate(ctx, req)
	if err != nil {
		breaker.RecordFailure()
		w.Header().Set("X-Debug-Breaker-State-After", breaker.State())
		http.Error(w, "upstream unavailable", http.StatusServiceUnavailable)
		return
	}
	breaker.RecordSuccess()
	w.Header().Set("X-Debug-Breaker-State-After", breaker.State())

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}
