import { mkdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  type AuthenticationCreds,
  type AuthenticationState,
  BufferJSON,
  initAuthCreds,
  proto,
  type SignalDataTypeMap,
} from "baileys";
import { decrypt, encrypt } from "../crypto.js";

/**
 * Penyimpanan sesi Baileys yang dienkripsi AES-256-GCM (ADR-0005).
 * Pola sama dengan useMultiFileAuthState bawaan Baileys, tapi setiap file dienkripsi.
 * Nanti bisa diganti ke PostgreSQL/Redis dengan mengganti read/write/remove.
 */
export async function useEncryptedAuthState(folder: string, key: Buffer) {
  await mkdir(folder, { recursive: true });
  const locks = new Map<string, Promise<unknown>>();

  /** Antrekan operasi per file supaya tulis-baca tidak bertabrakan. */
  function withLock<T>(file: string, fn: () => Promise<T>): Promise<T> {
    const prev = locks.get(file) ?? Promise.resolve();
    const next = prev.then(fn, fn);
    locks.set(
      file,
      next.catch(() => undefined),
    );
    return next;
  }

  const pathOf = (file: string) => join(folder, `${file.replace(/\//g, "__").replace(/:/g, "-")}.enc`);

  const writeData = (data: unknown, file: string) =>
    withLock(file, async () => {
      const json = Buffer.from(JSON.stringify(data, BufferJSON.replacer), "utf8");
      await writeFile(pathOf(file), encrypt(key, json), { mode: 0o600 });
    });

  const readData = (file: string) =>
    withLock(file, async () => {
      try {
        const raw = await readFile(pathOf(file));
        return JSON.parse(decrypt(key, raw).toString("utf8"), BufferJSON.reviver);
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw err;
      }
    });

  const removeData = (file: string) =>
    withLock(file, async () => {
      await unlink(pathOf(file)).catch(() => undefined);
    });

  const creds: AuthenticationCreds = (await readData("creds")) ?? initAuthCreds();

  const state: AuthenticationState = {
    creds,
    keys: {
      get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
        const data: { [id: string]: SignalDataTypeMap[T] } = {};
        await Promise.all(
          ids.map(async (id) => {
            let value = await readData(`${type}-${id}`);
            if (type === "app-state-sync-key" && value) {
              value = proto.Message.AppStateSyncKeyData.fromObject(value);
            }
            data[id] = value;
          }),
        );
        return data;
      },
      set: async (data) => {
        const tasks: Promise<void>[] = [];
        for (const category of Object.keys(data) as (keyof SignalDataTypeMap)[]) {
          const entries = data[category] ?? {};
          for (const id of Object.keys(entries)) {
            const value = entries[id];
            const file = `${category}-${id}`;
            tasks.push(value ? writeData(value, file) : removeData(file));
          }
        }
        await Promise.all(tasks);
      },
    },
  };

  return {
    state,
    saveCreds: () => writeData(creds, "creds"),
    /** Hapus semua data sesi (dipakai saat toko memutus WhatsApp). */
    clear: () => rm(folder, { recursive: true, force: true }),
  };
}
