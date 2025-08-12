# CLAUDE.md

Quick reference guide for Claude Code when working with ReservApp.

## Business Context

**ReservaApp** is a comprehensive reservation ecosystem platform with subscription-based business model supporting restaurants, spas, hotels, tours, and events. Features dual platform strategy (web for businesses, mobile for end-users) with real Stripe payments, JWT authentication, and multi-language support.

📖 **Complete Context**: See [`docs/BUSINESS_MODEL.md`](docs/BUSINESS_MODEL.md)

## 🎯 Build Status: PRODUCTION READY

✅ **BUILD SUCCESSFUL** - January 11, 2025
- Zero TypeScript errors
- Zero ESLint warnings  
- All routes pre-rendered successfully
- Bundle size optimized: 99.8 kB shared JS

## Essential Commands

**Development:**
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint and Stylelint (perfect score maintained)
- `yarn type-check` - TypeScript type checking (zero errors required)

**Database:**
- `yarn db:generate` - Generate Prisma client
- `yarn db:studio` - Open Prisma Studio

**Testing:** *(Infrastructure removed - January 2025)*
- Testing infrastructure has been removed to streamline the build process
- Focus shifted to production stability and manual QA

**Deployment:**
- `yarn vercel:deploy` - Deploy to production

## Quick Architecture Reference

**Next.js 15 + React 19** application with **Clean Architecture** principles and modular structure.

### Technology Stack

**Frontend:** Next.js 15, React 19, TypeScript, Styled Components, Lucide Icons
**Backend:** Prisma ORM, MySQL, JWT Authentication, Integrated Stripe Payment System
**Services:** Vercel deployment, Google Places API, Resend emails  
**Testing:** Jest, React Testing Library, Playwright E2E, Payment Flow Testing

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
9. **i18n**: Use translation keys for all user-facing text
10. **React 19+ Compatibility**: Components use modern parameter defaults pattern

## Documentation Index

📚 **Complete Project Documentation:**

**Architecture & Technical:**
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - Complete system architecture and design patterns
- [`docs/FRONTEND.md`](docs/FRONTEND.md) - Frontend implementation, components, hooks
- [`docs/BACKEND.md`](docs/BACKEND.md) - API endpoints, database models, services
- [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) - **NEW**: Complete REST API documentation with examples
- [`docs/PAYMENTS.md`](docs/PAYMENTS.md) - **NEW**: Complete payment system integration guide
- [`docs/TESTING.md`](docs/TESTING.md) - Comprehensive testing infrastructure guide
- [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md) - Package.json analysis and dependencies
- [`docs/LISTENERS.md`](docs/LISTENERS.md) - Event handlers and listeners

**QA & Testing:**
- [`docs/QA_MANUAL_CHECKLIST.md`](docs/QA_MANUAL_CHECKLIST.md) - **NEW**: Complete manual QA checklist for mobile integration

**Business & Deployment:**
- [`docs/BUSINESS_MODEL.md`](docs/BUSINESS_MODEL.md) - Business strategy and revenue model
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) - Vercel deployment and configuration
- [`docs/FLUJO_RESERVAS.md`](docs/FLUJO_RESERVAS.md) - Reservation flow documentation

**Internationalization:**
- [`I18N_GUIDE.md`](I18N_GUIDE.md) - Complete i18n guide (750+ translation keys)

**Quick i18n Usage:**
```typescript
import { useTranslation } from '@/libs/i18n';
const { t } = useTranslation();
return <h1>{t('services.title')}</h1>;
```

## Current Production Status

🚀 **LIVE IN PRODUCTION**: https://reservapp-web.vercel.app (Updated: January 11, 2025)

**Production Features:**
- ✅ **Perfect Code Quality**: Zero ESLint warnings, complete TypeScript safety
- ✅ **React 19+ Ready**: Modern component patterns, parameter defaults, no defaultProps
- ✅ **API-First Architecture**: All admin components use HTTP APIs (NO Prisma direct)
- ✅ **Mobile-Ready APIs**: Complete REST API documentation with 25+ endpoints
- ✅ **Authentication System**: Real JWT with bcrypt, multiple user roles
- ✅ **Business Registration**: Multi-step onboarding with Stripe payments
- ✅ **Integrated Payment System**: Automatic payment processing for reservations
- ✅ **Admin Management**: Users, Venues, Reservations, Services (HTTP API)
- ✅ **Multi-language**: Complete Spanish localization (750+ keys)
- ✅ **Modern Design**: Lucide icons, Montserrat+Lato typography, responsive

**Technical Specs:**
- **Platform**: Vercel Edge Network (global CDN)
- **Bundle**: 99.8 kB optimized JavaScript (First Load JS)
- **Build**: ~16 seconds, Node.js 22.x
- **Database**: Prisma ORM ready for production MySQL
- **Routes**: 31 total (26 static, 25+ API endpoints)
- **APIs**: Users, Venues, Reservations, Services, Settings, Auth, Notifications

**Demo Accounts (password: password123):**
- `admin@reservapp.com` - ADMIN role
- `user@reservapp.com` - USER role

---

**💡 Need detailed information?** Check the [Documentation Index](#documentation-index) above for comprehensive guides on all aspects of the system.