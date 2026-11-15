import { describe, expect, it } from "vitest";
import { normalizePhone, shareLink, toJid } from "../src/phone.js";
import { DailyLimiter, jakartaDate, jitterDelay } from "../src/rate-limit.js";

describe("normalizePhone", () => {
  it.each([
    ["081234567890", "6281234567890"],
    ["+62 812-3456-7890", "6281234567890"],
    ["6281234567890", "6281234567890"],
    ["81234567890", "6281234567890"],
  ])("%s → %s", (input, want) => {
    expect(normalizePhone(input)).toBe(want);
  });

  it.each(["", "0212345678", "12345", "08abc", "6221234567"])("menolak %s", (input) => {
    expect(normalizePhone(input)).toBeNull();
  });

  it("membuat JID dan tautan wa.me", () => {
    expect(toJid("6281234567890")).toBe("6281234567890@s.whatsapp.net");
    expect(shareLink("6281234567890", "Struk #12 Rp18.000")).toBe(
      "https://wa.me/6281234567890?text=Struk%20%2312%20Rp18.000",
    );
  });
});

describe("DailyLimiter", () => {
  it("menolak setelah kuota habis dan reset di hari berikutnya (WIB)", () => {
    let now = new Date("2026-11-23T10:00:00+07:00");
    const limiter = new DailyLimiter(2, () => now);

    expect(limiter.take("toko-a")).toBe(true);
    expect(limiter.take("toko-a")).toBe(true);
    expect(limiter.take("toko-a")).toBe(false);
    expect(limiter.remaining("toko-a")).toBe(0);
    expect(limiter.take("toko-b")).toBe(true);

    now = new Date("2026-11-24T00:01:00+07:00");
    expect(limiter.remaining("toko-a")).toBe(2);
    expect(limiter.take("toko-a")).toBe(true);
  });

  it("memakai tanggal WIB, bukan UTC", () => {
    // 23.30 UTC tanggal 23 = 06.30 WIB tanggal 24
    expect(jakartaDate(new Date("2026-11-23T23:30:00Z"))).toBe("2026-11-24");
  });
});

describe("jitterDelay", () => {
  it("selalu di antara min dan max", () => {
    expect(jitterDelay(1000, 3000, () => 0)).toBe(1000);
    expect(jitterDelay(1000, 3000, () => 0.999999)).toBe(3000);
    expect(jitterDelay(1000, 3000, () => 0.5)).toBe(2000);
  });
});
