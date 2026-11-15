export interface Config {
  port: number;
  /** Rahasia bersama dengan API. Dikirim di header X-Gateway-Secret. */
  gatewaySecret: string;
  /** Kunci AES-256 (base64, 32 byte) untuk mengenkripsi kredensial sesi WhatsApp. */
  sessionKey: Buffer;
  sessionDir: string;
  /** Batas pesan per nomor toko per hari (ADR-0005). */
  dailyLimit: number;
  /** Jeda acak antar pesan, dalam milidetik. */
  minDelayMs: number;
  maxDelayMs: number;
  provider: "baileys" | "fake";
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const provider = env.WA_PROVIDER ?? "fake";
  if (provider !== "baileys" && provider !== "fake") {
    throw new Error("WA_PROVIDER harus baileys atau fake");
  }

  const gatewaySecret = env.GATEWAY_SECRET ?? "";
  if (gatewaySecret.length < 24) {
    throw new Error("GATEWAY_SECRET wajib diisi, minimal 24 karakter");
  }

  const sessionKey = Buffer.from(env.SESSION_ENCRYPTION_KEY ?? "", "base64");
  if (sessionKey.length !== 32) {
    throw new Error(
      "SESSION_ENCRYPTION_KEY wajib berisi 32 byte base64. Buat dengan: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"",
    );
  }

  const minDelayMs = toInt(env.MIN_DELAY_MS, 1500);
  const maxDelayMs = toInt(env.MAX_DELAY_MS, 4000);
  if (maxDelayMs < minDelayMs) throw new Error("MAX_DELAY_MS harus >= MIN_DELAY_MS");

  return {
    port: toInt(env.PORT, 8090),
    gatewaySecret,
    sessionKey,
    sessionDir: env.SESSION_DIR ?? ".sessions",
    dailyLimit: toInt(env.DAILY_LIMIT, 300),
    minDelayMs,
    maxDelayMs,
    provider,
  };
}

function toInt(value: string | undefined, fallback: number): number {
  if (value === undefined || value === "") return fallback;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) throw new Error(`Angka tidak valid: ${value}`);
  return n;
}
