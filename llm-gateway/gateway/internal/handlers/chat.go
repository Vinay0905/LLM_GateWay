package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"llm-gateway/gateway/internal/logger"
	"llm-gateway/gateway/internal/types"
	"log"
	"strconv"
	"time"

	"net/http"
	"strings"
)

func (h *ChatHandler) HandleChat(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	requestID := fmt.Sprintf("%d", start.UnixNano())
	statusCode := http.StatusInternalServerError
	selectedProvider := ""
	requestModel := ""
	safetyVerdict := ""
	threatType := ""
	promptHash := ""

	if h.metrics != nil {
		h.metrics.RequestsTotal.Add(1)
	}
	defer func() {
		if h.logPath == "" {
			return
		}

		entry := logger.ExperimentLog{
			Timestamp:     start.UTC(),
			RequestID:     requestID,
			ApiKeyHash:    logger.SHA256Hex(r.Header.Get("X-API-Key")),
			PromptHash:    promptHash,
			Provider:      selectedProvider,
			Model:         requestModel,
			SafetyVerdict: safetyVerdict,
			ThreatType:    threatType,
			LatencyMs:     time.Since(start).Milliseconds(),
			StatusCode:    statusCode,
		}
		if err := logger.AppendJSONL(h.logPath, entry); err != nil {
			log.Printf("failed to append experiment log: %v", err)
		}
	}()

	var req types.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		statusCode = http.StatusBadRequest
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}
	promptHash = logger.SHA256Hex(req.Prompt)
	requestModel = req.Model

	if strings.TrimSpace(req.Prompt) == "" {
		statusCode = http.StatusBadRequest
		http.Error(w, "prompt required", http.StatusBadRequest)
		return
	}
	if h.safetyClient == nil {
		statusCode = http.StatusBadGateway
		if h.metrics != nil {
			h.metrics.UpstreamErrors.Add(1)
		}
		http.Error(w, "safety service unavailable", http.StatusBadGateway)
		return
	}

	verdict, err := h.safetyClient.Analyze(r.Context(), req.Prompt)
	if err != nil {
		statusCode = http.StatusBadGateway
		if h.metrics != nil {
			h.metrics.UpstreamErrors.Add(1)
		}
		http.Error(w, "safety service unavailable", http.StatusBadGateway)
		return
	}
	safetyVerdict = verdict.Verdict
	threatType = verdict.ThreatType
	if verdict.Verdict == "BLOCK" {
		statusCode = http.StatusBadRequest
		if h.metrics != nil {
			h.metrics.BlocksTotal.Add(1)
		}
		http.Error(w, "blocked_by_safety", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(verdict.MaskedPrompt) != "" {
		req.Prompt = verdict.MaskedPrompt
	}

	if h.router == nil {
		statusCode = http.StatusBadGateway
		http.Error(w, "router unavailable", http.StatusBadGateway)
		return
	}

	requestedPrimary := h.router.ResolveProvider(req.Model)
	selectedProvider = requestedPrimary
	fallbackFrom := ""

	breaker, ok := h.breakers[selectedProvider]
	if !ok {
		statusCode = http.StatusBadRequest
		http.Error(w, "unknown provider", http.StatusBadRequest)
		return
	}
	if !breaker.Allow() {
		fallbackFrom = selectedProvider
		selectedProvider = h.router.Secondary(selectedProvider)
		breaker, ok = h.breakers[selectedProvider]
		if !ok {
			statusCode = http.StatusBadRequest
			http.Error(w, "unknown provider", http.StatusBadRequest)
			return
		}
	}

	provider, ok := h.providers[selectedProvider]
	if !ok {
		statusCode = http.StatusBadRequest
		http.Error(w, "unknown provider", http.StatusBadRequest)
		return
	}

	if h.debugHeaders {
		// Optional debug headers for local resilience testing.
		w.Header().Set("X-Debug-Primary-Provider", requestedPrimary)
		w.Header().Set("X-Debug-Selected-Provider", selectedProvider)
		w.Header().Set("X-Debug-Fallback", strconv.FormatBool(fallbackFrom != ""))
		if fallbackFrom != "" {
			w.Header().Set("X-Debug-Fallback-From", fallbackFrom)
		}
		w.Header().Set("X-Debug-Breaker-State-Before", breaker.State())
	}

	ctx, cancel := context.WithTimeout(r.Context(), 8*time.Second)
	defer cancel()

	resp, err := provider.Generate(ctx, req)
	if err != nil {
		breaker.RecordFailure()
		if h.debugHeaders {
			w.Header().Set("X-Debug-Breaker-State-After", breaker.State())
		}
		statusCode = http.StatusServiceUnavailable
		if h.metrics != nil {
			h.metrics.UpstreamErrors.Add(1)
		}
		http.Error(w, "upstream unavailable", http.StatusServiceUnavailable)
		return
	}
	breaker.RecordSuccess()
	if h.debugHeaders {
		w.Header().Set("X-Debug-Breaker-State-After", breaker.State())
	}

	statusCode = http.StatusOK
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}
