package providers

import (
	"context"
	"time"

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

func Retry(attempts int, fn func() error) error {
	var err error
	for i := 0; i < attempts; i++ {
		err = fn()
		if err == nil {
			return nil
		}
		time.Sleep(time.Duration(i+1) * 150 * time.Millisecond)
	}
	return err
}
