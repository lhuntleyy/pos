/**
 * Paket langganan. Harga ini bawaan; nanti diambil dari API karena bisa diubah di panel super admin (story B-05).
 * Uang dalam Rupiah bulat.
 */
export interface Plan {
  id: "gratis" | "basic" | "pro" | "bisnis";
  name: string;
  for: string;
  monthly: number;
  perOutlet: boolean;
  popular?: boolean;
  cta: string;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "gratis",
    name: "Gratis",
    for: "Warung dan usaha yang baru mulai",
    monthly: 0,
    perOutlet: false,
    cta: "Mulai gratis",
    features: ["1 outlet, 1 perangkat", "Transaksi tidak dibatasi", "Hingga 50 produk", "Laporan harian dasar"],
  },
  {
    id: "basic",
    name: "Basic",
    for: "Toko dan kedai dengan 1 outlet",
    monthly: 99_000,
    perOutlet: false,
    cta: "Pilih Basic",
    features: [
      "2 perangkat, 5 karyawan",
      "Produk tidak dibatasi + varian",
      "Stok opname dengan alasan selisih",
      "Laporan lengkap",
      "Ringkasan harian ke WhatsApp",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    for: "Kafe, resto, dan retail yang ramai",
    monthly: 199_000,
    perOutlet: true,
    popular: true,
    cta: "Coba Pro 30 hari gratis",
    features: [
      "4 perangkat, karyawan tidak dibatasi",
      "Meja, open bill, layar dapur",
      "Resep, bahan baku, HPP otomatis",
      "Promo, member, dan poin",
      "Shift, absensi, QR menu",
    ],
  },
  {
    id: "bisnis",
    name: "Bisnis",
    for: "Banyak outlet dan franchise",
    monthly: 399_000,
    perOutlet: true,
    cta: "Pilih Bisnis",
    features: [
      "Perangkat tidak dibatasi",
      "Transfer stok antar outlet",
      "Pembelian dan supplier",
      "Peran dan persetujuan berlapis",
      "Laporan gabungan semua outlet",
    ],
  },
];

/** Ada di semua paket, termasuk Gratis. */
export const includedInAll = [
  "Jalan tanpa internet",
  "Stok dan riwayat perubahan stok",
  "QRIS dan struk lewat WhatsApp",
  "Unduh semua data ke Excel kapan saja",
  "Ukuran teks besar dan mode simpel",
  "Update gratis, tanpa iklan",
];

export function formatRupiah(value: number): string {
  return `Rp${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
