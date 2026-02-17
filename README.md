# CoronaHUB Monorepo

<img width="1902" height="945" alt="image" src="https://github.com/user-attachments/assets/95495fe7-7ec3-47ad-a98d-253c0cc30fa4" />


## Requisitos
- Node.js 18+

## Configuracion
1. Edita `server/.env` con tus credenciales.
2. Define `DB_MODE` segun tu entorno:
   - `DB_MODE=mongo` para produccion (recomendado en dominio propio).
   - `DB_MODE=file` para desarrollo local con `server/data/db.json`.
   - `DB_MODE=auto` (default): usa Mongo y si falla, hace fallback a archivo.
3. Instala dependencias:

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
