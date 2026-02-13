import { Router } from "express";
import { getEvents } from "../db.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const events = await getEvents();
    res.json({ ok: true, data: events });
  } catch (error) {
    next(error);
  }
});

export default router;
