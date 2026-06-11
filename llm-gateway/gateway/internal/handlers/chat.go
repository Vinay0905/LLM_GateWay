package handlers

import (
	"encoding/json"
	"llm-gateway/gateway/internal/safety"
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

	//policy gate in handler flow

	verdict := safety.Analyze(req.Prompt)
	if verdict.Verdict == "BLOCK" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]any{
			"error":       "blocked_by_safety",
			"threat_type": verdict.ThreatType,
			"score":       verdict.Score,
			"reasons":     verdict.Reasons,
		})
		return
	}

	resp, err := h.provider.Generate(r.Context(), req)
	if err != nil {
		http.Error(w, "provider error", http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}
