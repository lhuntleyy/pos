# Cara kerja tim

## Alur satu story

1. Ambil issue dari milestone sprint berjalan, assign ke diri sendiri, pindahkan ke kolom **Dikerjakan**.
2. Buat branch dari `main`:
   - `feat/ST-03-stok-opname` untuk fitur
   - `fix/C-02-kembalian-minus` untuk perbaikan
   - `chore/F-01-ci-cache` untuk pekerjaan teknis
3. Commit kecil-kecil dengan format [Conventional Commits](https://www.conventionalcommits.org/) dan ID story:

   ```
   feat(kasir): hitung kembalian dari uang cepat [C-02]
   fix(api): tolak event sinkron tanpa device_id [S-03]
   ```

   Scope yang dipakai: `api`, `kasir`, `web`, `site`, `wa`, `spec`, `tokens`, `infra`, `ci`, `docs`.
4. Buka PR ke `main` memakai template PR. Tulis `Closes #<nomor issue>` supaya issue tertutup otomatis.
5. Minimal **1 review** dari orang lain, dan CI harus hijau.
6. Merge dengan **squash**. Judul squash = judul PR (format Conventional Commits).

## Aturan `main`

- Tidak boleh push langsung ke `main`. Atur branch protection di GitHub: wajib PR, wajib CI hijau, wajib 1 approval.
- `main` selalu bisa di-deploy ke staging.

## Definition of Done

- [ ] Kriteria terima di PRD terpenuhi
- [ ] Tes unit untuk logika uang, stok, dan pajak
- [ ] Fitur kasir tetap jalan saat offline (kalau berlaku)
- [ ] Ukuran sentuh, label aksesibilitas, dan teks sesuai [kamus istilah](docs/kamus-istilah.md)
- [ ] Kalau API berubah: `openapi.yaml` diubah dulu, `pnpm gen` dijalankan, hasilnya ikut di-commit
- [ ] Sudah direview dan tampil di staging

## Aturan kode

- **Uang**: selalu bilangan bulat Rupiah (`int64` di Go, `int` di Dart, `number` bulat di TS). Dilarang memakai float untuk uang.
- **Waktu**: simpan UTC (`timestamptz`), tampilkan dalam zona waktu outlet (WIB/WITA/WIT).
- **ID**: UUIDv7. Untuk data dari kasir offline, ID dibuat di perangkat.
- **Data antar toko**: setiap query ke tabel milik toko harus lewat transaksi yang sudah memasang `app.business_id` (RLS). Lihat `apps/api/internal/platform/postgres`.
- **Rahasia**: tidak boleh ada token, password, atau kunci API di repo. Pakai `.env` (sudah di-ignore) dan contoh di `.env.example`.
- **Bahasa**: teks UI Bahasa Indonesia sesuai kamus istilah. Nama variabel, fungsi, tabel, dan komentar teknis boleh bahasa Inggris.
- **Dependensi baru**: sebut alasannya di PR. Untuk paket npm, cek nama paket dan repo resminya (hati-hati paket tiruan).

## Perintah yang sering dipakai

Lihat bagian "Perintah sehari-hari" di [README](README.md).

## Keputusan arsitektur

Keputusan besar ditulis sebagai ADR di [`docs/adr`](docs/adr). Salin `0000-template.md`, beri nomor berikutnya, lalu diskusikan lewat PR.
