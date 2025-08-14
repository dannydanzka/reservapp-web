# CLAUDE.md

Quick reference guide for Claude Code when working with ReservApp.

## Business Context

**ReservApp** is a comprehensive reservation ecosystem platform positioning itself as the **strategic solution for small venues and their service ecosystem**, offering superior profitability, control and reach with lower commissions, fast payments, and integrated management tools. More than a booking platform: **it's a growth partner**.

🏨 **Venue-Centric Approach**: Changed terminology from "hotel" to "venue" to expand market reach and include restaurants, spas, event centers, tour agencies, and entertainment venues.

📖 **Complete Business Context**: See [`docs/MODELO_NEGOCIO.md`](docs/MODELO_NEGOCIO.md)

## 🎯 Build Status: PRODUCTION READY

✅ **BUILD SUCCESSFUL** - January 14, 2025 (LATEST)
- Zero TypeScript errors ✅
- Zero build errors ✅ 
- Zero critical lint errors ✅
- All routes pre-rendered successfully (45 routes)
- Bundle size optimized: 99.8 kB shared JS
- Build time: ~19 seconds
- API endpoints: 25+ functional endpoints

🆕 **Recent Major Updates** (January 14, 2025):
- **Enhanced Authentication System**: JWT middleware with token refresh, error boundaries
- **System Logs Module**: Complete audit trail with categories, filtering, export, cleanup
- **Dashboard Optimization**: 10-minute refresh intervals, performance monitoring
- **Layout Improvements**: Fixed AdminLayout duplications, responsive design enhancements
- **Translation Cleanup**: Cleaned 750+ keys, removed duplicates, venue-centric terminology
- **Code Quality**: Fixed all build errors, maintained TypeScript safety

## Essential Commands

**Development:**
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint and Stylelint (perfect score maintained)
- `yarn type-check` - TypeScript type checking (zero errors required)

**Database:**
- `yarn db:generate` - Generate Prisma client
- `yarn db:studio` - Open Prisma Studio

**Testing:**
- `yarn test` - Run Jest test suite (47+ test files available)
- `yarn test:watch` - Watch mode for development
- `yarn test:coverage` - Generate coverage reports
- `yarn test:ci` - CI/CD test execution

**Deployment:**
- `yarn vercel:deploy` - Deploy to production

## Quick Architecture Reference

**Next.js 15 + React 19** application with **Clean Architecture** principles and modular structure.

### Technology Stack

**Frontend:** Next.js 15, React 19, TypeScript, Styled Components, Lucide Icons
**Backend:** Prisma ORM, MySQL, JWT Authentication with Enhanced Error Handling, Integrated Stripe Payment System
**Services:** Vercel deployment, Google Places API, Resend emails, System Logging
**Testing:** Jest, React Testing Library, Playwright E2E, Payment Flow Testing
**New Modules:** System Logs, Enhanced Auth Middleware, Dashboard Refresh Controls

📚 **Complete Stack Details**: [`docs/FRONTEND.md`](docs/FRONTEND.md) | [`docs/BACKEND.md`](docs/BACKEND.md) | [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)

### Project Structure

```
src/
├── app/                    # Next.js App Router (routes only)
├── modules/                # Feature modules (Clean Architecture)
│   ├── mod-auth/          # Authentication
│   ├── mod-admin/         # Admin dashboard
│   └── mod-landing/       # Landing pages
└── libs/                  # Shared libraries
    ├── ui/                # Components, layouts, providers
    ├── core/              # Config, state management
    ├── services/          # HTTP, Stripe, email services
    └── i18n/              # Internationalization (750+ keys)
```

🏗️ **Complete Architecture**: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

### Import Aliases

- `@/` - src/ directory
- `@libs/` - shared libraries
- `@ui/` - UI components
- `@core/` - core utilities
- `@mod-auth/` - auth module
- `@mod-admin/` - admin module
- `@mod-landing/` - landing module

## Development Guidelines

**Code Quality (Perfect ESLint Score Maintained):**
1. **TypeScript**: Strict mode, zero errors required (`yarn type-check`)
2. **Linting**: Perfect ESLint score - zero warnings (`yarn lint`)
3. **Exports**: Named exports preferred (tree shaking optimization)
4. **React Modern Patterns**: Modern parameter defaults, no defaultProps, useCallback for stability
5. **Component Props**: All optional props must have explicit defaults (`prop = undefined`)

**Architecture Rules:**
6. **Clean Architecture**: Respect layer boundaries (domain → data → presentation)
7. **Styled Components**: Only styling system used (no CSS/SCSS)
8. **Testing**: Comprehensive coverage required (unit, integration, E2E)
9. **i18n**: Use translation keys for all user-facing text (750+ keys, cleaned and organized)
10. **React 19+ Compatibility**: Components use modern parameter defaults pattern
11. **Enhanced Authentication**: JWT with comprehensive error handling, token refresh, and middleware
12. **System Logging**: Comprehensive logging with categories, levels, filtering, and automatic cleanup
13. **Dashboard Intervals**: Standardized 10-minute refresh intervals for all admin components

## 🚨 CRITICAL ARCHITECTURE RULES - MUST FOLLOW

**API Communication Pattern (MANDATORY):**
11. **NO Direct API Calls**: Components MUST NEVER call APIs directly using fetch()
12. **Service Layer Required**: Always create services in `src/libs/services/api/[feature]Service.ts`
13. **Custom Hooks Pattern**: Use custom hooks in `src/libs/presentation/hooks/use[Feature].ts` 
14. **Type Safety**: Define types in `src/libs/services/api/types/[feature].types.ts`
15. **Error Handling**: Services must return `ApiResponse<T>` with success/error states

**Example Correct Pattern:**
```typescript
// ✅ CORRECT: Component uses hook
const { loading, error, submitData } = useContactForm();

// ✅ CORRECT: Hook uses service 
const result = await ContactService.createContact(data);

// ✅ CORRECT: Service handles API calls
static async createContact(data): Promise<ApiResponse<Contact>> {
  // API call logic here
}

// ❌ WRONG: Direct API call in component
const response = await fetch('/api/contact', { ... });
```

**This pattern is MANDATORY for:**
- Contact forms
- User management  
- Reservations
- Payments
- System logs management
- Authentication flows
- All business logic

**Benefits:**
- Consistent error handling with automatic token refresh
- Reusable business logic across components
- Type safety with comprehensive interfaces
- Testing isolation and mocking capabilities
- Clean separation of concerns
- Automatic request/response logging
- Enhanced security with middleware protection

## 🔥 REGLA DE ORO - ALIAS PATHS

**NUNCA QUITAR ALIAS - SIEMPRE ARREGLARLOS:**
16. **Alias Obligatorios**: NUNCA quitar alias paths (`@libs/`, `@ui/`, etc.)
17. **Si Alias Falla**: Arreglar la configuración, NUNCA usar paths relativos
18. **Verificar tsconfig.json**: Asegurar que todos los alias estén configurados
19. **Mantener Consistencia**: Usar siempre el mismo alias para la misma ruta

**❌ PROHIBIDO:**
```typescript
// MAL: Quitar alias y usar path relativo
import { prisma } from '../../../libs/infrastructure/services/core/database/prismaService';

// MAL: Cambiar a path absoluto sin alias
import { prisma } from '/src/libs/infrastructure/services/core/database/prismaService';
```

**✅ CORRECTO:**
```typescript
// BIEN: Usar alias configurado
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';

// BIEN: Si falla, verificar tsconfig.json y arreglar alias
"@libs/*": ["./src/libs/*"]
```

## 🔍 PROCESO DE VERIFICACIÓN COMPLETA DEL FLUJO DE DATOS

**SIEMPRE seguir este checklist para verificar que todo funciona:**

### 📋 **1. Verificación de Base de Datos**
```bash
# Verificar que el schema sea válido
yarn prisma validate

# Sincronizar cambios con la base de datos
yarn db:push

# Regenerar el cliente de Prisma
yarn db:generate

# Ejecutar seeders para datos de prueba
yarn db:seed
```

### 🧪 **2. Verificación de Modelos Prisma**
```bash
# Test manual del modelo
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log('Modelo disponible:', 'contactForm' in prisma);
prisma.contactForm.findFirst().then(() => console.log('✅ Modelo funciona'));
"
```

### 📧 **3. Verificación de Servicio de Email**
```bash
# Verificar variables de entorno requeridas
echo "RESEND_API_KEY: ${RESEND_API_KEY:0:10}..."
echo "RESEND_FROM_EMAIL: $RESEND_FROM_EMAIL"
echo "NEXT_PUBLIC_ENABLE_EMAILS: $NEXT_PUBLIC_ENABLE_EMAILS"

# En desarrollo: usar email sandbox
echo "RESEND_DEVELOPMENT_EMAIL: $RESEND_DEVELOPMENT_EMAIL"
```

**🚨 PROBLEMA COMÚN: Dominio no verificado**
- Error: "The reservapp.com domain is not verified"
- **Solución Desarrollo**: Usar `onboarding@resend.dev` y enviar a email del propietario
- **Solución Producción**: Verificar dominio en resend.com/domains

**✅ Configuración MVP (desarrollo y producción):**
```env
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TARGET_EMAIL=danny.danzka21@gmail.com  # Todos los emails van aquí
NEXT_PUBLIC_ENABLE_EMAILS=true
```

**📧 Configuración de Email para MVP:**
- Todos los emails van a `danny.danzka21@gmail.com`
- Funciona tanto en desarrollo como producción
- Ideal para presentación del MVP

**✅ Emails Automáticos Implementados:**
1. **Formulario de Contacto** - Se envía cuando usuarios llenan el formulario
2. **Registro de Usuarios** - Email de bienvenida con beneficios de usuario pionero
3. **Registro de Negocios** - Email de bienvenida con información empresarial
4. **Confirmación de Reservas** - Se envía automáticamente al crear una reserva

**📧 Templates de Email:**
- **Usuarios**: Diseño morado/naranja con beneficios pioneros
- **Negocios**: Diseño verde con información empresarial y panel admin
- **Reservas**: Template profesional con todos los detalles de la reserva
- **Contacto**: Formato simple con información del remitente

### 🔍 **4. Verificación TypeScript**
```bash
# Verificar que no haya errores de tipos
yarn type-check

# Si falla, verificar archivos de tipos generados
ls -la ./node_modules/.prisma/client/
grep -n "contactForm" ./node_modules/.prisma/client/index.d.ts
```

### 🌐 **4. Verificación de API Endpoints**
```bash
# Iniciar servidor de desarrollo
yarn dev

# Probar endpoints manualmente o con curl
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test"}'
```

### 🎨 **5. Verificación de Frontend**
- [ ] Componente renderiza sin errores
- [ ] Formulario envía datos correctamente
- [ ] Estados de loading, success, error funcionan
- [ ] Validación de campos funciona
- [ ] Integración con servicios funciona

### 📧 **6. Verificación de Correos**
- [ ] Correo al admin se envía (`2111100077@soy.utj.edu.mx`)
- [ ] Correo de confirmación al usuario se envía
- [ ] Templates de email se ven correctamente
- [ ] Variables en templates se remplazan

### 🔄 **7. Verificación de Admin Panel**
```bash
# Verificar página de admin
http://localhost:3000/admin/contact-forms

# Verificar filtros y acciones funcionan
# Verificar paginación funciona
# Verificar actualización de estados funciona
```

### 📊 **8. Verificación de Datos de Prueba**
- [ ] Seeders se ejecutan sin error
- [ ] Datos realistas están disponibles
- [ ] Diferentes estados están representados
- [ ] Relaciones entre modelos funcionan

### 🧹 **9. Verificación de Limpieza**
```bash
# Limpiar archivos de test
rm -f test-*.js test-*.cjs

# Verificar que no haya console.log en producción
grep -r "console.log" src/ --exclude-dir=__tests__
```

### ⚠️ **ERRORES COMUNES Y SOLUCIONES:**

**Error: "Property X does not exist on type PrismaClient"**
- ✅ Ejecutar: `yarn db:generate`
- ✅ Verificar: Schema válido con `yarn prisma validate`
- ✅ Reiniciar: TypeScript language server en IDE

**Error: "Table X does not exist in database"**
- ✅ Ejecutar: `yarn db:push`
- ✅ Verificar: Conexión a base de datos correcta

**Error: Alias paths no funcionan**
- ✅ Verificar: `tsconfig.json` paths configurados
- ✅ **NUNCA** quitar alias, siempre arreglarlos

**Error: Correos no se envían**
- ✅ Verificar: Variables de entorno `RESEND_API_KEY`
- ✅ Verificar: `NEXT_PUBLIC_ENABLE_EMAILS=true`

**Error: "Property X does not exist on type PrismaClient" (System Logs)**
- ✅ Ejecutar: `yarn db:generate` después de cambios al schema
- ✅ Verificar: Modelos System Log en schema.prisma
- ✅ Reiniciar: TypeScript language server

**Error: Tokens expirados o problemas de autenticación**
- ✅ Verificar: authInterceptor configurado correctamente
- ✅ Verificar: refreshToken endpoint funcionando
- ✅ Verificar: Error boundaries capturando errores de auth
- ✅ Limpiar: localStorage si hay tokens corruptos

## Documentation Index

📚 **Complete Project Documentation:**

**Architecture & Technical:**
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - Complete system architecture and design patterns
- [`docs/FRONTEND.md`](docs/FRONTEND.md) - Frontend implementation, components, hooks
- [`docs/BACKEND.md`](docs/BACKEND.md) - API endpoints, database models, services
- [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) - Complete REST API documentation with examples
- [`docs/PAYMENTS.md`](docs/PAYMENTS.md) - Complete payment system integration guide
- [`docs/TESTING.md`](docs/TESTING.md) - Comprehensive testing infrastructure guide
- [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md) - Package.json analysis and dependencies
- [`docs/LISTENERS.md`](docs/LISTENERS.md) - Event handlers and listeners

**New Features Documentation:**
- **System Logs**: Complete audit trail with categories (AUTH, API, BUSINESS, SYSTEM, ERROR)
- **Enhanced Authentication**: JWT middleware with automatic refresh and error boundaries
- **Dashboard Optimization**: Configurable refresh intervals and performance monitoring
- **Admin Layout**: Fixed duplications, improved responsive design
- **Translation System**: Cleaned 750+ keys, removed duplicates

**QA & Testing:**
- [`docs/CHECKLIST_QA.md`](docs/CHECKLIST_QA.md) - **RENAMED**: Complete manual QA checklist for mobile integration
- System logs provide comprehensive audit trail for QA testing
- Enhanced error handling allows better debugging and issue tracking

**Business & Deployment:**
- [`docs/BUSSINESS_MODEL.md`](docs/BUSSINESS_MODEL.md) - **RENAMED**: Complete business model, competitive analysis, venue-focused strategy
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) - Vercel deployment and configuration
- [`docs/ROUTES_AND_SITEMAP.md`](docs/ROUTES_AND_SITEMAP.md) - **NEW**: Complete routes documentation
- [`docs/FEATURE_PRODUCT.md`](docs/FEATURE_PRODUCT.md) - **RENAMED**: Product functionalities and features
- [`docs/COMPLETE_DEVELOPER.md`](docs/COMPLETE_DEVELOPER.md) - **RENAMED**: Complete development guide
- [`docs/GUIDE.md`](docs/GUIDE.md) - **RENAMED**: Technical implementation guide

**Internationalization:**
- [`I18N_GUIDE.md`](I18N_GUIDE.md) - Complete i18n guide (750+ translation keys)

**Quick i18n Usage:**
```typescript
import { useTranslation } from '@/libs/i18n';
const { t } = useTranslation();
return <h1>{t('services.title')}</h1>;
```

## Current Production Status

🚀 **LIVE IN PRODUCTION**: https://reservapp-web.vercel.app (Updated: January 14, 2025)

**Production Features:**
- ✅ **Perfect Code Quality**: Zero TypeScript errors, zero build warnings, complete type safety
- ✅ **React 19+ Ready**: Modern component patterns, parameter defaults, no defaultProps
- ✅ **API-First Architecture**: All admin components use HTTP APIs (NO Prisma direct)
- ✅ **Mobile-Ready APIs**: Complete REST API documentation with 25+ endpoints
- ✅ **Enhanced Authentication**: JWT with automatic refresh, error boundaries, comprehensive middleware
- ✅ **Business Registration**: Multi-step onboarding with Stripe payments, venue-focused
- ✅ **Integrated Payment System**: Automatic payment processing for reservations
- ✅ **Admin Management**: Users, Venues, Reservations, Services, System Logs (HTTP API)
- ✅ **System Logging**: Complete audit trail with categorization, filtering, export, and cleanup
- ✅ **Multi-language**: Complete Spanish localization (750+ cleaned keys)
- ✅ **Modern Design**: Lucide icons, Montserrat+Lato typography, responsive, optimized layouts
- ✅ **Dashboard Optimization**: 10-minute refresh intervals, performance monitoring

**Technical Specs:**
- **Platform**: Vercel Edge Network (global CDN)
- **Bundle**: 99.8 kB optimized JavaScript (First Load JS)
- **Build**: ~19 seconds, Node.js 22.x, 45 routes total
- **Database**: Prisma ORM ready for production MySQL with System Logs
- **Routes**: 45 total (static + dynamic), 25+ API endpoints
- **APIs**: Users, Venues, Reservations, Services, Settings, Auth, Notifications, System Logs
- **Performance**: Enhanced error handling, automatic token refresh, middleware protection
- **Monitoring**: System logs with categories, levels, filtering, export, and cleanup

**Demo Accounts (password: password123):**
- `admin@reservapp.com` - SUPER_ADMIN role (Sistema Administrador) 🔥 **Ve TODO**
- `admin.salazar@reservapp.com` - ADMIN role (Roberto Salazar) 🏨 **Solo sus venues**
- `admin.restaurant@reservapp.com` - ADMIN role (Patricia Morales) 🍽️ **Solo sus venues**  
- `gestor.salazar@reservapp.com` - MANAGER role (Carlos Mendoza) 👤 **Gestor específico**
- `gestor.restaurant@reservapp.com` - MANAGER role (Ana García) 👤 **Gestor específico**
- `juan.perez@gmail.com` - USER role (Juan Carlos) 🧑‍💼 **Cliente final**
- `maria.lopez@gmail.com` - USER role (María Elena) 🧑‍💼 **Cliente final**

---

## 🔧 Recent System Enhancements (January 2025)

### 🔐 Enhanced Authentication System
- **JWT Middleware**: Comprehensive token validation with automatic refresh
- **Auth Interceptors**: HTTP request/response intercepting with token management
- **Error Boundaries**: Specialized error handling for authentication failures
- **Session Management**: Automatic token refresh, logout on expiration
- **Security**: Enhanced middleware protection for admin routes

### 📊 System Logs Module
- **Categories**: AUTH, API, BUSINESS, SYSTEM, ERROR for organized logging
- **Levels**: INFO, WARNING, ERROR, DEBUG for detailed monitoring  
- **Filtering**: Advanced filters by level, category, user, date range, resource
- **Export**: CSV/JSON export functionality for audit trails
- **Cleanup**: Automatic log rotation and cleanup based on retention policies
- **Statistics**: Real-time stats dashboard with log analytics

### 🎛️ Dashboard Optimization
- **Refresh Intervals**: Standardized 10-minute intervals across all components
- **Environment Variables**: Configurable refresh rates via `NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL`
- **Performance**: Optimized API calls with consistent polling strategies
- **Layout Fixes**: Resolved AdminLayout duplications, improved responsive design

### 🌐 Terminology & Market Expansion
- **Venue-Centric**: Changed from "hotel" to "venue" for broader market appeal
- **Multi-Industry**: Support for restaurants, spas, event centers, tour agencies
- **Business Types**: Enhanced BusinessType enum with comprehensive venue categories
- **Translations**: Updated 750+ translation keys to reflect venue-centric approach

### 🛠️ Development Improvements
- **Build Optimization**: Zero TypeScript errors, zero build warnings
- **Component Standards**: Fixed Button component size/variant inconsistencies
- **Type Safety**: Enhanced type definitions for all new modules
- **Code Quality**: Maintained perfect ESLint score throughout updates

---

**💡 Need detailed information?** Check the [Documentation Index](#documentation-index) above for comprehensive guides on all aspects of the system.