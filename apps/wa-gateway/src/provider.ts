/**
 * Semua kode memanggil antarmuka ini, bukan Baileys langsung (ADR-0005),
 * supaya bisa pindah ke WhatsApp Cloud API tanpa mengubah API utama.
 */
export type SessionStatus = "disconnected" | "waiting_qr" | "connecting" | "connected" | "logged_out";

export interface ConnectResult {
  status: SessionStatus;
  /** Isi QR (teks) yang harus di-scan pemilik toko dari WhatsApp > Perangkat tertaut. */
  qr?: string;
}

export interface SendResult {
  messageId: string;
}

export interface WhatsAppProvider {
  readonly name: string;
  connect(storeId: string): Promise<ConnectResult>;
  status(storeId: string): SessionStatus;
  /** to = nomor format 62xxx. */
  sendText(storeId: string, to: string, text: string): Promise<SendResult>;
  logout(storeId: string): Promise<void>;
  close(): Promise<void>;
}
