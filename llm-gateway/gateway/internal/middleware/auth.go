package middleware

import "net/http"

// AuthMiddleware rejects requests with missing or unknown API keys.
func AuthMiddleware(validKeys map[string]struct{}, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("X-API-Key")
		if _, ok := validKeys[key]; !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
