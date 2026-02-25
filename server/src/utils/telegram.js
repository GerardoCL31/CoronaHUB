const getTelegramConfig = () => ({
  token: process.env.TELEGRAM_BOT_TOKEN || "",
  chatId: process.env.TELEGRAM_CHAT_ID || "",
});

const isTelegramConfigured = () => {
  const { token, chatId } = getTelegramConfig();
  return Boolean(token && chatId);
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const sendTelegramRequest = async (method, payload = {}) => {
  const { token } = getTelegramConfig();
  if (!token) return null;

  const url = `https://api.telegram.org/bot${token}/${method}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.ok === false) {
    throw new Error(`Telegram ${method} failed`);
  }
  return data;
};

const sendTelegramMessageWithButtons = async (text, inlineKeyboard) => {
  if (!isTelegramConfigured()) return;
  const { chatId } = getTelegramConfig();

  await sendTelegramRequest("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: inlineKeyboard
      ? {
          inline_keyboard: inlineKeyboard,
        }
      : undefined,
  });
};

export const notifyNewReservation = async (reservation) => {
  const text = [
    "<b>[NUEVA RESERVA - PENDING]</b>",
    `<b>Nombre:</b> ${escapeHtml(reservation.name)}`,
    `<b>Fecha:</b> ${escapeHtml(reservation.date)} ${escapeHtml(reservation.time)}`,
    `<b>Mesa:</b> ${escapeHtml(reservation.tableId)}`,
    `<b>Personas:</b> ${escapeHtml(reservation.people)}`,
    `<b>Email:</b> ${escapeHtml(reservation.email)}`,
    `<b>Telefono:</b> ${escapeHtml(reservation.phone)}`,
    `<b>Notas:</b> ${escapeHtml(reservation.notes || "-")}`,
    `<b>ID:</b> ${escapeHtml(reservation.id)}`,
  ].join("\n");

  await sendTelegramMessageWithButtons(text, [
    [
      { text: "Confirmar", callback_data: `reservation|CONFIRMED|${reservation.id}` },
      { text: "Cancelar", callback_data: `reservation|CANCELLED|${reservation.id}` },
    ],
  ]);
};

export const notifyNewReview = async (review) => {
  const text = [
    "<b>[NUEVA OPINION - PENDING]</b>",
    `<b>Nombre:</b> ${escapeHtml(review.name)}`,
    `<b>Rating:</b> ${escapeHtml(review.rating)}/5`,
    `<b>Comentario:</b> ${escapeHtml(review.comment)}`,
    `<b>ID:</b> ${escapeHtml(review.id)}`,
  ].join("\n");

  await sendTelegramMessageWithButtons(text, [
    [
      { text: "Aprobar", callback_data: `review|APPROVED|${review.id}` },
      { text: "Rechazar", callback_data: `review|REJECTED|${review.id}` },
    ],
  ]);
};

export const answerTelegramCallback = async (callbackQueryId, text) => {
  if (!callbackQueryId) return;
  await sendTelegramRequest("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false,
  });
};

export const sendTelegramAdminNotice = async (text) => {
  await sendTelegramMessageWithButtons(text);
};

export const getTelegramWebhookInfo = async () => sendTelegramRequest("getWebhookInfo");

export const setTelegramWebhook = async (url) =>
  sendTelegramRequest("setWebhook", {
    url,
    drop_pending_updates: false,
  });

export const getTelegramUpdates = async (offset) =>
  sendTelegramRequest("getUpdates", {
    offset,
    timeout: 0,
    allowed_updates: ["callback_query"],
  });
