package providers

import (
	"context"

	"llm-gateway/gateway/internal/types"
)

type GeminiProvider struct {
	apiKey string
}

func NewGeminiProvider(apiKey string) *GeminiProvider {
	return &GeminiProvider{apiKey: apiKey}
}

func (p *GeminiProvider) Generate(ctx context.Context, req types.ChatRequest) (types.ChatResponse, error) {
	return types.ChatResponse{
		Output:   "gemini provider not implemented yet",
		Provider: "gemini",
		Model:    req.Model,
	}, nil
}
