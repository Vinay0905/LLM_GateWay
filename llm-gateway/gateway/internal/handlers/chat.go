package handlers

import (
	"encoding/json"
	"llm-gateway/gateway/internal/types"
	"net/http"
	"strings"
)

func (h *ChatHandler) HandleChat(w http.ResponseWriter, r *http.Request) {
	// 405 Method Not Allowed
	if r.Method != http.MethodPost {
		http.Error(w, "method no allowed", http.StatusMethodNotAllowed)
		return
	}
	// #decode chat request ---------------------------------------------------
	var req types.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	// #validate prompt text ---------------------------------------------------
	if strings.TrimSpace(req.Prompt) == "" {
		http.Error(w, "prompt required", http.StatusBadRequest)
		return
	}

	// #call provider generate ---------------------------------------------------
	resp, err := h.provider.Generate(r.Context(), req)
	if err != nil {
		http.Error(w, "provider error", http.StatusBadGateway)
		return
	}

	// #write json response ---------------------------------------------------
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}
