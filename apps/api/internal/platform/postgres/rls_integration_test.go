package postgres_test

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"os"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"poskita/api/internal/db"
	"poskita/api/internal/db/sqlc"
	"poskita/api/internal/platform/postgres"
)

// Tes integrasi: butuh PostgreSQL sungguhan. Di CI dijalankan dengan service container.
// Lokal: pnpm infra:up, lalu set dua variabel di bawah (lihat apps/api/.env.example).
func TestRowLevelSecurityAndIdempotentSync(t *testing.T) {
	ownerURL := os.Getenv("TEST_MIGRATION_DATABASE_URL")
	appURL := os.Getenv("TEST_DATABASE_URL")
	if ownerURL == "" || appURL == "" {
		t.Skip("set TEST_MIGRATION_DATABASE_URL dan TEST_DATABASE_URL untuk menjalankan tes integrasi")
	}

	ctx := context.Background()
	if err := db.Migrate(ctx, ownerURL, slog.New(slog.NewTextHandler(io.Discard, nil))); err != nil {
		t.Fatalf("migrasi: %v", err)
	}

	pool, err := postgres.Connect(ctx, appURL)
	if err != nil {
		t.Fatalf("connect: %v", err)
	}
	t.Cleanup(pool.Close)

	tokoA, tokoB := uuid.Must(uuid.NewV7()), uuid.Must(uuid.NewV7())
	for _, tc := range []struct {
		id   uuid.UUID
		name string
	}{{tokoA, "Toko A"}, {tokoB, "Toko B"}} {
		err := postgres.InTenant(ctx, pool, tc.id, func(tx pgx.Tx) error {
			q := sqlc.New(tx)
			if _, err := q.CreateBusiness(ctx, sqlc.CreateBusinessParams{ID: tc.id, Name: tc.name, BusinessType: "fnb"}); err != nil {
				return err
			}
			_, err := q.CreateOutlet(ctx, sqlc.CreateOutletParams{
				ID: uuid.Must(uuid.NewV7()), BusinessID: tc.id, Name: tc.name + " Pusat", Timezone: "Asia/Jakarta",
			})
			return err
		})
		if err != nil {
			t.Fatalf("membuat %s: %v", tc.name, err)
		}
	}

	t.Run("toko B hanya melihat outlet miliknya", func(t *testing.T) {
		err := postgres.InTenant(ctx, pool, tokoB, func(tx pgx.Tx) error {
			outlets, err := sqlc.New(tx).ListOutlets(ctx)
			if err != nil {
				return err
			}
			for _, o := range outlets {
				if o.BusinessID != tokoB {
					t.Errorf("bocor: toko B melihat outlet milik %s", o.BusinessID)
				}
			}
			if len(outlets) == 0 {
				t.Error("toko B tidak melihat outlet miliknya sendiri")
			}
			return nil
		})
		if err != nil {
			t.Fatal(err)
		}
	})

	t.Run("toko B tidak bisa menulis data atas nama toko A", func(t *testing.T) {
		err := postgres.InTenant(ctx, pool, tokoB, func(tx pgx.Tx) error {
			_, err := sqlc.New(tx).CreateOutlet(ctx, sqlc.CreateOutletParams{
				ID: uuid.Must(uuid.NewV7()), BusinessID: tokoA, Name: "Titipan", Timezone: "Asia/Jakarta",
			})
			return err
		})
		if err == nil {
			t.Fatal("mau ditolak RLS, ternyata berhasil")
		}
	})

	t.Run("tanpa app.business_id tidak ada data yang terlihat", func(t *testing.T) {
		var n int
		if err := pool.QueryRow(ctx, "SELECT count(*) FROM outlets").Scan(&n); err != nil {
			t.Fatal(err)
		}
		if n != 0 {
			t.Errorf("mau 0 baris tanpa tenant, dapat %d", n)
		}
	})

	t.Run("event sinkron yang dikirim ulang tidak tercatat dua kali", func(t *testing.T) {
		err := postgres.InTenant(ctx, pool, tokoA, func(tx pgx.Tx) error {
			var outletID uuid.UUID
			if err := tx.QueryRow(ctx, "SELECT id FROM outlets LIMIT 1").Scan(&outletID); err != nil {
				return err
			}
			deviceID := uuid.Must(uuid.NewV7())
			if _, err := tx.Exec(ctx,
				"INSERT INTO devices (id, business_id, outlet_id, name, platform, receipt_prefix) VALUES ($1, $2, $3, 'Kasir depan', 'android', 'K1')",
				deviceID, tokoA, outletID); err != nil {
				return err
			}

			payload, _ := json.Marshal(map[string]any{"receipt_no": "S-K1-0001", "total": 18000})
			event := sqlc.InsertSyncEventParams{
				EventID: uuid.Must(uuid.NewV7()), BusinessID: tokoA, DeviceID: deviceID,
				Type: "sale.completed", OccurredAt: time.Now().UTC(), Payload: payload,
			}
			q := sqlc.New(tx)
			first, err := q.InsertSyncEvent(ctx, event)
			if err != nil {
				return err
			}
			second, err := q.InsertSyncEvent(ctx, event)
			if err != nil {
				return err
			}
			if first != 1 || second != 0 {
				t.Errorf("mau 1 lalu 0 baris, dapat %d lalu %d", first, second)
			}
			return nil
		})
		if err != nil {
			t.Fatal(err)
		}
	})
}
