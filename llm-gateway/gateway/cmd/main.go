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

// #load env file ---------------------------------------------------
func loadDotEnv(path string) {
	// #open env path ---------------------------------------------------
	file, err := os.Open(path)
	if err != nil {
		return
	}
	defer file.Close()

	// #scan env lines ---------------------------------------------------
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		// #split key value ---------------------------------------------------
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}

		// #clean env value ---------------------------------------------------
		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		value = strings.Trim(value, `"'`)
		if key != "" {
			_ = os.Setenv(key, value)
		}
	}

	// #report scan error ---------------------------------------------------
	if err := scanner.Err(); err != nil {
		fmt.Println("warning: failed to read .env:", err)
	}
}

func main() {
	// #load local env ---------------------------------------------------
	loadDotEnv(".env")

	// #setup server mux ---------------------------------------------------
	mux := http.NewServeMux()
	provider := providers.NewGeminiProvider(os.Getenv("GEMINI_API_KEY"))
	chatHandler := handlers.NewChatHandler(provider)

	// #register http routes ---------------------------------------------------
	mux.HandleFunc("/v1/chat", chatHandler.HandleChat)
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	// #start http server ---------------------------------------------------
	log.Println("Server listinering on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
