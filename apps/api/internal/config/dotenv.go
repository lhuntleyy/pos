package config

import (
	"bufio"
	"errors"
	"io/fs"
	"os"
	"strings"
)

// LoadDotEnv membaca file .env (kalau ada) untuk development lokal.
// Variabel yang sudah ada di environment tidak ditimpa. Di staging/produksi,
// isi environment langsung dari Docker Compose, jangan pakai file ini.
func LoadDotEnv(path string) error {
	f, err := os.Open(path) // #nosec G304 -- path berasal dari kode, bukan input pengguna
	if errors.Is(err, fs.ErrNotExist) {
		return nil
	}
	if err != nil {
		return err
	}
	defer f.Close()

	sc := bufio.NewScanner(f)
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)
		if _, exists := os.LookupEnv(key); !exists {
			if err := os.Setenv(key, value); err != nil {
				return err
			}
		}
	}
	return sc.Err()
}
