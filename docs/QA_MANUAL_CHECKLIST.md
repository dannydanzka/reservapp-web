# QA Manual Testing Checklist - ReservApp

Checklist completo para pruebas de QA Manual en el ecosistema ReservApp preparado para la integración con aplicación móvil.

## 📋 Estado Actual del Sistema

**Plataforma Web:** ✅ PRODUCCIÓN ESTABLE  
**URL:** https://reservapp-web.vercel.app  
**Última actualización:** Enero 11, 2025  
**Estado de construcción:** Cero errores TypeScript, cero advertencias ESLint

## 🎯 Preparación para Integración Móvil

### Demo Accounts (password: password123)
- **Admin:** `admin@reservapp.com` - Rol ADMIN
- **Usuario:** `user@reservapp.com` - Rol USER

### APIs Disponibles para Móvil
- ✅ **50+ endpoints serverless** listos para consumo móvil
- ✅ **Navegación sin token** para servicios públicos
- ✅ **JWT Authentication** con bcrypt implementado
- ✅ **Sistema de pagos Stripe** completamente integrado

---

## 🔍 Checklist de Pruebas por Módulos

### 1. **Autenticación y Autorización**

#### 1.1 Registro de Usuarios
- [ ] Registro exitoso con email válido
- [ ] Validación de campos obligatorios
- [ ] Validación de formato de email
- [ ] Validación de fortaleza de contraseña
- [ ] Manejo de emails duplicados
- [ ] Confirmación por email (si aplica)

#### 1.2 Inicio de Sesión
- [ ] Login exitoso con credenciales válidas
- [ ] Rechazo de credenciales inválidas
- [ ] Manejo de usuarios inexistentes
- [ ] Persistencia de sesión
- [ ] Logout correcto
- [ ] Redirección post-login según rol

#### 1.3 Roles y Permisos
- [ ] **ADMIN**: Acceso completo al dashboard
- [ ] **USER**: Acceso limitado según permisos
- [ ] **BUSINESS**: Gestión de negocio (si aplica)
- [ ] Restricciones por rol funcionando
- [ ] Redirección correcta según permisos

### 2. **Registro de Negocios**

#### 2.1 Flujo Multi-paso
- [ ] Paso 1: Información básica del negocio
- [ ] Paso 2: Detalles de ubicación (Google Places)
- [ ] Paso 3: Configuración de servicios
- [ ] Paso 4: Integración de pagos Stripe
- [ ] Validación de cada paso
- [ ] Navegación entre pasos
- [ ] Guardado de progreso

#### 2.2 Integración con Stripe
- [ ] Conexión exitosa con cuenta Stripe
- [ ] Verificación de cuentas de negocio
- [ ] Configuración de métodos de pago
- [ ] Manejo de errores de Stripe

### 3. **Gestión de Servicios**

#### 3.1 CRUD de Servicios
- [ ] Crear servicio nuevo
- [ ] Listar servicios existentes
- [ ] Editar detalles de servicio
- [ ] Eliminar servicio
- [ ] Validación de campos obligatorios
- [ ] Subida de imágenes (Cloudinary)

#### 3.2 API Pública (Para Móvil)
- [ ] Listado público de servicios (sin token)
- [ ] Filtrado por categoría
- [ ] Filtrado por ubicación
- [ ] Búsqueda por nombre
- [ ] Paginación correcta
- [ ] Datos completos en respuesta

### 4. **Sistema de Reservas**

#### 4.1 Creación de Reservas
- [ ] Selección de servicio
- [ ] Selección de fecha y hora disponible
- [ ] Ingreso de datos del cliente
- [ ] Confirmación de reserva
- [ ] Generación de ID único
- [ ] Notificaciones automáticas

#### 4.2 Gestión de Reservas (Admin)
- [ ] Vista de todas las reservas
- [ ] Filtrado por fecha
- [ ] Filtrado por estado
- [ ] Check-in manual
- [ ] Check-out manual
- [ ] Cancelación de reservas
- [ ] Modificación de reservas

#### 4.3 Estados de Reserva
- [ ] **PENDING**: Reserva pendiente de confirmación
- [ ] **CONFIRMED**: Reserva confirmada
- [ ] **CHECKED_IN**: Cliente registrado
- [ ] **CHECKED_OUT**: Servicio completado
- [ ] **CANCELLED**: Reserva cancelada
- [ ] **NO_SHOW**: Cliente no se presentó

### 5. **Sistema de Pagos Integrado**

#### 5.1 Procesamiento de Pagos
- [ ] Creación de intención de pago
- [ ] Procesamiento con Stripe
- [ ] Confirmación de pago exitoso
- [ ] Manejo de pagos rechazados
- [ ] Reembolsos (si aplica)
- [ ] Recibos automáticos

#### 5.2 Analytics de Pagos
- [ ] Reporte de ingresos por período
- [ ] Detalles de transacciones
- [ ] Estados de pago correctos
- [ ] Integración con dashboard admin

### 6. **Dashboard Administrativo**

#### 6.1 Métricas y Estadísticas
- [ ] Total de reservas por período
- [ ] Ingresos generados
- [ ] Servicios más populares
- [ ] Tasa de no-show
- [ ] Gráficos y visualizaciones

#### 6.2 Gestión de Usuarios
- [ ] Lista de usuarios registrados
- [ ] Detalles de perfil de usuario
- [ ] Historial de reservas por usuario
- [ ] Gestión de roles (si aplica)

### 7. **Internacionalización (i18n)**

#### 7.1 Soporte Multi-idioma
- [ ] **Español**: 750+ claves de traducción
- [ ] **Inglés**: Traducciones completas
- [ ] Cambio de idioma dinámico
- [ ] Persistencia de preferencia
- [ ] Formato de fechas localizado
- [ ] Formato de moneda localizado

### 8. **Interfaz de Usuario (UI/UX)**

#### 8.1 Diseño Responsive
- [ ] **Desktop**: 1920x1080, 1366x768
- [ ] **Tablet**: iPad, Surface
- [ ] **Mobile**: iPhone, Android (preparación para app)
- [ ] Navegación intuitiva
- [ ] Carga rápida de páginas

#### 8.2 Componentes UI
- [ ] Botones interactivos
- [ ] Forms con validación visual
- [ ] Modales y dialogs
- [ ] Loading states
- [ ] Error states
- [ ] Success states

### 9. **APIs para Integración Móvil**

#### 9.1 Endpoints Públicos (Sin autenticación)
- [ ] `GET /api/public/services` - Lista de servicios
- [ ] `GET /api/public/venues` - Lista de negocios
- [ ] Respuestas JSON correctas
- [ ] Códigos HTTP apropiados
- [ ] CORS configurado para móvil

#### 9.2 Endpoints Autenticados
- [ ] `POST /api/auth/login` - Autenticación
- [ ] `POST /api/auth/register` - Registro
- [ ] `GET /api/reservations` - Mis reservas
- [ ] `POST /api/reservations` - Nueva reserva
- [ ] Headers de autorización JWT
- [ ] Refresh token (si aplica)

#### 9.3 Integración de Pagos
- [ ] `POST /api/payments/create-intent` - Intención de pago
- [ ] `POST /api/payments/confirm` - Confirmar pago
- [ ] Webhooks de Stripe funcionando
- [ ] Sincronización de estados

### 10. **APIs Reales y Base de Datos**

#### 10.1 Conexión a Base de Datos Real
- [ ] **CRÍTICO**: Verificar conexión Prisma a MySQL funcionando
- [ ] **CRÍTICO**: Todas las tablas creadas correctamente
- [ ] **CRÍTICO**: Datos de prueba/seed cargados en BD real
- [ ] **CRÍTICO**: Consultas Prisma funcionando sin errores

#### 10.2 APIs Reales Funcionando (Sin Mocks)
- [ ] **ServicesPage**: httpPublicApiService.getPublicVenues() funcionando
- [ ] **Admin Dashboard**: APIs de servicios conectadas a BD real
- [ ] **Reservas**: CRUD completo usando base de datos real
- [ ] **Usuarios**: Autenticación y gestión usando BD real
- [ ] **Pagos**: Stripe integrado con BD real para persistencia

#### 10.3 Eliminación Completa de Mocks
- [ ] ✅ **ELIMINADO**: VenueApiService mock
- [ ] ✅ **ELIMINADO**: service.slice.stub.ts
- [ ] ✅ **ELIMINADO**: useService.stub.ts  
- [ ] ✅ **ELIMINADO**: Mock venues hardcodeados
- [ ] **VERIFICAR**: No quedan imports a archivos eliminados
- [ ] **VERIFICAR**: No quedan referencias a mocks en código

#### 10.4 Validación API Real para Móvil
- [ ] **PARA MÓVIL**: APIs públicas funcionando con datos reales
- [ ] **PARA MÓVIL**: Estructura JSON consistente de BD real
- [ ] **PARA MÓVIL**: Paginación funcionando correctamente
- [ ] **PARA MÓVIL**: Filtros y búsquedas con BD real operativas

### 11. **Seguridad y Performance**

#### 11.1 Seguridad
- [ ] Validación de input en servidor
- [ ] Sanitización de datos
- [ ] Protección CSRF
- [ ] Headers de seguridad
- [ ] Tokens JWT seguros
- [ ] Encriptación de contraseñas (bcrypt)

#### 11.2 Performance
- [ ] Tiempo de carga < 3 segundos
- [ ] Bundle size optimizado (99.8 kB)
- [ ] Lazy loading de componentes
- [ ] Optimización de imágenes
- [ ] CDN de Vercel activo

---

## 🔄 Flujos Críticos para Móvil

### Flujo 1: Usuario Final (Móvil → Web API)
1. **Móvil**: Buscar servicios disponibles
2. **Web API**: Retornar lista filtrada
3. **Móvil**: Seleccionar y reservar
4. **Web API**: Procesar pago y confirmar
5. **Ambos**: Notificaciones de estado

### Flujo 2: Negocio (Web Dashboard)
1. **Web**: Recibir notificación de reserva
2. **Admin**: Revisar y confirmar
3. **Sistema**: Actualizar estado
4. **Móvil**: Notificar al cliente

### Flujo 3: Sincronización de Datos
1. **Verificar**: Consistencia entre plataformas
2. **Validar**: Estados de reserva sincronizados
3. **Confirmar**: Pagos reflejados en ambas plataformas

---

## 📱 Preparación para App Móvil

### Endpoints Críticos Listos
- ✅ Autenticación JWT
- ✅ CRUD de reservas
- ✅ Pagos con Stripe
- ✅ Servicios públicos
- ✅ Notificaciones

### Consideraciones Técnicas
- **CORS**: Configurado para dominios móviles
- **Rate Limiting**: Preparado para alto volumen
- **Error Handling**: Respuestas consistentes
- **Documentation**: API docs con Swagger

---

## 🚨 Casos de Error Críticos

### Errores de Conectividad
- [ ] Falta de conexión a internet
- [ ] Timeout de servidor
- [ ] Errores 500/502/503
- [ ] Fallback y retry logic

### Errores de Pagos
- [ ] Tarjeta rechazada
- [ ] Fondos insuficientes
- [ ] Problemas con Stripe
- [ ] Cancelación durante pago

### Errores de Reservas
- [ ] Servicio ya no disponible
- [ ] Horario ocupado
- [ ] Negocio cerrado
- [ ] Datos inválidos

---

## 📊 Métricas de Éxito

### Funcionalidad
- **100%** de casos exitosos en flujo feliz
- **90%+** de manejo correcto de errores
- **Cero** errores críticos en producción

### Performance
- **< 3 seg** tiempo de carga inicial
- **< 1 seg** respuesta de APIs
- **99.9%** disponibilidad del sistema

### Preparación Móvil
- **100%** endpoints documentados
- **100%** compatibilidad CORS
- **100%** consistencia de datos

---

**📅 Fecha de creación:** Enero 12, 2025  
**🔗 Referencia:** [CLAUDE.md](../CLAUDE.md) - Estado de producción  
**🚀 Estado:** Listo para pruebas de integración móvil