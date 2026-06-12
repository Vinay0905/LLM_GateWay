package handlers

import (
	"llm-gateway/gateway/internal/providers"
	"llm-gateway/gateway/internal/router"
	"llm-gateway/gateway/internal/safety"
)

// #store provider dependency ---------------------------------------------------
type ChatHandler struct {
	providers    map[string]providers.Provider
	router       *router.Router
	safetyClient *safety.SafetyClient
}

// #create chat handler ---------------------------------------------------
func NewChatHandler(providers map[string]providers.Provider, router *router.Router, safetyClient *safety.SafetyClient) *ChatHandler {
	return &ChatHandler{
		providers:    providers,
		router:       router,
		safetyClient: safetyClient,
	}
}
