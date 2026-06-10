package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"golang.org/x/time/rate"

	"llm-gateway/gateway/internal/handlers"
	"llm-gateway/gateway/internal/middleware"
	"llm-gateway/gateway/internal/providers"
)

// loadDotEnv loads local environment variables from a .env file when present.
func loadDotEnv(path string) {
	file, err := os.Open(path)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}

		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		value = strings.Trim(value, `"'`)
		if key != "" {
			_ = os.Setenv(key, value)
		}
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("warning: failed to read .env:", err)
	}
}

func main() {
	loadDotEnv(".env")

	mux := http.NewServeMux()
	provider := providers.NewGeminiProvider(os.Getenv("GEMINI_API_KEY"))
	chatHandler := handlers.NewChatHandler(provider)

	validKeys := map[string]struct{}{
		"dev-key": {},
	}

	limiterStore := middleware.NewLimiterStore(rate.Limit(5), 10)

	// Auth runs first, then rate limiting, then the chat handler.
	var chat http.Handler = http.HandlerFunc(chatHandler.HandleChat)
	chat = middleware.RateLimitMiddleware(limiterStore, chat)
	chat = middleware.AuthMiddleware(validKeys, chat)

	mux.Handle("/v1/chat", chat)
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	log.Println("Server listinering on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
