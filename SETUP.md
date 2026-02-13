REQUISITOS

Node.js 18+ (mejor LTS)
Git
MongoDB Community Server (OBLIGATORIO)
MongoDB Compass (opcional, recomendado)
IMPORTANTE

Compass NO levanta la base de datos.
El que levanta la BBDD es MongoDB Community Server (servicio MongoDB).
PASOS COMPLETOS

Instalar MongoDB en Windows
Instalar MongoDB Community Server (MSI).
En la instalación marcar:
Complete
Install MongoD as a Service
Verificar servicio MongoDB
Abrir PowerShell como Administrador y ejecutar:
Get-Service mongo
Si aparece MongoDB, arrancar:
Start-Service MongoDB

Clonar proyecto
git clone <TU_REPO>
cd CoronaHUB

Instalar dependencias
npm install
npm run install:all

Configurar variables backend
Editar archivo: server/.env
Contenido mínimo recomendado:

PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=tu_secret_seguro
ADMIN_EMAIL=tu_email_admin
ADMIN_PASSWORD=tu_password_admin
IP_HASH_SALT=tu_salt_seguro
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=coronahub

Levantar proyecto
Desde la raíz del repo:
npm run dev
URLs:

Frontend: http://localhost:5173
Backend: http://localhost:4000
Health: http://localhost:4000/api/health
Comprobar en Compass
Add new connection
URI: mongodb://127.0.0.1:27017
Connect
Debe aparecer la base coronahub cuando la app guarde datos.
ERRORES TÍPICOS Y SOLUCIÓN

Error: NoServiceFoundForGivenName

MongoDB Community Server no está instalado.
Error: ECONNREFUSED 127.0.0.1:27017

El servicio MongoDB está apagado.
Solución: Start-Service MongoDB
Error: 'mongosh' no se reconoce

mongosh no está en PATH.
Puedes usar Compass directamente sin problema.
BACKUP / MIGRACIÓN DE DATOS (opcional)

Para llevar datos de un equipo a otro:
Opción A: mongodump/mongorestore
Opción B: conservar server/data/db.json como respaldo temporal
RESUMEN CORTO

Instalas MongoDB Server + Node
Clonas repo
npm install + npm run install:all
Configuras server/.env
Start-Service MongoDB
npm run dev
Verificas en Compass