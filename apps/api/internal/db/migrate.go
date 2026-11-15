// Package db berisi migrasi (goose) dan query (sqlc) PostgreSQL.
package db

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"io/fs"
	"log/slog"

	_ "github.com/jackc/pgx/v5/stdlib" // driver database/sql untuk goose
	"github.com/pressly/goose/v3"
)

//go:embed migrations/*.sql
var embedded embed.FS

// Migrations mengembalikan file migrasi yang ikut di dalam binary.
func Migrations() fs.FS {
	sub, err := fs.Sub(embedded, "migrations")
	if err != nil {
		panic(err) // tidak mungkin terjadi: folder di-embed saat compile
	}
	return sub
}

// Migrate menjalankan semua migrasi yang belum dijalankan.
// Pakai koneksi pemilik tabel (MIGRATION_DATABASE_URL), bukan role aplikasi.
func Migrate(ctx context.Context, databaseURL string, logger *slog.Logger) error {
	conn, err := sql.Open("pgx", databaseURL)
	if err != nil {
		return fmt.Errorf("membuka database: %w", err)
	}
	defer conn.Close()

	provider, err := goose.NewProvider(goose.DialectPostgres, conn, Migrations())
	if err != nil {
		return fmt.Errorf("menyiapkan migrasi: %w", err)
	}

	results, err := provider.Up(ctx)
	for _, r := range results {
		logger.Info("migrasi", "versi", r.Source.Version, "file", r.Source.Path, "durasi", r.Duration)
	}
	if err != nil {
		return fmt.Errorf("migrasi gagal: %w", err)
	}
	if len(results) == 0 {
		logger.Info("database sudah versi terbaru")
	}
	return nil
}
