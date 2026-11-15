# ADR-0001: Satu monorepo untuk semua aplikasi

- Status: diterima
- Tanggal: 2026-11-15

## Konteks

Ada lima aplikasi (API Go, app kasir Flutter, web back office React, situs Astro, gateway WhatsApp Node) yang berbagi kontrak API dan sistem desain. Tim kecil (sekitar 5 developer) dan perubahan sering menyentuh lebih dari satu aplikasi sekaligus, misalnya field baru di API, web, dan kasir.

## Pilihan yang dipertimbangkan

1. **Monorepo**: satu PR bisa mengubah spesifikasi API, server, dan klien sekaligus. CI harus pintar menjalankan job sesuai folder yang berubah.
2. **Repo per aplikasi**: CI lebih sederhana, tapi kontrak API gampang tidak sinkron dan butuh rilis paket bersama.

## Keputusan

Monorepo dengan pnpm workspace untuk paket JavaScript/TypeScript. Go dan Flutter tetap memakai tooling bawaannya di folder masing-masing. Job CI dipilih dengan filter path (`dorny/paths-filter`).

Struktur:

- `apps/api`, `apps/kasir`, `apps/web`, `apps/site`, `apps/wa-gateway`
- `packages/api-spec` (OpenAPI + klien TS), `packages/design-tokens`
- `infra/` (Docker Compose dev & staging), `docs/` (ADR, arsitektur)

## Konsekuensi

- Satu PR untuk satu story, walaupun lintas aplikasi.
- File hasil generator (klien API, tokens) di-commit, lalu CI mengecek bahwa file itu sesuai sumbernya.
- Riwayat git lebih ramai. Pakai label jalur (`jalur:kasir`, `jalur:backend`, dll.) untuk menyaring.
