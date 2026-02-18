import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  getMenu,
  setMenu,
  getEvents,
  setEvents,
  listAllReviews,
  updateReviewStatus,
  listAllReservations,
  updateReservationStatus,
} from "../db.js";
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
    return res.status(401).json({ ok: false, message: "Credenciales inválidas" });
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

const eventPhotoSchema = z.object({
  id: z.string().min(1),
  imageUrl: z.string().max(500),
  imageAlt: z.string().min(1).max(120),
});

const eventHomeCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(80),
  schedule: z.string().min(1).max(80),
  note: z.string().min(1).max(180),
  imageUrl: z.string().max(500),
  imageAlt: z.string().min(1).max(120),
});

const eventPageItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  photos: z.array(eventPhotoSchema).length(2),
});

const eventsSchema = z.object({
  homeTitle: z.string().min(1).max(80),
  homeCards: z.array(eventHomeCardSchema).length(2),
  pageItems: z.array(eventPageItemSchema).length(2),
});

router.get("/menu", async (_req, res, next) => {
  try {
    const menu = await getMenu();
    res.json({ ok: true, data: menu });
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
    const menu = await setMenu(parsed.data);
    res.json({ ok: true, data: menu });
  } catch (error) {
    next(error);
  }
});

router.get("/events", async (_req, res, next) => {
  try {
    const events = await getEvents();
    res.json({ ok: true, data: events });
  } catch (error) {
    next(error);
  }
});

router.put("/events", async (req, res, next) => {
  const parsed = eventsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  try {
    const events = await setEvents(parsed.data);
    res.json({ ok: true, data: events });
  } catch (error) {
    next(error);
  }
});

router.get("/reviews", async (_req, res, next) => {
  try {
    const reviews = await listAllReviews();
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
    const review = await updateReviewStatus(req.params.id, parsed.data.status);
    if (!review) {
      return res.status(404).json({ ok: false, message: "Reseña no encontrada" });
    }

    res.json({ ok: true, data: review });
  } catch (error) {
    next(error);
  }
});

router.get("/reservations", async (_req, res, next) => {
  try {
    const reservations = await listAllReservations();
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
    const reservation = await updateReservationStatus(req.params.id, parsed.data.status);
    if (!reservation) {
      return res.status(404).json({ ok: false, message: "Reserva no encontrada" });
    }

    res.json({ ok: true, data: reservation });
  } catch (error) {
    if (error?.code === "RESERVATION_SLOT_TAKEN") {
      return res.status(409).json({ ok: false, message: error.message });
    }
    next(error);
  }
});

export default router;

