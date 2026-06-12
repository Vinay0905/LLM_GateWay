package providers

import (
	"context"

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
	// #return stub response ---------------------------------------------------
	return types.ChatResponse{
		Output:   "groq provider not implemented yet",
		Provider: "groq",
		Model:    req.Model,
	}, nil
}
