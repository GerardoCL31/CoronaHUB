import { Router } from "express";
import { getMenu } from "../db.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const menu = await getMenu();
    res.json({ ok: true, data: menu });
  } catch (error) {
    next(error);
  }
});

export default router;
