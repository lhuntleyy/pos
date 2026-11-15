# ADR-0005: WhatsApp lewat Baileys di layanan terpisah

- Status: diterima (dengan risiko yang disadari)
- Tanggal: 2026-11-15

## Konteks

Struk digital, OTP, laporan harian, pengingat kasbon, dan notifikasi "laundry siap diambil" dikirim lewat WhatsApp. WhatsApp Cloud API resmi berbayar per percakapan. Tim memutuskan memakai Baileys (library tidak resmi) untuk menekan biaya.

## Risiko

- Nomor bisa diblokir WhatsApp kalau dianggap spam.
- Library tidak resmi bisa rusak saat WhatsApp berubah.
- April 2026 ada paket npm "anti-ban" untuk Baileys yang ternyata mencuri sesi WhatsApp.

## Keputusan

Gateway Node.js terpisah (`apps/wa-gateway`) dengan pengaman:

1. Setiap toko menyambungkan nomor WhatsApp **miliknya sendiri** dengan scan QR. Nomor platform untuk OTP terpisah.
2. Hanya pesan transaksional (struk, OTP, laporan, pengingat), tidak ada broadcast promosi.
3. Batas harian per nomor (awal 300 pesan) dan jeda acak antar pesan.
4. Kalau sesi putus atau batas habis, kasir menampilkan tombol "Bagikan lewat WA" (membuka WhatsApp di HP) sebagai cadangan.
5. Kredensial sesi dienkripsi AES-256-GCM sebelum disimpan.
6. Versi Baileys dikunci persis (tanpa `^`), paket diambil dari npm resmi `baileys`. Dilarang memasang paket tambahan "anti-ban" atau fork tidak dikenal. pnpm menunda versi baru 3 hari (`minimumReleaseAge`).
7. Semua kode memanggil antarmuka `WhatsAppProvider`, sehingga bisa pindah ke Cloud API tanpa mengubah API utama.
8. Gateway hanya bisa diakses dari jaringan internal dengan header rahasia bersama.

## Konsekuensi

- Fitur WhatsApp harus selalu punya jalur cadangan. Tidak boleh ada alur yang macet kalau WA mati.
- Perlu pemantauan sesi putus (story W-04).
- Kalau tingkat blokir tinggi saat beta, pindah ke Cloud API untuk OTP terlebih dahulu.
