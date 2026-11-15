package httpapi

import (
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func newTestHandler() http.Handler {
	fixed := time.Date(2026, 11, 23, 2, 0, 0, 0, time.UTC)
	srv := NewServer(Deps{Version: "test", Now: func() time.Time { return fixed }})
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	return NewRouter(RouterConfig{AllowedOrigins: []string{"http://localhost:5173"}}, srv, logger)
}

func TestHealth(t *testing.T) {
	rec := httptest.NewRecorder()
	newTestHandler().ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/health", nil))

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, mau 200", rec.Code)
	}
	var body Health
	if err := json.NewDecoder(rec.Body).Decode(&body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Status != HealthStatusOk || body.Version != "test" {
		t.Errorf("body = %+v", body)
	}
	if !body.Time.Equal(time.Date(2026, 11, 23, 2, 0, 0, 0, time.UTC)) {
		t.Errorf("time = %v", body.Time)
	}
}

func TestUnknownRouteReturnsProblem(t *testing.T) {
	rec := httptest.NewRecorder()
	newTestHandler().ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/tidak-ada", nil))

	if rec.Code != http.StatusNotFound {
		t.Fatalf("status = %d, mau 404", rec.Code)
	}
	if ct := rec.Header().Get("Content-Type"); ct != "application/problem+json" {
		t.Errorf("Content-Type = %q", ct)
	}
	var p Problem
	if err := json.NewDecoder(rec.Body).Decode(&p); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if p.Code != "not_found" {
		t.Errorf("code = %q", p.Code)
	}
}

func TestNotYetImplementedEndpointReturns501(t *testing.T) {
	rec := httptest.NewRecorder()
	newTestHandler().ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/v1/products", nil))
	if rec.Code != http.StatusNotImplemented {
		t.Fatalf("status = %d, mau 501", rec.Code)
	}
}

func TestInvalidQueryParamReturnsProblem(t *testing.T) {
	rec := httptest.NewRecorder()
	newTestHandler().ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/v1/products?limit=banyak", nil))
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, mau 400", rec.Code)
	}
}

func TestCORSPreflight(t *testing.T) {
	req := httptest.NewRequest(http.MethodOptions, "/v1/products", nil)
	req.Header.Set("Origin", "http://localhost:5173")
	req.Header.Set("Access-Control-Request-Method", "POST")
	rec := httptest.NewRecorder()
	newTestHandler().ServeHTTP(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("status = %d, mau 204", rec.Code)
	}
	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5173" {
		t.Errorf("Allow-Origin = %q", got)
	}
}

func TestCORSRejectsUnknownOrigin(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	req.Header.Set("Origin", "https://situs-lain.example")
	rec := httptest.NewRecorder()
	newTestHandler().ServeHTTP(rec, req)

	if got := rec.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Errorf("Allow-Origin = %q, mau kosong", got)
	}
}
