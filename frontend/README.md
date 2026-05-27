# Social Media Frontend

This is a minimal React + Vite frontend for the Social Media API. It includes:

- A small UI for authentication, profile, and comments CRUD.
- Playwright E2E tests that mock API responses so tests can run without a backend.

Quick start

1. Install dependencies

```bash
cd frontend
npm install
```

2. (Playwright only) install browsers

```bash
npx playwright install --with-deps
```

3. Run the dev server

```bash
npm run dev
```

4. Run unit tests (Vitest)

```bash
npm run test:unit
```

5. Run Playwright tests (will start dev server automatically)

```bash
npm run test:e2e
```

Notes

- The app reads the API base URL from `VITE_API_URL` (defaults to `http://localhost:3000`).
- Playwright tests mock network responses; to run tests against a live backend, modify or remove the route() mocks in `tests/playwright/*.spec.ts`.
- Open this folder in VS Code: `File -> Open Folder -> d:/Midterm/frontend` and run the scripts in the integrated terminal.
