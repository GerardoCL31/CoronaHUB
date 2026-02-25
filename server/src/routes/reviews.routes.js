import { Router } from "express";
import { reviewSchema } from "../validators/review.schema.js";
import { buildRateLimiter } from "../middlewares/rateLimit.js";
import { hashIp } from "../utils/hash.js";
import { listApprovedReviews, createReview } from "../db.js";
import { notifyNewReview } from "../utils/telegram.js";

const router = Router();

const limiter = buildRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 });

router.get("/", async (_req, res, next) => {
  try {
    const reviews = await listApprovedReviews();
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
    const ipHash = hashIp(req.ip || "");
    const userAgent = req.get("user-agent") || "";
    const review = await createReview({
      name: parsed.data.name,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      status: "PENDING",
      ipHash,
      userAgent,
    });

    notifyNewReview(review).catch((telegramError) => {
      console.warn("Telegram review notification failed:", telegramError.message);
    });

    res.status(201).json({ ok: true, data: review });
  } catch (error) {
    next(error);
  }
});

export default router;
