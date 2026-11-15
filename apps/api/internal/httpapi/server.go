package httpapi

import (
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Deps berisi dependensi yang dipakai handler.
type Deps struct {
	Version string
	DB      *pgxpool.Pool // nil kalau server jalan tanpa database (development)
	Now     func() time.Time
}

// Server mengimplementasikan ServerInterface hasil generator.
// Endpoint yang belum dibuat otomatis membalas 501 lewat Unimplemented.
type Server struct {
	Unimplemented
	deps Deps
}

var _ ServerInterface = (*Server)(nil)

// NewServer membuat Server dengan nilai bawaan yang aman.
func NewServer(deps Deps) *Server {
	if deps.Now == nil {
		deps.Now = time.Now
	}
	if deps.Version == "" {
		deps.Version = "dev"
	}
	return &Server{deps: deps}
}

// GetHealth dipanggil load balancer dan uptime monitor.
func (s *Server) GetHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, Health{
		Status:  HealthStatusOk,
		Version: s.deps.Version,
		Time:    s.deps.Now().UTC(),
	})
}
