# POS Kita

Aplikasi kasir untuk usaha Indonesia: F&B, retail, dan jasa. Bisa dipakai semua umur dan tetap jalan tanpa internet. Nama, logo, dan warna produk diatur dari panel super admin, jadi "POS Kita" hanya nama sementara.

- **PRD, roadmap, tech stack, backlog**: https://claude.ai/artifact/C3fa2i3ZmJVfstRHUzsybf
- **Mockup 42 layar**: https://claude.ai/artifact/WgWf38bWpEs41JdifDu4on
- **Riset pasar & kompetitor**: [riset/riset-pos.html](riset/riset-pos.html)
- **Arsitektur**: [docs/arsitektur.md](docs/arsitektur.md) · **Keputusan (ADR)**: [docs/adr](docs/adr) · **Kamus istilah & aturan UI**: [docs/kamus-istilah.md](docs/kamus-istilah.md)
- **Cara kerja tim**: [CONTRIBUTING.md](CONTRIBUTING.md)

## Isi repo

| Folder                   | Isi                                                   | Teknologi                                       |
| ------------------------ | ----------------------------------------------------- | ----------------------------------------------- |
| `apps/api`               | Backend: akun, katalog, sinkron, laporan              | Go, chi, pgx, sqlc, goose, PostgreSQL (RLS)     |
| `apps/kasir`             | App kasir HP/tablet/mesin kasir, offline-first        | Flutter, Riverpod (drift menyusul)              |
| `apps/web`               | Back office pemilik/manajer + super admin             | React, Vite, TanStack Router/Query, Tailwind v4 |
| `apps/site`              | Situs publik: beranda, harga, privasi                 | Astro                                           |
| `apps/wa-gateway`        | Kirim struk/OTP/laporan lewat WhatsApp                | Node.js, Baileys (dikunci versinya)             |
| `packages/api-spec`      | Kontrak API (OpenAPI) + klien TypeScript              | openapi-typescript, openapi-fetch               |
| `packages/design-tokens` | Warna, ukuran teks, ukuran sentuh untuk web & Flutter | JSON → CSS/Tailwind/Dart                        |
| `infra`                  | Docker Compose untuk dev dan staging, Caddy           | Docker                                          |
| `backlog`, `scripts`     | 70 story + skrip pembuat issue GitHub                 | CSV, Python                                     |

## Prasyarat

| Alat           | Versi                   | Untuk                                                                                                 |
| -------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Node.js        | 22 LTS (lihat `.nvmrc`) | web, situs, gateway WA, generator                                                                     |
| pnpm           | 10 (`corepack enable`)  | paket JavaScript                                                                                      |
| Go             | 1.26 atau lebih baru    | API                                                                                                   |
| Flutter        | kanal stable terbaru    | app kasir                                                                                             |
| Docker Desktop | terbaru                 | Postgres, Redis, MinIO lokal                                                                          |
| sqlc           | 1.31                    | hanya kalau mengubah query SQL ([cara pasang](https://docs.sqlc.dev/en/latest/overview/install.html)) |

## Mulai pertama kali

```bash
corepack enable
pnpm install
pnpm infra:up                      # Postgres, Redis, MinIO
cp apps/api/.env.example apps/api/.env
pnpm db:migrate                    # buat tabel
pnpm dev:api                       # http://localhost:8080/health
pnpm dev:web                       # http://localhost:5173
```

App kasir: lihat [apps/kasir/README.md](apps/kasir/README.md). Ada satu langkah sekali jalan (`flutter create`) untuk membuat folder Android.

## Perintah sehari-hari

| Perintah                                           | Fungsi                                                          |
| -------------------------------------------------- | --------------------------------------------------------------- |
| `pnpm dev:api` / `dev:web` / `dev:site` / `dev:wa` | jalankan satu aplikasi                                          |
| `pnpm gen`                                         | buat ulang token desain, klien TS, dan server Go dari sumbernya |
| `pnpm lint` / `pnpm format`                        | cek / rapikan kode TypeScript (Biome)                           |
| `pnpm typecheck` · `pnpm test` · `pnpm build`      | semua paket JavaScript                                          |
| `cd apps/api && go test ./...`                     | tes Go                                                          |
| `cd apps/api && sqlc generate`                     | setelah mengubah `internal/db/queries/*.sql`                    |
| `cd apps/kasir && flutter test`                    | tes Flutter                                                     |

### Mengubah API

1. Ubah `packages/api-spec/openapi.yaml`.
2. Jalankan `pnpm gen`. Ini memperbarui `apps/api/internal/httpapi/api.gen.go` dan `packages/api-spec/ts/schema.gen.ts`.
3. Implementasikan handler di `apps/api/internal/httpapi`. Endpoint yang belum dibuat otomatis membalas 501.
4. Commit spesifikasi dan hasil generator dalam PR yang sama. CI gagal kalau keduanya tidak sesuai.

### Mengubah warna atau ukuran

Ubah `packages/design-tokens/tokens.json`, lalu `pnpm gen:tokens`. Web, situs, dan Flutter ikut berubah.

## Membagi tugas ke GitHub

Setelah repo dibuat dan `gh auth login`:

```bash
python scripts/setup_github.py --repo OWNER/NAMA-REPO --dry-run   # lihat dulu
python scripts/setup_github.py --repo OWNER/NAMA-REPO             # buat label, milestone S0-S8, 70 issue
```

Lalu atur branch protection `main` (wajib PR, CI hijau, 1 approval). Lihat [CONTRIBUTING.md](CONTRIBUTING.md).

## Status sprint 0

| Story                    | Status                                                                          |
| ------------------------ | ------------------------------------------------------------------------------- |
| F-01 Monorepo + CI       | ✅ kerangka siap; CI berjalan setelah push pertama                              |
| F-02 Staging             | 🟡 Compose + Caddyfile siap; butuh VPS, domain, dan workflow deploy             |
| F-03 OpenAPI + generator | ✅ TS & Go; generator Dart ditambahkan saat kasir mulai memanggil API           |
| F-04 Design tokens       | ✅ CSS, Tailwind v4, Dart                                                       |
| F-05 Kerangka app        | ✅ web, situs, gateway WA; 🟡 kasir perlu `flutter create` untuk folder Android |
