package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"llm-gateway/gateway/internal/handlers"
	"llm-gateway/gateway/internal/providers"
)

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

	mux.HandleFunc("/v1/chat", chatHandler.HandleChat)
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})
	log.Println("Server listinering on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
