package logger

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"time"
)

type ExperimentLog struct {
	Timestamp     time.Time `json:"timestamp"`
	RequestID     string    `json:"request_id"`
	ApiKeyHash    string    `json:"api_key_hash"`
	PromptHash    string    `json:"prompt_hash"`
	Provider      string    `json:"provider"`
	Model         string    `json:"model"`
	SafetyVerdict string    `json:"safety_verdict"`
	ThreatType    string    `json:"threat_type"`
	LatencyMs     int64     `json:"latency_ms"`
	StatusCode    int       `json:"status_code"`
}

func SHA256Hex(input string) string {
	sum := sha256.Sum256([]byte(input))
	return hex.EncodeToString(sum[:])
}

func AppendJSONL(path string, v any) error {
	if dir := filepath.Dir(path); dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
	}

	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer f.Close()
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}
	_, err = f.Write(append(b, '\n'))
	return err
}
