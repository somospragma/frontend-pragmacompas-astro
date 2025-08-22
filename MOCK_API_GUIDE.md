# 🎭 Sistema de APIs Mock - Pragma Compass

Este sistema te permite alternar fácilmente entre usar **APIs mock locales** y el **backend real** simplemente cambiando las variables de entorno.

## 🚀 Configuración Rápida

### Para usar MOCKS (desarrollo sin backend):

1. Crea un archivo `.env` basado en `.env.example`
2. Configura estas variables:

```bash
API_URL=http://localhost:4321/api
PUBLIC_API_URL=http://localhost:4321/api
```

### Para usar el BACKEND real (producción):

```bash
API_URL=https://your-backend-api.com/api
PUBLIC_API_URL=https://your-backend-api.com/api
```

## 📋 Endpoints Mock Disponibles

### 👥 Usuarios
- `GET /api/v1/users/{id}` - Obtener usuario por ID o validar por Google ID
- `POST /api/v1/users` - Crear nuevo usuario
- `PUT /api/v1/users/{id}` - Actualizar usuario
- `GET /api/v1/users/{id}/statistics` - Estadísticas del usuario

### 🏢 Capítulos
- `GET /api/chapter/` - Listar todos los capítulos
- `POST /api/chapter/` - Crear nuevo capítulo

### 🎯 Habilidades
- `GET /api/v1/skills` - Listar todas las habilidades
- `POST /api/v1/skills` - Crear nueva habilidad
- `PUT /api/v1/skills` - Actualizar habilidad
- `DELETE /api/v1/skills?id={id}` - Eliminar habilidad

### 📝 Solicitudes de Tutoría
- `GET /api/v1/tutoring-requests` - Listar solicitudes (con filtros)
- `POST /api/v1/tutoring-requests` - Crear nueva solicitud
- `PUT /api/v1/tutoring-requests` - Actualizar estado de solicitud

### 🎓 Tutorías
- `GET /api/v1/tutorings` - Listar tutorías (con filtros)
- `POST /api/v1/tutorings` - Crear nueva tutoría
- `PUT /api/v1/tutorings` - Actualizar tutoría

## 🗄️ Datos Mock Incluidos

### Usuarios de Prueba:
- **Juan Pérez** (Tutorado) - `user-123`
- **María García** (Tutor) - `user-456`
- **Carlos López** (Administrador) - `user-789`

### Capítulos:
- Bogotá, Medellín, Cali, Barranquilla

### Habilidades:
- JavaScript, React, Node.js, Python, TypeScript, SQL

### Solicitudes y Tutorías:
- Datos de ejemplo con diferentes estados y relaciones

## 🔧 Cómo Funciona

1. **httpClient** lee la variable `API_URL` de tu configuración de entorno
2. Si apunta a `http://localhost:4321/api`, usa los mocks locales
3. Si apunta a tu backend real, usa las APIs de producción
4. **Sin cambios de código** - solo cambias las variables de entorno

## 🎯 Servicios Compatibles

Todos tus servicios existentes funcionan automáticamente:

- ✅ `validateUser`
- ✅ `postCreateUser`
- ✅ `getUserById`
- ✅ `getChapters`
- ✅ `getSkills`
- ✅ `getTutoringRequests`
- ✅ `createTutoring`
- ✅ Y todos los demás...

## 🚦 Cambio Entre Modos

### Modo Desarrollo (Mocks):
```bash
# .env
API_URL=http://localhost:4321/api
PUBLIC_API_URL=http://localhost:4321/api
```

### Modo Producción (Backend Real):
```bash
# .env
API_URL=https://api.pragmacompas.com/api
PUBLIC_API_URL=https://api.pragmacompas.com/api
```

## 🔍 Debugging

Para ver las llamadas a las APIs mock:
1. Abre las DevTools del navegador
2. Ve a la pestaña Network
3. Verás las llamadas a `localhost:4321/api/*`

## 📝 Notas Importantes

- Los datos mock se **reinician** cada vez que reinicias el servidor
- Los mocks incluyen **validación de errores** realista
- Las respuestas siguen el **mismo formato** que el backend real
- Compatible con tu sistema de **autenticación Google** existente

## 🎉 ¡Listo para Usar!

Simplemente cambia las variables de entorno y reinicia tu servidor de desarrollo. ¡No necesitas modificar ningún código!

```bash
npm run dev
# o
yarn dev
```

---

**¿Necesitas más endpoints mock?** Simplemente agrega nuevos archivos en `/src/pages/api/` siguiendo la estructura existente.
