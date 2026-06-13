package providers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"llm-gateway/gateway/internal/types"
)

// #gemini provider config ---------------------------------------------------
type GeminiProvider struct {
	apiKey string
}

// #create gemini provider ---------------------------------------------------
func NewGeminiProvider(apiKey string) *GeminiProvider {
	return &GeminiProvider{apiKey: apiKey}
}

func geminiModel(model string) string {
	m := strings.TrimSpace(strings.ToLower(model))
	switch m {
	case "", "gemini":
		return "gemini-1.5-flash"
	case "gemini-1.5-pro", "gemini-1.5-flash":
		return m
	default:
		if strings.HasPrefix(m, "gemini-") {
			return m
		}
		return "gemini-1.5-flash"
	}
}

type geminiGenerateRequest struct {
	Contents []struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"contents"`
	GenerationConfig struct {
		Temperature    float64 `json:"temperature,omitempty"`
		MaxOutputToken int     `json:"maxOutputTokens,omitempty"`
	} `json:"generationConfig,omitempty"`
}

type geminiGenerateResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

// #generate gemini response ---------------------------------------------------
func (p *GeminiProvider) Generate(ctx context.Context, req types.ChatRequest) (types.ChatResponse, error) {
	mode := strings.ToLower(metadataString(req.Metadata, "simulate_mode", ""))
	delayMs := metadataInt(req.Metadata, "simulate_delay_ms", 0)
	failuresLeft := metadataInt(req.Metadata, "simulate_retry_failures", 0)
	if mode == "transient" && failuresLeft <= 0 {
		failuresLeft = 1
	}

	if strings.TrimSpace(mode) == "" {
		if strings.TrimSpace(p.apiKey) == "" {
			return types.ChatResponse{}, fmt.Errorf("GEMINI_API_KEY missing")
		}

		selectedModel := geminiModel(req.Model)
		endpoint := fmt.Sprintf(
			"https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
			url.PathEscape(selectedModel),
			url.QueryEscape(strings.TrimSpace(p.apiKey)),
		)

		body := geminiGenerateRequest{}
		content := struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		}{}
		content.Parts = append(content.Parts, struct {
			Text string `json:"text"`
		}{Text: req.Prompt})
		body.Contents = append(body.Contents, content)
		body.GenerationConfig.Temperature = req.Temperature
		if req.MaxTokens > 0 {
			body.GenerationConfig.MaxOutputToken = req.MaxTokens
		}

		reqBytes, err := json.Marshal(body)
		if err != nil {
			return types.ChatResponse{}, err
		}

		client := &http.Client{}
		var out types.ChatResponse
		err = Retry(ctx, 3, 150*time.Millisecond, func() error {
			httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(reqBytes))
			if err != nil {
				return err
			}
			httpReq.Header.Set("Content-Type", "application/json")

			httpResp, err := client.Do(httpReq)
			if err != nil {
				return MarkRetryable(err)
			}
			defer httpResp.Body.Close()

			respBytes, _ := io.ReadAll(httpResp.Body)
			respText := strings.TrimSpace(string(respBytes))

			if httpResp.StatusCode == http.StatusTooManyRequests || httpResp.StatusCode >= 500 {
				return MarkRetryable(fmt.Errorf("gemini upstream status %d: %s", httpResp.StatusCode, respText))
			}
			if httpResp.StatusCode < 200 || httpResp.StatusCode >= 300 {
				return fmt.Errorf("gemini upstream status %d: %s", httpResp.StatusCode, respText)
			}

			var parsed geminiGenerateResponse
			if err := json.Unmarshal(respBytes, &parsed); err != nil {
				return fmt.Errorf("gemini decode error: %w", err)
			}
			if len(parsed.Candidates) == 0 || len(parsed.Candidates[0].Content.Parts) == 0 {
				return fmt.Errorf("gemini returned empty candidates")
			}

			var textBuilder strings.Builder
			for _, part := range parsed.Candidates[0].Content.Parts {
				textBuilder.WriteString(part.Text)
			}

			out = types.ChatResponse{
				Output:   strings.TrimSpace(textBuilder.String()),
				Provider: "gemini",
				Model:    selectedModel,
			}
			if out.Output == "" {
				out.Output = "(empty response)"
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
			return fmt.Errorf("gemini upstream permanent failure")
		}

		if failuresLeft > 0 {
			failuresLeft--
			return MarkRetryable(fmt.Errorf("gemini transient upstream failure"))
		}

		resp = types.ChatResponse{
			Output:   "gemini simulated success",
			Provider: "gemini",
			Model:    req.Model,
		}
		return nil
	})

	if err != nil {
		return types.ChatResponse{}, err
	}
	return resp, nil
}

