package providers

import (
	"context"
	"errors"
	"strconv"
	"strings"
	"time"
)

// retryableError marks errors safe to retry.
type retryableError struct {
	err error
}

func (e retryableError) Error() string { return e.err.Error() }
func (e retryableError) Unwrap() error { return e.err }

// MarkRetryable wraps an error as retryable.
func MarkRetryable(err error) error {
	if err == nil {
		return nil
	}
	return retryableError{err: err}
}

// IsRetryable returns true when an error is explicitly retryable.
func IsRetryable(err error) bool {
	var target retryableError
	return errors.As(err, &target)
}

// Retry retries only retryable errors with linear backoff.
func Retry(ctx context.Context, attempts int, baseDelay time.Duration, fn func() error) error {
	if attempts <= 0 {
		attempts = 1
	}
	if baseDelay <= 0 {
		baseDelay = 150 * time.Millisecond
	}

	var err error
	for i := 0; i < attempts; i++ {
		err = fn()
		if err == nil {
			return nil
		}
		if !IsRetryable(err) || i == attempts-1 {
			return err
		}

		backoff := time.Duration(i+1) * baseDelay
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(backoff):
		}
	}
	return err
}

func metadataInt(md map[string]string, key string, defaultVal int) int {
	if md == nil {
		return defaultVal
	}
	raw := strings.TrimSpace(md[key])
	if raw == "" {
		return defaultVal
	}
	v, err := strconv.Atoi(raw)
	if err != nil {
		return defaultVal
	}
	return v
}

func metadataString(md map[string]string, key, defaultVal string) string {
	if md == nil {
		return defaultVal
	}
	raw := strings.TrimSpace(md[key])
	if raw == "" {
		return defaultVal
	}
	return raw
}
