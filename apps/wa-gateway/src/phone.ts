/**
 * Ubah nomor HP Indonesia ke format internasional tanpa plus: 081234567890 → 6281234567890.
 * Mengembalikan null kalau bukan nomor HP Indonesia yang masuk akal.
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;

  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;

  // Nomor seluler Indonesia: 62 8xx, total 10-15 digit.
  if (!/^628\d{7,12}$/.test(digits)) return null;
  return digits;
}

/** JID WhatsApp untuk nomor pribadi. */
export function toJid(phone: string): string {
  return `${phone}@s.whatsapp.net`;
}

/** Tautan wa.me untuk cadangan "Bagikan lewat WA" saat gateway tidak bisa mengirim. */
export function shareLink(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
