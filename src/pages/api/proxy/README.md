# Proxy API para Backend

## ¿Por qué?

Cuando la app está desplegada en Vercel (HTTPS) e intenta hacer requests a un backend HTTP, los navegadores bloquean estas peticiones por **mixed-content**. Este proxy soluciona el problema.

## ¿Cómo funciona?

1. **Cliente (navegador)**: Hace requests a `/api/proxy/*` (HTTPS)
2. **Proxy (Astro SSR)**: Recibe la request y la reenvía al backend HTTP
3. **Backend**: Procesa la request y responde al proxy
4. **Proxy**: Devuelve la respuesta al cliente

```
[Cliente HTTPS] → [Proxy HTTPS] → [Backend HTTP] → [Proxy] → [Cliente]
```

## Configuración

### Variables de entorno

En Vercel o tu entorno de producción:

```bash
API_URL=http://tu-backend-interno.com/api  # Puede ser HTTP (server-side)
PUBLIC_API_URL=http://tu-backend.com/api   # Solo para fallback server-side
```

### Uso en servicios

Los servicios **no necesitan cambios**, el `httpClient` automáticamente usa el proxy en el cliente:

```typescript
// Esto funciona automáticamente
await httpClient.get("/api/v1/users");

// En cliente → GET /api/proxy/api/v1/users
// En servidor → GET http://backend.com/api/v1/users
```

## Debugging

Para ver las requests que pasan por el proxy, revisa los logs en Vercel:

```
[Proxy] GET http://backend.com/api/v1/users
[Proxy] POST http://backend.com/api/v1/tutorings
```

## Notas

- El proxy solo se usa en el **cliente (navegador)**
- En **SSR (servidor)**, Astro hace las requests directamente al backend
- El timeout se aumentó a 10 segundos para requests más lentas
