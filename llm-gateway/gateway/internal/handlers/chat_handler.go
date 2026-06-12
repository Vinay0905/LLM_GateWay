package handlers

import (
	"llm-gateway/gateway/internal/circuit"
	"llm-gateway/gateway/internal/providers"
	"llm-gateway/gateway/internal/router"
	"llm-gateway/gateway/internal/safety"
	"time"
)

// #store provider dependency ---------------------------------------------------
type ChatHandler struct {
	providers    map[string]providers.Provider
	router       *router.Router
	safetyClient *safety.SafetyClient
	breakers     map[string]*circuit.Breaker
}

// #create chat handler ---------------------------------------------------
func NewChatHandler(providers map[string]providers.Provider, router *router.Router, safetyClient *safety.SafetyClient) *ChatHandler {
	breakers := make(map[string]*circuit.Breaker, len(providers))
	for name := range providers {
		breakers[name] = circuit.NewBreaker(3, 30*time.Second)
	}

	return &ChatHandler{
		providers:    providers,
		router:       router,
		safetyClient: safetyClient,
		breakers:     breakers,
	}
}
