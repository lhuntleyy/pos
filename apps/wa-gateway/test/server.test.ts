import type { AddressInfo } from "node:net";
import { pino } from "pino";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FakeProvider } from "../src/providers/fake.js";
import { DailyLimiter } from "../src/rate-limit.js";
import { SendQueue } from "../src/send-queue.js";
import { createGatewayServer } from "../src/server.js";

const SECRET = "rahasia-gateway-untuk-tes-123";

describe("gateway server", () => {
  let provider: FakeProvider;
  let base: string;
  let close: () => Promise<void>;

  beforeEach(async () => {
    provider = new FakeProvider();
    const limiter = new DailyLimiter(2);
    const queue = new SendQueue(
      provider,
      limiter,
      () => 0,
      async () => {},
    );
    const server = createGatewayServer({
      provider,
      queue,
      limiter,
      gatewaySecret: SECRET,
      logger: pino({ level: "silent" }),
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    close = () => new Promise((resolve) => server.close(() => resolve()));
  });

  afterEach(async () => {
    await close();
  });

  const call = (path: string, init: RequestInit = {}, secret = SECRET) =>
    fetch(base + path, {
      ...init,
      headers: { "Content-Type": "application/json", "X-Gateway-Secret": secret, ...init.headers },
    });

  const send = (body: unknown) => call("/v1/messages", { method: "POST", body: JSON.stringify(body) });

  it("health tanpa rahasia", async () => {
    const res = await fetch(`${base}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", provider: "fake" });
  });

  it("menolak rahasia yang salah", async () => {
    const res = await call("/v1/sessions/toko-a", {}, "salah");
    expect(res.status).toBe(401);
  });

  it("belum tersambung → 409 dengan tautan cadangan wa.me", async () => {
    const res = await send({ store_id: "toko-a", to: "081234567890", text: "Struk" });
    expect(res.status).toBe(409);
    const body = (await res.json()) as { code: string; fallback_url: string };
    expect(body.code).toBe("not_connected");
    expect(body.fallback_url).toBe("https://wa.me/6281234567890?text=Struk");
  });

  it("mengirim setelah tersambung, lalu 429 saat kuota habis", async () => {
    await call("/v1/sessions/toko-a/connect", { method: "POST" });

    const first = await send({ store_id: "toko-a", to: "081234567890", text: "Struk 1" });
    expect(first.status).toBe(202);
    expect(await first.json()).toEqual({ status: "queued", remaining_today: 1 });

    expect((await send({ store_id: "toko-a", to: "081234567890", text: "Struk 2" })).status).toBe(202);

    const third = await send({ store_id: "toko-a", to: "081234567890", text: "Struk 3" });
    expect(third.status).toBe(429);

    await new Promise((r) => setTimeout(r, 10));
    expect(provider.sent.map((m) => m.text)).toEqual(["Struk 1", "Struk 2"]);
    expect(provider.sent[0]?.to).toBe("6281234567890");
  });

  it("memvalidasi nomor dan isi pesan", async () => {
    await call("/v1/sessions/toko-a/connect", { method: "POST" });
    expect((await send({ store_id: "toko-a", to: "021555", text: "x" })).status).toBe(400);
    expect((await send({ store_id: "toko-a", to: "081234567890", text: "" })).status).toBe(400);
    expect((await send({ store_id: "../etc", to: "081234567890", text: "x" })).status).toBe(400);
  });
});
