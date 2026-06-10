package types

// Defines a stable api contract for inbout and outbound payloads
// kepp generation controls(MaxTokens,temperature) explicit.
// add metadata for futre tracking and experiments without changing core schema

// Request and Response contracts

// #chat request payload ---------------------------------------------------
type ChatRequest struct {
	Model       string            `json:"model"`
	Prompt      string            `json:"prompt"`
	MaxTokens   int               `json:"max_tokens"`
	Temperature float64           `json:"temperature"`
	Metadata    map[string]string `json:"metadata"`
}

// #chat response payload ---------------------------------------------------
type ChatResponse struct {
	Output   string `json:"output"`
	Provider string `json:"provider"`
	Model    string `json:"model"`
}
