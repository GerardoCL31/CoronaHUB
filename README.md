# CoronaHUB Monorepo
<img width="1866" height="887" alt="image" src="https://github.com/user-attachments/assets/2b34242e-350f-4692-851b-18b6c15e1a7f" />



## Current Architecture

- `client/`: React + Webpack frontend
- `server/`: Express backend
- `tests/`: automated backend and frontend service tests

## Final Delivery Summary

CoronaHUB is a full-stack web app for Bar Corona with public pages, reservations, reviews, menu and events management, plus an admin area.

Included functionality:
- Public website with home, menu, events, gallery, contact/legal information and reservation flow.
- Reservation availability endpoint to avoid duplicate active bookings for the same table/date/time.
- Review submission flow with moderation before public display.
- Admin login protected with JWT, rate-limited login attempts and CRUD-style moderation/update endpoints.
- Editable menu and events content persisted in MongoDB or the local JSON fallback.
- Optional Telegram notifications and action buttons for new reservations and reviews.
- Production frontend build workflow for One.com, including SPA `.htaccess` routing support.

Code quality and structure:
- Frontend split into pages, reusable components, constants and service modules.
- Backend split into routes, validators, middleware, database access, Telegram utilities and default data.
- Shared API helper centralizes base URL resolution, auth headers, JSON serialization and error handling.
- Zod schemas validate external input before persistence.
- Environment-driven configuration keeps secrets out of source code.

Styling and UX:
- Responsive React layout with dedicated CSS files per major page/area.
- Cloudinary/static image constants centralize media usage.
- Accessible navigation targets and descriptive image alt text are used across the main pages.

Testing:
- Server integration tests cover health, menu/events data, reviews, admin auth and reservations.
- Client unit tests cover API base URL resolution, error handling and service endpoint calls.
- The current verification command is:

```bash
npm test
```

Latest local verification:
- `npm.cmd test`: 14 tests passing.
- `npm.cmd run build --prefix client`: production build completed successfully.

## Requirements

- Node.js 18+
- npm
- Git
- MongoDB Community Server (required for `DB_MODE=mongo`, optional for `DB_MODE=auto`)

Optional:
- MongoDB Compass

## Quick Start (Windows PowerShell)

```bash
git clone <https://github.com/GerardoCL31/CoronaHUB.git>
cd CoronaHUB
npm.cmd install
npm.cmd run install:all
Copy-Item server/.env.example server/.env
npm.cmd run dev
```

## Quick Start (macOS/Linux)

```bash
git clone <https://github.com/GerardoCL31/CoronaHUB.git>
cd CoronaHUB
npm install
npm run install:all
cp server/.env.example server/.env
npm run dev
```

App URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Healthcheck: `http://localhost:4000/api/health`

## Backend Environment (`server/.env`)

Example:

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
DB_MODE=auto
JWT_SECRET=change_this_to_a_long_random_secret
ADMIN_EMAIL=admin@coronahub.local
ADMIN_PASSWORD=change_this_password
IP_HASH_SALT=change_this_salt
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=coronahub
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_WEBHOOK_BASE_URL=
TELEGRAM_WEBHOOK_TOKEN=
TELEGRAM_POLLING_ENABLED=false
```

Database modes:
- `DB_MODE=mongo`: MongoDB only (recommended when you want strict Mongo usage)
- `DB_MODE=file`: uses `server/data/db.json`
- `DB_MODE=auto`: tries MongoDB, falls back to file DB if Mongo is unavailable

Production safety:
- In `NODE_ENV=production`, `DB_MODE=auto` no longer falls back silently to file DB.
- If you really want file fallback in production, set `ALLOW_FILE_DB_IN_PRODUCTION=true`.
- Recommended for Render/production: `DB_MODE=mongo`.

## MongoDB Setup (Detailed)

### 1) Install MongoDB Community Server

Windows:
1. Download MongoDB Community Server (MSI) from the official MongoDB website.
2. During install, select:
- `Complete`
- `Install MongoD as a Service`
3. Finish installation.


### 2) Start MongoDB service

Windows (PowerShell as Administrator):

```powershell
Get-Service MongoDB
Start-Service MongoDB
Get-Service MongoDB
```

If service name is different:

```powershell
Get-Service *mongo*
```

Linux:

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### 3) Force the app to use MongoDB

Set this in `server/.env`:

```env
DB_MODE=mongo
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=coronahub
```

Why this matters:
- `DB_MODE=mongo` guarantees the backend will fail fast if MongoDB is not reachable.
- `DB_MODE=auto` can hide Mongo issues because it silently falls back to file DB.

### 4) Run the project

From repo root:

```bash
npm run dev
```

### 5) Verify MongoDB is actually being used

1. Open backend health endpoint:
- `http://localhost:4000/api/health`
2. Create at least one reservation/review from the app.
3. Open MongoDB Compass and connect to:
- `mongodb://127.0.0.1:27017`
4. Confirm database `coronahub` exists and contains collections like:
- `reservations`
- `reviews`
- `settings`

## Common MongoDB Errors

- `ECONNREFUSED 127.0.0.1:27017`
  - MongoDB is not running.
  - Fix: start service (`Start-Service MongoDB` or `sudo systemctl start mongod`).

- `NoServiceFoundForGivenName`
  - MongoDB service name is different or Mongo is not installed.
  - Fix: run `Get-Service *mongo*` and start the correct service.

- `mongosh is not recognized`
  - `mongosh` is not in PATH.
  - This does not block the app; use Compass instead.

- Backend starts but still writes to file DB
  - Usually `DB_MODE=auto` + MongoDB unavailable.
  - Fix: set `DB_MODE=mongo` to force MongoDB usage.

## Useful Scripts

Root:
- `npm run dev`: run client + server
- `npm run dev:client`: run frontend only
- `npm run dev:server`: run backend only
- `npm test`: run server and client automated tests

Client:
- `npm run dev --prefix client`: Webpack dev server
- `npm run build --prefix client`: production build
- `npm run preview --prefix client`: preview server
- `npm run one --prefix client`: build + create `client/dist-one.zip` ready to upload to One.com

## Frontend Deploy to One.com

### Option A (recommended): one command + ZIP

Windows PowerShell:

```powershell
npm.cmd run one --prefix client
```

This command:
- Builds the frontend in `client/dist`
- Creates `client/dist-one.zip` (ready to upload)

Upload the content of this ZIP to your One.com web root (`public_html`).

### Option B: manual build

```bash
npm run build --prefix client
```

Upload all files inside `client/dist` to `public_html`.

### SPA routing (`react-router-dom`)

If you use frontend routes, add this `.htaccess` in `public_html`:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## API Endpoints

- POST `/api/reviews`
- GET `/api/reviews`
- POST `/api/reservations`
- GET `/api/menu`
- GET `/api/events`
- POST `/api/admin/login`
- GET `/api/admin/menu`
- PUT `/api/admin/menu`
- GET `/api/admin/reviews`
- PATCH `/api/admin/reviews/:id`
- GET `/api/admin/reservations`
- PATCH `/api/admin/reservations/:id`
