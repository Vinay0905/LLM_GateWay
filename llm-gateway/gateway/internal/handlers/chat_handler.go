package handlers

import "llm-gateway/gateway/internal/providers"

// #store provider dependency ---------------------------------------------------
type ChatHandler struct {
	provider providers.Provider
}

// #create chat handler ---------------------------------------------------
func NewChatHandler(provider providers.Provider) *ChatHandler {
	return &ChatHandler{provider: provider}
}
