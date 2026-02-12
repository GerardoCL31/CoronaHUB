import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defaultMenu } from "./menu.default.js";
import { defaultEvents } from "./events.default.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "..", "data", "db.json");
const defaultDb = {
  reviews: [],
  reservations: [],
  menu: defaultMenu,
  events: defaultEvents,
};

const ensureDb = async () => {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2), "utf-8");
  }
};

export const readDb = async () => {
  await ensureDb();
  const raw = await fs.readFile(dbPath, "utf-8");
  const parsed = JSON.parse(raw);
  return {
    reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
    reservations: Array.isArray(parsed.reservations) ? parsed.reservations : [],
    menu: parsed.menu || defaultMenu,
    events: parsed.events || defaultEvents,
  };
};

export const writeDb = async (data) => {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
};

export const createId = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
