# ADR-0006: Kontrak API ditulis dulu (OpenAPI), kode dibuat dari spesifikasi

- Status: diterima
- Tanggal: 2026-11-15

## Konteks

Tiga klien (kasir Flutter, web React, gateway WA) memanggil API yang sama. Tanpa kontrak bersama, field gampang beda nama atau tipe, dan baru ketahuan saat dipakai.

## Keputusan

- Sumber kebenaran: `packages/api-spec/openapi.yaml`.
- Versi OpenAPI **3.0.3**, karena `oapi-codegen` belum mendukung penuh 3.1. Naikkan ke 3.1 kalau generator sudah siap.
- Server Go: `oapi-codegen` membuat interface handler chi dan tipe (`apps/api/internal/httpapi/api.gen.go`), dijalankan dengan `go generate`.
- Web: `openapi-typescript` + `openapi-fetch` (`packages/api-spec/ts`).
- Kasir Flutter: generator Dart ditambahkan saat kasir mulai memanggil API (S1), misalnya `swagger_parser`. Sebelum itu klien ditulis tangan di `lib/data/api`.
- Error memakai format Problem Details (RFC 9457, `application/problem+json`).
- Semua nominal uang bertipe integer Rupiah.
- Alur kerja: ubah `openapi.yaml`, jalankan `pnpm gen`, lalu commit hasilnya dalam PR yang sama. CI gagal kalau hasil generator tidak sama dengan spesifikasi.

## Konsekuensi

- Review PR API dimulai dari diff `openapi.yaml`.
- Endpoint yang belum diimplementasi otomatis membalas 501 dari server Go.
