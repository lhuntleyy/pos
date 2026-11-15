# ADR-0003: App kasir memakai Flutter

- Status: diterima
- Tanggal: 2026-11-15

## Konteks

App kasir harus jalan di HP Android murah, tablet, dan mesin kasir Android (Sunmi, iMin), harus tetap bisa jualan saat internet mati, dan harus bisa mencetak ke printer thermal Bluetooth/USB. Nanti juga perlu iOS dan mungkin Windows.

## Pilihan yang dipertimbangkan

1. **Flutter**: satu kode untuk HP, tablet, iOS, dan desktop. Performa konsisten di HP murah, plugin ESC/POS dan SDK Sunmi/iMin tersedia, SQLite lewat `drift`.
2. **React Native**: berbagi bahasa dengan web, tapi plugin printer dan performa daftar panjang di HP murah lebih tidak konsisten.
3. **Kotlin native**: performa terbaik, tapi hanya Android dan butuh tim terpisah untuk iOS.

## Keputusan

Flutter (kanal stable) dengan:

- State: Riverpod (`Notifier`/`NotifierProvider`)
- Database lokal: `drift` (SQLite), mulai di story S-01
- Printer: ESC/POS lewat Bluetooth/USB + SDK Sunmi/iMin (H-01)
- Scanner: HID keyboard + `mobile_scanner` (K-07)
- Warna, ukuran teks, dan ukuran sentuh diambil dari `lib/core/theme/tokens.g.dart` yang dibuat oleh `packages/design-tokens`

## Konsekuensi

- Folder platform (`android/`, `ios/`) dibuat sekali dengan `flutter create` oleh developer kasir pertama, lalu di-commit.
- Semua teks UI memakai kamus istilah (`docs/kamus-istilah.md`).
- Tes widget wajib untuk alur uang (bayar, kembalian, refund).
