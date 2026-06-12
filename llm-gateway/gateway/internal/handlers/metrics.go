package handlers

import (
	"encoding/json"
	"net/http"
	"sync/atomic"
)

type Metrics struct {
	RequestsTotal  atomic.Int64
	BlocksTotal    atomic.Int64
	UpstreamErrors atomic.Int64
}

func (m *Metrics) HandleMetrics(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]int64{
		"requests_total":  m.RequestsTotal.Load(),
		"blocks_total":    m.BlocksTotal.Load(),
		"upstream_errors": m.UpstreamErrors.Load(),
	})
}
