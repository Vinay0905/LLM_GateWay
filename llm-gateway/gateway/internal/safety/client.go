package safety

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

// -Encapsualtioes sidecar HTTP call behind client object
// -keeps handlre code clean and testable
// -Reuses contect for cancellations

type SidecarVerdict struct {
	Verdict      string  `json:"verdict"`
	ThreatType   string  `json:"threat_type"`
	Score        float64 `json:"score"`
	MaskedPrompt string  `json:"masked_prompt"`
}

type SafetyClient struct {
	BaseURL string
	Client  *http.Client
}

func (s *SafetyClient) Analyze(ctx context.Context, prompt string) (SidecarVerdict, error) {
	body, err := json.Marshal(map[string]string{"prompt": prompt})
	if err != nil {
		return SidecarVerdict{}, err
	}

	if strings.TrimSpace(s.BaseURL) == "" {
		return SidecarVerdict{}, fmt.Errorf("safety base URL is required")
	}

	client := s.Client
	if client == nil {
		client = http.DefaultClient
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, strings.TrimRight(s.BaseURL, "/")+"/analyze", bytes.NewReader(body))
	if err != nil {
		return SidecarVerdict{}, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return SidecarVerdict{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return SidecarVerdict{}, fmt.Errorf("safety service returned status %d", resp.StatusCode)
	}

	var verdict SidecarVerdict
	if err := json.NewDecoder(resp.Body).Decode(&verdict); err != nil {
		return SidecarVerdict{}, err
	}

	return verdict, nil
}
