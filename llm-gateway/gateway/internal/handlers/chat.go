package handlers

import (
	"encoding/json"
	"llm-gateway/gateway/internal/types"

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

	providerName := h.router.ResolveProvider(req.Model)
	provider, ok := h.providers[providerName]
	if !ok {
		http.Error(w, "unknown provider", http.StatusBadRequest)
		return
	}

	resp, err := provider.Generate(r.Context(), req)
	if err != nil {
		http.Error(w, "provider error", http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}
