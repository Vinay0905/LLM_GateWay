package handlers

import "llm-gateway/gateway/internal/providers"

type ChatHandler struct {
	provider providers.Provider
}

func NewChatHandler(provider providers.Provider) *ChatHandler {
	return &ChatHandler{provider: provider}
}
