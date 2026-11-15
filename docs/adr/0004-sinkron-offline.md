# ADR-0004: Kasir offline-first dengan outbox dan ledger

- Status: diterima
- Tanggal: 2026-11-15

## Konteks

Warung dan kedai sering kehilangan sinyal. Kasir harus tetap bisa jualan, mencetak struk, dan menghitung stok tanpa internet. Keluhan terbesar di kompetitor adalah stok dan transaksi yang selisih setelah sinkron.

## Keputusan

1. **Database lokal** SQLite (drift) berisi master data (produk, harga, pajak, karyawan) dan transaksi.
2. **Outbox**: setiap kejadian (penjualan, void, refund, kas masuk/keluar, buka/tutup kasir, hasil hitung stok opname) disimpan sebagai event dengan ID UUIDv7 buatan perangkat.
3. **Push idempoten**: `POST /v1/sync/push` menerima kumpulan event. Server menyimpan `event_id` sebagai primary key (`sync_events`), jadi event yang dikirim ulang dibalas `duplicate`, bukan dicatat dua kali.
4. **Pull dengan cursor**: `GET /v1/sync/pull?cursor=` mengirim perubahan master data sejak cursor terakhir.
5. **Transaksi hanya ditambah**: transaksi tidak pernah diubah. Void dan refund adalah event baru yang merujuk transaksi asal.
6. **Stok sebagai ledger**: stok = jumlah semua mutasi. Tidak ada kolom "stok" yang ditimpa dari perangkat.
7. **Konflik master data**: server yang menang (last-writer-wins di server), dicatat di log aktivitas.
8. **Stok opname**: saat mulai menghitung, sistem memotret stok saat itu. Selisih dihitung dari potret itu, sehingga penjualan selama penghitungan tidak membuat angka kacau.
9. **Nomor nota per perangkat**: format `S-K1-0412` (prefix perangkat + urutan lokal), jadi dua kasir offline tidak bentrok.
10. **Rekonsiliasi malam**: job server membandingkan jumlah event per perangkat dan memberi tahu pemilik kalau ada yang belum terkirim.

## Konsekuensi

- Perangkat butuh jam yang cukup akurat. `occurred_at` dicatat dari perangkat, `received_at` dari server.
- Laporan bisa berubah sedikit saat event offline masuk belakangan. Layar menampilkan status "menunggu dikirim".
- Hak akses (paket, flag fitur) di-cache 7 hari di perangkat.
