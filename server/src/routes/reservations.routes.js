import { Router } from "express";
import { reservationSchema } from "../validators/reservation.schema.js";
import { buildRateLimiter } from "../middlewares/rateLimit.js";
import { hashIp } from "../utils/hash.js";
import { readDb, writeDb, createId } from "../db.js";

const router = Router();

const limiter = buildRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 });

router.post("/", limiter, async (req, res, next) => {
  const parsed = reservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  try {
    const db = await readDb();
    const ipHash = hashIp(req.ip || "");
    const userAgent = req.get("user-agent") || "";

    const reservation = {
      id: createId(),
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      date: parsed.data.date,
      time: parsed.data.time,
      people: parsed.data.people,
      notes: parsed.data.notes || null,
      status: "PENDING",
      ipHash,
      userAgent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.reservations.push(reservation);
    await writeDb(db);

    res.status(201).json({ ok: true, data: reservation });
  } catch (error) {
    next(error);
  }
});

export default router;
