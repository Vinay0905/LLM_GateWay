package providers

import (
	"context"
	"fmt"
	"strings"
	"time"

	"llm-gateway/gateway/internal/types"
)

// #groq provider config ---------------------------------------------------
type GroqProvider struct {
	apiKey string
}

// #create groq provider ---------------------------------------------------
func NewGroqProvider(apiKey string) *GroqProvider {
	return &GroqProvider{apiKey: apiKey}
}

// #generate groq response ---------------------------------------------------
func (p *GroqProvider) Generate(ctx context.Context, req types.ChatRequest) (types.ChatResponse, error) {
	mode := strings.ToLower(metadataString(req.Metadata, "simulate_mode", "ok"))
	delayMs := metadataInt(req.Metadata, "simulate_delay_ms", 0)
	failuresLeft := metadataInt(req.Metadata, "simulate_retry_failures", 0)
	if mode == "transient" && failuresLeft <= 0 {
		failuresLeft = 1
	}

	var resp types.ChatResponse
	err := Retry(ctx, 3, 150*time.Millisecond, func() error {
		if delayMs > 0 {
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(time.Duration(delayMs) * time.Millisecond):
			}
		}

		switch mode {
		case "timeout":
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(10 * time.Second):
				return ctx.Err()
			}
		case "permanent":
			return fmt.Errorf("groq upstream permanent failure")
		}

		if failuresLeft > 0 {
			failuresLeft--
			return MarkRetryable(fmt.Errorf("groq transient upstream failure"))
		}

		resp = types.ChatResponse{
			Output:   "groq provider not implemented yet",
			Provider: "groq",
			Model:    req.Model,
		}
		return nil
	})

	if err != nil {
		return types.ChatResponse{}, err
	}
	return resp, nil
}
