import { randomBytes } from "node:crypto";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { useEncryptedAuthState } from "../src/providers/encrypted-auth-state.js";

describe("useEncryptedAuthState", () => {
  let dir = "";
  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
  });

  it("menyimpan kredensial terenkripsi dan bisa dibaca ulang", async () => {
    dir = await mkdtemp(join(tmpdir(), "wa-sesi-"));
    const key = randomBytes(32);

    const first = await useEncryptedAuthState(dir, key);
    await first.saveCreds();
    await first.state.keys.set({ "pre-key": { "1": { public: Buffer.from("pub"), private: Buffer.from("priv") } } });

    const files = await readdir(dir);
    expect(files.sort()).toEqual(["creds.enc", "pre-key-1.enc"]);
    const raw = await readFile(join(dir, "creds.enc"));
    expect(raw.toString("utf8")).not.toContain("noiseKey");

    const second = await useEncryptedAuthState(dir, key);
    expect(Buffer.from(second.state.creds.noiseKey.public).equals(Buffer.from(first.state.creds.noiseKey.public))).toBe(
      true,
    );
    const keys = await second.state.keys.get("pre-key", ["1", "2"]);
    expect(Buffer.from(keys["1"]?.private ?? []).toString()).toBe("priv");
    expect(keys["2"]).toBeNull();
  });

  it("gagal membaca dengan kunci yang salah", async () => {
    dir = await mkdtemp(join(tmpdir(), "wa-sesi-"));
    const first = await useEncryptedAuthState(dir, randomBytes(32));
    await first.saveCreds();
    await expect(useEncryptedAuthState(dir, randomBytes(32))).rejects.toThrow();
  });
});
