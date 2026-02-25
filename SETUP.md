# CoronaHUB - Setup completo (facil)

Este proyecto es un monorepo con dos apps:
- `client/` (frontend React + Vite)
- `server/` (API Express)

Tambien puede usar 2 modos de base de datos:
- `DB_MODE=mongo`: usa MongoDB siempre.
- `DB_MODE=file`: usa `server/data/db.json` (sin MongoDB).
- `DB_MODE=auto`: intenta MongoDB y, si falla, usa archivo.

## 1) Requisitos minimos

- Node.js 18 o superior (recomendado LTS)
- npm (viene con Node)
- Git
- MongoDB Community Server (solo si quieres usar `DB_MODE=mongo` o `DB_MODE=auto` con Mongo activo)

Opcional:
- MongoDB Compass para ver datos visualmente

## 2) Clonar proyecto

```bash
git clone <TU_REPO>
cd CoronaHUB
```

## 3) Instalar dependencias

Ejecuta desde la raiz del repo:

```bash
npm install
npm run install:all
```

Esto instala:
- dependencias raiz (por ejemplo `concurrently`)
- dependencias de `client/`
- dependencias de `server/`

## 4) Configurar backend (`server/.env`)

Copia la plantilla:

```bash
cp server/.env.example server/.env
```

Ahora edita `server/.env` y deja algo asi:

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

## 5) Levantar MongoDB (si usas modo mongo/auto)

Si MongoDB no esta arrancado, la app puede caer a archivo en `DB_MODE=auto`.

En Windows (PowerShell admin):

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

En Linux con systemd:

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

## 6) Ejecutar proyecto

Desde la raiz:

```bash
npm run dev
```

URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Healthcheck: http://localhost:4000/api/health

## 7) Verificar que todo funciona

1. Abre `http://localhost:4000/api/health` y comprueba que responde `{"ok": true}`.
2. Abre el frontend en `http://localhost:5173`.
3. Si usas MongoDB, comprueba en Compass que aparece la base `coronahub` al guardar datos.

## 8) Errores tipicos

- `ECONNREFUSED 127.0.0.1:27017`
  - MongoDB no esta levantado.
- `NoServiceFoundForGivenName`
  - MongoDB Community Server no esta instalado o el nombre del servicio no coincide.
- `'mongosh' no se reconoce`
  - No pasa nada para este proyecto; puedes trabajar con Compass.

## 9) Bloque rapido (Bash) para "de cero a funcionando"

Este bloque te deja todo listo en local:

```bash
# 1) Clonar

git clone <TU_REPO>
cd CoronaHUB

# 2) Instalar dependencias (raiz + client + server)
npm install
npm run install:all

# 3) Crear .env backend desde plantilla
cp server/.env.example server/.env

# 4) (Opcional) Edita secretos/credenciales antes de arrancar
# nano server/.env

# 5) Arrancar app (client + server)
npm run dev
```

Si quieres forzar MongoDB, cambia en `server/.env`:

```env
DB_MODE=mongo
```

Si quieres trabajar sin MongoDB:

```env
DB_MODE=file
```
