# Sistema de Anuncios de Accesibilidad

Sistema reutilizable para anunciar mensajes a lectores de pantalla usando ARIA live regions.

## 📦 Componentes

### 1. `useAccessibilityAnnouncer` (Hook)

Hook personalizado para gestionar anuncios de accesibilidad.

#### Parámetros

- `clearDelay` (opcional): Tiempo en milisegundos antes de limpiar el mensaje. Por defecto: 3000ms

#### Retorna

- `announce`: Función para anunciar un mensaje
- `clear`: Función para limpiar el mensaje manualmente
- `message`: Mensaje actual

#### Ejemplo de Uso

```tsx
import { useAccessibilityAnnouncer } from "@/shared/hooks/useAccessibilityAnnouncer";
import { AccessibilityAnnouncer } from "@/components/atoms/AccessibilityAnnouncer";

function MyComponent() {
  const { announce, message } = useAccessibilityAnnouncer();

  const handleSave = async () => {
    try {
      await saveData();
      announce("Datos guardados exitosamente");
    } catch (error) {
      announce("Error al guardar los datos");
    }
  };

  return (
    <div>
      <AccessibilityAnnouncer message={message} />
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
}
```

### 2. `AccessibilityAnnouncer` (Componente)

Componente que renderiza una live region para anuncios.

#### Props

| Prop         | Tipo                      | Por Defecto | Descripción                         |
| ------------ | ------------------------- | ----------- | ----------------------------------- |
| `message`    | `string`                  | -           | Mensaje a anunciar (requerido)      |
| `politeness` | `"polite" \| "assertive"` | `"polite"`  | Nivel de prioridad del anuncio      |
| `atomic`     | `boolean`                 | `true`      | Si lee toda la región cuando cambia |

#### Ejemplo de Uso

```tsx
import { AccessibilityAnnouncer } from "@/components/atoms/AccessibilityAnnouncer";

// Anuncio normal
<AccessibilityAnnouncer message="Operación completada" />

// Anuncio urgente (interrumpe)
<AccessibilityAnnouncer message="Error crítico" politeness="assertive" />

// Anuncio sin atomic
<AccessibilityAnnouncer message="Actualización parcial" atomic={false} />
```

## 🎯 Casos de Uso

### 1. Feedback de Formularios

```tsx
function FormComponent() {
  const { announce, message } = useAccessibilityAnnouncer();

  const handleSubmit = async (data) => {
    try {
      await submitForm(data);
      announce("Formulario enviado correctamente");
    } catch (error) {
      announce(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <AccessibilityAnnouncer message={message} />
      <form onSubmit={handleSubmit}>{/* campos del formulario */}</form>
    </>
  );
}
```

### 2. Operaciones CRUD

```tsx
function DataTable() {
  const { announce, message } = useAccessibilityAnnouncer();

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      announce("Elemento eliminado exitosamente");
    } catch (error) {
      announce("Error al eliminar el elemento");
    }
  };

  return (
    <>
      <AccessibilityAnnouncer message={message} />
      {/* tabla con botones de eliminar */}
    </>
  );
}
```

### 3. Estados de Carga

```tsx
function AsyncComponent() {
  const { announce, message } = useAccessibilityAnnouncer(5000); // 5 segundos
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      announce("Cargando datos...");
    }
  }, [isLoading, announce]);

  return (
    <>
      <AccessibilityAnnouncer message={message} />
      {/* contenido */}
    </>
  );
}
```

### 4. Notificaciones en Tiempo Real

```tsx
function NotificationCenter() {
  const { announce, message } = useAccessibilityAnnouncer();

  useEffect(() => {
    const socket = connectWebSocket();

    socket.on("notification", (notification) => {
      announce(`Nueva notificación: ${notification.title}`);
    });

    return () => socket.disconnect();
  }, [announce]);

  return <AccessibilityAnnouncer message={message} />;
}
```

## ⚙️ Configuración

### Duración del Anuncio

Controla cuánto tiempo permanece el mensaje antes de limpiarse:

```tsx
// 3 segundos (por defecto)
const { announce, message } = useAccessibilityAnnouncer();

// 5 segundos
const { announce, message } = useAccessibilityAnnouncer(5000);

// Sin auto-limpieza
const { announce, message } = useAccessibilityAnnouncer(0);
```

### Nivel de Urgencia

Controla si el anuncio interrumpe o espera:

```tsx
// Espera una pausa (por defecto)
<AccessibilityAnnouncer message={message} politeness="polite" />

// Interrumpe inmediatamente
<AccessibilityAnnouncer message={message} politeness="assertive" />
```

## ✅ Mejores Prácticas

1. **Usa "polite" para la mayoría de anuncios**: No interrumpe al usuario
2. **Usa "assertive" solo para errores críticos**: Interrumpe la lectura actual
3. **Mensajes cortos y claros**: Evita mensajes demasiado largos
4. **Auto-limpieza apropiada**: 3-5 segundos es óptimo
5. **Un anunciador por sección**: No satures con múltiples live regions

## 🧪 Testing

```tsx
import { renderHook, act } from "@testing-library/react";
import { useAccessibilityAnnouncer } from "@/shared/hooks/useAccessibilityAnnouncer";

test("should announce message", () => {
  const { result } = renderHook(() => useAccessibilityAnnouncer());

  act(() => {
    result.current.announce("Test message");
  });

  expect(result.current.message).toBe("Test message");
});
```

## 🎨 Estilos

El componente usa la clase `sr-only` de Tailwind CSS:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

Esto oculta visualmente el elemento pero lo mantiene accesible para lectores de pantalla.

## 📚 Referencias

- [ARIA Live Regions - MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [WCAG 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
- [WAI-ARIA Best Practices](https://www.w3.org/WAI/ARIA/apg/)
