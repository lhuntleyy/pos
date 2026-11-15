/** Tanggal (YYYY-MM-DD) menurut WIB, supaya kuota harian reset jam 00.00 WIB. */
export function jakartaDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(now);
}

/**
 * Kuota pesan harian per toko. Disimpan di memori untuk sekarang;
 * pindah ke Redis saat W-02 supaya tetap benar kalau gateway di-restart atau di-scale.
 */
export class DailyLimiter {
  private readonly counts = new Map<string, { day: string; count: number }>();

  constructor(
    private readonly limit: number,
    private readonly now: () => Date = () => new Date(),
  ) {}

  /** Ambil satu jatah. Mengembalikan false kalau kuota hari ini habis. */
  take(storeId: string): boolean {
    const entry = this.current(storeId);
    if (entry.count >= this.limit) return false;
    entry.count++;
    return true;
  }

  remaining(storeId: string): number {
    return Math.max(0, this.limit - this.current(storeId).count);
  }

  private current(storeId: string) {
    const day = jakartaDate(this.now());
    let entry = this.counts.get(storeId);
    if (!entry || entry.day !== day) {
      entry = { day, count: 0 };
      this.counts.set(storeId, entry);
    }
    return entry;
  }
}

/** Jeda acak antara min dan max (inklusif) supaya pola kirim tidak terlihat seperti robot. */
export function jitterDelay(minMs: number, maxMs: number, random: () => number = Math.random): number {
  return Math.round(minMs + random() * (maxMs - minMs));
}
