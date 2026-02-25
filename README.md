# CoronaHUB Monorepo
<img width="1914" height="954" alt="image" src="https://github.com/user-attachments/assets/128a374b-a558-41f1-8135-91e372722477" />


## Current Architecture

- `client/`: React + Webpack frontend
- `server/`: Express backend

## Requirements

- Node.js 18+
- npm
- Git
- MongoDB Community Server (required for `DB_MODE=mongo`, optional for `DB_MODE=auto`)

Optional:
- MongoDB Compass

## Quick Start

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
DB_MODE=auto
JWT_SECRET=change_this_to_a_long_random_secret
ADMIN_EMAIL=admin@coronahub.local
ADMIN_PASSWORD=change_this_password
IP_HASH_SALT=change_this_salt
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=coronahub
```

Database modes:
- `DB_MODE=mongo`: MongoDB only (recommended when you want strict Mongo usage)
- `DB_MODE=file`: uses `server/data/db.json`
- `DB_MODE=auto`: tries MongoDB, falls back to file DB if Mongo is unavailable

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

Client:
- `npm run dev --prefix client`: Webpack dev server
- `npm run build --prefix client`: production build
- `npm run preview --prefix client`: preview server

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
