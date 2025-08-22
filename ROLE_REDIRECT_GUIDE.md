# 🚀 Sistema de Redirección Basada en Roles - Pragma Compass

Este sistema redirige automáticamente a los usuarios al dashboard correcto según su rol después del login.

## 🎯 Funcionamiento

### Roles y Dashboards:
- **Tutor** → `/dashboard/tutor`
- **Administrador** → `/dashboard/admin` 
- **Tutorado** → `/dashboard/tutorado`

## 🔧 Implementación

### 1. **Middleware del Servidor** (`src/middleware.ts`)
- **Redirección automática**: Si un usuario autenticado accede a `/dashboard/*` pero no está en su dashboard correcto, se redirige automáticamente
- **Manejo de errores**: Si hay problemas con la API, permite continuar sin romper la aplicación
- **Logging**: Registra todas las redirecciones para debugging

### 2. **Componente React** (`src/components/auth/RoleRedirect.tsx`)
- **Redirección del cliente**: Para casos donde el middleware no capture la redirección
- **UI de carga**: Muestra un spinner mientras verifica el rol
- **Manejo de errores**: Interfaz amigable si hay problemas

### 3. **Hook Personalizado** (`src/hooks/useRoleRedirect.ts`)
- **`useRoleRedirect(googleUserId, autoRedirect)`**: Hook principal para manejar redirecciones
- **`useManualRoleRedirect()`**: Para redirecciones manuales
- **Estado completo**: Loading, error, rol del usuario, y si debe redirigir

### 4. **Utilidades** (`src/shared/utils/roleRedirect.ts`)
- **`getRoleBasedRoute(role)`**: Obtiene la ruta correcta para un rol
- **`isOnCorrectRoleRoute(path, role)`**: Verifica si el usuario está en la ruta correcta
- **`redirectToRoleDashboard(role)`**: Redirección manual del cliente

## 📋 Rutas Configuradas

### Nuevas Rutas Agregadas:
```typescript
DASHBOARD_TUTOR: "/dashboard/tutor"
DASHBOARD_ADMIN: "/dashboard/admin" 
DASHBOARD_TUTORADO: "/dashboard/tutorado"
```

### Mapeo de Roles:
```typescript
export const ROLE_ROUTES = {
  Tutor: "/dashboard/tutor",
  Administrador: "/dashboard/admin",
  Tutorado: "/dashboard/tutorado",
} as const;
```

## 🎨 Dashboards Creados

### 1. **Dashboard del Tutor** (`/dashboard/tutor`)
- Tutorías activas
- Solicitudes pendientes
- Horas totales
- Acciones rápidas (Ver solicitudes, Crear tutoría, etc.)

### 2. **Dashboard del Administrador** (`/dashboard/admin`)
- Estadísticas generales (usuarios, tutorías, capítulos)
- Gestión de usuarios
- Gestión de contenido
- Actividad reciente

### 3. **Dashboard del Tutorado** (`/dashboard/tutorado`)
- Tutorías activas
- Solicitudes enviadas
- Progreso de aprendizaje
- Solicitudes recientes con estados

## 🔄 Flujo de Redirección

1. **Usuario hace login** → Auth callback valida/crea usuario
2. **JWT almacena rol** → El token incluye la información del rol
3. **Middleware verifica ruta** → Si accede a `/dashboard/*`, verifica que sea la correcta
4. **Redirección automática** → Si no está en su dashboard, lo redirige
5. **Componente de respaldo** → RoleRedirect maneja casos edge del cliente

## 🛡️ Seguridad y Protección

### Rutas Protegidas:
Todas las rutas de dashboard requieren autenticación:
```typescript
export const PROTECTED_ROUTES: string[] = [
  "/dashboard",
  "/dashboard/tutor", 
  "/dashboard/admin",
  "/dashboard/tutorado",
  // ... otras rutas
];
```

### Validación de Roles:
- **Server-side**: Middleware valida roles en cada request
- **Client-side**: Componentes verifican roles antes de renderizar
- **API Integration**: Usa el servicio `validateUser` para obtener roles actualizados

## 🚦 Casos de Uso

### Escenario 1: Login Inicial
```
Usuario → Login → Validación → Redirección al dashboard correcto
```

### Escenario 2: Acceso Directo a Dashboard
```
Usuario → /dashboard/admin → Middleware verifica rol → Redirige si no es admin
```

### Escenario 3: Cambio de Rol
```
Admin cambia rol → Usuario accede → Middleware detecta cambio → Redirige al nuevo dashboard
```

## 🔧 Configuración

### Variables de Entorno:
El sistema funciona con las mismas variables que el sistema de mocks:
```bash
API_URL=http://localhost:4321/api  # Para mocks
PUBLIC_API_URL=http://localhost:4321/api
```

### Datos Mock Incluidos:
- **user-123**: Tutorado
- **user-456**: Tutor  
- **user-789**: Administrador

## 🐛 Debugging

### Logs del Middleware:
```
Ruta solicitada: /dashboard/admin
Redirecting Tutorado from /dashboard/admin to /dashboard/tutorado
```

### Logs del Cliente:
```
Redirecting Tutor from /dashboard/tutorado to /dashboard/tutor
```

### Console de Navegador:
- Network tab: Ver llamadas a `/api/v1/users/{googleId}`
- Console: Ver logs de redirección y errores

## ✅ Beneficios

1. **Seguridad**: Los usuarios solo ven su dashboard correspondiente
2. **UX Mejorada**: Redirección automática sin confusión
3. **Mantenibilidad**: Sistema centralizado y fácil de modificar
4. **Escalabilidad**: Fácil agregar nuevos roles y dashboards
5. **Robustez**: Manejo de errores en múltiples niveles

## 🎉 ¡Listo para Usar!

El sistema está completamente implementado y funcionando. Los usuarios serán redirigidos automáticamente a su dashboard correcto según su rol después del login.

**Próximos pasos sugeridos:**
- Personalizar los dashboards según necesidades específicas
- Agregar más funcionalidades específicas por rol
- Implementar notificaciones de cambio de rol
- Agregar analytics de uso por dashboard
