# CoronaHUB Monorepo

## Requisitos
- Node.js 18+

## Configuracion
1. Edita `server/.env` con tus credenciales.
2. Instala dependencias:

```bash
npm run install:all
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
- GET `/api/menu`
- POST `/api/admin/login`
- GET `/api/admin/menu`
- PUT `/api/admin/menu`
- GET `/api/admin/reviews`
- PATCH `/api/admin/reviews/:id`
- GET `/api/admin/reservations`
- PATCH `/api/admin/reservations/:id`
