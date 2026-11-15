import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { decrypt, encrypt } from "../src/crypto.js";

describe("crypto", () => {
  const key = randomBytes(32);

  it("enkripsi lalu dekripsi kembali ke data asal", () => {
    const data = Buffer.from('{"creds":"rahasia"}');
    expect(decrypt(key, encrypt(key, data)).equals(data)).toBe(true);
  });

  it("hasil enkripsi berbeda setiap kali (IV acak)", () => {
    const data = Buffer.from("sama");
    expect(encrypt(key, data).equals(encrypt(key, data))).toBe(false);
  });

  it("menolak data yang diubah", () => {
    const sealed = encrypt(key, Buffer.from("struk"));
    sealed[sealed.length - 1] = (sealed[sealed.length - 1] ?? 0) ^ 1;
    expect(() => decrypt(key, sealed)).toThrow();
  });

  it("menolak kunci yang salah", () => {
    const sealed = encrypt(key, Buffer.from("struk"));
    expect(() => decrypt(randomBytes(32), sealed)).toThrow();
  });

  it("menolak kunci yang bukan 32 byte", () => {
    expect(() => encrypt(randomBytes(16), Buffer.from("x"))).toThrow(/32 byte/);
  });
});
