package router

import (
	"math/rand"
	"sync"
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

func ChooseByWeight(weights []WeightedProvider, r *rand.Rand) string {
	n := r.Intn(100)
	sum := 0

	for _, w := range weights {
		sum += w.Percent
		if n < sum {
			return w.Name
		}
	}
	return "gemini"
}

type Router struct {
	policy RoutePolicy
	rnd    *rand.Rand
	mu     sync.Mutex
}

func NewRouter(policy RoutePolicy, rnd *rand.Rand) *Router {
	return &Router{
		policy: policy,
		rnd:    rnd,
	}
}

func (rt *Router) ResolveProvider(model string) string {
	if p, ok := rt.policy.ModelMap[model]; ok {
		return p
	}
	if len(rt.policy.Weights) > 0 {
		rt.mu.Lock()
		defer rt.mu.Unlock()
		return ChooseByWeight(rt.policy.Weights, rt.rnd)
	}
	return rt.policy.DefaultProvider
}
