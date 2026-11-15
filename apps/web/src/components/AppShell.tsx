import { useQuery } from "@tanstack/react-query";
import { Link, Outlet } from "@tanstack/react-router";
import { api } from "../lib/api";
import { defaultBranding } from "../lib/branding";
import { StatusBadge } from "./StatusBadge";
import { TextSizeSwitch } from "./TextSizeSwitch";

const nav = [
  { to: "/", label: "Beranda" },
  { to: "/produk", label: "Produk" },
  { to: "/stok", label: "Stok" },
  { to: "/stok-opname", label: "Stok opname" },
  { to: "/laporan", label: "Laporan" },
  { to: "/karyawan", label: "Karyawan" },
  { to: "/pengaturan", label: "Pengaturan" },
] as const;

function ApiStatus() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data, error } = await api.GET("/health");
      if (error || !data) throw new Error("API tidak membalas");
      return data;
    },
    refetchInterval: 30_000,
    retry: false,
  });

  if (health.isPending) return <StatusBadge tone="neutral">Mengecek server…</StatusBadge>;
  if (health.isError) return <StatusBadge tone="danger">Server tidak terhubung</StatusBadge>;
  return <StatusBadge tone="success">Server terhubung · versi {health.data.version}</StatusBadge>;
}

export function AppShell() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col gap-2 border-r border-line bg-surface p-4 md:flex">
        <div className="flex items-center gap-3 px-2 py-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-brand text-xl font-extrabold text-on-brand">
            {defaultBranding.productName.charAt(0)}
          </span>
          <span className="text-lg font-extrabold">{defaultBranding.productName}</span>
        </div>
        <nav aria-label="Menu utama" className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="flex h-touch-min items-center rounded-md px-3 font-semibold text-ink hover:bg-brand-soft"
              activeProps={{ className: "bg-brand-soft text-brand-strong" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 md:px-8">
          <span className="font-bold">Kedai Kopi Senja · Outlet Pusat</span>
          <div className="flex flex-wrap items-center gap-3">
            <ApiStatus />
            <TextSizeSwitch />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
