import rateLimit from "express-rate-limit";

export const buildRateLimiter = ({ windowMs, max }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, message: "Demasiadas solicitudes" },
  });
