import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import { defaultMenu } from "./menu.default.js";
import { defaultEvents } from "./events.default.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileDbPath = path.resolve(__dirname, "..", "data", "db.json");
const rawDbMode = (process.env.DB_MODE || "auto").trim().toLowerCase();
const DB_MODE = ["auto", "mongo", "file"].includes(rawDbMode) ? rawDbMode : "auto";

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
  if (DB_MODE === "file") {
    return null;
  }

  if (mongoUnavailable) {
    if (DB_MODE === "mongo") {
      throw new Error("MongoDB no disponible y DB_MODE=mongo. Revisa MONGODB_URI.");
    }
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
    if (DB_MODE === "mongo") {
      throw new Error(`MongoDB no disponible y DB_MODE=mongo: ${error.message}`);
    }
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
const ACTIVE_RESERVATION_STATUSES = ["PENDING", "CONFIRMED"];
const extractTableIdFromNotes = (notes) => {
  if (!notes || typeof notes !== "string") return null;
  const match = notes.match(/Mesa:\s*([A-Za-z0-9-]+)/i);
  return match?.[1] || null;
};
const getReservationTableId = (item) => item.tableId || extractTableIdFromNotes(item.notes) || null;

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
    const sameSlotRows = await reservations
      .find(
        {
          date: reservation.date,
          time: reservation.time,
          status: { $in: ACTIVE_RESERVATION_STATUSES },
        },
        { projection: { _id: 0, id: 1, tableId: 1, notes: 1 } }
      )
      .toArray();
    const conflict = sameSlotRows.find(
      (item) => getReservationTableId(item) === reservation.tableId
    );
    if (conflict) {
      const error = new Error("Ya existe una reserva activa para esa fecha y hora");
      error.code = "RESERVATION_SLOT_TAKEN";
      throw error;
    }
    await reservations.insertOne(reservation);
    return reservation;
  }

  const state = await readFileDb();
  const conflict = state.reservations.find(
    (item) =>
      item.date === reservation.date &&
      item.time === reservation.time &&
      getReservationTableId(item) === reservation.tableId &&
      ACTIVE_RESERVATION_STATUSES.includes(item.status)
  );
  if (conflict) {
    const error = new Error("Ya existe una reserva activa para esa fecha y hora");
    error.code = "RESERVATION_SLOT_TAKEN";
    throw error;
  }
  state.reservations.push(reservation);
  await writeFileDb(state);
  return reservation;
};

export const updateReservationStatus = async (id, status) => {
  const updatedAt = new Date().toISOString();
  const db = await getDb();

  if (db) {
    const reservations = db.collection("reservations");
    const existing = await reservations.findOne({ id }, { projection: { _id: 0 } });
    if (!existing) {
      return null;
    }

    if (status !== "CANCELLED") {
      const sameSlotRows = await reservations
        .find(
          {
            id: { $ne: id },
            date: existing.date,
            time: existing.time,
            status: { $in: ACTIVE_RESERVATION_STATUSES },
          },
          { projection: { _id: 0, id: 1, tableId: 1, notes: 1 } }
        )
        .toArray();
      const conflict = sameSlotRows.find(
        (item) => getReservationTableId(item) === getReservationTableId(existing)
      );
      if (conflict) {
        const error = new Error("Ese horario ya esta ocupado por otra reserva");
        error.code = "RESERVATION_SLOT_TAKEN";
        throw error;
      }
    }

    await reservations.updateOne({ id }, { $set: { status, updatedAt } });
    return reservations.findOne({ id }, { projection: { _id: 0 } });
  }

  const state = await readFileDb();
  const index = state.reservations.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  if (status !== "CANCELLED") {
    const current = state.reservations[index];
    const conflict = state.reservations.find(
      (item) =>
        item.id !== id &&
        item.date === current.date &&
        item.time === current.time &&
        getReservationTableId(item) === getReservationTableId(current) &&
        ACTIVE_RESERVATION_STATUSES.includes(item.status)
    );
    if (conflict) {
      const error = new Error("Ese horario ya esta ocupado por otra reserva");
      error.code = "RESERVATION_SLOT_TAKEN";
      throw error;
    }
  }

  state.reservations[index] = {
    ...state.reservations[index],
    status,
    updatedAt,
  };
  await writeFileDb(state);
  return state.reservations[index];
};

export const listActiveReservationsByDate = async (date) => {
  const db = await getDb();
  if (db) {
    const reservations = db.collection("reservations");
    const rows = await reservations
      .find(
        { date, status: { $in: ACTIVE_RESERVATION_STATUSES } },
        { projection: { _id: 0, tableId: 1, time: 1, notes: 1 } }
      )
      .toArray();
    return rows
      .map((item) => ({ tableId: getReservationTableId(item), time: item.time }))
      .filter((item) => item.tableId && item.time);
  }

  const state = await readFileDb();
  return state.reservations
    .filter((item) => item.date === date && ACTIVE_RESERVATION_STATUSES.includes(item.status))
    .map((item) => ({ tableId: getReservationTableId(item), time: item.time }))
    .filter((item) => item.tableId && item.time);
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
  const withDefaults = (value) => ({
    ...clone(defaultEvents),
    ...value,
    homeCards: Array.isArray(value?.homeCards) ? value.homeCards : clone(defaultEvents.homeCards),
    pageItems: Array.isArray(value?.pageItems) ? value.pageItems : clone(defaultEvents.pageItems),
    gallery: Array.isArray(value?.gallery) ? value.gallery : clone(defaultEvents.gallery),
  });

  const db = await getDb();
  if (db) {
    const settings = db.collection("settings");
    const doc = await settings.findOne({ _id: "events" }, { projection: { _id: 0, value: 1 } });
    if (doc?.value) {
      return withDefaults(doc.value);
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
  return withDefaults(state.events);
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

