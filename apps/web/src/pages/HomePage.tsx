import { Link } from "@tanstack/react-router";
import { formatRupiah } from "../lib/format";

const kpis = [
  { label: "Penjualan hari ini", value: formatRupiah(0) },
  { label: "Transaksi", value: "0" },
  { label: "Rata-rata per transaksi", value: formatRupiah(0) },
  { label: "Kasbon belum lunas", value: formatRupiah(0) },
];

const steps = [
  { label: "Tambah produk pertama", to: "/produk" },
  { label: "Pasang perangkat kasir", to: "/pengaturan" },
  { label: "Undang karyawan", to: "/karyawan" },
] as const;

export function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold">Beranda</h1>

      <section aria-label="Ringkasan hari ini" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-line bg-surface p-5">
            <p className="text-ink-muted">{k.label}</p>
            <p className="tabular mt-1 text-3xl font-extrabold">{k.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-line bg-surface p-5">
        <h2 className="text-xl font-bold">Langkah memulai</h2>
        <ol className="mt-3 flex flex-col gap-2">
          {steps.map((s, i) => (
            <li key={s.label}>
              <Link
                to={s.to}
                className="flex h-touch-min items-center gap-3 rounded-md px-3 font-semibold hover:bg-brand-soft"
              >
                <span className="flex size-8 items-center justify-center rounded-pill bg-brand-soft font-bold text-brand-strong">
                  {i + 1}
                </span>
                {s.label}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
