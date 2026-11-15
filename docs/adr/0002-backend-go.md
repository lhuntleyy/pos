# ADR-0002: Backend memakai Go

- Status: diterima
- Tanggal: 2026-11-15

## Konteks

Backend mengurus uang, stok, pajak, dan sinkron offline dari ribuan perangkat kasir. Kesalahan kecil di sini langsung jadi selisih uang atau stok, yang merupakan keluhan utama pengguna kompetitor di ulasan Play Store. Biaya server per toko juga harus rendah karena paket termurah Rp99rb per bulan.

## Pilihan yang dipertimbangkan

1. **Go** (chi, pgx, sqlc): tipe statis, konkurensi bawaan, satu binary kecil, RAM rendah. Query SQL ditulis tangan lalu dicek oleh sqlc.
2. **Bun + Hono + Drizzle**: satu bahasa dengan web, cepat dikembangkan. Tapi runtime Bun lebih muda dan ekosistem produksinya lebih kecil.
3. **Node + NestJS**: ekosistem besar, tapi pemakaian memori lebih tinggi dan banyak lapisan abstraksi.

## Keputusan

Go (versi stabil terbaru, minimal 1.26) dengan:

- Router `chi`, handler dibuat dari OpenAPI oleh `oapi-codegen` (lihat ADR-0006)
- PostgreSQL lewat `pgx/v5`, query dengan `sqlc`, migrasi `goose`
- Isolasi data antar toko dengan Row Level Security (RLS) PostgreSQL
- Antrean job dengan `asynq` (Redis), ditambahkan saat dibutuhkan

Kalau ternyata mayoritas tim hanya bisa JavaScript, cadangannya Bun + Hono + Drizzle. Keputusan ini harus ditinjau ulang sebelum sprint 1 berakhir, bukan di tengah jalan.

## Konsekuensi

- Uang selalu disimpan sebagai bilangan bulat Rupiah (`int64`), tidak pernah float.
- Developer frontend yang mau menyentuh backend perlu belajar Go dasar.
- Satu binary memudahkan deploy di VPS kecil.
