// Package postgres berisi koneksi database dan helper isolasi data per toko (RLS).
package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Connect membuka pool koneksi dan memastikan database bisa dihubungi.
func Connect(ctx context.Context, url string) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(url)
	if err != nil {
		return nil, fmt.Errorf("DATABASE_URL tidak valid: %w", err)
	}
	cfg.MaxConns = 10
	cfg.MaxConnIdleTime = 5 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("membuka pool database: %w", err)
	}

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("database tidak bisa dihubungi: %w", err)
	}
	return pool, nil
}

// Beginner adalah sesuatu yang bisa memulai transaksi (pool atau koneksi).
type Beginner interface {
	Begin(ctx context.Context) (pgx.Tx, error)
}

// InTenant menjalankan fn di dalam transaksi yang sudah memasang app.business_id.
// Kebijakan RLS di database hanya menampilkan dan mengizinkan data milik toko itu,
// jadi bug di query pun tidak bisa membocorkan data toko lain.
//
// Semua akses ke tabel milik toko WAJIB lewat fungsi ini.
func InTenant(ctx context.Context, db Beginner, businessID uuid.UUID, fn func(pgx.Tx) error) error {
	if businessID == uuid.Nil {
		return fmt.Errorf("InTenant: business_id kosong")
	}
	return pgx.BeginFunc(ctx, db, func(tx pgx.Tx) error {
		// set_config(..., true) hanya berlaku sampai transaksi selesai, aman untuk pool.
		if _, err := tx.Exec(ctx, "SELECT set_config('app.business_id', $1, true)", businessID.String()); err != nil {
			return fmt.Errorf("memasang app.business_id: %w", err)
		}
		return fn(tx)
	})
}
