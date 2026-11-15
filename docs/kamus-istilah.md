# Kamus istilah dan aturan UI semua umur

Pengguna kita mulai dari pemilik warung umur 60-an sampai kasir umur 17-an. Kompetitor dinilai terlalu padat dan memakai bahasa campur. Aturan ini berlaku untuk semua layar: kasir, web, situs, struk, dan pesan WhatsApp.

## Bahasa

Pakai Bahasa Indonesia sehari-hari. Jangan campur Inggris.

| Pakai              | Hindari                      |
| ------------------ | ---------------------------- |
| Uang diterima      | Cash tendered                |
| Kembalian          | Change                       |
| Simpan pesanan     | Hold / Save order            |
| Batalkan transaksi | Void                         |
| Kembalikan uang    | Refund                       |
| Pindah meja        | Move to table                |
| Kirim ke dapur     | Checker                      |
| Tutup kasir        | Settlement / Close shift     |
| Buka kasir         | Open shift                   |
| Stok opname        | Stock take / Stock count     |
| Kasbon             | Piutang / Account receivable |
| Karyawan           | Staff / User                 |
| Pengaturan         | Settings                     |
| Laporan            | Report / Analytics           |
| Menunggu dikirim   | Pending sync / Queued        |

Nama variabel, fungsi, dan tabel di kode tetap memakai bahasa Inggris (`refund`, `shift`, `stock_count`). Yang memakai kamus ini adalah teks yang dilihat pengguna.

## Ukuran

- Target sentuh minimal **48 px**, tombol kategori **56 px**, tombol utama (Bayar) **64 px**.
- Kartu produk minimal 120 × 96 px dengan jarak 12 px.
- Tiga ukuran teks yang bisa dipilih pengguna:

| Elemen                | A   | A+  | A++ |
| --------------------- | --- | --- | --- |
| Teks isi              | 16  | 18  | 20  |
| Nama produk           | 15  | 17  | 19  |
| Harga di kartu        | 17  | 19  | 22  |
| Total                 | 36  | 40  | 44  |
| Kolom produk (tablet) | 4   | 4   | 3   |

- Angka uang memakai digit tabular (`font-variant-numeric: tabular-nums` / `FontFeature.tabularFigures()`).

## Warna

| Nama       | Hex       | Dipakai untuk                                             |
| ---------- | --------- | --------------------------------------------------------- |
| Nila       | `#3B35B5` | aksi utama (warna brand bawaan, bisa diganti super admin) |
| Tinta      | `#181A2E` | teks utama                                                |
| Abu tinta  | `#51546F` | teks kedua                                                |
| Kunyit     | `#E39D00` | sorotan, **selalu dengan teks gelap**                     |
| Hijau      | `#16774A` | berhasil                                                  |
| Merah bata | `#B42318` | bahaya                                                    |
| Latar      | `#F6F6FB` | latar halaman                                             |

- Kontras minimal WCAG 2.2 AA (4,5:1 untuk teks).
- Status selalu ditandai **warna + ikon + teks**, tidak boleh warna saja. Contoh: "Offline · 3 transaksi menunggu dikirim".
- Tombol uang cepat memakai warna uang kertas Rupiah: Rp100.000 `#C2185B`, Rp50.000 `#1565C0`, Rp20.000 `#2E7D32`, Rp10.000 `#6A1B9A`, Rp5.000 `#8D6E63`, Rp2.000 `#546E7A`.
- Warna brand dari super admin dicek kontrasnya dulu sebelum disimpan.

## Perilaku

- Pilih tombol **"Batalkan"** (undo 5 detik) daripada dialog "Yakin?".
- PIN hanya diminta untuk batalkan transaksi, kembalikan uang, dan diskon besar.
- Pesan error menjelaskan apa yang terjadi dan apa yang harus dilakukan. Contoh: "Printer tidak tersambung · nyalakan Bluetooth", bukan "Error 503".
- Font: Plus Jakarta Sans.

Semua nilai di atas tersedia sebagai token di `packages/design-tokens/tokens.json`.
