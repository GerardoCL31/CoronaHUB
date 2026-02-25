# CoronaHUB Monorepo

## Estado actual del proyecto

- Frontend en `client/` con React + Webpack.
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

## MongoDB paso a paso (detallado)

### 1) Instalar MongoDB Community Server

Windows:
1. Descarga MongoDB Community Server (MSI) desde la web oficial.
2. En el instalador marca:
- `Complete`
- `Install MongoD as a Service`
3. Termina la instalacion.

Linux (Ubuntu/Debian):
1. Instala MongoDB Community Server segun la documentacion oficial de tu version.
2. Asegurate de tener el servicio `mongod`.

### 2) Levantar el servicio de MongoDB

Windows (PowerShell como administrador):

```powershell
Get-Service MongoDB
Start-Service MongoDB
Get-Service MongoDB
```

Si el servicio no aparece como `MongoDB`, prueba:

```powershell
Get-Service *mongo*
```

Linux:

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### 3) Configurar el proyecto para usar Mongo

En `server/.env` usa:

```env
DB_MODE=mongo
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=coronahub
```

Notas:
- `DB_MODE=mongo` obliga a usar MongoDB (si Mongo no arranca, el backend falla).
- `DB_MODE=auto` intenta Mongo y, si no puede conectar, usa archivo local.

### 4) Arrancar proyecto

Desde la raiz:

```bash
npm run dev
```

### 5) Verificar que Mongo esta funcionando con la app

1. Comprueba salud backend:
- `http://localhost:4000/api/health`
2. Crea una reserva/opinion desde la app.
3. Abre MongoDB Compass y conecta a:
- `mongodb://127.0.0.1:27017`
4. Verifica que existe la base `coronahub` y colecciones como `reservations`/`reviews`.

### 6) Errores tipicos y solucion

- `ECONNREFUSED 127.0.0.1:27017`
  - MongoDB no esta levantado.
  - Solucion: iniciar servicio (`Start-Service MongoDB` o `systemctl start mongod`).

- `NoServiceFoundForGivenName`
  - El nombre del servicio no coincide o Mongo no esta instalado.
  - Solucion: buscar con `Get-Service *mongo*` y arrancar el nombre correcto.

- `mongosh no se reconoce`
  - Falta `mongosh` en PATH.
  - No bloquea el proyecto; puedes usar Compass para verificar datos.

- El backend arranca pero guarda en archivo y no en Mongo
  - Seguramente `DB_MODE=auto` y Mongo esta caido.
  - Solucion: usa `DB_MODE=mongo` para forzar Mongo y detectar el fallo al instante.

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
