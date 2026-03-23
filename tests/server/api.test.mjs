import test, { after, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "coronahub-tests-"));
const testDbPath = path.join(tmpDir, "db.json");

process.env.NODE_ENV = "test";
process.env.DB_MODE = "file";
process.env.FILE_DB_PATH = testDbPath;
process.env.JWT_SECRET = "test-secret";
process.env.ADMIN_EMAIL = "admin@coronahub.local";
process.env.ADMIN_PASSWORD = "test-password";
process.env.TELEGRAM_BOT_TOKEN = "";
process.env.TELEGRAM_CHAT_ID = "";
process.env.TELEGRAM_POLLING_ENABLED = "false";
process.env.CORS_ORIGIN = "http://localhost:5173";

const backendEntryUrl = `${pathToFileURL(path.join(repoRoot, "server", "src", "index.js")).href}?t=${Date.now()}`;
const { createApp } = await import(backendEntryUrl);

let server;
let baseUrl;

const resetDb = async () => {
  await fs.writeFile(
    testDbPath,
    `${JSON.stringify({ reviews: [], reservations: [] }, null, 2)}\n`,
    "utf8"
  );
};

const requestJson = async (pathname, { method = "GET", body, token } = {}) => {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
};

const loginAsAdmin = async () => {
  const { response, data } = await requestJson("/api/admin/login", {
    method: "POST",
    body: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
  });
  assert.equal(response.status, 200);
  assert.equal(typeof data.token, "string");
  return data.token;
};

const getNextOpenDate = () => {
  const value = new Date();
  value.setDate(value.getDate() + 1);
  value.setHours(20, 0, 0, 0);

  while (value.getDay() === 0) {
    value.setDate(value.getDate() + 1);
  }

  return value.toISOString().slice(0, 10);
};

before(async () => {
  await resetDb();
  const app = createApp();
  server = await new Promise((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

beforeEach(async () => {
  await resetDb();
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await fs.rm(tmpDir, { recursive: true, force: true });
});

test("health, menu and events endpoints respond correctly", async () => {
  const health = await requestJson("/api/health");
  assert.equal(health.response.status, 200);
  assert.deepEqual(health.data, { ok: true });

  const menu = await requestJson("/api/menu");
  assert.equal(menu.response.status, 200);
  assert.equal(menu.data.ok, true);
  assert.equal(Array.isArray(menu.data.data.days), true);
  assert.equal(menu.data.data.days.length, 6);

  const events = await requestJson("/api/events");
  assert.equal(events.response.status, 200);
  assert.equal(events.data.ok, true);
  assert.equal(Array.isArray(events.data.data.homeCards), true);
  assert.equal(events.data.data.homeCards.length, 2);
});

test("reviews flow validates payloads and exposes approved items only", async () => {
  const invalid = await requestJson("/api/reviews", {
    method: "POST",
    body: {
      name: "A",
      rating: 8,
      comment: "Comentario inválido por rating",
    },
  });
  assert.equal(invalid.response.status, 400);
  assert.equal(invalid.data.ok, false);

  const created = await requestJson("/api/reviews", {
    method: "POST",
    body: {
      name: "Lucia",
      rating: 5,
      comment: "Muy buen desayuno y trato cercano.",
    },
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.data.data.status, "PENDING");

  const publicListBeforeApproval = await requestJson("/api/reviews");
  assert.equal(publicListBeforeApproval.response.status, 200);
  assert.deepEqual(publicListBeforeApproval.data.data, []);

  const token = await loginAsAdmin();
  const approved = await requestJson(`/api/admin/reviews/${created.data.data.id}`, {
    method: "PATCH",
    token,
    body: { status: "APPROVED" },
  });
  assert.equal(approved.response.status, 200);
  assert.equal(approved.data.data.status, "APPROVED");

  const publicListAfterApproval = await requestJson("/api/reviews");
  assert.equal(publicListAfterApproval.response.status, 200);
  assert.equal(publicListAfterApproval.data.data.length, 1);
  assert.equal(publicListAfterApproval.data.data[0].name, "Lucia");
});

test("admin endpoints require auth and login rejects invalid credentials", async () => {
  const protectedRequest = await requestJson("/api/admin/menu");
  assert.equal(protectedRequest.response.status, 401);
  assert.equal(protectedRequest.data.message, "No autorizado");

  const invalidLogin = await requestJson("/api/admin/login", {
    method: "POST",
    body: {
      email: process.env.ADMIN_EMAIL,
      password: "wrong-password",
    },
  });
  assert.equal(invalidLogin.response.status, 401);
  assert.equal(invalidLogin.data.message, "Credenciales inválidas");

  const token = await loginAsAdmin();
  const menu = await requestJson("/api/admin/menu", { token });
  assert.equal(menu.response.status, 200);
  assert.equal(menu.data.ok, true);
});

test("reservations flow validates, reports availability and blocks duplicate slots", async () => {
  const date = getNextOpenDate();
  const time = "20:30";

  const invalidAvailability = await requestJson("/api/reservations/availability?date=2026/01/01");
  assert.equal(invalidAvailability.response.status, 400);

  const created = await requestJson("/api/reservations", {
    method: "POST",
    body: {
      name: "Manuel",
      email: "manuel@example.com",
      phone: "600123123",
      date,
      time,
      tableId: "terraza-1",
      people: 4,
      notes: "Cumpleaños",
    },
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.data.data.status, "PENDING");

  const availability = await requestJson(`/api/reservations/availability?date=${date}`);
  assert.equal(availability.response.status, 200);
  assert.deepEqual(availability.data.data, [{ tableId: "terraza-1", time }]);

  const conflict = await requestJson("/api/reservations", {
    method: "POST",
    body: {
      name: "Ana",
      email: "ana@example.com",
      phone: "600555555",
      date,
      time,
      tableId: "terraza-1",
      people: 2,
      notes: "",
    },
  });
  assert.equal(conflict.response.status, 409);
  assert.match(conflict.data.message, /Ya existe una reserva activa/i);

  const token = await loginAsAdmin();
  const reservations = await requestJson("/api/admin/reservations", { token });
  assert.equal(reservations.response.status, 200);
  assert.equal(reservations.data.data.length, 1);
});

test("admin menu and events updates persist valid payloads", async () => {
  const token = await loginAsAdmin();
  const menu = await requestJson("/api/admin/menu", { token });
  const nextMenu = {
    ...menu.data.data,
    banner: "Menú especial de prueba",
  };

  const updatedMenu = await requestJson("/api/admin/menu", {
    method: "PUT",
    token,
    body: nextMenu,
  });
  assert.equal(updatedMenu.response.status, 200);
  assert.equal(updatedMenu.data.data.banner, "Menú especial de prueba");

  const events = await requestJson("/api/admin/events", { token });
  const nextEvents = {
    ...events.data.data,
    homeTitle: "Eventos test",
  };

  const updatedEvents = await requestJson("/api/admin/events", {
    method: "PUT",
    token,
    body: nextEvents,
  });
  assert.equal(updatedEvents.response.status, 200);
  assert.equal(updatedEvents.data.data.homeTitle, "Eventos test");
});
