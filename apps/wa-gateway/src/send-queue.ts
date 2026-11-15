import type { SendResult, WhatsAppProvider } from "./provider.js";
import type { DailyLimiter } from "./rate-limit.js";

export type EnqueueResult =
  | { accepted: true; remainingToday: number; done: Promise<SendResult> }
  | { accepted: false; reason: "not_connected" | "daily_limit" };

/**
 * Antrean kirim per toko: satu pesan dalam satu waktu, dengan jeda acak di antaranya,
 * dan kuota harian. Disimpan di memori untuk sekarang; pindah ke Redis (asynq/BullMQ) di W-02.
 */
export class SendQueue {
  private readonly chains = new Map<string, Promise<unknown>>();

  constructor(
    private readonly provider: WhatsAppProvider,
    private readonly limiter: DailyLimiter,
    private readonly nextDelayMs: () => number,
    private readonly sleep: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
  ) {}

  enqueue(storeId: string, to: string, text: string): EnqueueResult {
    if (this.provider.status(storeId) !== "connected") return { accepted: false, reason: "not_connected" };
    if (!this.limiter.take(storeId)) return { accepted: false, reason: "daily_limit" };

    const prev = this.chains.get(storeId) ?? Promise.resolve();
    const done = prev
      .catch(() => undefined)
      .then(() => this.sleep(this.nextDelayMs()))
      .then(() => this.provider.sendText(storeId, to, text));
    this.chains.set(
      storeId,
      done.catch(() => undefined),
    );
    return { accepted: true, remainingToday: this.limiter.remaining(storeId), done };
  }
}
