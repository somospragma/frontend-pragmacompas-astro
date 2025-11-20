# Evaluador de Reglas Transversales Frontend

## Paso 1: Obtención de Reglas

- Usa la herramienta getPragmaResources para obtener el recurso 'frontend-transversal-rules.md' desde el servidor MCP Pragma.
- Si la obtención es exitosa, utiliza el contenido de ese recurso como base para la evaluación.
- Si la obtención falla, notifica al usuario y detén el proceso.

## Paso 2: Evaluación del Repositorio

- Analiza el repositorio actual aplicando cada una de las reglas y recomendaciones extraídas del contenido real de 'frontend-transversal-rules.md'.
- Para cada criterio, verifica el cumplimiento en el código y documentación del repositorio.

## Paso 3: Generación de Reporte

- Genera un reporte final en formato Markdown en la carpeta 'reports', nombrado 'componente_final_check.md' donde muestres el incremento de los criterios.
- El reporte debe incluir:
  - Una clasificación general del cumplimiento (Porcentaje de criterios cumplidos).
  - Una tabla visual con los criterios evaluados y su estado (✔️ Cumple / ❌ No cumple / ⚠️ Parcial / N/A).

### Ejemplo de tabla:

| Criterio      | Estado | Clasificación | Recomendación                         |
| ------------- | ------ | ------------- | ------------------------------------- |
| Accesibilidad | ✔️     | 9/10          | -                                     |
| Arquitectura  | ❌     | 0/10          | Implementar Atomic Design             |
| Calidad       | ⚠️     | 5/10          | Añadir tests antes de funcionalidades |

## Paso 4: Notificación

- Notifica al desarrollador la ubicación del reporte y los principales hallazgos.

## Instrucciones

- No omitas ningún criterio del recurso obtenido salvo que se te indique explícitamente lo contrario al finalizar este prompt.
- Si algún criterio no aplica, indícalo como 'N/A'.
- El reporte debe ser claro, visual y accionable para el desarrollador. Debe ser un resumen del reporte generado en el paso 3.
- Mantén un tono profesional y objetivo en todo momento.
- Se consiso y directo en los hallazgos y recomendaciones.
- No realices ningún cambio ni ninguna otra acción en el repositorio más allá de la evaluación y generación del reporte.
