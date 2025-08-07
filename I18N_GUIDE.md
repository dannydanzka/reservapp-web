# Sistema de Internacionalización (i18n) - ReservApp

## 📚 Guía Completa del Sistema i18n

### 🔧 Estructura del Sistema

```
src/libs/i18n/
├── index.ts              # Exportaciones principales
├── useTranslation.ts     # Hook personalizado
└── translations.json     # Todas las traducciones (750+ claves)
```

### 🚀 Uso Básico

```typescript
import { useTranslation } from '@/libs/i18n';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('services.title')}</h1>
      <p>{t('services.subtitle')}</p>
      <button>{t('common.submit')}</button>
    </div>
  );
};
```

### 🎯 Funcionalidades Avanzadas

#### 1. Parámetros Dinámicos
```typescript
// En translations.json: "welcome": "Bienvenido {name}!"
const welcomeMessage = t('welcome', { name: 'Juan' });
// Resultado: "Bienvenido Juan!"
```

#### 2. Arrays (para listas de características)
```typescript
// En translations.json: "features": ["Característica 1", "Característica 2"]
const features = t('business.pricing.basic.features', { returnObjects: true }) as string[];
features.map((feature, index) => (
  <li key={index}>{feature}</li>
));
```

#### 3. Texto Multilínea
```typescript
// En translations.json: "address": "Línea 1\nLínea 2\nLínea 3"
{t('contact.info.officesAddress')
  .split('\n')
  .map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ))}
```

## 📋 Estructura de Claves de Traducción

### 🏠 **landing** - Página Principal
```
landing.hero.title           - Título principal
landing.hero.subtitle        - Subtítulo hero
landing.hero.cta            - Botón principal
landing.hero.ctaSecondary   - Botón secundario

landing.features.title           - "¿Por qué elegir ReservApp?"
landing.features.subtitle        - Descripción de características
landing.features.easyBooking.*   - Reservas instantáneas
landing.features.realTimeAvailability.* - Disponibilidad tiempo real
landing.features.localServices.* - Servicios locales
landing.features.securePayments.* - Pagos seguros
landing.features.smartNotifications.* - Recordatorios
landing.features.customerSupport.* - Soporte 24/7

landing.services.*          - Sección de servicios
landing.howItWorks.*        - Como funciona (4 pasos)
landing.testimonials.*      - Testimonios de usuarios
landing.cta.*              - Call to action final
landing.footer.*           - Footer completo
```

### 🛍️ **services** - Página de Servicios
```
services.title              - "Servicios Disponibles"
services.subtitle           - Descripción página

services.filters.allServices    - "Todos los Servicios"
services.filters.accommodation  - "Hospedaje"  
services.filters.restaurant     - "Restaurantes"
services.filters.spa           - "Spa & Bienestar"
services.filters.tours         - "Tours"
services.filters.events        - "Eventos"
services.filters.entertainment - "Entretenimiento"

services.details.location       - "Ubicación"
services.details.category       - "Categoría"
services.details.servicesAvailable - "servicios disponibles"
services.details.rating         - "Calificación"
services.details.phone          - "Teléfono"
services.details.bookNow        - "Reservar Ahora"

services.categories.ACCOMMODATION   - "Hospedaje"
services.categories.RESTAURANT      - "Restaurante"
services.categories.SPA            - "Spa & Bienestar"
services.categories.TOUR_OPERATOR  - "Tours"
services.categories.EVENT_CENTER   - "Centro de Eventos"
services.categories.ENTERTAINMENT  - "Entretenimiento"

services.descriptions.*         - Descripciones detalladas por categoría
services.emptyState.*          - Estado vacío cuando no hay servicios
```

### 📧 **contact** - Página de Contacto
```
contact.title               - "Contacto"
contact.subtitle            - Descripción página

contact.form.title          - "Envíanos un mensaje"
contact.form.name           - "Nombre completo"
contact.form.namePlaceholder - "Tu nombre completo"
contact.form.email          - "Correo electrónico"
contact.form.emailPlaceholder - "tu@email.com"
contact.form.phone          - "Teléfono"
contact.form.phonePlaceholder - "33 1234 5678"
contact.form.subject        - "Asunto"
contact.form.subjectPlaceholder - "¿En qué podemos ayudarte?"
contact.form.message        - "Mensaje"
contact.form.messagePlaceholder - "Cuéntanos más detalles..."
contact.form.submit         - "Enviar Mensaje"
contact.form.submitting     - "Enviando..."
contact.form.success        - "¡Gracias por contactarnos!"
contact.form.error          - "Hubo un error al enviar..."

contact.info.contactTitle   - "Información de Contacto"
contact.info.hoursTitle     - "Horarios de Atención"
contact.info.coverageTitle  - "Cobertura de Servicio"
contact.info.offices        - "Oficinas Principales"
contact.info.officesAddress - Dirección completa (multilínea)
contact.info.email          - Email de contacto
contact.info.phone          - Teléfonos (multilínea)
contact.info.emergencySupport - Texto soporte 24/7
contact.info.coverageDescription - Descripción cobertura
contact.info.cities         - Lista ciudades (multilínea)

contact.info.hours.mondayFriday    - "Lunes - Viernes"
contact.info.hours.saturday       - "Sábados"
contact.info.hours.sunday         - "Domingos"
contact.info.hours.businessHours  - "9:00 - 18:00"
contact.info.hours.saturdayHours  - "9:00 - 14:00"
contact.info.hours.closed        - "Cerrado"
```

### 🏢 **business** - Página de Negocios
```
business.title              - "Haz Crecer tu Negocio con ReservApp"
business.subtitle           - Descripción principal

business.hero.registerButton - "Registrar mi Negocio"
business.hero.demoButton    - "Ver Demo"

business.benefits.title     - "¿Por qué elegir ReservApp?"
business.benefits.subtitle  - "Descubre todos los beneficios..."

business.benefits.increaseBookings.*  - Aumenta reservaciones
business.benefits.schedule247.*       - Gestión 24/7
business.benefits.securePayments.*    - Pagos seguros
business.benefits.analytics.*         - Analytics y reportes
business.benefits.notifications.*     - Notificaciones automáticas
business.benefits.reviews.*           - Reseñas y calificaciones

business.pricing.title      - "Planes para tu Negocio"
business.pricing.subtitle   - "Elige el plan que mejor se adapte..."

business.pricing.basic.name     - "Plan Básico"
business.pricing.basic.price    - "$799"
business.pricing.basic.period   - "por mes"
business.pricing.basic.features - [Array de características]
business.pricing.basic.button   - "Empezar Prueba Gratuita"

business.pricing.professional.* - Similar estructura, plan profesional
business.pricing.enterprise.*   - Similar estructura, plan empresarial

business.form.title         - "Registra tu Negocio"
business.form.subtitle      - "Completa este formulario..."
business.form.businessName  - "Nombre del Negocio"
business.form.businessNamePlaceholder - "Ej: Restaurante Casa Salazar"
business.form.ownerName     - "Nombre del Propietario"
business.form.ownerNamePlaceholder - "Tu nombre completo"
business.form.email         - "Correo Electrónico"
business.form.emailPlaceholder - "tu@negocio.com"
business.form.phone         - "Teléfono"
business.form.phonePlaceholder - "33 1234 5678"
business.form.businessType  - "Tipo de Negocio"
business.form.businessTypePlaceholder - "Selecciona una opción"
business.form.address       - "Dirección del Negocio"
business.form.addressPlaceholder - "Dirección completa en Guadalajara"
business.form.description   - "Describe tu Negocio"
business.form.descriptionPlaceholder - "Cuéntanos sobre tu negocio..."
business.form.submit        - "Registrar mi Negocio"
business.form.submitting    - "Enviando..."
business.form.success       - "¡Gracias por tu interés!"

business.form.businessTypes.RESTAURANT     - "Restaurante"
business.form.businessTypes.SPA           - "Spa y Bienestar"
business.form.businessTypes.ACCOMMODATION - "Hospedaje"
business.form.businessTypes.TOUR_OPERATOR - "Tour Operador"
business.form.businessTypes.EVENT_CENTER  - "Centro de Eventos"
business.form.businessTypes.ENTERTAINMENT - "Entretenimiento"

business.cta.title          - "¿Listo para Empezar?"
```

### 🔐 **auth** - Sistema de Autenticación
```
auth.login.*               - Formulario de login completo
auth.register.*            - Formulario de registro completo
auth.forgotPassword.*      - Recuperación de contraseña
auth.resetPassword.*       - Restablecimiento de contraseña
auth.profile.*             - Gestión de perfil
auth.logout.*              - Cierre de sesión
```

### 👨‍💼 **admin** - Panel de Administración
```
admin.navigation.*         - Navegación completa del admin
admin.dashboard.*          - Panel principal con estadísticas
admin.reservations.*       - Gestión de reservaciones
admin.venues.*             - Gestión de venues
admin.services.*           - Gestión de servicios
admin.users.*              - Gestión de usuarios
admin.common.*             - Elementos comunes del admin
```

### 🌐 **common** - Elementos Comunes
```
common.loading             - "Cargando..."
common.error              - "Error"
common.success            - "Éxito"
common.cancel             - "Cancelar"
common.confirm            - "Confirmar"
common.delete             - "Eliminar"
common.edit               - "Editar"
common.save               - "Guardar"
common.search             - "Buscar"
common.filter             - "Filtrar"
common.next               - "Siguiente"
common.previous           - "Anterior"
common.close              - "Cerrar"
common.yes                - "Sí"
common.no                 - "No"
common.optional           - "Opcional"
common.required           - "Requerido"
common.selectOption       - "Seleccionar opción"
common.noResults          - "No se encontraron resultados"
common.tryAgain           - "Intentar de nuevo"
```

### ❌ **errors** - Mensajes de Error
```
errors.generic            - Error genérico
errors.network            - Error de conexión
errors.timeout            - Timeout
errors.unauthorized       - Sin autorización
errors.forbidden          - Acceso prohibido
errors.notFound           - No encontrado
errors.validation         - Error de validación
errors.server             - Error del servidor
errors.maintenance        - Mantenimiento
```

### ✅ **success** - Mensajes de Éxito
```
success.saved             - "Guardado exitosamente"
success.updated           - "Actualizado exitosamente"
success.deleted           - "Eliminado exitosamente"
success.created           - "Creado exitosamente"
success.sent              - "Enviado exitosamente"
```

### 🔔 **notifications** - Notificaciones
```
notifications.reservation.* - Notificaciones de reservaciones
notifications.payment.*     - Notificaciones de pagos
```

### 📅 **dates** - Fechas
```
dates.today               - "Hoy"
dates.yesterday           - "Ayer"
dates.tomorrow            - "Mañana"
dates.thisWeek           - "Esta semana"
dates.nextWeek           - "Próxima semana"
dates.thisMonth          - "Este mes"
dates.nextMonth          - "Próximo mes"
```

## 🛠️ Implementación en Componentes

### ✅ Componentes YA Implementados con i18n:
- ✅ **ContactPage.tsx** - 100% implementado
- ✅ **ServicesPage.tsx** - 100% implementado  
- ✅ **BusinessPage.tsx** - 100% implementado
- ✅ **LandingPage.tsx** - Parcialmente implementado (Hero section)

### ⏳ Componentes PENDIENTES de implementar:
- 📋 **AuthPages** (LoginPage.tsx, RegisterPage.tsx)
- 📋 **AdminPages** (Dashboard, Management pages)
- 📋 **Complete LandingPage** (Todas las secciones)

## 💡 Mejores Prácticas

### 1. Nomenclatura de Claves
```
[seccion].[subseccion].[elemento].[propiedad]
```

### 2. Organización por Funcionalidad
- **Agrupa por página/feature**
- **Usa jerarquías claras**
- **Mantén consistencia**

### 3. Manejo de Arrays
```typescript
// Para listas de características, beneficios, etc.
const features = t('business.pricing.basic.features', { returnObjects: true }) as string[];
```

### 4. Texto Multilínea
```typescript
// Para direcciones, descripciones largas, etc.
{t('contact.info.officesAddress').split('\n').map((line, index) => (
  <React.Fragment key={index}>
    {line}
    {index < lines.length - 1 && <br />}
  </React.Fragment>
))}
```

### 5. Parámetros Dinámicos
```typescript
// Para nombres, números, etc.
const message = t('admin.dashboard.title', { name: userName });
```

## 🚀 Para Implementar en Nuevos Componentes

### 1. Importar el hook:
```typescript
import { useTranslation } from '@/libs/i18n';
```

### 2. Usar en el componente:
```typescript
const { t } = useTranslation();
```

### 3. Reemplazar texto hardcodeado:
```typescript
// Antes:
<h1>Mi Título</h1>

// Después:
<h1>{t('miSeccion.titulo')}</h1>
```

### 4. Agregar claves al translations.json:
```json
{
  "miSeccion": {
    "titulo": "Mi Título"
  }
}
```

## ⚠️ IMPORTANTE

**El sistema i18n está COMPLETAMENTE funcional y listo para usar.**

**Total de traducciones disponibles: 750+ claves organizadas**

**Todas las páginas principales de landing ya tienen sus traducciones:**
- Landing Page (Hero, Features, Services, How it Works, Testimonials, CTA, Footer)
- Services Page (Filters, Categories, Details, Empty States)
- Contact Page (Form, Info Cards, Hours, Coverage)
- Business Page (Hero, Benefits, Pricing, Form, Business Types)
- Auth System (Login, Register, Profile, Password Reset)
- Admin System (Dashboard, Management, Navigation)
- Common Elements (Buttons, Messages, Dates, Errors, Success)

**¡Úsalo en todos los componentes futuros siguiendo esta guía!**