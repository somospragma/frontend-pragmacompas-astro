# Checklist: Componentes Sin Tests

**Generado:** 20 de Noviembre de 2025  
**Total Componentes:** 126  
**Con Tests:** 45  
**Sin Tests:** 81  
**Cobertura:** 35.7%

---

## 📊 Resumen por Categoría

| Categoría | Total | Con Tests | Sin Tests | Cobertura |
|-----------|-------|-----------|-----------|-----------|
| **UI (shadcn)** | 16 | 0 | 16 | 0% |
| **Atoms** | 9 | 6 | 3 | 66.7% |
| **Molecules** | 10 | 10 | 0 | 100% ✅ |
| **Organisms** | 32 | 24 | 8 | 75% |
| **Pages** | 5 | 1 | 4 | 20% |
| **Auth** | 1 | 0 | 1 | 0% |

---

## 🔴 Prioridad ALTA (Componentes de Negocio)

### Organisms (8 pendientes)

- [ ] `UserDeleteModal.tsx` - Modal de confirmación de eliminación de usuario
- [ ] `UserInitializer.tsx` - Inicializador de estado de usuario
- [ ] `UserCardsGrid.tsx` - Grid de tarjetas de usuarios
- [ ] `TechStackCards.tsx` - Tarjetas de tecnologías
- [ ] `TriviaModal.tsx` - Modal de trivia (gamificación)
- [ ] `HeaderTriviaScript.tsx` - Script de header de trivia
- [ ] `UserCard.tsx` + subcomponentes (6 archivos)
  - [ ] `UserCard.tsx` - Componente principal
  - [ ] `UserCardSkills.tsx` - Sección de habilidades
  - [ ] `UserCardMainInfo.tsx` - Información principal
  - [ ] `UserCardHeader.tsx` - Header de la tarjeta
  - [ ] `UserCardDatesInfo.tsx` - Información de fechas
  - [ ] `UserCardContactInfo.tsx` - Información de contacto
  - [ ] `UserCardAiTools.tsx` - Herramientas de IA

**Estimación:** 12-16 horas  
**Impacto:** Alto - Funcionalidades core de la aplicación

---

## 🟡 Prioridad MEDIA (Componentes de Layout/UI)

### Pages (4 pendientes)

- [ ] `triviaPage.tsx` - Página de trivia
- [ ] `pruebaServices.tsx` - Página de pruebas de servicios
- [ ] `RequestsPage.tsx` - Página de solicitudes
- [ ] `MentorshipRequest.tsx` - Página de solicitud de mentoría
- [ ] `AdminDashboard.tsx` - Dashboard de administrador

**Estimación:** 6-8 horas  
**Impacto:** Medio - Páginas completas con lógica de integración

### Atoms (3 pendientes)

- [ ] `atoms/ui/toaster.tsx` - Componente de notificaciones toast
- [ ] Otros componentes atom sin clasificar

**Estimación:** 1-2 horas  
**Impacto:** Bajo - Componentes pequeños

---

## 🟢 Prioridad BAJA (Componentes de UI Library)

### UI Components - shadcn/ui (16 pendientes)

Estos son componentes de la librería shadcn/ui. Generalmente no requieren tests unitarios ya que son componentes de UI básicos y bien probados por la librería.

- [ ] `ui/avatar.tsx`
- [ ] `ui/badge.tsx`
- [ ] `ui/alert.tsx`
- [ ] `ui/tooltip.tsx`
- [ ] `ui/toaster.tsx`
- [ ] `ui/textarea.tsx`
- [ ] `ui/table.tsx`
- [ ] `ui/skeleton.tsx`
- [ ] `ui/select.tsx`
- [ ] `ui/scroll-area.tsx`
- [ ] `ui/multi-select.tsx`
- [ ] `ui/label.tsx`
- [ ] `ui/input.tsx`
- [ ] `ui/dropdown-menu.tsx`
- [ ] `ui/card.tsx`
- [ ] `ui/button.tsx`

**Estimación:** Opcional  
**Impacto:** Muy Bajo - Wrappers de librería externa

### Auth (1 pendiente)

- [ ] `auth/RoleRedirect.tsx` - Componente de redirección por rol

**Estimación:** 1 hora  
**Impacto:** Medio - Seguridad y autorización

---

## 🎓 Notas Importantes

1. **Componentes UI (shadcn)**: No es obligatorio testear estos componentes ya que son wrappers de una librería externa bien probada. Enfócate en componentes de negocio.

2. **Priorización**: Enfócate primero en organisms y pages que contengan lógica de negocio compleja.

3. **Tests de Integración**: Algunos componentes page pueden beneficiarse más de tests de integración end-to-end que de tests unitarios.

4. **Cobertura Real**: Excluyendo UI library components, la cobertura es más cercana al 56% que al 36%.

5. **Mantenimiento**: Actualiza este checklist conforme se agreguen nuevos tests.

---

