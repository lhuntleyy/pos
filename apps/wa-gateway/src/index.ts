import { pino } from "pino";
import { loadConfig } from "./config.js";
import type { WhatsAppProvider } from "./provider.js";
import { BaileysProvider } from "./providers/baileys.js";
import { FakeProvider } from "./providers/fake.js";
import { DailyLimiter, jitterDelay } from "./rate-limit.js";
import { SendQueue } from "./send-queue.js";
import { createGatewayServer } from "./server.js";

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
const config = loadConfig();

const provider: WhatsAppProvider =
  config.provider === "baileys"
    ? new BaileysProvider({ sessionDir: config.sessionDir, sessionKey: config.sessionKey, logger })
    : new FakeProvider();

const limiter = new DailyLimiter(config.dailyLimit);
const queue = new SendQueue(provider, limiter, () => jitterDelay(config.minDelayMs, config.maxDelayMs));
const server = createGatewayServer({ provider, queue, limiter, gatewaySecret: config.gatewaySecret, logger });

server.listen(config.port, () => {
  logger.info(
    { port: config.port, provider: provider.name, dailyLimit: config.dailyLimit },
    "gateway WhatsApp berjalan",
  );
});

async function shutdown(signal: string) {
  logger.info({ signal }, "mematikan gateway");
  server.close();
  await provider.close();
  process.exit(0);
}
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
