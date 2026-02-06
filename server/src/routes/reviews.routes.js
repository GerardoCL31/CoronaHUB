import { Router } from "express";
import { reviewSchema } from "../validators/review.schema.js";
import { buildRateLimiter } from "../middlewares/rateLimit.js";
import { hashIp } from "../utils/hash.js";
import { readDb, writeDb, createId } from "../db.js";

const router = Router();

const limiter = buildRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 });

router.get("/", async (_req, res, next) => {
  try {
    const db = await readDb();
    const reviews = db.reviews.filter((item) => item.status === "APPROVED");
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ ok: true, data: reviews });
  } catch (error) {
    next(error);
  }
});

router.post("/", limiter, async (req, res, next) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  try {
    const db = await readDb();
    const ipHash = hashIp(req.ip || "");
    const userAgent = req.get("user-agent") || "";

    const review = {
      id: createId(),
      name: parsed.data.name,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      status: "PENDING",
      ipHash,
      userAgent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.reviews.push(review);
    await writeDb(db);

    res.status(201).json({ ok: true, data: review });
  } catch (error) {
    next(error);
  }
});

export default router;
