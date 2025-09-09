# Refactoring: Migración de handleApiRequest a handleRequest

## 📋 Resumen del Proyecto

**Objetivo:** Unificar el sistema de requests HTTP eliminando `handleApiRequest` y usando únicamente `handleRequest` para tener un sistema más robusto y consistente.

**Razones para la migración:**
- `handleRequest` es más maduro y robusto (maneja uploads, downloads, timeouts, simulación)
- Eliminar duplicación de código y lógica
- Consistencia en el manejo de errores
- Mejor integración con `authInterceptor`

## 🎯 Estrategia de Migración

**Enfoque:** Migración directa archivo por archivo
- ✅ **Ventaja:** Cambios limpios sin código bridge temporal
- ✅ **Proceso:** Un archivo a la vez, probar manualmente después de cada cambio
- ✅ **Seguridad:** Build y type-check después de cada migración

## 📊 Estado Actual de Migración

### ✅ Archivos Migrados (1/8)

| Archivo | Estado | Fecha | Notas |
|---------|--------|-------|-------|
| `src/libs/presentation/hooks/useEmail.ts` | ✅ **COMPLETADO** | 2025-01-25 | Build exitoso, 5 funciones migradas |

### 🔄 Archivos Pendientes (7/8)

| Archivo | Prioridad | Complejidad | Notas |
|---------|-----------|-------------|-------|
| `src/libs/presentation/hooks/useCloudinary.ts` | 🟡 **SIGUIENTE** | Media | Maneja uploads de archivos |
| `src/libs/presentation/hooks/useUserService.ts` | 🟢 Alta | Media | Hook crítico de usuarios |
| `src/libs/presentation/hooks/useReservationService.ts` | 🟢 Alta | Media | Hook crítico de reservas |
| `src/libs/presentation/hooks/useStripe.ts` | 🟡 Media | Alta | Pagos - requiere cuidado especial |
| `src/libs/shared/utils/handleApiRequest.ts` | 🔴 **DEPRECAR** | Baja | Eliminar después de migrar todo |
| `src/libs/shared/utils/index.ts` | 🔴 Baja | Baja | Actualizar exports |

## 🔧 Patrón de Migración

### Antes (handleApiRequest):
```typescript
import { handleApiRequest } from '@shared/utils/handleApiRequest';

const response = await handleApiRequest('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
  },
});

return response?.data ?? null;
```

### Después (handleRequest):
```typescript
import { handleRequest } from '@libs/infrastructure/services/core/http/handleRequest';

const response = await handleRequest({
  endpoint: '/api/endpoint',
  method: 'POST',
  body: data, // Ya no necesita JSON.stringify
  headers: {
    'Content-Type': 'application/json',
  },
});

return response ?? null; // Ya no necesita .data
```

## ✅ Checklist de Migración por Archivo

### Para cada archivo a migrar:

#### 🔄 Pre-migración
- [ ] Identificar todas las llamadas a `handleApiRequest`
- [ ] Revisar si hay lógica especial (uploads, downloads, etc.)
- [ ] Backup del archivo original (git commit)

#### 🛠️ Durante la migración
- [ ] Actualizar import: `@shared/utils/handleApiRequest` → `@libs/infrastructure/services/core/http/handleRequest`
- [ ] Convertir cada llamada `handleApiRequest()` → `handleRequest({})`
- [ ] Cambiar parámetros:
  - [ ] `url` → `endpoint`
  - [ ] `options.method` → `method`
  - [ ] `options.body` → `body` (sin `JSON.stringify`)
  - [ ] `options.headers` → `headers`
- [ ] Actualizar manejo de respuesta:
  - [ ] `response?.data` → `response`
  - [ ] Revisar lógica de error handling

#### ✅ Post-migración
- [ ] `yarn type-check` - Sin errores TypeScript
- [ ] `yarn build` - Build exitoso
- [ ] Prueba manual de funcionalidad
- [ ] Git commit con mensaje descriptivo

## 📝 Registro de Cambios

### ✅ useEmail.ts (COMPLETADO - 2025-01-25)
**Funciones migradas:**
- [x] `sendEmail()` - Email genérico
- [x] `sendReservationConfirmation()` - Confirmación de reserva
- [x] `sendReservationCancellation()` - Cancelación de reserva  
- [x] `sendPaymentConfirmation()` - Confirmación de pago
- [x] `sendCheckInReminder()` - Recordatorio de check-in

**Resultados:**
- ✅ TypeScript: Sin errores
- ✅ Build: Exitoso en 21.70s
- ✅ Funcionalidad: Mantiene misma API externa

### 🔄 useCloudinary.ts (SIGUIENTE)
**Funciones a migrar:**
- [ ] `uploadImage()` - Upload individual
- [ ] `uploadMultipleImages()` - Upload múltiple
- [ ] `deleteImage()` - Eliminación de imagen
- [ ] `generateImageUrl()` - Generación de URLs
- [ ] `generateThumbnailUrl()` - Generación de thumbnails

**Consideraciones especiales:**
- Maneja `FormData` para uploads
- Requiere configuración especial de headers
- Progress tracking para uploads

## 🚨 Casos Especiales y Consideraciones

### 📤 Uploads (useCloudinary)
- `handleRequest` ya soporta uploads via `upload` parameter
- Cambiar de `FormData` manual a configuración `upload`
- Mantener progress tracking

### 💳 Pagos (useStripe)  
- Crítico para funcionalidad de pagos
- Probar exhaustivamente con Stripe sandbox
- Verificar webhooks y callbacks

### 🔐 Autenticación
- `handleRequest` usa `injectAuthorizationHeader` automáticamente
- Verificar que tokens se manejen correctamente
- Probar casos de token expirado

## 📋 Checklist Final del Proyecto

### Cuando todas las migraciones estén completas:

#### 🗑️ Limpieza
- [ ] Eliminar `src/libs/shared/utils/handleApiRequest.ts`
- [ ] Actualizar `src/libs/shared/utils/index.ts`
- [ ] Buscar imports huérfanos: `grep -r "handleApiRequest" src/`
- [ ] Buscar referencias en documentación

#### ✅ Validación Final  
- [ ] `yarn type-check` - Proyecto completo sin errores
- [ ] `yarn build` - Build exitoso
- [ ] `yarn lint` - Sin warnings nuevos
- [ ] Pruebas manuales de funcionalidades críticas:
  - [ ] Login/Logout
  - [ ] Envío de emails
  - [ ] Upload de imágenes
  - [ ] Procesar pagos
  - [ ] Crear reservas

#### 📚 Documentación
- [ ] Actualizar `CLAUDE.md` con nuevo patrón
- [ ] Actualizar documentación de arquitectura
- [ ] Añadir ejemplo en `docs/FRONTEND.md`

## 🎯 Próximos Pasos

1. **Continuar con useCloudinary.ts** - Siguiente archivo de complejidad media
2. **Migrar hooks críticos** - useUserService y useReservationService  
3. **Casos especiales** - useStripe requiere atención especial
4. **Limpieza final** - Eliminar handleApiRequest.ts

## 📞 Notas del Desarrollador

**Fecha de inicio:** 25 de enero de 2025
**Progreso:** 1/8 archivos (12.5%)
**Tiempo estimado por archivo:** 10-15 minutos
**Tiempo total estimado:** 2-3 horas

**Riesgos identificados:**
- Uploads de archivos requieren configuración especial
- Pagos Stripe son críticos para funcionalidad
- Verificar integración con authInterceptor

**Beneficios esperados:**
- Sistema HTTP unificado y robusto  
- Mejor manejo de errores automático
- Menos código duplicado
- Integración automática con autenticación