import { Router } from "express";
import { reservationSchema } from "../validators/reservation.schema.js";
import { hashIp } from "../utils/hash.js";
import { createReservation, listActiveReservationsByDate } from "../db.js";
import { notifyNewReservation } from "../utils/telegram.js";

const router = Router();

router.get("/availability", async (req, res, next) => {
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    return res.status(400).json({ ok: false, message: "Parámetro date inválido" });
  }

  try {
    const rows = await listActiveReservationsByDate(String(date));
    return res.json({ ok: true, data: rows });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const parsed = reservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  try {
    const ipHash = hashIp(req.ip || "");
    const userAgent = req.get("user-agent") || "";
    const reservation = await createReservation({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      date: parsed.data.date,
      time: parsed.data.time,
      tableId: parsed.data.tableId,
      people: parsed.data.people,
      notes: parsed.data.notes || null,
      status: "PENDING",
      ipHash,
      userAgent,
    });

    notifyNewReservation(reservation).catch((telegramError) => {
      console.warn("Telegram reservation notification failed:", telegramError.message);
    });

    res.status(201).json({ ok: true, data: reservation });
  } catch (error) {
    if (error?.code === "RESERVATION_SLOT_TAKEN") {
      return res.status(409).json({ ok: false, message: error.message });
    }
    next(error);
  }
});

export default router;



