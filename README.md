# CoronaHUB Monorepo

## Estructura

- `client/`: frontend React + Vite
- `server/`: backend Express

## Requisitos

- Node.js 18+
- npm
- MongoDB Community Server (si usas `DB_MODE=mongo` o `DB_MODE=auto` con Mongo activo)

## Configuracion rapida

1. Instala dependencias:

```bash
npm install
npm run install:all
```

2. Crea el archivo de entorno backend:

```bash
cp server/.env.example server/.env
```

3. Ajusta `server/.env` (secretos, credenciales, modo DB).

4. Inicia el proyecto:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000
- Health: http://localhost:4000/api/health

## Modos de base de datos (`server/.env`)

- `DB_MODE=mongo`: usa MongoDB siempre (produccion recomendada).
- `DB_MODE=file`: usa `server/data/db.json`.
- `DB_MODE=auto`: intenta MongoDB y si falla usa archivo.

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

## Guia completa

Revisa [SETUP.md](./SETUP.md) para el paso a paso detallado y solucion de errores.
