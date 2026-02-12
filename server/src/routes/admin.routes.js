import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { readDb, writeDb } from "../db.js";
import { defaultMenu } from "../menu.default.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ ok: false, message: "Credenciales invalidas" });
  }

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET || "", {
    expiresIn: "2h",
  });

  return res.json({ ok: true, token });
});

router.use(authMiddleware);

const menuDaySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  first: z.string().min(1),
  second: z.string().min(1),
  dessert: z.string().min(1),
});

const menuSchema = z.object({
  banner: z.string().min(1).max(120),
  days: z.array(menuDaySchema).length(6),
  combosTitle: z.string().min(1).max(80),
  combos: z.array(z.string().min(1)).min(1).max(20),
});

router.get("/menu", async (_req, res, next) => {
  try {
    const db = await readDb();
    res.json({ ok: true, data: db.menu || defaultMenu });
  } catch (error) {
    next(error);
  }
});

router.put("/menu", async (req, res, next) => {
  const parsed = menuSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  try {
    const db = await readDb();
    db.menu = parsed.data;
    await writeDb(db);
    res.json({ ok: true, data: db.menu });
  } catch (error) {
    next(error);
  }
});

router.get("/reviews", async (_req, res, next) => {
  try {
    const db = await readDb();
    const reviews = [...db.reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ ok: true, data: reviews });
  } catch (error) {
    next(error);
  }
});

router.patch("/reviews/:id", async (req, res, next) => {
  const statusSchema = z.object({
    status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
  });
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  try {
    const db = await readDb();
    const review = db.reviews.find((item) => item.id === req.params.id);
    if (!review) {
      return res.status(404).json({ ok: false, message: "Resena no encontrada" });
    }

    review.status = parsed.data.status;
    review.updatedAt = new Date().toISOString();
    await writeDb(db);

    res.json({ ok: true, data: review });
  } catch (error) {
    next(error);
  }
});

router.get("/reservations", async (_req, res, next) => {
  try {
    const db = await readDb();
    const reservations = [...db.reservations].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ ok: true, data: reservations });
  } catch (error) {
    next(error);
  }
});

router.patch("/reservations/:id", async (req, res, next) => {
  const statusSchema = z.object({
    status: z.enum(["CONFIRMED", "CANCELLED", "PENDING"]),
  });
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  try {
    const db = await readDb();
    const reservation = db.reservations.find((item) => item.id === req.params.id);
    if (!reservation) {
      return res.status(404).json({ ok: false, message: "Reserva no encontrada" });
    }

    reservation.status = parsed.data.status;
    reservation.updatedAt = new Date().toISOString();
    await writeDb(db);

    res.json({ ok: true, data: reservation });
  } catch (error) {
    next(error);
  }
});

export default router;
