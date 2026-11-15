# Arsitektur singkat

```
            ┌────────────────────┐        ┌──────────────────────┐
            │  App kasir Flutter │        │  Web back office     │
            │  (HP/tablet/Sunmi) │        │  React + Vite        │
            │  SQLite lokal +    │        │  (pemilik, manajer,  │
            │  outbox event      │        │   super admin)       │
            └─────────┬──────────┘        └──────────┬───────────┘
     push event /     │                              │  REST + JWT
     pull perubahan   │                              │
                      ▼                              ▼
            ┌──────────────────────────────────────────────────┐
            │                API Go (chi)                      │
            │  handler dari OpenAPI · sqlc · goose · RLS       │
            └───────┬──────────────┬──────────────┬────────────┘
                    │              │              │ HTTP internal + rahasia
                    ▼              ▼              ▼
              PostgreSQL 16     Redis 7     Gateway WA (Node + Baileys)
              (RLS per toko)   (antrean)    nomor WA milik toko via QR
```

Situs publik (Astro) adalah file statis yang dilayani Caddy.

## Prinsip

1. **Offline-first**: kasir tidak pernah menunggu server untuk jualan. Detail di [ADR-0004](adr/0004-sinkron-offline.md).
2. **Kontrak dulu**: semua endpoint ditulis di `packages/api-spec/openapi.yaml` sebelum dibuat ([ADR-0006](adr/0006-openapi-spec-first.md)).
3. **Data antar toko terpisah di level database**: setiap tabel milik toko punya kebijakan RLS. Kode aplikasi wajib memakai `postgres.InTenant`. Tes integrasi di `apps/api/internal/platform/postgres` membuktikan toko B tidak bisa membaca atau menulis data toko A.
4. **Uang = bilangan bulat Rupiah** di semua lapisan (Go `int64`, Dart `int`, TS `number` bulat, Postgres `bigint`).
5. **WhatsApp selalu punya cadangan**: kalau gateway gagal, kasir menampilkan tombol "Bagikan lewat WA" ([ADR-0005](adr/0005-whatsapp-baileys.md)).
6. **Satu inti, banyak segmen**: F&B, retail, dan jasa memakai inti yang sama. Perbedaannya lewat flag modul dan template jenis usaha, bukan aplikasi terpisah.

## Alur sinkron (ringkas)

1. Kasir mencatat penjualan ke SQLite dan menambah event `sale.completed` (ID UUIDv7) ke outbox.
2. Saat online, kasir mengirim maksimal 200 event per `POST /v1/sync/push`.
3. Server menyimpan event ke `sync_events` (primary key `event_id`). Event yang sama dikirim ulang → `duplicate`, tidak dicatat dua kali.
4. Server memproses event menjadi transaksi, mutasi stok (ledger), dan kas.
5. Kasir menarik perubahan master data dengan `GET /v1/sync/pull?cursor=`.

## Lingkungan

| Lingkungan | Tempat                   | Catatan                                      |
| ---------- | ------------------------ | -------------------------------------------- |
| Lokal      | laptop developer         | `pnpm infra:up` untuk Postgres, Redis, MinIO |
| Staging    | 1 VPS Indonesia          | `infra/staging`, deploy dari `main`          |
| Produksi   | VPS/cloud region Jakarta | diputuskan sebelum beta (keputusan terbuka)  |
