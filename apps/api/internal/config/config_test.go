package config

import "testing"

func TestLoadDefaults(t *testing.T) {
	t.Setenv("APP_ENV", "")
	t.Setenv("HTTP_ADDR", "")
	t.Setenv("CORS_ALLOWED_ORIGINS", "")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}
	if cfg.Env != "development" || cfg.HTTPAddr != ":8080" {
		t.Errorf("nilai bawaan salah: env=%q addr=%q", cfg.Env, cfg.HTTPAddr)
	}
	if len(cfg.AllowedOrigins) != 2 {
		t.Errorf("AllowedOrigins = %v, mau 2 origin bawaan", cfg.AllowedOrigins)
	}
}

func TestLoadRequiresDatabaseOutsideDevelopment(t *testing.T) {
	t.Setenv("APP_ENV", "staging")
	t.Setenv("DATABASE_URL", "")
	if _, err := Load(); err == nil {
		t.Fatal("mau error kalau DATABASE_URL kosong di staging")
	}
}

func TestLoadRejectsUnknownEnv(t *testing.T) {
	t.Setenv("APP_ENV", "prod")
	if _, err := Load(); err == nil {
		t.Fatal("mau error untuk APP_ENV tidak dikenal")
	}
}

func TestSplitList(t *testing.T) {
	got := splitList(" a , ,b,")
	if len(got) != 2 || got[0] != "a" || got[1] != "b" {
		t.Errorf("splitList = %v", got)
	}
}
