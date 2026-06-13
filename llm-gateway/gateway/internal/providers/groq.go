package providers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"llm-gateway/gateway/internal/types"
)

// #groq provider config ---------------------------------------------------
type GroqProvider struct {
	apiKey string
}

// #create groq provider ---------------------------------------------------
func NewGroqProvider(apiKey string) *GroqProvider {
	return &GroqProvider{apiKey: apiKey}
}

func groqModel(model string) string {
	defaultModel := strings.TrimSpace(os.Getenv("GROQ_DEFAULT_MODEL"))
	if defaultModel == "" {
		defaultModel = "llama-3.1-8b-instant"
	}

	m := strings.TrimSpace(strings.ToLower(model))
	switch m {
	case "", "groq", "groq-llama3-70b", "llama-3.1-70b":
		return defaultModel
	case "llama-3.1-8b-instant", "llama-3.3-70b-versatile", "llama-3.1-70b-versatile":
		return m
	default:
		if strings.Contains(m, "llama") || strings.Contains(m, "mixtral") {
			return m
		}
		return defaultModel
	}
}

type groqChatRequest struct {
	Model       string `json:"model"`
	Messages    []struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	} `json:"messages"`
	Temperature float64 `json:"temperature,omitempty"`
	MaxTokens   int     `json:"max_tokens,omitempty"`
}

type groqChatResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// #generate groq response ---------------------------------------------------
func (p *GroqProvider) Generate(ctx context.Context, req types.ChatRequest) (types.ChatResponse, error) {
	mode := strings.ToLower(metadataString(req.Metadata, "simulate_mode", ""))
	delayMs := metadataInt(req.Metadata, "simulate_delay_ms", 0)
	failuresLeft := metadataInt(req.Metadata, "simulate_retry_failures", 0)
	if mode == "transient" && failuresLeft <= 0 {
		failuresLeft = 1
	}

	if strings.TrimSpace(mode) == "" {
		if strings.TrimSpace(p.apiKey) == "" {
			return types.ChatResponse{}, fmt.Errorf("GROQ_API_KEY missing")
		}

		selectedModel := groqModel(req.Model)
		body := groqChatRequest{
			Model:       selectedModel,
			Temperature: req.Temperature,
		}
		if req.MaxTokens > 0 {
			body.MaxTokens = req.MaxTokens
		}
		body.Messages = append(body.Messages, struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		}{
			Role:    "user",
			Content: req.Prompt,
		})

		reqBytes, err := json.Marshal(body)
		if err != nil {
			return types.ChatResponse{}, err
		}

		client := &http.Client{}
		var out types.ChatResponse
		err = Retry(ctx, 3, 150*time.Millisecond, func() error {
			httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.groq.com/openai/v1/chat/completions", bytes.NewReader(reqBytes))
			if err != nil {
				return err
			}
			httpReq.Header.Set("Content-Type", "application/json")
			httpReq.Header.Set("Authorization", "Bearer "+strings.TrimSpace(p.apiKey))

			httpResp, err := client.Do(httpReq)
			if err != nil {
				return MarkRetryable(err)
			}
			defer httpResp.Body.Close()

			respBytes, _ := io.ReadAll(httpResp.Body)
			respText := strings.TrimSpace(string(respBytes))

			if httpResp.StatusCode == http.StatusTooManyRequests || httpResp.StatusCode >= 500 {
				return MarkRetryable(fmt.Errorf("groq upstream status %d: %s", httpResp.StatusCode, respText))
			}
			if httpResp.StatusCode < 200 || httpResp.StatusCode >= 300 {
				return fmt.Errorf("groq upstream status %d: %s", httpResp.StatusCode, respText)
			}

			var parsed groqChatResponse
			if err := json.Unmarshal(respBytes, &parsed); err != nil {
				return fmt.Errorf("groq decode error: %w", err)
			}
			if len(parsed.Choices) == 0 {
				return fmt.Errorf("groq returned empty choices")
			}

			output := strings.TrimSpace(parsed.Choices[0].Message.Content)
			if output == "" {
				output = "(empty response)"
			}

			out = types.ChatResponse{
				Output:   output,
				Provider: "groq",
				Model:    selectedModel,
			}
			return nil
		})
		if err != nil {
			return types.ChatResponse{}, err
		}
		return out, nil
	}

	var resp types.ChatResponse
	err := Retry(ctx, 3, 150*time.Millisecond, func() error {
		if delayMs > 0 {
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(time.Duration(delayMs) * time.Millisecond):
			}
		}

		switch mode {
		case "timeout":
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(10 * time.Second):
				return ctx.Err()
			}
		case "permanent":
			return fmt.Errorf("groq upstream permanent failure")
		}

		if failuresLeft > 0 {
			failuresLeft--
			return MarkRetryable(fmt.Errorf("groq transient upstream failure"))
		}

		resp = types.ChatResponse{
			Output:   "groq simulated success",
			Provider: "groq",
			Model:    req.Model,
		}
		return nil
	})

	if err != nil {
		return types.ChatResponse{}, err
	}
	return resp, nil
}
