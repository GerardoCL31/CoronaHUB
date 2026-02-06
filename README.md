# CoronaHUB Monorepo

## Requisitos
- Node.js 18+

## Configuracion
1. Edita `server/.env` con tus credenciales.
2. Instala dependencias:

```bash
npm run install:all
```

3. Genera la base de datos:

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

## Desarrollo

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

## Endpoints
- POST `/api/reviews`
- GET `/api/reviews`
- POST `/api/reservations`
- POST `/api/admin/login`
- GET `/api/admin/reviews`
- PATCH `/api/admin/reviews/:id`
- GET `/api/admin/reservations`
- PATCH `/api/admin/reservations/:id`
