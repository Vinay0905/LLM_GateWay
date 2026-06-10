package providers

import (
	"context"

	"llm-gateway/gateway/internal/types"
)

// #gemini provider config ---------------------------------------------------
type GeminiProvider struct {
	apiKey string
}

// #create gemini provider ---------------------------------------------------
func NewGeminiProvider(apiKey string) *GeminiProvider {
	return &GeminiProvider{apiKey: apiKey}
}

// #generate gemini response ---------------------------------------------------
func (p *GeminiProvider) Generate(ctx context.Context, req types.ChatRequest) (types.ChatResponse, error) {
	// #return stub response ---------------------------------------------------
	return types.ChatResponse{
		Output:   "gemini provider not implemented yet",
		Provider: "gemini",
		Model:    req.Model,
	}, nil
}
