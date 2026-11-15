package httpapi

import (
	"encoding/json"
	"net/http"
)

// writeJSON menulis respons JSON biasa.
func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}

// writeProblem menulis error dalam format Problem Details (RFC 9457).
// detail harus aman dibaca pengguna dan memakai Bahasa Indonesia.
func writeProblem(w http.ResponseWriter, r *http.Request, status int, code, title, detail string) {
	p := Problem{
		Status: status,
		Code:   code,
		Title:  title,
	}
	if detail != "" {
		p.Detail = &detail
	}
	if r != nil {
		instance := r.URL.Path
		p.Instance = &instance
	}
	w.Header().Set("Content-Type", "application/problem+json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(p)
}
