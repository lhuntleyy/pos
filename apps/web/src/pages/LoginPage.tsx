import { type FormEvent, useState } from "react";
import { api } from "../lib/api";

export function LoginPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const { data, error, response } = await api.POST("/v1/auth/otp/request", {
        body: { phone, channel: "whatsapp" },
      });
      if (data) {
        setMessage({ tone: "info", text: "Kode dikirim ke WhatsApp. Berlaku 5 menit." });
      } else if (response.status === 501) {
        setMessage({ tone: "info", text: "Masuk dengan OTP sedang dikerjakan di sprint 1 (story A-01)." });
      } else {
        setMessage({ tone: "error", text: error?.detail ?? "Kode belum bisa dikirim. Coba lagi sebentar." });
      }
    } catch {
      setMessage({ tone: "error", text: "Server tidak terhubung. Periksa internet lalu coba lagi." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-line bg-surface p-6"
      >
        <h1 className="text-2xl font-extrabold">Masuk</h1>
        <label className="flex flex-col gap-2 font-semibold">
          Nomor HP
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="0812 3456 7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="h-touch-category rounded-md border border-line px-4 text-lg font-normal"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="h-touch-primary rounded-lg bg-brand text-lg font-extrabold text-on-brand hover:bg-brand-strong disabled:opacity-60"
        >
          {busy ? "Mengirim…" : "Kirim kode lewat WhatsApp"}
        </button>
        {message && (
          <p role="alert" className={message.tone === "error" ? "text-danger" : "text-ink-muted"}>
            {message.text}
          </p>
        )}
      </form>
    </main>
  );
}
