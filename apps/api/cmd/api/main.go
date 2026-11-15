// Command api menjalankan server HTTP POS Kita.
//
//	api            jalankan server (sama dengan `api serve`)
//	api migrate    jalankan migrasi database sampai versi terbaru
package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"poskita/api/internal/config"
	"poskita/api/internal/db"
	"poskita/api/internal/httpapi"
	"poskita/api/internal/platform/postgres"
)

// version diisi saat build: go build -ldflags "-X main.version=1.2.3".
var version = "dev"

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	if err := run(context.Background(), os.Args[1:], logger); err != nil {
		logger.Error("berhenti karena error", "err", err)
		os.Exit(1)
	}
}

func run(ctx context.Context, args []string, logger *slog.Logger) error {
	if err := config.LoadDotEnv(".env"); err != nil {
		return err
	}
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	cmd := "serve"
	if len(args) > 0 {
		cmd = args[0]
	}

	switch cmd {
	case "serve":
		return serve(ctx, cfg, logger)
	case "migrate":
		url := cfg.MigrationDatabaseURL
		if url == "" {
			url = cfg.DatabaseURL
		}
		if url == "" {
			return errors.New("MIGRATION_DATABASE_URL atau DATABASE_URL harus diisi untuk migrasi")
		}
		return db.Migrate(ctx, url, logger)
	default:
		return fmt.Errorf("perintah tidak dikenal %q (pakai: serve | migrate)", cmd)
	}
}

func serve(ctx context.Context, cfg config.Config, logger *slog.Logger) error {
	ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer stop()

	var pool *pgxpool.Pool
	if cfg.DatabaseURL != "" {
		p, err := postgres.Connect(ctx, cfg.DatabaseURL)
		if err != nil {
			return err
		}
		defer p.Close()
		pool = p
	} else {
		logger.Warn("DATABASE_URL kosong: server jalan tanpa database (hanya boleh di development)")
	}

	srv := httpapi.NewServer(httpapi.Deps{Version: version, DB: pool})
	handler := httpapi.NewRouter(httpapi.RouterConfig{AllowedOrigins: cfg.AllowedOrigins}, srv, logger)

	httpServer := &http.Server{
		Addr:              cfg.HTTPAddr,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	errCh := make(chan error, 1)
	go func() {
		logger.Info("server berjalan", "addr", cfg.HTTPAddr, "env", cfg.Env, "version", version)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
		close(errCh)
	}()

	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
	}

	logger.Info("mematikan server")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return httpServer.Shutdown(shutdownCtx)
}
