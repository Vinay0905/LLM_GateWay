package main

import (
	"bufio"
	"fmt"
	"llm-gateway/gateway/internal/handlers"
	"llm-gateway/gateway/internal/middleware"
	"llm-gateway/gateway/internal/providers"
	"llm-gateway/gateway/internal/router"
	"llm-gateway/gateway/internal/safety"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"golang.org/x/time/rate"
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
	envPath := os.Getenv("ENV_FILE")
	if envPath == "" {
		envPath = ".env"
	}
	loadDotEnv(envPath)

	mux := http.NewServeMux()

	// -------------------
	providerRegistry := map[string]providers.Provider{
		"gemini": providers.NewGeminiProvider(os.Getenv("GEMINI_API_KEY")),
		"groq":   providers.NewGroqProvider(os.Getenv("GROQ_API_KEY")),
	}

	routePolicy := router.RoutePolicy{
		DefaultProvider: "gemini",
		ModelMap: map[string]string{
			"gemini":           "gemini",
			"gemini-1.5-flash": "gemini",
			"gemini-1.5-pro":   "gemini",
			"groq":             "groq",
			"groq-llama3-70b":  "groq",
			"llama-3.1-70b":    "groq",
		},
	}

	modelRouter := router.NewRouter(routePolicy, rand.New(rand.NewSource(time.Now().UnixNano())))

	safetyBaseURL := os.Getenv("SAFETY_BASE_URL")
	if safetyBaseURL == "" {
		safetyBaseURL = "http://localhost:8000"
	}

	safetyClient := &safety.SafetyClient{
		BaseURL: safetyBaseURL,
		Client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}

	metrics := &handlers.Metrics{}
	chatHandler := handlers.NewChatHandler(providerRegistry, modelRouter, safetyClient, metrics, "../logs/experiment_log.jsonl")

	// ----------------
	validKeys := map[string]struct{}{
		"dev-key": {},
	}

	limiterStore := middleware.NewLimiterStore(rate.Limit(5), 10)

	// Method guard runs first, then auth, then rate limiting, then the chat handler.
	var chat http.Handler = http.HandlerFunc(chatHandler.HandleChat)
	chat = middleware.RateLimitMiddleware(limiterStore, chat)
	chat = middleware.AuthMiddleware(validKeys, chat)
	chat = middleware.MethodMiddleware(http.MethodPost, chat)

	mux.Handle("/v1/chat", chat)
	mux.HandleFunc("/metrics", metrics.HandleMetrics)
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	log.Println("Server listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
