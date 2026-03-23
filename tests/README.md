## Test Suites

- `tests/server`: HTTP and integration tests for the Express backend using the file DB in a temporary location.
- `tests/client`: unit tests for frontend services and API helpers using Node's built-in test runner.

Run everything from the repo root:

```bash
npm test
```

Or run each side separately:

```bash
npm run test:server
npm run test:client
```
