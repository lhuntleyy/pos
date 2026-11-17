# POS Kita · PRD, Roadmap, Tech Stack & Backlog

Nov 15, 2026 · @gilang

## 1. Ringkasan produk

POS Kita adalah aplikasi kasir offline-first untuk semua jenis usaha kecil–menengah di Indonesia: F&B, retail, dan jasa. Targetnya rilis publik MVP pada 19 April 2027 dengan paket Gratis dan Basic. Nama, logo, dan warna produk diatur dari panel super admin, jadi branding bisa diputuskan belakangan.

**Masalah yang diselesaikan** (dari riset 13 POS dan ±110 ulasan bintang 1–2 di Play Store):

- Aplikasi yang ada lengkap fiturnya, tapi menunya dalam dan istilahnya campur bahasa Inggris, sehingga pengguna baru dan lansia kesulitan.
- Stok dan laporan sering tidak cocok dengan data di kasir. Sinkron offline tidak bisa dipercaya.
- Harga tidak benar-benar bulanan: kontrak 12 bulan, bayar setahun di muka, add-on mahal, atau harus lewat sales.
- Purna jual lambat, dan banyak yang bergantung pada teknisi datang ke lokasi.

**Posisi:** kasir paling gampang di Indonesia. Bisa dipakai umur 17 sampai 70 tahun, bayar bulanan tanpa kontrak, tetap jalan tanpa internet, dan struk serta laporan dikirim lewat WhatsApp.

**Sasaran 6 bulan setelah rilis (Oktober 2027):**

| Metrik | Target | Cara ukur |
| --- | --- | --- |
| Toko aktif (minimal 1 transaksi/minggu) | 1.500 | Data transaksi per tenant |
| Toko berbayar | 300 | Langganan aktif |
| Konversi trial Pro ke berbayar | > 15% | Funnel langganan |
| Churn bulanan berbayar | < 3% | Langganan berhenti / aktif awal bulan |
| Transaksi pertama tanpa bantuan | < 60 detik | Waktu dari login pertama ke struk pertama |
| Sesi app kasir bebas crash | > 99,5% | Sentry |
| Selisih data kasir vs laporan | 0 kasus tak terjelaskan | Rekonsiliasi malam |

## 2. Pengguna dan modul usaha

Produk dibangun dari satu inti yang dipakai semua usaha, plus tiga modul yang aktif sesuai jenis usaha. Template saat daftar menyalakan modul yang cocok, dan pemilik bisa menambah modul lain kapan saja.

| Persona | Konteks | Kebutuhan utama |
| --- | --- | --- |
| Bu Sri, 54, pemilik warung makan | HP Android, belum pernah pakai kasir digital, mata sudah plus | Teks besar, langkah sedikit, tahu untung hari ini lewat WA |
| Dimas, 23, kasir kafe | 80+ transaksi/jam saat ramai, juga memantau pesanan ojol | Cepat, favorit, topping cepat, pintasan keyboard |
| Pak Hendra, 41, pemilik 3 outlet | Jarang di toko, khawatir stok bocor dan selisih kas | Notifikasi void dan selisih, laporan per outlet |
| Rina, 29, admin keuangan | Rekap bulanan untuk software akuntansi | Ekspor rapi, laporan pajak, rekonsiliasi QRIS |
| Mbak Nia, 30, kasir laundry | Menerima cucian, mengabari pelanggan saat selesai | Status pengerjaan, WA "siap diambil" |
| Tim internal (super admin) | Mengelola toko, paket, dan branding | Ubah harga dan fitur paket tanpa rilis aplikasi |

| Bagian | Isi | Contoh usaha |
| --- | --- | --- |
| Inti (semua usaha) | Kasir offline, produk & varian, stok + stok opname, pelanggan & kasbon, diskon, pembayaran, buka/tutup kasir, refund/void + PIN, struk printer & WA, laporan, karyawan & hak akses, ekspor data | Semua |
| Modul F&B | Meja & open bill, topping min–maks, kirim ke dapur, mode pelayan, harga per kanal ojol, resep & HPP, QR menu, service charge | Warung makan, kafe, resto |
| Modul Retail | Barcode, varian ukuran × warna, multi-satuan, harga grosir, supplier & pembelian, retur | Kelontong, minimarket, toko baju |
| Modul Jasa | Layanan per kg/jam/paket, status pengerjaan, antrean, booking, komisi, uang muka | Laundry, barbershop, salon |

## 3. Lingkup MVP (Fase 1)

MVP mencakup seluruh inti untuk semua segmen, ditambah versi dasar modul retail dan jasa. Fitur F&B yang berat (denah meja, layar dapur, resep & HPP) masuk Fase 2.

**Masuk MVP:**

- Aplikasi kasir Android (HP dan tablet): login PIN, jualan, keranjang, diskon, pembulatan, simpan pesanan, jenis pesanan, mode simpel/lengkap, 3 ukuran teks.
- Pembayaran: tunai (uang cepat), QRIS statis milik merchant dengan konfirmasi manual, transfer, EDC (dicatat), kasbon, pisah bayar, pisah tagihan.
- Struk: printer ESC/POS Bluetooth/USB 58 & 80 mm, antrean cetak, cetak ulang, bagikan ke WhatsApp.
- Buka/tutup kasir: modal per pecahan, kas masuk/keluar, selisih wajib beralasan, laporan shift ke WA pemilik.
- Riwayat transaksi, refund/void dengan PIN dan alasan, log aktivitas.
- Katalog: produk, kategori, varian, topping min–maks, multi-satuan, harga per kanal, barcode (kamera & scanner), impor Excel.
- Stok: riwayat mutasi (ledger), stok masuk dengan tanggal mundur, penyesuaian, **stok opname** dengan persetujuan, peringatan stok menipis.
- Pelanggan & kasbon: batas, jatuh tempo, catat bayar, pengingat WA.
- Modul jasa dasar: layanan per kg/jam, estimasi selesai, papan status, WA "siap diambil". Modul retail dasar: kasir mode scan dan pilih satuan.
- Back office web: beranda, produk & stok, stok opname, stok masuk, pelanggan, karyawan & hak akses, laporan (penjualan, produk, stok, laba rugi sederhana, pajak, shift), pengaturan (modul, pajak, struk), ekspor semua data.
- WhatsApp lewat Baileys: OTP, struk otomatis, laporan harian 22.00, tutup kasir, pengingat kasbon.
- Langganan: paket Gratis & Basic aktif, trial Pro 30 hari dengan fitur MVP, penagihan bulanan via payment gateway.
- Panel super admin: daftar toko, ringkasan MRR/churn, editor paket & harga, branding (nama, logo, warna, domain).
- Onboarding 4 langkah di HP dengan contoh menu per jenis usaha.

**Tidak masuk MVP (Fase 2–3):** denah meja visual, layar dapur & printer dapur, mode pelayan, resep & HPP, promo & member/poin, multi-outlet & transfer stok, pembelian lengkap, QRIS dinamis, harga grosir bertingkat & cetak label, booking & komisi jasa, app pemilik (PWA), layar pelanggan, integrasi ojol, QR self-order, asisten AI, toko online, akuntansi, iOS dan Windows.

**Asumsi:**

- Perangkat minimal Android 8 (API 26) dengan RAM 2 GB. Printer thermal ESC/POS umum.
- Internet di toko sering putus. Kasir harus tetap jalan minimal 7 hari tanpa internet.
- Paket Pro dan Bisnis dijual setelah fitur Fase 2 siap. Selama MVP, trial Pro hanya membuka fitur yang sudah ada.

## 4. Kebutuhan fungsional

Setiap modul di bawah punya aturan bisnis yang mengikat. Kriteria terimanya dipakai QA dan Definition of Done. Nomor epic sama dengan backlog di bagian 11.

**EP02 · Akun, toko, perangkat**

- Daftar cukup dengan nomor HP + OTP 6 digit lewat WhatsApp, kedaluwarsa 5 menit, maksimal 5 percobaan. Email jadi cadangan.
- Perangkat kasir dipasang dengan kode 6 digit dari back office. Satu perangkat terikat ke satu outlet.
- Login kasir pakai PIN 6 digit. PIN di-hash argon2id dan disinkron ke perangkat, jadi login tetap bisa saat offline. 5 PIN salah = kunci 5 menit.
- Hak akses diatur per aksi dengan tiga nilai: Boleh, Perlu PIN, Tidak boleh. Preset: Pemilik, Kepala toko, Kasir, Pelayan, Dapur, Gudang.

**EP03 · Katalog**

- Varian maksimal 2 dimensi (contoh ukuran × warna) dengan harga dan stok per kombinasi.
- Grup topping punya aturan wajib/opsional serta batas minimal–maksimal. Opsi yang habis tidak bisa dipilih.
- Multi-satuan: satu satuan dasar untuk stok, satuan lain dengan faktor konversi dan harga sendiri.
- Harga per kanal (toko, GoFood, GrabFood, ShopeeFood) bisa nominal atau persen dari harga toko.
- Impor Excel/CSV memakai template resmi. Baris error ditampilkan dengan alasannya, baris valid tetap masuk.

**EP05 · Kasir & pembayaran**

- Kriteria: dari produk terakhir ke struk maksimal 3 tap untuk pembayaran tunai uang pas.
- Uang cepat menampilkan "Uang pas" ditambah pecahan di atas total, dengan warna uang Rupiah.
- QRIS statis: gambar QRIS merchant tampil di kasir dan layar pelanggan, lalu kasir konfirmasi manual. Tidak ada biaya tambahan ke pembeli (aturan BI).
- Kasbon hanya untuk pelanggan bernama dan tidak boleh melewati batas kasbon tanpa PIN.
- Hapus item dari keranjang langsung terjadi, lalu muncul "Batalkan" selama 5 detik. Void/refund setelah bayar wajib alasan dan sesuai hak akses. Stok dikembalikan otomatis.
- Nomor nota unik per perangkat (contoh S-K1-0412) supaya tidak bentrok saat offline.

**EP06 · Struk & perangkat keras**

- Kalau printer putus, cetakan masuk antrean dan dicetak saat tersambung lagi. Semua dokumen bisa dicetak ulang, termasuk laporan tutup kasir.
- Struk memisahkan PBJT, service charge, dan PPN, plus pembulatan bila aktif.

**EP07 · Buka/tutup kasir**

- Kasir tidak bisa jualan sebelum buka kasir. Uang seharusnya di laci = modal + tunai − kas keluar − refund tunai.
- Selisih ≠ 0 wajib beralasan. Laporan shift otomatis dikirim ke WA pemilik.

**EP08 · Stok & stok opname**

- Stok = jumlah semua mutasi (penjualan, void, refund, stok masuk, penyesuaian, opname). Angka stok tidak pernah ditimpa langsung.
- Stok masuk boleh bertanggal mundur. Stok dan HPP sejak tanggal itu dihitung ulang, dan perubahan tercatat di log.
- Stok opname: buat sesi (semua barang, per kategori, atau per rak), lalu hitung di HP/tablet. Penjualan tetap jalan selama hitung. Selisih dihitung terhadap stok sistem pada saat barang dihitung. Selisih wajib beralasan, lalu disetujui pemilik atau kepala toko sebelum stok disesuaikan.

**EP09 · Pelanggan & kasbon**

- Nomor HP pelanggan disamarkan di layar kasir (0812-\*\*\*\*-7781). Struk WA dan pengingat hanya dikirim ke pelanggan yang setuju.
- Pengingat kasbon dikirim 3 hari sebelum dan pada hari jatuh tempo.

**EP10–11 · Laporan & pajak**

- Satu halaman laporan dengan filter tanggal, outlet, kasir, kanal, dan tab: Penjualan, Produk, Stok, Keuangan, Pajak, Shift & kas.
- Laba rugi sederhana: penjualan bersih − HPP = laba kotor, dikurangi biaya (kas keluar dan pengeluaran dicatat).
- Panduan pajak mengisi tarif PBJT dari kota (maksimal 10%). PPN memakai DPP nilai lain 11/12 dan hanya aktif untuk usaha PKP.
- Rekonsiliasi malam: penjualan = pembayaran = mutasi stok. Kalau ada yang tidak cocok, pemilik diberi tahu lengkap dengan nomor notanya.

**EP12 · WhatsApp**

- Satu sesi Baileys per toko, ditautkan lewat QR dari back office. Nomor platform terpisah untuk OTP.
- Hanya pesan transaksional. Ada batas aman harian per sesi (awal 300) dan jeda acak antar pesan.
- Kalau sesi putus, kasir otomatis memakai tombol "bagikan ke WhatsApp" dan pemilik diberi tahu.

**EP13 · Modul jasa & retail dasar**

- Jasa: status Diterima → Dikerjakan → Siap diambil → Diambil. Status "Siap diambil" mengirim WA ke pelanggan.
- Retail: kolom scan selalu fokus, scan barang yang sama menambah jumlah, pilih satuan saat scan barang multi-satuan.

**EP14 · Langganan & super admin**

- Batas dan fitur paket dibaca dari server, lalu disimpan di perangkat dengan masa berlaku offline 7 hari.
- Pembayaran gagal memberi masa tenggang 7 hari, lalu akun turun ke Gratis. Data tidak pernah dihapus karena turun paket.
- Perubahan harga di super admin bisa berlaku hanya untuk pelanggan baru. Semua perubahan tercatat di log audit.
- Branding (nama, logo, warna, domain, nomor bantuan) dipakai di app kasir, web, struk, email, dan WA. Warna yang kontrasnya gagal otomatis memakai teks gelap.

## 5. Kebutuhan non-fungsional

Angka di bawah adalah batas lulus untuk rilis MVP dan diuji di perangkat Android RAM 2 GB.

| Area | Syarat | Cara uji |
| --- | --- | --- |
| Offline | Semua fungsi kasir inti jalan tanpa internet minimal 7 hari. Tidak ada transaksi hilang. | Uji mode pesawat 7 hari, 500 transaksi, lalu sinkron |
| Sinkron | Data terkirim maksimal 30 detik setelah internet kembali. Kirim ulang tidak membuat data ganda. | Uji putus-sambung acak + kirim ulang paket yang sama |
| Kecepatan kasir | Tap produk ke keranjang < 100 ms. Cari di 5.000 produk < 200 ms. App dibuka < 3 detik. | Profiling di HP 2 GB |
| Kecepatan server | API p95 < 300 ms. Beranda web tampil < 2 detik. | Uji beban k6 |
| Skala awal | 2.000 toko, 10.000 perangkat, 1 juta transaksi/bulan | Uji beban dan perkiraan kapasitas |
| Ketersediaan | Backend 99,5%/bulan. Kasir tetap jalan saat server mati. | Monitoring uptime |
| Keamanan | TLS di semua koneksi. Isolasi tenant dengan Row-Level Security. Kredensial WA dan token dienkripsi. PIN argon2id. Batas laju di semua endpoint. Log audit untuk aksi sensitif. Mengikuti OWASP ASVS level 1. | Review kode, uji isolasi tenant, pentest ringan sebelum rilis |
| Cadangan | Backup harian + point-in-time recovery 7 hari. Uji restore tiap bulan. | Restore ke staging |
| Privasi (UU PDP) | Persetujuan pelanggan untuk WA, nomor HP disamarkan, ekspor & hapus data atas permintaan, server di Indonesia, prosedur notifikasi kebocoran 3×24 jam | Checklist PDP sebelum rilis |
| Aksesibilitas | WCAG 2.2 AA, target sentuh minimal 48 px (CTA 64 px), 3 ukuran teks, label untuk TalkBack | Audit aksesibilitas + uji 2 pengguna 50+ |
| Kompatibilitas | Android 8+, Chrome/Edge/Safari dua versi terakhir, minimal 5 model printer thermal teruji | Lab perangkat |
| Lokalisasi | Bahasa Indonesia sesuai kamus istilah, format Rupiah, zona waktu per outlet (WIB/WITA/WIT) | Review copy |
| Kualitas | Sesi bebas crash > 99,5%, error rate API < 0,5% | Sentry + Grafana |

## 6. Paket, batas, dan penagihan

Langganan bulanan tanpa kontrak, dengan opsi tahunan diskon 2 bulan. Semua harga, batas, dan fitur bisa diubah dari panel super admin tanpa rilis aplikasi. Harga belum termasuk PPN.

| Batas / fitur | Kunci flag | Gratis | Basic | Pro | Bisnis |
| --- | --- | --- | --- | --- | --- |
| Harga bulanan | plan.price | Rp0 | Rp99.000 | Rp199.000/outlet | Rp399.000/outlet |
| Outlet | limit.outlets | 1 | 1 | per outlet | per outlet |
| Perangkat per outlet | limit.devices | 1 | 2 | 4 | tanpa batas |
| Produk/layanan | limit.products | 100 | tanpa batas | tanpa batas | tanpa batas |
| Karyawan | limit.staff | 1 | 5 | tanpa batas | tanpa batas |
| Stok opname (stok dan riwayatnya tetap ada di semua paket) | feature.stock\_opname | Tidak | Ya | Ya | Ya |
| Kasbon | feature.customer\_credit | Ya | Ya | Ya | Ya |
| Ekspor data | feature.export | Ya | Ya | Ya | Ya |
| WA otomatis (struk, laporan) | feature.wa\_auto | Tidak, tombol bagikan | Ya | Ya | Ya |
| Buka/tutup kasir & laporan selisih | feature.shift | Sederhana | Ya | Ya | Ya |
| Status pengerjaan jasa | feature.service\_status | Tidak | Ya | Ya | Ya |
| Meja, layar dapur, resep & HPP | feature.fnb\_pro | Tidak | Tidak | Ya (Fase 2) | Ya |
| Promo, member, poin | feature.loyalty | Tidak | Tidak | Ya (Fase 2) | Ya |
| Multi-outlet & transfer stok | feature.multi\_outlet | Tidak | Tidak | Tidak | Ya (Fase 2) |

**Aturan penagihan:**

- Tagihan bulanan lewat payment gateway (VA, QRIS, e-wallet, kartu). Pembayaran pertama dapat garansi uang kembali 14 hari.
- Trial Pro 30 hari untuk toko baru, tanpa kartu. Setelah trial selesai, otomatis turun ke Gratis kalau tidak membayar.
- Naik paket dihitung per hari. Turun paket berlaku di periode berikutnya.
- Pembayaran gagal: dicoba lagi otomatis, masa tenggang 7 hari, lalu turun ke Gratis. Data tidak dihapus.
- Kalau melewati batas paket (misalnya perangkat ketiga di Basic), yang baru diblokir dengan tawaran naik paket atau add-on perangkat Rp29.000/bulan. Fungsi yang sudah berjalan tidak dimatikan.
- Kenaikan harga diumumkan 30 hari sebelumnya. Pelanggan lama bisa tetap di harga lama.

## 7. Tech stack dan arsitektur

Keputusan: backend inti pakai **Go**, app kasir Android pakai **Flutter**, web pakai **React + TypeScript**, dan gateway WhatsApp jadi layanan **Node.js + Baileys** terpisah. Semua data di PostgreSQL di server Indonesia.

&#91;embedded content: arsitektur MVP · 4 klien, 1 API, 3 penyimpanan\]

Kasir selalu menulis ke SQLite lokal dulu, baru sinkron ke API. WhatsApp dan payment gateway tidak pernah dipanggil langsung dari perangkat, selalu lewat server.

**Go atau Bun untuk backend?** Untuk POS, Go lebih cocok di inti sistem:

- Logika uang, stok, dan sinkron butuh tipe data yang ketat dan konkurensi yang aman. Goroutine + database transaction di Go lebih matang untuk ribuan perangkat yang push data bersamaan.
- Memori per instance kecil dan hasil build-nya satu binary, jadi biaya VPS per toko lebih murah dan deploy lebih sederhana.
- Bun memang lebih cepat untuk mulai, terutama kalau seluruh tim sudah JavaScript. Tapi kecepatan di bulan pertama tidak sebanding dengan biaya bug di logika stok selama bertahun-tahun.
- Jalan tengahnya: TypeScript tetap dipakai di web dan gateway WA. Kontrak API pakai OpenAPI, jadi klien TypeScript dan Dart dibuat otomatis.
- Rencana cadangan: kalau tim mayoritas JavaScript dan tidak ada yang bisa Go, pakai Bun + Hono + Drizzle dengan arsitektur yang sama. Gateway WA tetap di Node.

**Kenapa Flutter untuk Android?** Satu codebase untuk HP dan tablet Android sekarang, lalu iOS dan Windows di Fase 3 (kasir PC seperti Majoo). Performanya stabil di HP murah, punya pengaturan skala teks untuk mode A/A+/A++, database lokal SQLite (drift) yang matang, dan plugin printer ESC/POS serta Sunmi tersedia. Kotlin native lebih kuat untuk hardware tapi hanya Android. React Native bisa berbagi TypeScript, tapi ekosistem printer dan offline-nya lebih lemah.

| Lapisan | Pilihan | Catatan |
| --- | --- | --- |
| App kasir & HP | Flutter 3 (Dart), Riverpod, drift (SQLite), go\_router | Android 8+ dulu. Printer: ESC/POS Bluetooth/USB/LAN + SDK Sunmi/iMin bila perlu. Barcode: scanner HID + kamera (mobile\_scanner). |
| Backend inti & sinkron | Go 1.23+, chi, pgx + sqlc, goose (migrasi), asynq (antrean di Redis) | Satu repo modular: auth, tenant, katalog, transaksi, stok, laporan, billing, sync. |
| Gateway WhatsApp | Node.js 22 LTS + Baileys (TypeScript) | Satu sesi per toko. Kredensial dienkripsi AES-GCM. Komunikasi dengan inti lewat antrean Redis. Versi Baileys dikunci, tanpa paket "anti-ban" pihak ketiga. |
| Web back office & super admin | React 18 + Vite + TypeScript, TanStack Router & Query, Tailwind + Radix | App pemilik nanti jadi PWA dari codebase yang sama (Fase 2). |
| Situs & halaman harga | Astro | Statis dan cepat untuk SEO. |
| Database | PostgreSQL 16 dengan Row-Level Security per tenant | Skema bersama, setiap tabel punya tenant\_id. |
| Cache & antrean | Redis 7 | Antrean pesan WA, batas laju, cache flag paket. |
| Penyimpanan file | Object storage S3-compatible (Cloudflare R2 atau MinIO) | Foto produk, file ekspor, backup. |
| Kontrak API | OpenAPI 3.1, spec-first | oapi-codegen untuk server Go, generator klien TypeScript dan Dart. |
| Auth | OTP WA + email cadangan, JWT 15 menit + refresh token berputar, token per perangkat, PIN karyawan | PIN bisa diverifikasi offline. |
| Pembayaran | Xendit atau Midtrans (diputuskan saat negosiasi) | Tagihan langganan. QRIS dinamis merchant di Fase 2. |
| Infrastruktur | Docker Compose di VPS Indonesia, Caddy (TLS), GitHub Actions | Lingkungan dev, staging, prod. Pindah ke Kubernetes kalau sudah perlu. |
| Observabilitas | Sentry, Prometheus + Grafana + Loki, Uptime Kuma | Halaman status untuk merchant. |

Struktur repo (monorepo): `apps/api` (Go), `apps/wa-gateway` (Node), `apps/web` (React: back office + super admin), `apps/site` (Astro), `apps/kasir` (Flutter), `packages/api-spec` (OpenAPI), `packages/design-tokens`, `docs/` (ADR & catatan teknis), `infra/` (Docker Compose, Caddy, skrip backup).

## 8. Model data inti dan sinkron offline-first

Prinsipnya: transaksi tidak pernah diubah (hanya ditambah), stok dihitung dari riwayat mutasi, dan data master dipegang server. Dengan begitu konflik sinkron hampir tidak mungkin terjadi, dan keluhan utama kompetitor (stok selisih, kasir beda dengan laporan) bisa dihindari dari desainnya.

| Kelompok | Tabel inti | Catatan |
| --- | --- | --- |
| Tenant & akses | tenant, outlet, device, staff, role, permission, audit\_log | Semua tabel bisnis punya tenant\_id + RLS |
| Katalog | category, product, variant, modifier\_group, modifier, unit\_conversion, channel\_price, tax\_rule | Versi per baris untuk sinkron |
| Transaksi | sale, sale\_line, payment, refund, sale\_number\_seq (per perangkat) | Hanya ditambah. Void/refund = baris baru yang merujuk nota asal |
| Kas | shift, cash\_movement | Rekap shift dihitung dari transaksi dan kas |
| Stok | stock\_movement (ledger), stock\_level (cache), stock\_count, stock\_count\_line, purchase, purchase\_line, supplier | stock\_level dibangun ulang dari ledger kapan saja |
| Pelanggan | customer, customer\_consent, credit\_ledger (kasbon) | Saldo kasbon = jumlah ledger |
| Jasa | service\_order, service\_status\_log | Status mengirim pesan WA |
| Langganan | plan, plan\_feature, subscription, invoice, branding | Dikelola dari super admin |
| WhatsApp | wa\_session, wa\_message | Kredensial sesi terenkripsi |
| Sinkron | change\_log (per tenant), device\_cursor, inbox\_event | Cursor dan idempotensi |

**Alur sinkron:**

1. Setiap aksi di kasir ditulis ke SQLite lokal dan ke tabel outbox dengan ID UUIDv7 buatan perangkat, ID perangkat, dan waktu lokal.
2. **Push:** outbox dikirim per batch ke `POST /sync/push`. Server menolak ID yang sudah pernah diterima (idempoten), menerapkan semuanya dalam satu transaksi database, lalu mengembalikan tanda terima.
3. **Pull:** perangkat meminta `GET /sync/pull?cursor=` dan menerima perubahan master (produk, harga, karyawan, pengaturan, level stok) sejak cursor terakhir.
4. **Aturan konflik:** transaksi tidak bisa konflik karena hanya ditambah. Data master dimenangkan versi server (last-writer-wins berdasarkan versi server). Stok tidak pernah ditimpa: penjualan offline cukup menambah mutasi.
5. **Stok opname:** saat barang dihitung, sistem mencatat stok sistem pada detik itu. Penyesuaian = fisik − stok saat hitung, jadi penjualan selama proses hitung tetap benar.
6. **Status di layar:** jumlah yang menunggu dikirim, waktu sinkron terakhir, error dengan tombol kirim ulang. Percobaan ulang memakai backoff eksponensial.
7. **Rekonsiliasi malam:** server mencocokkan penjualan, pembayaran, dan mutasi stok per outlet. Ketidakcocokan dilaporkan ke pemilik dan tim internal lengkap dengan nomor notanya.

## 9. Roadmap

MVP dikerjakan dalam 9 sprint dua mingguan mulai 23 November 2026, beta tertutup akhir Maret 2027, dan rilis publik 19 April 2027. Jadwal ini mengasumsikan tim 5 developer (2 backend Go, 1 Flutter, 1 web, 1 fullstack/platform) plus 1 orang produk/desain/QA. Kalau tim lebih kecil, rilis mundur kira-kira proporsional.

&#91;embedded content: timeline MVP · 9 sprint, libur, beta, rilis\]

Libur akhir tahun dan cuti Lebaran sudah dihitung. Kalau satu sprint mundur, tanggal beta dan rilis ikut mundur dua minggu.

1. **S0 · 23 Nov–4 Des 2026 · Fondasi:** monorepo, CI, staging, spesifikasi OpenAPI, design tokens, kerangka 4 aplikasi.
2. **S1 · 7–18 Des:** daftar + OTP, toko & outlet, pasang perangkat, karyawan + PIN, produk & kategori.
3. **Libur akhir tahun · 21 Des–1 Jan:** tidak ada sprint.
4. **S2 · 4–15 Jan 2027:** varian, topping, multi-satuan, harga kanal, database lokal + pull master, layar jualan + bayar tunai.
5. **S3 · 18–29 Jan:** outbox + push transaksi, status sinkron, QRIS statis, pembayaran lain, simpan pesanan, riwayat + refund/void, cetak struk, buka kasir, barcode, log audit, backup.
6. **S4 · 1–12 Feb:** ledger stok, stok masuk, **stok opname**, pelanggan & kasbon, diskon, pisah tagihan, tutup kasir.
7. **S5 · 15–26 Feb:** beranda & laporan web, ekspor, panduan pajak, hak akses, gateway WA (Baileys), pengaturan struk, rekonsiliasi malam.
8. **S6 · 1–19 Mar (dipotong cuti Lebaran, perkiraan 8–12 Mar):** modul jasa & retail dasar, langganan & penagihan, super admin (toko, paket, branding), onboarding + impor Excel.
9. **S7 · 22 Mar–2 Apr:** uji regresi, uji offline di lapangan, uji 5 printer, beta tertutup 20–30 toko.
10. **S8 · 5–16 Apr:** perbaikan dari beta, rilis Play Store, situs harga, kebijakan privasi & syarat layanan.
11. **Rilis publik MVP · Senin 19 Apr 2027.**

**Fase 2 (Mei–Agustus 2027):** denah meja, layar & printer dapur, mode pelayan, resep & HPP, promo & member/poin, multi-outlet & transfer stok, pembelian lengkap, QRIS dinamis, grosir bertingkat & label barcode, booking & komisi jasa, app pemilik (PWA), layar pelanggan. Paket Pro dan Bisnis dijual penuh.

**Fase 3 (September–Desember 2027):** integrasi GoFood/GrabFood (kalau kemitraan sudah disetujui), QR self-order, asisten AI lewat WA, toko online & marketplace, akuntansi & ekspor ke Jurnal/Accurate, API publik, iOS & Windows.

## 10. Tim dan cara kerja

Pekerjaan dibagi ke 5 jalur kerja yang masing-masing punya satu penanggung jawab, supaya anggota tim bisa jalan paralel tanpa saling tunggu. Kontrak API (OpenAPI) disepakati di awal sprint, jadi app, web, dan backend bisa mulai bersamaan memakai data contoh.

| Jalur kerja | Isi | Orang | Penanggung jawab |
| --- | --- | --- | --- |
| App kasir (Flutter) | Kasir tablet & HP, printer, scanner, database lokal, onboarding | 1–2 | \[isi nama\] |
| Backend inti & sinkron (Go) | Katalog, transaksi, stok, laporan, sync, rekonsiliasi | 1–2 | \[isi nama\] |
| Web (React) | Back office, super admin, situs harga | 1 | \[isi nama\] |
| Platform | Auth, tenant, langganan & penagihan, gateway WA, infra, backup | 1 | \[isi nama\] |
| Produk, desain & QA | Prioritas backlog, mockup, kamus istilah, uji aksesibilitas & regresi | 1 | \[isi nama\] |

**Peran tetap:** Product owner memutuskan scope dan urutan backlog. Tech lead menjaga arsitektur dan menulis ADR untuk keputusan besar.

**Aturan kerja:**

- **Branching:** trunk-based. `main` dilindungi. Branch pendek `feat/<ID>-slug` atau `fix/<ID>-slug`, PR wajib 1 reviewer, squash merge, pesan commit format Conventional Commits.
- **CI:** lint + tes + build per aplikasi (filter path), deploy otomatis ke staging setelah merge. App kasir ke jalur Internal Testing Play Store per tag rilis.
- **Definition of Done:** kriteria terima terpenuhi; tes unit untuk logika bisnis (uang, stok, pajak); fitur kasir jalan offline; ukuran sentuh dan label aksesibilitas dicek; teks sesuai kamus istilah; sudah direview; sudah di staging; dokumen diperbarui.
- **Ritual:** sprint 2 minggu. Planning Senin pagi, standup 15 menit tiap hari (boleh tertulis di grup), demo + retro Jumat terakhir sprint.
- **Keputusan teknis:** tulis ADR singkat di `docs/adr/` (konteks, pilihan, keputusan, konsekuensi).

**Yang perlu disiapkan sebelum S0:**

- [ ] Organisasi GitHub + repo monorepo + GitHub Projects (board dan milestone per sprint)
- [ ] Grup komunikasi tim dan kanal untuk notifikasi CI/Sentry
- [ ] Password manager bersama (contoh Bitwarden) untuk kredensial server dan API
- [ ] Domain + VPS staging di Indonesia
- [ ] Akun Google Play Console
- [ ] Akun sandbox payment gateway (Xendit atau Midtrans)
- [ ] Akun Sentry (tier gratis cukup di awal)
- [ ] 2–3 SIM khusus untuk nomor WA platform (OTP dan notifikasi)
- [ ] Perangkat uji: tablet Android murah, HP Android RAM 2–3 GB, printer Bluetooth 58 mm, printer 80 mm, barcode scanner, laci kasir
- [ ] Badan usaha, NIB, pendaftaran PSE Komdigi, dan pendaftaran merek (jalan paralel, non-teknis)

## 11. Backlog MVP

MVP berisi 70 story dengan total ±303 poin (1 poin ≈ setengah hari kerja satu orang). Sprint S3, S5, dan S6 paling padat. Kalau velocity tim di bawah 45 poin per sprint, story P1 digeser ke sprint berikutnya, sedangkan P0 tidak boleh digeser. Prioritas: P0 = wajib untuk rilis, P1 = penting tapi bisa menyusul, P2 = nanti.

| ID | Story | Epic | Jalur | Sprint | Prioritas | Poin |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | Monorepo + CI lint/tes/build untuk semua aplikasi | EP01 Fondasi | Platform | S0 | P0 | 3 |
| F-02 | Staging: Docker Compose, Caddy, Postgres, Redis, object storage | EP01 Fondasi | Platform | S0 | P0 | 5 |
| F-03 | Spesifikasi OpenAPI awal + generator klien TS & Dart | EP01 Fondasi | Backend | S0 | P0 | 3 |
| F-04 | Design tokens (warna, tipografi, ukuran sentuh) untuk Flutter & Tailwind | EP01 Fondasi | Produk/QA | S0 | P0 | 3 |
| F-05 | Kerangka app kasir, web, dan situs | EP01 Fondasi | Kasir, Web | S0 | P0 | 5 |
| F-06 | Sentry + log terstruktur di semua aplikasi | EP01 Fondasi | Platform | S1 | P1 | 2 |
| F-07 | Backup harian + PITR + uji restore | EP01 Fondasi | Platform | S3 | P0 | 3 |
| A-01 | Daftar nomor HP + OTP WA, cadangan email | EP02 Akun | Platform | S1 | P0 | 5 |
| A-02 | Buat usaha + outlet + pilih template jenis usaha | EP02 Akun | Backend | S1 | P0 | 3 |
| A-03 | Pasang perangkat kasir dengan kode 6 digit | EP02 Akun | Backend, Kasir | S1 | P0 | 3 |
| A-04 | Karyawan + PIN, login PIN offline di kasir | EP02 Akun | Kasir, Backend | S1 | P0 | 5 |
| A-05 | Peran preset + hak akses per aksi | EP02 Akun | Backend, Web | S5 | P0 | 5 |
| A-06 | Log aktivitas untuk aksi sensitif | EP02 Akun | Backend | S3 | P0 | 3 |
| K-01 | Produk & kategori (web + HP) | EP03 Katalog | Backend, Web | S1 | P0 | 5 |
| K-02 | Varian 2 dimensi dengan harga & stok per kombinasi | EP03 Katalog | Backend, Web | S2 | P0 | 5 |
| K-03 | Grup topping wajib/opsional dengan batas min–maks | EP03 Katalog | Backend, Kasir | S2 | P0 | 5 |
| K-04 | Multi-satuan & konversi | EP03 Katalog | Backend, Kasir | S2 | P0 | 5 |
| K-05 | Harga per kanal (toko, GoFood, GrabFood, ShopeeFood) | EP03 Katalog | Backend, Kasir | S2 | P1 | 3 |
| K-06 | Impor produk Excel/CSV + laporan error per baris | EP03 Katalog | Backend, Web | S6 | P0 | 5 |
| K-07 | Barcode: scanner HID + kamera | EP03 Katalog | Kasir | S3 | P0 | 3 |
| S-01 | Database lokal drift + skema master | EP04 Sinkron | Kasir | S2 | P0 | 5 |
| S-02 | Pull perubahan master dengan cursor | EP04 Sinkron | Backend, Kasir | S2 | P0 | 5 |
| S-03 | Outbox + push transaksi idempoten | EP04 Sinkron | Backend, Kasir | S3 | P0 | 8 |
| S-04 | Status sinkron di layar + kirim ulang dengan backoff | EP04 Sinkron | Kasir | S3 | P0 | 3 |
| S-05 | Rekonsiliasi malam + notifikasi ke pemilik | EP04 Sinkron | Backend | S5 | P1 | 5 |
| C-01 | Layar jualan: kategori, grid, cari, keranjang, 3 ukuran teks | EP05 Kasir | Kasir | S2 | P0 | 8 |
| C-02 | Bayar tunai: uang cepat warna Rupiah + kembalian | EP05 Kasir | Kasir | S2 | P0 | 3 |
| C-03 | Mode simpel/lengkap + batalkan hapus item 5 detik | EP05 Kasir | Kasir | S2 | P1 | 2 |
| C-04 | QRIS statis merchant + konfirmasi manual | EP05 Kasir | Kasir, Backend | S3 | P0 | 3 |
| C-05 | Transfer, EDC, kasbon, pisah bayar | EP05 Kasir | Kasir | S3 | P0 | 5 |
| C-06 | Simpan pesanan + jenis pesanan | EP05 Kasir | Kasir | S3 | P0 | 5 |
| C-07 | Riwayat, cetak ulang, refund/void + PIN + alasan | EP05 Kasir | Kasir, Backend | S3 | P0 | 5 |
| C-08 | Diskon per item & total, pembulatan | EP05 Kasir | Kasir | S4 | P0 | 3 |
| C-09 | Pisah tagihan per item & bagi rata | EP05 Kasir | Kasir | S4 | P1 | 5 |
| H-01 | Cetak ESC/POS Bluetooth/USB 58 & 80 mm + antrean + sambung ulang | EP06 Struk | Kasir | S3 | P0 | 8 |
| H-02 | Laci kasir terbuka saat bayar tunai | EP06 Struk | Kasir | S3 | P1 | 1 |
| H-03 | Pengaturan struk (logo, footer, QR) + pratinjau | EP06 Struk | Web, Kasir | S5 | P1 | 3 |
| H-04 | Uji kompatibilitas 5 printer populer | EP06 Struk | Produk/QA | S7 | P0 | 3 |
| SH-01 | Buka kasir: modal per pecahan | EP07 Kas | Kasir | S3 | P0 | 3 |
| SH-02 | Kas masuk/keluar dengan alasan | EP07 Kas | Kasir | S3 | P0 | 2 |
| SH-03 | Tutup kasir: rekap, selisih + alasan, laporan WA | EP07 Kas | Kasir, Backend | S4 | P0 | 5 |
| ST-01 | Ledger mutasi stok dari penjualan, void, refund | EP08 Stok | Backend | S4 | P0 | 5 |
| ST-02 | Stok masuk dari supplier, tanggal mundur + audit | EP08 Stok | Backend, Web | S4 | P0 | 5 |
| ST-03 | Stok opname: sesi, hitung di HP, selisih + alasan, persetujuan | EP08 Stok | Backend, Kasir, Web | S4 | P0 | 8 |
| ST-04 | Peringatan stok menipis | EP08 Stok | Backend | S5 | P1 | 2 |
| P-01 | Pelanggan + persetujuan WA | EP09 Pelanggan | Backend, Kasir | S4 | P0 | 3 |
| P-02 | Kasbon: batas, jatuh tempo, catat bayar, pengingat | EP09 Pelanggan | Backend, Kasir, Web | S4 | P0 | 5 |
| L-01 | Beranda web: KPI, per jam, per kanal, terlaris, perlu perhatian | EP10 Laporan | Web, Backend | S5 | P0 | 5 |
| L-02 | Halaman laporan 6 tab + filter | EP10 Laporan | Web, Backend | S5 | P0 | 8 |
| L-03 | Ekspor Excel/CSV/PDF semua data | EP10 Laporan | Backend | S5 | P0 | 3 |
| L-04 | Status perangkat & sinkron di web | EP10 Laporan | Web | S5 | P1 | 2 |
| T-01 | Panduan pajak: PBJT per kota, service charge, PPN DPP 11/12 | EP11 Pajak | Backend, Web, Kasir | S5 | P0 | 5 |
| W-01 | Gateway Node + Baileys: sesi per toko via QR, kredensial terenkripsi | EP12 WhatsApp | Platform | S5 | P0 | 8 |
| W-02 | Antrean pesan, batas harian, jeda acak, fallback tombol bagikan | EP12 WhatsApp | Platform, Kasir | S5 | P0 | 5 |
| W-03 | Template: OTP, struk, laporan harian, tutup kasir, kasbon, jasa siap | EP12 WhatsApp | Platform | S5 | P0 | 5 |
| W-04 | Monitoring sesi putus + notifikasi ke pemilik | EP12 WhatsApp | Platform | S6 | P1 | 3 |
| J-01 | Layanan per kg/jam/paket + estimasi selesai | EP13 Jasa & retail | Kasir, Backend | S6 | P0 | 3 |
| J-02 | Papan status pengerjaan + WA "siap diambil" | EP13 Jasa & retail | Kasir, Backend | S6 | P0 | 5 |
| R-01 | Kasir mode retail: scan cepat, tabel keranjang, pilih satuan | EP13 Jasa & retail | Kasir | S6 | P0 | 5 |
| B-01 | Paket, batas, flag fitur (server + cache 7 hari di perangkat) | EP14 Langganan & admin | Platform | S6 | P0 | 5 |
| B-02 | Penagihan bulanan via payment gateway, trial 30 hari, tenggang 7 hari | EP14 Langganan & admin | Platform | S6 | P0 | 8 |
| B-03 | Halaman langganan merchant | EP14 Langganan & admin | Web | S6 | P0 | 3 |
| B-04 | Super admin: daftar toko + ringkasan MRR/churn | EP14 Langganan & admin | Web, Backend | S6 | P0 | 5 |
| B-05 | Super admin: editor paket & harga | EP14 Langganan & admin | Web, Backend | S6 | P1 | 3 |
| B-06 | Super admin: branding diterapkan ke semua aplikasi | EP14 Langganan & admin | Web, Kasir, Backend | S6 | P0 | 5 |
| O-01 | Onboarding 4 langkah di HP | EP15 Onboarding | Kasir | S6 | P0 | 5 |
| O-02 | Contoh menu per jenis usaha | EP15 Onboarding | Produk/QA | S6 | P1 | 2 |
| RL-01 | Uji regresi + uji offline di lapangan | EP16 Rilis | Produk/QA | S7 | P0 | 5 |
| RL-02 | Beta tertutup 20–30 toko + saluran masukan | EP16 Rilis | Produk/QA | S7 | P0 | 3 |
| RL-03 | Rilis Play Store + situs harga + kebijakan privasi & syarat | EP16 Rilis | Web, Kasir | S8 | P0 | 5 |

**Epic Fase 2 (dirinci jadi story sebelum Mei 2027):** EP20 Denah meja & open bill visual · EP21 Layar & printer dapur · EP22 Mode pelayan · EP23 Resep & HPP · EP24 Promo, member & poin · EP25 Multi-outlet & transfer stok · EP26 Pembelian & supplier lengkap · EP27 QRIS dinamis · EP28 Grosir bertingkat & label barcode · EP29 Booking & komisi jasa · EP30 App pemilik (PWA) · EP31 Layar pelanggan.

**Epic Fase 3:** EP40 Integrasi GoFood/GrabFood · EP41 QR self-order · EP42 Asisten AI lewat WA · EP43 Toko online & marketplace · EP44 Akuntansi & ekspor Jurnal/Accurate · EP45 API publik · EP46 iOS & Windows.

## 12. Progres

Tabel ini adalah ringkasan per milestone dan diperbarui setiap demo Jumat akhir sprint. Tugas harian dilacak di GitHub Projects, bukan di dokumen ini.

| Milestone | Target | Isi | Status | PIC |
| --- | --- | --- | --- | --- |
| M0 · Fondasi siap | Dec 4, 2026 | Repo, CI, staging, OpenAPI, kerangka aplikasi | Belum mulai | \[isi\] |
| M1 · Akun & katalog | Dec 18, 2026 | Daftar + OTP, PIN, pasang perangkat, produk & kategori | Belum mulai | \[isi\] |
| M2 · Jualan offline end-to-end | Jan 29, 2027 | Jualan, bayar, struk, sinkron, buka kasir, refund | Belum mulai | \[isi\] |
| M3 · Stok, kasbon, tutup kasir | Feb 12, 2027 | Ledger stok, stok masuk, stok opname, kasbon, diskon | Belum mulai | \[isi\] |
| M4 · Laporan, pajak, WhatsApp | Feb 26, 2027 | Beranda & laporan web, pajak, hak akses, gateway Baileys | Belum mulai | \[isi\] |
| M5 · Langganan, admin, onboarding | Mar 19, 2027 | Penagihan, super admin, branding, jasa & retail dasar | Belum mulai | \[isi\] |
| M6 · Beta tertutup | Apr 2, 2027 | 20–30 toko, uji offline lapangan, uji printer | Belum mulai | \[isi\] |
| M7 · Rilis publik MVP | Apr 19, 2027 | Play Store, situs harga, kebijakan privasi & syarat | Belum mulai | \[isi\] |

**Cara melacak tugas:**

- **GitHub Projects** dengan kolom Backlog → Siap dikerjakan → Dikerjakan → Review → Selesai.
- **Label:** `epic:EP05`, `jalur:kasir`, `prioritas:P0`, `fase:1`. **Milestone GitHub** = sprint (S0–S8) dengan tanggal selesai sama seperti roadmap.
- Backlog di bagian 11 sudah disiapkan sebagai `backlog/backlog.csv` dan skrip `scripts/setup_github.py` di folder proyek. Setelah repo dibuat, skrip itu membuat label, milestone, dan issue untuk 70 story sekaligus.
- Setiap issue memakai ID story (contoh `ST-03`) di judulnya, dan nama branch-nya ikut ID tersebut (`feat/ST-03-stok-opname`).
- Grafik burndown per sprint diambil dari Insights di GitHub Projects.

## 13. Risiko dan keputusan terbuka

Dua risiko terbesar adalah nomor WA diblokir (karena Baileys tidak resmi) dan sinkron offline yang membuat data tidak cocok. Keduanya punya mitigasi yang sudah masuk backlog MVP.

| Risiko | Dampak | Peluang | Mitigasi | Pemilik |
| --- | --- | --- | --- | --- |
| Nomor WA toko/platform diblokir karena Baileys | Tinggi | Sedang | Nomor milik toko sendiri, hanya pesan transaksional, batas harian + jeda acak, fallback tombol bagikan, OTP cadangan email, lapisan provider supaya bisa pindah ke Cloud API | Platform |
| Baileys rusak karena protokol WhatsApp berubah | Sedang | Sedang | Kunci versi, pantau rilis upstream, uji harian otomatis, fallback tombol bagikan | Platform |
| Paket npm berbahaya mencuri sesi WA | Tinggi | Rendah | Tanpa paket "anti-ban" pihak ketiga, lockfile + audit dependensi, gateway terisolasi | Platform |
| Sinkron offline membuat stok atau laporan tidak cocok | Tinggi | Sedang | Ledger stok, push idempoten, transaksi hanya ditambah, rekonsiliasi malam, uji offline lapangan | Backend |
| Printer Bluetooth beragam dan sering putus | Sedang | Tinggi | Daftar printer teruji, antrean cetak, sambung ulang otomatis, uji 5 model | Kasir |
| Scope melebar karena semua segmen | Tinggi | Tinggi | Satu inti + modul, MVP terbatas, flag fitur, PO menjaga backlog | Produk |
| Kemitraan GoBiz/Grab/PJP lama atau ditolak | Sedang | Sedang | Ajukan sejak S0, MVP pakai input ojol manual dan QRIS statis | Produk |
| Regulasi: PSE belum terdaftar, pelanggaran UU PDP | Tinggi | Rendah | Daftar PSE sebelum rilis, persetujuan WA, server di Indonesia, prosedur kebocoran | Produk |
| Kompetitor gratis menekan harga | Sedang | Sedang | Unggul di kemudahan, keandalan, dan WA tanpa biaya tambahan | Produk |
| Tim kecil, satu orang jadi titik lemah | Sedang | Sedang | Review kode wajib, ADR, dokumentasi, pairing di bagian sinkron | Tech lead |

**Keputusan yang masih terbuka:**

- [ ] Komposisi tim, nama penanggung jawab tiap jalur kerja, dan target rilis final (jadwal saat ini mengasumsikan 5 developer)
- [ ] Payment gateway: Xendit atau Midtrans, termasuk tarif QRIS setelah aturan MDR 0% 1 Oktober 2026
- [ ] Hosting: VPS lokal (lebih murah) atau AWS/GCP region Jakarta (lebih mudah diskalakan)
- [ ] Nama produk dan logo final, lalu pendaftaran merek ke DJKI
- [ ] Jam layanan bantuan dan kanalnya (chat WA, telepon, jam kerja)
- [ ] Validasi harga paket ke 10–20 calon pelanggan sebelum rilis
- [ ] Seberapa dalam fitur chain/central kitchen ala ESB (di luar roadmap saat ini)

## 14. Lampiran

**Tautan kerja:**

- [Riset POS Indonesia (revisi 2)](https://claude.ai/artifact/4fyMTq2SCVG8c9ychP9eAh): kompetitor, harga, ulasan Play Store, QRIS, ojol, Baileys, legal, biaya.
- [Mockup POS Kita](https://claude.ai/artifact/WgWf38bWpEs41JdifDu4on): 42 layar di 6 halaman (kasir tablet, HP, web, super admin, layar & struk, situs & sistem desain).
- Folder proyek: `riset/`, `mockup/project/` (sumber mockup), `backlog/backlog.csv`, `scripts/setup_github.py`.

**Kamus istilah (dipakai di semua layar):**

| Pakai | Hindari | Arti |
| --- | --- | --- |
| Uang diterima | Cash tendered | Uang yang diberikan pelanggan |
| Kembalian | Change | Uang yang dikembalikan |
| Simpan pesanan | Hold, Save order | Pesanan belum dibayar, disimpan dulu |
| Batalkan transaksi | Void | Membatalkan nota yang sudah dibayar |
| Kembalikan uang | Refund | Mengembalikan uang untuk sebagian/seluruh item |
| Pindah meja | Move to table | Memindahkan pesanan ke meja lain |
| Kirim ke dapur | Checker | Mengirim pesanan ke dapur/bar |
| Buka kasir / Tutup kasir | Open/close shift, Settlement | Awal dan akhir shift dengan hitung uang laci |
| Kasbon | Piutang, AR | Pembelian yang dibayar nanti oleh pelanggan |
| Stok opname | Stock take | Menghitung stok fisik lalu menyesuaikan sistem |

**Sumber regulasi & teknis yang dirujuk:**

- [Katadata: perluasan MDR QRIS 0% mulai 1 Oktober 2026](https://katadata.co.id/foto/6a882ffd488a8/foto-bi-perluas-mdr-qris-0-mulai-oktober-2026)
- [Ortax: PBJT makanan dan minuman](https://ortax.org/pbjt-makanan-minuman)
- [DJP: DPP nilai lain PPN](https://www.pajak.go.id/sites/default/files/2025-02/SP-4%20PEMERINTAH%20TERBITKAN%20ATURAN%20DPP%20NILAI%20LAIN%20DAN%20BESARAN%20TERTENTU%20PPN.pdf)
- [Bisnis: Komdigi menegakkan pendaftaran PSE](https://teknologi.bisnis.com/read/20260928/101/2007757/komdigi-beri-tenggat-1-oktober-7-pse-belum-terdaftar-terancam-kena-teguran)
- [SIP Law: PP 33/2026 pelaksanaan UU PDP](https://siplawfirm.id/resources/pp-33-2026-pelindungan-data-pribadi)
- [apis.io: GoBiz Partner Integration API](https://apis.io/providers/gojek/)
- [Midtrans: biaya QRIS](https://docs.midtrans.com/docs/what-is-the-applicable-transaction-fee-for-qris)
- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/)
