package circuit

import (
	"sync"
	"time"
)

type Breaker struct {
	failCount int
	state     string // closed, open, half_open
	openedAt  time.Time
	threshold int
	cooldown  time.Duration
	mu        sync.Mutex
}

func NewBreaker(threshold int, cooldown time.Duration) *Breaker {
	if threshold <= 0 {
		threshold = 3
	}
	if cooldown <= 0 {
		cooldown = 30 * time.Second
	}
	return &Breaker{
		state:     "closed",
		threshold: threshold,
		cooldown:  cooldown,
	}
}

func (b *Breaker) Allow() bool {
	b.mu.Lock()
	defer b.mu.Unlock()

	if b.state != "open" {
		return true
	}
	if time.Since(b.openedAt) > b.cooldown {
		b.state = "half_open"
		return true
	}
	return false
}

func (b *Breaker) RecordFailure() {
	b.mu.Lock()
	defer b.mu.Unlock()

	b.failCount++
	if b.failCount >= b.threshold {
		b.state = "open"
		b.openedAt = time.Now()
	}
}

func (b *Breaker) RecordSuccess() {
	b.mu.Lock()
	defer b.mu.Unlock()

	b.failCount = 0
	b.state = "closed"
}
