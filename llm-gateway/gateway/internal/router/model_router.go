package router

import (
	"math/rand"
	"strings"
	"sync"
	"time"
)

// ---------Router Policy Model

type WeightedProvider struct {
	Name    string
	Percent int
}

type RoutePolicy struct {
	DefaultProvider string
	Weights         []WeightedProvider
	ModelMap        map[string]string
}

func ChooseByWeight(weights []WeightedProvider, r *rand.Rand, fallback string) string {
	if strings.TrimSpace(fallback) == "" {
		fallback = "gemini"
	}
	if r == nil {
		r = rand.New(rand.NewSource(time.Now().UnixNano()))
	}

	n := r.Intn(100)
	sum := 0

	for _, w := range weights {
		sum += w.Percent
		if n < sum {
			return w.Name
		}
	}
	return fallback
}

type Router struct {
	policy RoutePolicy
	rnd    *rand.Rand
	mu     sync.Mutex
}

func NewRouter(policy RoutePolicy, rnd *rand.Rand) *Router {
	defaultProvider := strings.TrimSpace(policy.DefaultProvider)
	if defaultProvider == "" {
		defaultProvider = "gemini"
	}

	normalizedMap := make(map[string]string, len(policy.ModelMap))
	for model, provider := range policy.ModelMap {
		modelKey := strings.ToLower(strings.TrimSpace(model))
		providerName := strings.TrimSpace(provider)
		if modelKey == "" || providerName == "" {
			continue
		}
		normalizedMap[modelKey] = providerName
	}

	if rnd == nil {
		rnd = rand.New(rand.NewSource(time.Now().UnixNano()))
	}

	return &Router{
		policy: RoutePolicy{
			DefaultProvider: defaultProvider,
			Weights:         policy.Weights,
			ModelMap:        normalizedMap,
		},
		rnd: rnd,
	}
}

func (rt *Router) ResolveProvider(model string) string {
	modelKey := strings.ToLower(strings.TrimSpace(model))
	if p, ok := rt.policy.ModelMap[modelKey]; ok {
		return p
	}
	if hasValidWeights(rt.policy.Weights) {
		rt.mu.Lock()
		defer rt.mu.Unlock()
		return ChooseByWeight(rt.policy.Weights, rt.rnd, rt.policy.DefaultProvider)
	}
	return rt.policy.DefaultProvider
}

func (rt *Router) Secondary(primary string) string {
	primary = strings.TrimSpace(primary)
	if primary != "groq" {
		return "groq"
	}
	return "gemini"
}

func hasValidWeights(weights []WeightedProvider) bool {
	if len(weights) == 0 {
		return false
	}
	total := 0
	for _, w := range weights {
		if strings.TrimSpace(w.Name) == "" || w.Percent <= 0 {
			return false
		}
		total += w.Percent
	}
	return total == 100
}
