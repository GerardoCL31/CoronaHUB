# CoronaHUB Monorepo

## Estado actual del proyecto

- Frontend en `client/` con React + Webpack (sin Vite).
- Backend en `server/` con Express.
- Se elimino el frontend legacy de la raiz para evitar confusiones.

## Requisitos

- Node.js 18+
- npm
- Git
- MongoDB Community Server (si usas `DB_MODE=mongo` o `DB_MODE=auto`)

Opcional:
- MongoDB Compass

## Setup rapido

```bash
git clone <TU_REPO>
cd CoronaHUB
npm install
npm run install:all
cp server/.env.example server/.env
npm run dev
```

URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Health: `http://localhost:4000/api/health`

## Variables backend (`server/.env`)

Ejemplo:

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
DB_MODE=auto
JWT_SECRET=cambia_esto_por_un_secret_largo
ADMIN_EMAIL=admin@coronahub.local
ADMIN_PASSWORD=cambia_esto_por_password_seguro
IP_HASH_SALT=cambia_esto_por_un_salt_seguro
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=coronahub
```

Modos de DB:
- `DB_MODE=mongo`: solo MongoDB.
- `DB_MODE=file`: `server/data/db.json`.
- `DB_MODE=auto`: intenta Mongo y si falla usa archivo.

## Scripts utiles

Raiz:
- `npm run dev`: levanta client + server.
- `npm run dev:client`: levanta solo frontend.
- `npm run dev:server`: levanta solo backend.

Client:
- `npm run dev --prefix client`: desarrollo Webpack.
- `npm run build --prefix client`: build produccion.
- `npm run preview --prefix client`: servidor de preview.

## Verificacion

1. Abrir `http://localhost:4000/api/health` y comprobar `{"ok": true}`.
2. Abrir `http://localhost:5173`.

## Endpoints principales

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
