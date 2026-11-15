import { timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { Logger } from "pino";
import QRCode from "qrcode";
import { normalizePhone, shareLink } from "./phone.js";
import type { WhatsAppProvider } from "./provider.js";
import type { DailyLimiter } from "./rate-limit.js";
import type { SendQueue } from "./send-queue.js";

export interface ServerDeps {
  provider: WhatsAppProvider;
  queue: SendQueue;
  limiter: DailyLimiter;
  gatewaySecret: string;
  logger: Logger;
}

const MAX_BODY = 64 * 1024;
const MAX_TEXT = 4096;

class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    detail: string,
    readonly extra: Record<string, unknown> = {},
  ) {
    super(detail);
  }
}

/**
 * Server HTTP internal. Hanya API utama yang boleh memanggil (header X-Gateway-Secret),
 * dan port ini tidak boleh dibuka ke internet.
 */
export function createGatewayServer(deps: ServerDeps): Server {
  return createServer((req, res) => {
    handle(deps, req, res).catch((err: unknown) => {
      if (err instanceof HttpError) {
        sendJson(res, err.status, { code: err.code, detail: err.message, ...err.extra });
        return;
      }
      deps.logger.error({ err }, "error tak terduga");
      sendJson(res, 500, { code: "internal", detail: "Terjadi kesalahan di gateway WhatsApp." });
    });
  });
}

async function handle(deps: ServerDeps, req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const method = req.method ?? "GET";

  if (method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, { status: "ok", provider: deps.provider.name });
  }

  authorize(req, deps.gatewaySecret);

  const session = url.pathname.match(/^\/v1\/sessions\/([A-Za-z0-9_-]{1,64})(\/connect)?$/);
  if (session) {
    const storeId = session[1] as string;
    if (method === "POST" && session[2]) {
      const result = await deps.provider.connect(storeId);
      const qrImage = result.qr ? await QRCode.toDataURL(result.qr, { margin: 1, width: 320 }) : undefined;
      return sendJson(res, 200, { status: result.status, qr_image: qrImage });
    }
    if (method === "GET" && !session[2]) {
      return sendJson(res, 200, {
        status: deps.provider.status(storeId),
        remaining_today: deps.limiter.remaining(storeId),
      });
    }
    if (method === "DELETE" && !session[2]) {
      await deps.provider.logout(storeId);
      return sendJson(res, 200, { status: "logged_out" });
    }
  }

  if (method === "POST" && url.pathname === "/v1/messages") {
    const body = await readJson(req);
    const storeId = typeof body.store_id === "string" ? body.store_id : "";
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const to = normalizePhone(typeof body.to === "string" ? body.to : "");

    if (!/^[A-Za-z0-9_-]{1,64}$/.test(storeId)) throw new HttpError(400, "invalid_store", "store_id tidak valid.");
    if (!to) throw new HttpError(400, "invalid_phone", "Nomor HP harus nomor seluler Indonesia (08xx atau 628xx).");
    if (!text || text.length > MAX_TEXT) {
      throw new HttpError(400, "invalid_text", `Isi pesan wajib diisi, maksimal ${MAX_TEXT} karakter.`);
    }

    const result = deps.queue.enqueue(storeId, to, text);
    if (!result.accepted) {
      // Cadangan: kasir menampilkan tombol "Bagikan lewat WA" yang membuka tautan ini.
      const fallback = { fallback_url: shareLink(to, text) };
      if (result.reason === "daily_limit") {
        throw new HttpError(429, "daily_limit", "Batas pesan WhatsApp hari ini sudah habis.", fallback);
      }
      throw new HttpError(409, "not_connected", "WhatsApp toko belum tersambung.", fallback);
    }

    result.done.catch((err: unknown) => deps.logger.warn({ err, storeId }, "pesan gagal dikirim"));
    return sendJson(res, 202, { status: "queued", remaining_today: result.remainingToday });
  }

  throw new HttpError(404, "not_found", "Alamat tidak ada.");
}

function authorize(req: IncomingMessage, secret: string) {
  const given = Buffer.from(String(req.headers["x-gateway-secret"] ?? ""));
  const expected = Buffer.from(secret);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    throw new HttpError(401, "unauthorized", "Rahasia gateway salah.");
  }
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY) throw new HttpError(413, "too_large", "Body terlalu besar.");
    chunks.push(chunk as Buffer);
  }
  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
  } catch {
    // jatuh ke error di bawah
  }
  throw new HttpError(400, "invalid_json", "Body harus objek JSON.");
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}
