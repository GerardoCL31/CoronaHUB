import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "..", "data", "db.json");

const ensureDb = async () => {
  try {
    await fs.access(dbPath);
  } catch {
    const initial = { reviews: [], reservations: [] };
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(initial, null, 2), "utf-8");
  }
};

export const readDb = async () => {
  await ensureDb();
  const raw = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(raw);
};

export const writeDb = async (data) => {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
};

export const createId = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
