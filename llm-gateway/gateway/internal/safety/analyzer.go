package safety

import (
	"math"
	"regexp"
	"strings"
)

// Standardizes safety output structure.
// Allows policy tuning later via score thresholds.
// Supports user-facing and logging use cases.

type SafetyVerdict struct {
	Verdict    string   `json:"verdict"`     // PASS or BLOCK
	ThreatType string   `json:"threat_type"` // injection, jailbreak, pii
	Score      float64  `json:"score"`
	Reasons    []string `json:"reasons"`
}

//Injection Heuristic

func DetectInjection(prompt string) (bool, float64, []string) {
	lowered := strings.ToLower(prompt)
	patterns := []string{
		"ignore previous instructions",
		"reveal system prompt",
		"developer message",
		"bypass safety",
	}
	var hits []string
	for _, p := range patterns {
		if strings.Contains(lowered, p) {
			hits = append(hits, p)
		}
	}
	if len(hits) == 0 {
		return false, 0.0, nil
	}
	score := math.Min(1.0, 0.3+float64(len(hits))*0.2)
	return true, score, hits
}

// Analyzer orchestrator
func Analyze(prompt string) SafetyVerdict {
	blocked, score, reasons := DetectInjection(prompt)
	if blocked {
		return SafetyVerdict{
			Verdict:    "BLOCK",
			ThreatType: "injection",
			Score:      score,
			Reasons:    reasons,
		}
	}
	return SafetyVerdict{
		Verdict:    "PASS",
		ThreatType: "none",
		Score:      0.0,
		Reasons:    nil,
	}
}

//PII redaction helper (optional mode)

var emailRe = regexp.MustCompile(`[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`)

func MaskPII(text string) string {
	return emailRe.ReplaceAllString(text, "[REDACTED_EMAIL]")
}
