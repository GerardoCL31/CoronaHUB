import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import reviewsRoutes from "./routes/reviews.routes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/reviews", reviewsRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, message: "Error interno" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
