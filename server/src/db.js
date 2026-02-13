import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import { defaultMenu } from "./menu.default.js";
import { defaultEvents } from "./events.default.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileDbPath = path.resolve(__dirname, "..", "data", "db.json");

let clientPromise;
let mongoUnavailable = false;
let mongoFallbackWarned = false;

const clone = (value) => JSON.parse(JSON.stringify(value));

const defaultFileState = () => ({
  reviews: [],
  reservations: [],
  menu: clone(defaultMenu),
  events: clone(defaultEvents),
});

const readFileDb = async () => {
  try {
    const raw = await fs.readFile(fileDbPath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...defaultFileState(),
      ...parsed,
      menu: parsed?.menu || clone(defaultMenu),
      events: parsed?.events || clone(defaultEvents),
      reviews: Array.isArray(parsed?.reviews) ? parsed.reviews : [],
      reservations: Array.isArray(parsed?.reservations) ? parsed.reservations : [],
    };
  } catch {
    const initial = defaultFileState();
    await writeFileDb(initial);
    return initial;
  }
};

const writeFileDb = async (state) => {
  await fs.mkdir(path.dirname(fileDbPath), { recursive: true });
  await fs.writeFile(fileDbPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
};

const getClient = async () => {
  if (mongoUnavailable) {
    return null;
  }

  if (!clientPromise) {
    const mongodbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
    const client = new MongoClient(mongodbUri, { serverSelectionTimeoutMS: 1500 });
    clientPromise = client.connect();
  }

  try {
    return await clientPromise;
  } catch (error) {
    mongoUnavailable = true;
    if (!mongoFallbackWarned) {
      console.warn("MongoDB no disponible, usando file DB fallback", error.message);
      mongoFallbackWarned = true;
    }
    return null;
  }
};

const getDb = async () => {
  const client = await getClient();
  if (!client) {
    return null;
  }

  const mongodbDb = process.env.MONGODB_DB || "coronahub";
  return client.db(mongodbDb);
};

const sortByCreatedDesc = (items) =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const createId = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

export const listApprovedReviews = async () => {
  const db = await getDb();
  if (db) {
    const reviews = db.collection("reviews");
    return reviews
      .find({ status: "APPROVED" }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
  }

  const state = await readFileDb();
  return sortByCreatedDesc(state.reviews.filter((item) => item.status === "APPROVED"));
};

export const listAllReviews = async () => {
  const db = await getDb();
  if (db) {
    const reviews = db.collection("reviews");
    return reviews.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
  }

  const state = await readFileDb();
  return sortByCreatedDesc(state.reviews);
};

export const createReview = async (payload) => {
  const review = {
    id: createId(),
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const db = await getDb();
  if (db) {
    const reviews = db.collection("reviews");
    await reviews.insertOne(review);
    return review;
  }

  const state = await readFileDb();
  state.reviews.push(review);
  await writeFileDb(state);
  return review;
};

export const updateReviewStatus = async (id, status) => {
  const updatedAt = new Date().toISOString();
  const db = await getDb();

  if (db) {
    const reviews = db.collection("reviews");
    const result = await reviews.updateOne({ id }, { $set: { status, updatedAt } });
    if (result.matchedCount === 0) {
      return null;
    }
    return reviews.findOne({ id }, { projection: { _id: 0 } });
  }

  const state = await readFileDb();
  const index = state.reviews.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  state.reviews[index] = {
    ...state.reviews[index],
    status,
    updatedAt,
  };
  await writeFileDb(state);
  return state.reviews[index];
};

export const listAllReservations = async () => {
  const db = await getDb();
  if (db) {
    const reservations = db.collection("reservations");
    return reservations.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
  }

  const state = await readFileDb();
  return sortByCreatedDesc(state.reservations);
};

export const createReservation = async (payload) => {
  const reservation = {
    id: createId(),
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const db = await getDb();
  if (db) {
    const reservations = db.collection("reservations");
    await reservations.insertOne(reservation);
    return reservation;
  }

  const state = await readFileDb();
  state.reservations.push(reservation);
  await writeFileDb(state);
  return reservation;
};

export const updateReservationStatus = async (id, status) => {
  const updatedAt = new Date().toISOString();
  const db = await getDb();

  if (db) {
    const reservations = db.collection("reservations");
    const result = await reservations.updateOne({ id }, { $set: { status, updatedAt } });
    if (result.matchedCount === 0) {
      return null;
    }
    return reservations.findOne({ id }, { projection: { _id: 0 } });
  }

  const state = await readFileDb();
  const index = state.reservations.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  state.reservations[index] = {
    ...state.reservations[index],
    status,
    updatedAt,
  };
  await writeFileDb(state);
  return state.reservations[index];
};

export const getMenu = async () => {
  const db = await getDb();
  if (db) {
    const settings = db.collection("settings");
    const doc = await settings.findOne({ _id: "menu" }, { projection: { _id: 0, value: 1 } });
    if (doc?.value) {
      return doc.value;
    }
    const fallback = clone(defaultMenu);
    await settings.updateOne({ _id: "menu" }, { $setOnInsert: { value: fallback } }, { upsert: true });
    return fallback;
  }

  const state = await readFileDb();
  if (!state.menu) {
    state.menu = clone(defaultMenu);
    await writeFileDb(state);
  }
  return state.menu;
};

export const setMenu = async (menu) => {
  const db = await getDb();
  if (db) {
    const settings = db.collection("settings");
    await settings.updateOne({ _id: "menu" }, { $set: { value: menu } }, { upsert: true });
    return menu;
  }

  const state = await readFileDb();
  state.menu = menu;
  await writeFileDb(state);
  return menu;
};

export const getEvents = async () => {
  const db = await getDb();
  if (db) {
    const settings = db.collection("settings");
    const doc = await settings.findOne({ _id: "events" }, { projection: { _id: 0, value: 1 } });
    if (doc?.value) {
      return doc.value;
    }
    const fallback = clone(defaultEvents);
    await settings.updateOne(
      { _id: "events" },
      { $setOnInsert: { value: fallback } },
      { upsert: true }
    );
    return fallback;
  }

  const state = await readFileDb();
  if (!state.events) {
    state.events = clone(defaultEvents);
    await writeFileDb(state);
  }
  return state.events;
};

export const setEvents = async (events) => {
  const db = await getDb();
  if (db) {
    const settings = db.collection("settings");
    await settings.updateOne({ _id: "events" }, { $set: { value: events } }, { upsert: true });
    return events;
  }

  const state = await readFileDb();
  state.events = events;
  await writeFileDb(state);
  return events;
};

