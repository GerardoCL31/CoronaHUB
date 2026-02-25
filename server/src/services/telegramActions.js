import { updateReservationStatus, updateReviewStatus } from "../db.js";
import { answerTelegramCallback, sendTelegramAdminNotice } from "../utils/telegram.js";

const parseCallbackData = (raw) => {
  const value = String(raw || "");
  const [entity, status, ...idParts] = value.split("|");
  const id = idParts.join("|");
  if (!entity || !status || !id) return null;
  return { entity, status, id };
};

export const handleTelegramCallback = async (callbackQuery) => {
  const parsed = parseCallbackData(callbackQuery?.data);
  if (!parsed) {
    await answerTelegramCallback(callbackQuery?.id, "Accion invalida");
    return;
  }

  try {
    if (parsed.entity === "reservation") {
      const updated = await updateReservationStatus(parsed.id, parsed.status);
      if (!updated) {
        await answerTelegramCallback(callbackQuery.id, "Reserva no encontrada");
        return;
      }

      await answerTelegramCallback(callbackQuery.id, "Reserva actualizada");
      await sendTelegramAdminNotice(`[OK] Reserva ${parsed.id} -> ${parsed.status}`);
      return;
    }

    if (parsed.entity === "review") {
      const updated = await updateReviewStatus(parsed.id, parsed.status);
      if (!updated) {
        await answerTelegramCallback(callbackQuery.id, "Opinion no encontrada");
        return;
      }

      await answerTelegramCallback(callbackQuery.id, "Opinion actualizada");
      await sendTelegramAdminNotice(`[OK] Opinion ${parsed.id} -> ${parsed.status}`);
      return;
    }

    await answerTelegramCallback(callbackQuery.id, "Entidad no soportada");
  } catch (_error) {
    await answerTelegramCallback(callbackQuery.id, "No se pudo actualizar");
  }
};
