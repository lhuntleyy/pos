# App kasir (Flutter)

App kasir untuk HP, tablet, dan mesin kasir Android (Sunmi, iMin). Offline-first (ADR-0003, ADR-0004).

## Pertama kali (sekali saja, oleh developer kasir pertama)

Folder platform Android/iOS belum ada di repo. Buat dengan:

```bash
cd apps/kasir
flutter create --platforms=android,ios --org id.poskita --project-name kasir .
```

Perintah ini hanya menambah file yang belum ada (folder `android/`, `ios/`, dll.) dan tidak menimpa `lib/` atau `test/`. Setelah itu:

1. Di `android/app/build.gradle(.kts)` set `minSdk = 24` (Android 7, masih dipakai banyak mesin kasir murah).
2. Commit folder `android/` dan `ios/`.

## Perintah

```bash
flutter pub get
flutter analyze
flutter test
flutter run            # ke HP/emulator yang tersambung
```

## Struktur

```
lib/
  core/              uang (Rupiah int), ukuran teks, tema, widget umum
    theme/tokens.g.dart   dibuat dari packages/design-tokens (jangan diedit manual)
  features/
    auth/            masuk dengan PIN
    sell/            layar jualan, keranjang
```

Fitur berikutnya ditambahkan per folder di `features/` (misalnya `features/stock_count/` untuk stok opname).

## Aturan

- Uang selalu `int` Rupiah. Pakai `formatRupiah()` untuk menampilkan.
- Warna, ukuran teks, dan ukuran sentuh diambil dari `tokens.g.dart`, jangan tulis angka langsung.
- Teks UI mengikuti `docs/kamus-istilah.md`.
- Font Plus Jakarta Sans perlu dibundel di `assets/fonts` (lisensi OFL) supaya tampil saat offline. Lihat komentar di `pubspec.yaml`.
