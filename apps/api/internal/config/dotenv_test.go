package config

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadDotEnv(t *testing.T) {
	path := filepath.Join(t.TempDir(), ".env")
	content := "# komentar\nPOS_TEST_A=satu\nPOS_TEST_B=\"dua\"\nPOS_TEST_KEEP=dari-file\nbaris-rusak\n"
	if err := os.WriteFile(path, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	t.Setenv("POS_TEST_KEEP", "dari-env")
	t.Cleanup(func() {
		_ = os.Unsetenv("POS_TEST_A")
		_ = os.Unsetenv("POS_TEST_B")
	})

	if err := LoadDotEnv(path); err != nil {
		t.Fatalf("LoadDotEnv: %v", err)
	}
	if got := os.Getenv("POS_TEST_A"); got != "satu" {
		t.Errorf("A = %q", got)
	}
	if got := os.Getenv("POS_TEST_B"); got != "dua" {
		t.Errorf("B = %q", got)
	}
	if got := os.Getenv("POS_TEST_KEEP"); got != "dari-env" {
		t.Errorf("KEEP = %q, env tidak boleh ditimpa file", got)
	}
}

func TestLoadDotEnvMissingFileIsOK(t *testing.T) {
	if err := LoadDotEnv(filepath.Join(t.TempDir(), "tidak-ada.env")); err != nil {
		t.Fatalf("mau nil, dapat %v", err)
	}
}
