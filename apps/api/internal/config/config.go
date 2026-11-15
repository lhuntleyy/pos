// Package config membaca konfigurasi dari environment variable.
package config

import (
	"errors"
	"os"
	"strings"
)

// Config berisi semua pengaturan server. Lihat .env.example untuk daftar variabel.
type Config struct {
	Env                  string // development | staging | production
	HTTPAddr             string
	DatabaseURL          string // koneksi aplikasi (role tanpa BYPASSRLS)
	MigrationDatabaseURL string // koneksi pemilik tabel, hanya untuk migrasi
	RedisURL             string
	AllowedOrigins       []string
}

// Load membaca environment dan memberi nilai bawaan untuk development.
func Load() (Config, error) {
	cfg := Config{
		Env:                  getenv("APP_ENV", "development"),
		HTTPAddr:             getenv("HTTP_ADDR", ":8080"),
		DatabaseURL:          os.Getenv("DATABASE_URL"),
		MigrationDatabaseURL: os.Getenv("MIGRATION_DATABASE_URL"),
		RedisURL:             os.Getenv("REDIS_URL"),
		AllowedOrigins:       splitList(getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4321")),
	}

	switch cfg.Env {
	case "development", "staging", "production":
	default:
		return Config{}, errors.New("APP_ENV harus development, staging, atau production")
	}
	if cfg.Env != "development" && cfg.DatabaseURL == "" {
		return Config{}, errors.New("DATABASE_URL wajib diisi di luar development")
	}
	return cfg, nil
}

// IsProduction bernilai true di lingkungan produksi.
func (c Config) IsProduction() bool { return c.Env == "production" }

func getenv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}

func splitList(s string) []string {
	var out []string
	for _, part := range strings.Split(s, ",") {
		if p := strings.TrimSpace(part); p != "" {
			out = append(out, p)
		}
	}
	return out
}
