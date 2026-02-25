import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import reviewsRoutes from "./routes/reviews.routes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import telegramRoutes from "./routes/telegram.routes.js";
import { getTelegramUpdates, setTelegramWebhook } from "./utils/telegram.js";
import { handleTelegramCallback } from "./services/telegramActions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/reviews", reviewsRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/telegram", telegramRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, message: "Error interno" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  const webhookBaseUrl = (process.env.TELEGRAM_WEBHOOK_BASE_URL || "").trim();
  const webhookToken = (process.env.TELEGRAM_WEBHOOK_TOKEN || "").trim();
  const hasTelegramToken = Boolean((process.env.TELEGRAM_BOT_TOKEN || "").trim());

  if (hasTelegramToken && webhookBaseUrl && webhookToken) {
    const base = webhookBaseUrl.replace(/\/+$/, "");
    const webhookUrl = `${base}/api/telegram/webhook/${webhookToken}`;

    setTelegramWebhook(webhookUrl)
      .then(() => {
        console.log(`Telegram webhook configured: ${webhookUrl}`);
      })
      .catch((error) => {
        console.warn("Telegram webhook auto-config failed:", error.message);
      });
  }

  const pollingEnabled = String(process.env.TELEGRAM_POLLING_ENABLED || "").toLowerCase() === "true";
  if (hasTelegramToken && pollingEnabled) {
    let updateOffset = 0;

    const poll = async () => {
      try {
        const response = await getTelegramUpdates(updateOffset);
        const updates = Array.isArray(response?.result) ? response.result : [];
        for (const update of updates) {
          if (typeof update.update_id === "number") {
            updateOffset = update.update_id + 1;
          }
          if (update?.callback_query) {
            await handleTelegramCallback(update.callback_query);
          }
        }
      } catch (error) {
        console.warn("Telegram polling failed:", error.message);
      }
    };

    setInterval(poll, 3000);
    console.log("Telegram polling enabled");
  }
});
