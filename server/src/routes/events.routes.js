import { Router } from "express";
import { readDb } from "../db.js";
import { defaultEvents } from "../events.default.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const db = await readDb();
    res.json({ ok: true, data: db.events || defaultEvents });
  } catch (error) {
    next(error);
  }
});

export default router;
