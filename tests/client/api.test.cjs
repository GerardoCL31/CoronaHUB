const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadClientModule } = require("./load-client-module.cjs");

const apiModulePath = path.resolve(__dirname, "../../client/src/services/api.js");
const originalFetch = global.fetch;

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
    clear() {
      store.clear();
    },
  };
};

const loadApiModule = () => loadClientModule(apiModulePath);

test.afterEach(() => {
  delete global.window;
  delete global.localStorage;
  global.fetch = originalFetch;
  delete process.env.API_URL;
});

test("getApiBaseUrl uses local backend on localhost-like hosts", () => {
  global.window = {
    location: {
      hostname: "localhost",
      protocol: "http:",
      port: "5173",
    },
  };

  const { getApiBaseUrl } = loadApiModule();
  assert.equal(getApiBaseUrl(), "http://localhost:4000");
});

test("getApiBaseUrl prefers runtime override on production hosts", () => {
  global.window = {
    location: {
      hostname: "barcorona.es",
      protocol: "https:",
      port: "",
    },
    CORONAHUB_API_URL: "https://api.example.com/ ",
  };

  const { getApiBaseUrl } = loadApiModule();
  assert.equal(getApiBaseUrl(), "https://api.example.com");
});

test("getApiBaseUrl falls back to build override when runtime override is absent", () => {
  process.env.API_URL = "https://build.example.com/";
  global.window = {
    location: {
      hostname: "barcorona.es",
      protocol: "https:",
      port: "",
    },
  };

  const { getApiBaseUrl } = loadApiModule();
  assert.equal(getApiBaseUrl(), "https://build.example.com");
});

test("apiRequest sends auth headers and serializes JSON bodies", async () => {
  let requestArgs;
  global.window = {
    location: {
      hostname: "localhost",
      protocol: "http:",
      port: "5173",
    },
  };
  global.localStorage = createStorage();
  global.localStorage.setItem("coronahub_token", "abc123");
  global.fetch = async (url, options) => {
    requestArgs = { url, options };
    return {
      ok: true,
      async json() {
        return { ok: true, data: { id: "1" } };
      },
    };
  };

  const { apiRequest } = loadApiModule();
  const data = await apiRequest("/api/reviews", {
    method: "POST",
    body: { name: "Lucia" },
  });

  assert.deepEqual(data, { ok: true, data: { id: "1" } });
  assert.equal(requestArgs.url, "http://localhost:4000/api/reviews");
  assert.equal(requestArgs.options.method, "POST");
  assert.equal(requestArgs.options.headers.Authorization, "Bearer abc123");
  assert.equal(requestArgs.options.body, JSON.stringify({ name: "Lucia" }));
});

test("apiRequest prefers API error messages and field errors", async () => {
  global.window = {
    location: {
      hostname: "localhost",
      protocol: "http:",
      port: "5173",
    },
  };
  global.localStorage = createStorage();
  global.fetch = async () => ({
    ok: false,
    async json() {
      return {
        ok: false,
        errors: {
          fieldErrors: {
            name: ["El nombre es obligatorio"],
          },
        },
      };
    },
  });

  const { apiRequest } = loadApiModule();
  await assert.rejects(() => apiRequest("/api/reviews"), /El nombre es obligatorio/);
});

test("apiRequest reports connection errors with resolved base URL", async () => {
  global.window = {
    location: {
      hostname: "localhost",
      protocol: "http:",
      port: "5173",
    },
  };
  global.localStorage = createStorage();
  global.fetch = async () => {
    throw new Error("network down");
  };

  const { apiRequest } = loadApiModule();
  await assert.rejects(
    () => apiRequest("/api/menu"),
    /No se pudo conectar con el servidor \(http:\/\/localhost:4000\)/
  );
});
