import { Router } from "express";
import {
  getTelegramWebhookInfo,
  setTelegramWebhook,
} from "../utils/telegram.js";
import { handleTelegramCallback } from "../services/telegramActions.js";

const router = Router();

const isTokenValid = (token) => {
  const expected = process.env.TELEGRAM_WEBHOOK_TOKEN || "";
  if (!expected) return true;
  return token === expected;
};

const getPublicBaseUrl = (req) => {
  const xfProto = req.get("x-forwarded-proto");
  const proto = xfProto ? xfProto.split(",")[0].trim() : req.protocol;
  return `${proto}://${req.get("host")}`;
};

router.get("/webhook-info/:token", async (req, res) => {
  if (!isTokenValid(req.params.token)) {
    return res.status(401).json({ ok: false });
  }
  try {
    const info = await getTelegramWebhookInfo();
    return res.json({ ok: true, data: info?.result || info || {} });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
});

router.get("/register-webhook/:token", async (req, res) => {
  if (!isTokenValid(req.params.token)) {
    return res.status(401).json({ ok: false });
  }

  try {
    const webhookToken = process.env.TELEGRAM_WEBHOOK_TOKEN || "telegram-webhook";
    const webhookUrl = `${getPublicBaseUrl(req)}/api/telegram/webhook/${webhookToken}`;
    const result = await setTelegramWebhook(webhookUrl);
    return res.json({ ok: true, webhookUrl, data: result?.result || result || {} });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
});

router.post("/webhook/:token", async (req, res) => {
  if (!isTokenValid(req.params.token)) {
    return res.status(401).json({ ok: false });
  }

  const callbackQuery = req.body?.callback_query;
  if (!callbackQuery) {
    return res.json({ ok: true });
  }

  await handleTelegramCallback(callbackQuery);
  return res.json({ ok: true });
});

export default router;
