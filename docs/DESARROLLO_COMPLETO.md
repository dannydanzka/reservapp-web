# ReservApp - Guía de Desarrollo Completa

## 📋 Información General del Proyecto

**ReservApp** es una plataforma completa de reservaciones para la industria de hospitalidad en Guadalajara, Jalisco. Utiliza **Next.js 15**, **React 19**, **TypeScript**, **Prisma ORM**, y sigue principios de **Clean Architecture**.

### 🎯 Estado Actual
- ✅ **100% Funcional en Producción**: https://reservapp-web.vercel.app
- ✅ **47+ Test Files**: Cobertura completa unit/integration/E2E
- ✅ **Perfect ESLint Score**: Zero warnings mantenido
- ✅ **TypeScript Strict**: Zero errors policy
- ✅ **Sistema de Pagos**: Integración completa con Stripe
- ✅ **Dashboard Admin**: 7 módulos completamente funcionales

### 🔧 Stack Tecnológico

**Frontend:**
- Next.js 15.4.5 (App Router, Server Components)
- React 19 (Concurrent Features, Suspense)
- TypeScript 5.6 (Strict mode)
- Styled Components 6 (CSS-in-JS)
- Lucide React (Iconografía)

**Backend:**
- Prisma ORM 6.13 (Type-safe queries)
- MySQL 8.0 (Base de datos)
- Next.js API Routes (Serverless)
- JWT Authentication
- bcrypt (Password hashing)

**Integraciones:**
- Stripe (Pagos completos)
- Resend (Email delivery)
- Google Places API (Geolocation)
- Vercel (Deployment y Analytics)

---

## 🚀 Quick Start

### Instalación Inicial

```bash
# Clonar repositorio
git clone [repository-url]
cd reservapp-web

# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Configurar base de datos
yarn db:push
yarn db:seed

# Iniciar desarrollo
yarn dev
```

### Variables de Entorno Requeridas

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/reservapp"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Stripe (usar test keys para desarrollo)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@reservapp.com"

# Google Places
GOOGLE_PLACES_API_KEY="your-google-places-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Cuentas Demo Disponibles

```bash
# Admin Dashboard
Email: admin@reservapp.com
Password: password123
Role: ADMIN (acceso completo)

# Usuario Regular
Email: user@reservapp.com
Password: password123
Role: USER (reservaciones únicamente)
```

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Dashboard administrativo
│   │   ├── page.tsx       # Dashboard principal
│   │   ├── payments/      # Gestión de pagos
│   │   ├── reservations/  # Gestión de reservaciones
│   │   ├── venues/        # Gestión de venues
│   │   ├── users/         # Gestión de usuarios
│   │   ├── services/      # Gestión de servicios
│   │   └── reports/       # Reportes empresariales ⭐ NUEVO
│   ├── api/               # API Routes serverless (50+ endpoints)
│   ├── auth/              # Páginas de autenticación
│   ├── services/          # Catálogo público de servicios
│   └── (public)/          # Landing y páginas públicas
├── modules/               # Módulos de negocio (Clean Architecture)
│   ├── mod-auth/          # Autenticación y autorización
│   ├── mod-admin/         # Dashboard administrativo
│   └── mod-landing/       # Páginas públicas y landing
└── libs/                  # Bibliotecas compartidas
    ├── ui/                # Componentes UI reutilizables
    ├── core/              # Configuración y estado global
    ├── services/          # Servicios de integración
    ├── data/              # Repositorios y acceso a datos
    └── i18n/              # Sistema de internacionalización
```

### Principios de Clean Architecture

1. **Separation of Concerns**: Cada módulo tiene responsabilidad única
2. **Dependency Inversion**: Dependencias apuntan hacia abstracciones
3. **Testability**: Cada capa puede probarse independientemente
4. **Independence**: UI, DB, y frameworks son intercambiables

### Import Aliases Configurados

```typescript
import { Component } from '@/path';           // src/
import { Button } from '@libs/ui/Button';     // src/libs/
import { useAuth } from '@ui/providers';      // src/libs/ui/
import { config } from '@core/config';        // src/libs/core/
import { Login } from '@mod-auth/Login';      // src/modules/mod-auth/
import { Dashboard } from '@mod-admin/';      // src/modules/mod-admin/
```

---

## 💻 Comandos de Desarrollo

### Desarrollo Diario

```bash
# Servidor de desarrollo con hot reload
yarn dev

# Build para producción
yarn build

# Servidor de producción local
yarn start
```

### Base de Datos

```bash
# Generar Prisma client después de cambios en schema
yarn db:generate

# Aplicar cambios de schema a la BD
yarn db:push

# Popular base de datos con data real de Guadalajara
yarn db:seed

# Abrir Prisma Studio (GUI para BD)
yarn db:studio

# Reset completo (útil para desarrollo)
yarn db:reset
```

### Calidad de Código

```bash
# ESLint + Stylelint (debe mantenerse en score perfecto)
yarn lint

# Auto-fix de issues menores
yarn lint:fix

# Type checking de TypeScript (debe ser zero errors)
yarn type-check

# Formateo con Prettier
yarn format
```

### Testing

```bash
# Unit tests con Jest
yarn test

# Tests en modo watch
yarn test:watch

# Coverage report completo
yarn test:coverage

# Integration tests
yarn test:integration

# E2E tests con Playwright
yarn test:e2e

# Test específico del flujo de pagos
./test-reservation-with-payments.sh
```

---

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Login/Register**: Usuario envía credenciales
2. **Validación**: bcrypt para password hashing
3. **JWT Generation**: Access token (15 min) + Refresh token (7 días)
4. **Response**: Tokens + datos de usuario
5. **Middleware**: Protección automática de rutas admin

### Implementación de JWT

```typescript
// Estructura del token
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRoleEnum;
  iat: number;
  exp: number;
}

// Generación de tokens
const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
  expiresIn: '15m'
});

const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_REFRESH_SECRET!,
  { expiresIn: '7d' }
);
```

### Middleware de Protección

Todas las rutas `/admin/*` y `/api/admin/*` están protegidas automáticamente:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return authMiddleware(request);
  }
}
```

---

## 💳 Sistema de Pagos Integrado

### Flujo Completo de Pago

1. **Usuario selecciona servicio** → Configura reservación
2. **Cálculo automático** → Precio total con descuentos/impuestos
3. **Payment Intent** → Stripe crea intento de pago
4. **Captura de pago** → Frontend procesa con Stripe Elements
5. **Webhook confirmation** → Stripe confirma pago exitoso
6. **Auto-confirmación** → Reservación se confirma automáticamente
7. **Notificación** → Email de confirmación + recibo digital

### Integración con Stripe

```typescript
// Crear Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100), // Centavos
  currency: 'mxn',
  metadata: {
    reservationId,
    userId,
    source: 'reservapp-web'
  }
});

// Webhook handler para confirmación
export async function POST(request: Request) {
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  
  if (event.type === 'payment_intent.succeeded') {
    // 1. Actualizar estado de pago
    // 2. Confirmar reservación
    // 3. Enviar email de confirmación
    // 4. Generar recibo digital
  }
}
```

### Estados de Pago Soportados

- `PENDING`: Pago iniciado, pendiente de confirmación
- `COMPLETED`: Pago exitoso, reservación confirmada
- `FAILED`: Pago rechazado o error
- `REFUNDED`: Reembolso procesado
- `CANCELLED`: Pago cancelado por usuario

---

## 🏢 Dashboard Administrativo

### Módulos Implementados (100% Funcionales)

#### 1. Dashboard Principal (`/admin`)
- KPIs en tiempo real (ingresos, reservaciones, ocupación)
- Gráficos de rendimiento vs período anterior
- Reservaciones recientes con estados
- Acciones rápidas para operaciones frecuentes

#### 2. Gestión de Pagos (`/admin/payments`)
- Vista unificada de todas las transacciones
- Filtros avanzados (fecha, estado, método, venue)
- Procesamiento de reembolsos con un click
- Sync automático con Stripe via webhooks
- Export a Excel para contabilidad

#### 3. Gestión de Reservaciones (`/admin/reservations`)
- Lista completa con filtros inteligentes
- Gestión de estados: PENDING → CONFIRMED → CHECKED_IN → COMPLETED
- Check-in/check-out simplificado
- Comunicación directa con clientes
- Métricas operativas (ocupación, no-shows, etc.)

#### 4. Gestión de Venues (`/admin/venues`)
- CRUD completo de establecimientos
- Upload y gestión de imágenes
- Configuración de horarios y políticas
- Asociación de múltiples servicios
- Analytics individual por venue

#### 5. Gestión de Usuarios (`/admin/users`)
- Base completa de usuarios registrados
- Segmentación automática por valor
- Historial de reservaciones y pagos
- Herramientas de comunicación
- Customer Lifetime Value (CLV)

#### 6. Gestión de Servicios (`/admin/services`)
- Catálogo centralizado de servicios
- Pricing dinámico y promociones
- Calendarios de disponibilidad
- Performance analytics por servicio
- A/B testing de precios

#### 7. 📊 Reportes Empresariales (`/admin/reports`) ⭐ **NUEVO**

**4 Tipos de Reportes Principales:**

1. **📊 Análisis de Ingresos**
   - Revenue total, transacciones, ticket promedio
   - Crecimiento vs períodos anteriores
   - Breakdown por venue y servicio
   - Métodos de pago más usados
   - Tendencias temporales

2. **📅 Resumen de Reservaciones**
   - KPIs operativos (confirmación rate, lead time)
   - Distribución de estados de reservas
   - Performance comparativa por venue
   - Patrones de demanda temporal
   - Análisis de cancelaciones

3. **👥 Actividad de Usuarios**
   - Usuarios activos, nuevos, recurrentes
   - Patrones de comportamiento
   - Segmentación por valor
   - Análisis de retención
   - Top usuarios por spending

4. **🏨 Rendimiento de Venues**
   - Comparativa de venues por revenue/ocupación
   - Trends de ocupación histórica
   - Performance de servicios por venue
   - Customer satisfaction analysis
   - Recommendations de pricing

**Características de Reportes:**
- **Generación Automática**: Programación de reportes por email
- **Múltiples Formatos**: PDF ejecutivo, Excel detallado, CSV raw
- **Filtros Personalizables**: Rangos de fecha, venues específicos
- **AI Insights**: Recomendaciones basadas en data
- **Export & Share**: Distribución automática a stakeholders

### Sistema de Roles y Permisos

**Jerarquía Implementada:**
- `SUPER_ADMIN`: Acceso total sin restricciones
- `ADMIN`: Gestión completa de plataforma
- `MANAGER`: Gestión de venues asignados
- `EMPLOYEE`: Operaciones básicas limitadas
- `USER`: Solo funciones de cliente

**Control Granular:**
- 60+ permisos específicos por módulo
- Acceso por venue individual
- Audit trail completo de acciones
- Session management avanzado

---

## 🧪 Estrategia de Testing

### Testing Pyramid Implementado

```
     /\     E2E Tests (Playwright)
    /  \    - Flujos completos usuario
   /____\   - Tests de integración con Stripe
  /      \  
 /________\ Integration Tests (Jest + Prisma)
/          \ - API endpoints completos
\__________/ - Database operations
 \        /
  \______/  Unit Tests (Jest + RTL)
   \    /   - Componentes individuales
    \__/    - Funciones de utilidad
```

### Configuración de Tests

```bash
# Jest configuration
# jest.config.js
{
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx'
  ]
}

# Playwright configuration
# playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ]
});
```

### Tests Críticos Implementados

1. **Unit Tests**: Componentes UI, funciones de utilidad, hooks
2. **Integration Tests**: API endpoints, database operations
3. **E2E Tests**: Flujos completos de usuario, pagos con Stripe
4. **Payment Flow Tests**: Script específico para testing de pagos

---

## 🌐 Internacionalización (i18n)

### Sistema Implementado

- **750+ Translation Keys**: Cobertura completa en español
- **Namespacing**: Organización por módulos y contexto
- **Dynamic Loading**: Lazy loading de traducciones
- **Type Safety**: Types generados automáticamente

### Uso en Componentes

```typescript
import { useTranslation } from '@/libs/i18n';

export const Component = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('services.title')}</h1>
      <p>{t('services.description')}</p>
      <button>{t('common.buttons.reserve')}</button>
    </div>
  );
};
```

### Estructura de Traducciones

```json
{
  "common": {
    "buttons": {
      "save": "Guardar",
      "cancel": "Cancelar",
      "delete": "Eliminar"
    }
  },
  "admin": {
    "dashboard": {
      "title": "Panel de Administración",
      "stats": {
        "totalRevenue": "Ingresos Totales",
        "totalReservations": "Reservaciones Totales"
      }
    }
  }
}
```

---

## 🚀 Deployment y Production

### Vercel Configuration

```javascript
// vercel.json
{
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "app/api/**/*": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://reservapp-web.vercel.app"
        }
      ]
    }
  ]
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, dev]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Type checking
        run: yarn type-check
      - name: Linting
        run: yarn lint
      - name: Unit tests
        run: yarn test --coverage
      - name: E2E tests
        run: yarn test:e2e
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        run: vercel --prod
```

### Performance Metrics

- **Lighthouse Score**: 95+ en todas las categorías
- **Bundle Size**: ~100KB JavaScript inicial
- **API Response Time**: < 200ms promedio
- **Database Query Time**: < 50ms promedio
- **Uptime**: 99.9% en producción

---

## 📊 Monitoring y Analytics

### Métricas Tracked

**Business KPIs:**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Conversion Rate
- Net Promoter Score (NPS)

**Technical KPIs:**
- Core Web Vitals (LCP, FID, CLS)
- API Response Times
- Database Query Performance
- Error Rate & Types
- User Session Analytics

### Error Handling

```typescript
// Global Error Boundary
class GlobalErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    console.error('Global error:', error, errorInfo);
    
    if (process.env.NODE_ENV === 'production') {
      // Send to monitoring service (Sentry, LogRocket, etc.)
      this.reportError(error, errorInfo);
    }
  }
}

// API Error Handling
export async function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  // Log unexpected errors
  console.error('Unexpected API error:', error);
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Build Errors
```bash
# Error de TypeScript
yarn type-check  # Verificar errores específicos

# Error de ESLint
yarn lint        # Ver warnings/errors específicos
yarn lint:fix    # Auto-fix cuando sea posible
```

#### 2. Database Issues
```bash
# Schema out of sync
yarn db:generate  # Regenerar Prisma client
yarn db:push      # Aplicar cambios de schema

# Prisma connection issues
# Verificar DATABASE_URL en .env.local
```

#### 3. Payment Testing
```bash
# Usar Stripe test cards
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits

# Verificar webhook endpoint
# Usar ngrok para development webhooks
```

#### 4. Environment Variables
```bash
# Verificar que todas las vars estén definidas
cat .env.local

# Para producción, verificar en Vercel dashboard
```

### Debug Tools

```typescript
// Enable debug logging
localStorage.setItem('debug', 'reservapp:*');

// Prisma query logging
// En prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}

// Next.js debugging
DEBUG=* yarn dev
```

---

## 📚 Documentación de Referencia

### Archivos de Documentación

- **`docs/PRODUCTO_FUNCIONALIDADES.md`**: Guía completa no técnica del producto
- **`docs/GUIA_TECNICA.md`**: Documentación técnica detallada
- **`docs/CLAUDE.md`**: Quick reference para desarrollo con Claude
- **`docs/BUSINESS_MODEL.md`**: Contexto de negocio y estrategia
- **`docs/TESTING.md`**: Guía completa de testing
- **`docs/DEPLOYMENT.md`**: Guía de deployment y configuración

### APIs y Endpoints

**Endpoints Públicos (sin auth):**
- `GET /api/public/venues` - Catálogo de venues
- `GET /api/public/services` - Servicios disponibles
- `POST /api/auth/login` - Autenticación
- `POST /api/auth/register` - Registro de usuarios

**Endpoints Protegidos (con JWT):**
- `POST /api/reservations` - Crear reservación
- `GET /api/reservations` - Mis reservaciones
- `POST /api/payments/create-intent` - Crear intento de pago
- `GET /api/payments` - Historial de pagos

**Endpoints Admin (rol ADMIN required):**
- `GET /api/admin/reservations` - Todas las reservaciones
- `PUT /api/admin/reservations/[id]` - Actualizar reservación
- `GET /api/admin/venues` - Gestión de venues
- `POST /api/admin/venues` - Crear venue
- `GET /api/admin/users` - Gestión de usuarios

### Resources Externos

- **Stripe Documentation**: https://stripe.com/docs/api
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js 15 Docs**: https://nextjs.org/docs
- **React 19 Docs**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

---

## 🎯 Roadmap de Desarrollo

### ✅ Completado (Enero 2025)
- ✅ Plataforma web completa con reservaciones
- ✅ Dashboard administrativo (7 módulos)
- ✅ Sistema de pagos integrado con Stripe
- ✅ Sistema de reportes empresariales (4 tipos)
- ✅ Sistema de roles y permisos granulares
- ✅ Testing completo (unit/integration/E2E)
- ✅ Deployment en producción con CI/CD

### 🔄 En Progreso
- 📱 App móvil nativa (React Native)
- 🤖 AI-powered recommendations
- 📊 Advanced analytics con ML

### 🔮 Próximos Features
- 💬 Live chat y soporte en tiempo real
- 🔗 API marketplace para integraciones
- 🎯 Marketing automation
- 🌍 Multi-tenant para múltiples ciudades

---

*Guía de Desarrollo ReservApp - Versión 2.0 - Enero 2025*

**Para soporte técnico o preguntas sobre desarrollo, consultar los archivos de documentación específicos o contactar al equipo de desarrollo.**