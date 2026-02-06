# CoronaHUB - Setup Rapido

## Requisitos
- Node.js 18+ (ideal 20/24)

## 1) Instalar dependencias
Desde la raiz del repo:

```bash
npm install
npm run install:all
```

## 2) Configurar variables
Revisa `server/.env` y ajusta:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `IP_HASH_SALT`
- `CORS_ORIGIN` (por defecto http://localhost:5173)

## 3) Ejecutar en desarrollo
En la raiz:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/health

## 4) Uso basico
- Opiniones: se envian como PENDING y se aprueban en `/admin/dashboard`
- Reservas: se envian como PENDING y se confirman en `/admin/dashboard`

## Solucion de problemas
- Si `concurrently` falla: ejecuta `npm install` en la raiz.
- Si el front no carga: revisa `client/.env` con `VITE_API_URL`.
- Si el backend no arranca: revisa `server/.env`.
