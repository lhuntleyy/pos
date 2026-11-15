import { join } from "node:path";
import makeWASocket, { Browsers, DisconnectReason, type WASocket } from "baileys";
import type { Logger } from "pino";
import { toJid } from "../phone.js";
import type { ConnectResult, SendResult, SessionStatus, WhatsAppProvider } from "../provider.js";
import { useEncryptedAuthState } from "./encrypted-auth-state.js";

interface Session {
  status: SessionStatus;
  sock?: WASocket;
  clear?: () => Promise<void>;
  reconnectTimer?: NodeJS.Timeout;
}

export interface BaileysOptions {
  sessionDir: string;
  sessionKey: Buffer;
  logger: Logger;
}

const STORE_ID = /^[A-Za-z0-9_-]{1,64}$/;

/**
 * Provider Baileys. Setiap toko memakai nomor WhatsApp miliknya sendiri yang ditautkan lewat QR.
 * Hanya untuk pesan transaksional (struk, OTP, laporan, pengingat), bukan broadcast.
 */
export class BaileysProvider implements WhatsAppProvider {
  readonly name = "baileys";
  private readonly sessions = new Map<string, Session>();

  constructor(private readonly opts: BaileysOptions) {}

  status(storeId: string): SessionStatus {
    return this.sessions.get(storeId)?.status ?? "disconnected";
  }

  async connect(storeId: string): Promise<ConnectResult> {
    if (!STORE_ID.test(storeId)) throw new Error("storeId tidak valid");
    const existing = this.sessions.get(storeId);
    if (existing?.status === "connected") return { status: "connected" };
    return this.start(storeId);
  }

  private async start(storeId: string): Promise<ConnectResult> {
    const log = this.opts.logger.child({ storeId });
    const auth = await useEncryptedAuthState(join(this.opts.sessionDir, storeId), this.opts.sessionKey);

    const session: Session = this.sessions.get(storeId) ?? { status: "connecting" };
    session.status = "connecting";
    session.clear = auth.clear;
    this.sessions.set(storeId, session);

    const sock = makeWASocket({
      auth: auth.state,
      browser: Browsers.ubuntu("POS Kita"),
      logger: log.child({ lib: "baileys" }),
      markOnlineOnConnect: false,
      syncFullHistory: false,
    });
    session.sock = sock;
    sock.ev.on("creds.update", auth.saveCreds);

    return new Promise<ConnectResult>((resolve) => {
      let settled = false;
      const settle = (result: ConnectResult) => {
        if (!settled) {
          settled = true;
          resolve(result);
        }
      };

      sock.ev.on("connection.update", (update) => {
        if (update.qr) {
          session.status = "waiting_qr";
          settle({ status: "waiting_qr", qr: update.qr });
        }
        if (update.connection === "open") {
          session.status = "connected";
          log.info("WhatsApp tersambung");
          settle({ status: "connected" });
        }
        if (update.connection === "close") {
          const code = (update.lastDisconnect?.error as { output?: { statusCode?: number } } | undefined)?.output
            ?.statusCode;
          if (code === DisconnectReason.loggedOut) {
            session.status = "logged_out";
            log.warn("WhatsApp dikeluarkan dari HP pemilik; hapus sesi");
            void auth.clear();
            settle({ status: "logged_out" });
            return;
          }
          session.status = "connecting";
          log.warn({ code }, "Koneksi WhatsApp putus, menyambung ulang");
          clearTimeout(session.reconnectTimer);
          session.reconnectTimer = setTimeout(() => {
            void this.start(storeId).catch((err) => log.error({ err }, "Gagal menyambung ulang"));
          }, 5_000);
          settle({ status: "connecting" });
        }
      });
    });
  }

  async sendText(storeId: string, to: string, text: string): Promise<SendResult> {
    const session = this.sessions.get(storeId);
    if (!session?.sock || session.status !== "connected") {
      throw new Error("Sesi WhatsApp toko belum tersambung");
    }
    const msg = await session.sock.sendMessage(toJid(to), { text });
    return { messageId: msg?.key.id ?? "" };
  }

  async logout(storeId: string): Promise<void> {
    const session = this.sessions.get(storeId);
    if (!session) return;
    clearTimeout(session.reconnectTimer);
    await session.sock?.logout().catch(() => undefined);
    await session.clear?.();
    session.status = "logged_out";
    session.sock = undefined;
  }

  async close(): Promise<void> {
    for (const session of this.sessions.values()) {
      clearTimeout(session.reconnectTimer);
      session.sock?.end(undefined);
    }
    this.sessions.clear();
  }
}
