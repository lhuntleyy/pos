import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const IV_BYTES = 12;
const TAG_BYTES = 16;

/**
 * Enkripsi AES-256-GCM. Hasil: iv (12) + tag (16) + ciphertext.
 * GCM juga mendeteksi kalau data diubah, jadi file sesi yang dirusak akan ditolak.
 */
export function encrypt(key: Buffer, plaintext: Buffer): Buffer {
  assertKey(key);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]);
}

export function decrypt(key: Buffer, data: Buffer): Buffer {
  assertKey(key);
  if (data.length < IV_BYTES + TAG_BYTES) throw new Error("Data terenkripsi terlalu pendek");
  const iv = data.subarray(0, IV_BYTES);
  const tag = data.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]);
}

function assertKey(key: Buffer) {
  if (key.length !== 32) throw new Error("Kunci AES-256 harus 32 byte");
}
