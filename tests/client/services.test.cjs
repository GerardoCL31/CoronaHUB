const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadClientModule } = require("./load-client-module.cjs");

const createStorage = () => {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
  };
};

test.afterEach(() => {
  delete global.localStorage;
});

test("auth service stores and clears admin token", async () => {
  const authModulePath = path.resolve(__dirname, "../../client/src/services/auth.service.js");
  const apiModulePath = path.resolve(__dirname, "../../client/src/services/api.js");
  const calls = [];
  global.localStorage = createStorage();

  const authService = loadClientModule(authModulePath, {
    mocks: new Map([
      [
        apiModulePath,
        {
          apiRequest: async (...args) => {
            calls.push(args);
            return { ok: true, token: "token-123" };
          },
        },
      ],
    ]),
  });

  const loginResponse = await authService.login("admin@coronahub.local", "secret");
  assert.equal(loginResponse.token, "token-123");
  assert.equal(global.localStorage.getItem("coronahub_token"), "token-123");
  assert.deepEqual(calls[0], [
    "/api/admin/login",
    {
      method: "POST",
      body: { email: "admin@coronahub.local", password: "secret" },
    },
  ]);

  assert.equal(authService.isAuthenticated(), true);
  authService.logout();
  assert.equal(authService.isAuthenticated(), false);
});

test("reviews and reservations services call the expected API endpoints", async () => {
  const reviewsModulePath = path.resolve(__dirname, "../../client/src/services/reviews.service.js");
  const reservationsModulePath = path.resolve(
    __dirname,
    "../../client/src/services/reservations.service.js"
  );
  const apiModulePath = path.resolve(__dirname, "../../client/src/services/api.js");
  const calls = [];

  const apiMock = {
    apiRequest: async (...args) => {
      calls.push(args);
      return { ok: true, data: [] };
    },
  };

  const reviewsService = loadClientModule(reviewsModulePath, {
    mocks: new Map([[apiModulePath, apiMock]]),
  });
  const reservationsService = loadClientModule(reservationsModulePath, {
    mocks: new Map([[apiModulePath, apiMock]]),
  });

  await reviewsService.getApprovedReviews();
  await reviewsService.createReview({ name: "Lucia" });
  await reviewsService.adminGetReviews();
  await reviewsService.adminUpdateReview("rv-1", "APPROVED");

  await reservationsService.createReservation({ tableId: "mesa-1" });
  await reservationsService.getReservationAvailability("2026-03-30");
  await reservationsService.adminGetReservations();
  await reservationsService.adminUpdateReservation("rs-1", "CONFIRMED");

  assert.deepEqual(calls, [
    ["/api/reviews"],
    ["/api/reviews", { method: "POST", body: { name: "Lucia" } }],
    ["/api/admin/reviews"],
    ["/api/admin/reviews/rv-1", { method: "PATCH", body: { status: "APPROVED" } }],
    ["/api/reservations", { method: "POST", body: { tableId: "mesa-1" } }],
    ["/api/reservations/availability?date=2026-03-30"],
    ["/api/admin/reservations"],
    ["/api/admin/reservations/rs-1", { method: "PATCH", body: { status: "CONFIRMED" } }],
  ]);
});

test("menu and events admin services call the expected API endpoints", async () => {
  const menuModulePath = path.resolve(__dirname, "../../client/src/services/menu.service.js");
  const eventsModulePath = path.resolve(__dirname, "../../client/src/services/events.service.js");
  const apiModulePath = path.resolve(__dirname, "../../client/src/services/api.js");
  const calls = [];

  const apiMock = {
    apiRequest: async (...args) => {
      calls.push(args);
      return { ok: true, data: { banner: "ok", homeTitle: "ok" } };
    },
  };

  const menuService = loadClientModule(menuModulePath, {
    mocks: new Map([[apiModulePath, apiMock]]),
  });
  const eventsService = loadClientModule(eventsModulePath, {
    mocks: new Map([[apiModulePath, apiMock]]),
  });

  await menuService.adminGetMenu();
  await menuService.adminUpdateMenu({ banner: "nuevo" });
  await eventsService.getEvents();
  await eventsService.adminGetEvents();
  await eventsService.adminUpdateEvents({ homeTitle: "nuevo" });

  assert.deepEqual(calls, [
    ["/api/admin/menu"],
    ["/api/admin/menu", { method: "PUT", body: { banner: "nuevo" } }],
    ["/api/events"],
    ["/api/admin/events"],
    ["/api/admin/events", { method: "PUT", body: { homeTitle: "nuevo" } }],
  ]);
});
