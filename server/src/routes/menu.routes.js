import { Router } from "express";
import { readDb } from "../db.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const db = await readDb();
    res.json({ ok: true, data: db.menu });
  } catch (error) {
    next(error);
  }
});

export default router;
