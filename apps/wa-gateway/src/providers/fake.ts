import { randomUUID } from "node:crypto";
import type { ConnectResult, SendResult, SessionStatus, WhatsAppProvider } from "../provider.js";

export interface SentMessage {
  storeId: string;
  to: string;
  text: string;
  messageId: string;
}

/** Provider palsu untuk development dan tes: tidak menyentuh WhatsApp sama sekali. */
export class FakeProvider implements WhatsAppProvider {
  readonly name = "fake";
  readonly sent: SentMessage[] = [];
  private readonly sessions = new Map<string, SessionStatus>();

  async connect(storeId: string): Promise<ConnectResult> {
    this.sessions.set(storeId, "connected");
    return { status: "connected" };
  }

  status(storeId: string): SessionStatus {
    return this.sessions.get(storeId) ?? "disconnected";
  }

  async sendText(storeId: string, to: string, text: string): Promise<SendResult> {
    if (this.status(storeId) !== "connected") throw new Error("Sesi WhatsApp toko belum tersambung");
    const messageId = randomUUID();
    this.sent.push({ storeId, to, text, messageId });
    return { messageId };
  }

  async logout(storeId: string): Promise<void> {
    this.sessions.set(storeId, "logged_out");
  }

  async close(): Promise<void> {}
}
