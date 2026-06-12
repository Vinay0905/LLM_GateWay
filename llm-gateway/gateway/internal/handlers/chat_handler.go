package handlers

import (
	"llm-gateway/gateway/internal/providers"
	"llm-gateway/gateway/internal/safety"
)

// #store provider dependency ---------------------------------------------------
type ChatHandler struct {
	provider     providers.Provider
	safetyClient *safety.SafetyClient
}

// #create chat handler ---------------------------------------------------
func NewChatHandler(provider providers.Provider, safetyClient *safety.SafetyClient) *ChatHandler {
	return &ChatHandler{
		provider:     provider,
		safetyClient: safetyClient,
	}
}
