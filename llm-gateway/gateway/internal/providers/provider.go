package providers

import (
	"context"

	"llm-gateway/gateway/internal/types"
)

// Provider interface

type Provider interface {
	Generate(ctx context.Context, req types.ChatRequest) (types.ChatResponse, error)
}
