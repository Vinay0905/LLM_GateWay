package middleware

import (
	"net/http"
	"sync"

	"golang.org/x/time/rate"
)

// LimiterStore keeps one token bucket per client key.
type LimiterStore struct {
	mu       sync.Mutex
	limiters map[string]*rate.Limiter
	rps      rate.Limit
	burst    int
}

// NewLimiterStore creates a per-key rate limiter store.
func NewLimiterStore(rps rate.Limit, burst int) *LimiterStore {
	return &LimiterStore{
		limiters: make(map[string]*rate.Limiter),
		rps:      rps,
		burst:    burst,
	}
}

// ForKey returns the existing limiter for a key or creates a new one.
func (s *LimiterStore) ForKey(key string) *rate.Limiter {
	s.mu.Lock()
	defer s.mu.Unlock()
	if l, ok := s.limiters[key]; ok {
		return l
	}
	l := rate.NewLimiter(s.rps, s.burst)
	s.limiters[key] = l
	return l
}

// RateLimitMiddleware rejects requests that exceed the client key's token bucket.
func RateLimitMiddleware(store *LimiterStore, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("X-API-Key")
		if !store.ForKey(key).Allow() {
			http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
			return
		}
		next.ServeHTTP(w, r)
	})
}
