# 🧪 Testing Infrastructure Documentation - ReservApp

> **⚠️ IMPORTANT**: Esta documentación preserva toda la información sobre la infraestructura de testing que existía en ReservApp antes de su eliminación temporal. Se eliminó todo el código de testing para reducir ruido durante la fase de estabilización del MVP, pero se conserva aquí la documentación completa para reimplementar testing en el futuro.

## 📋 Resumen

ReservApp contaba con una infraestructura de testing completa y bien estructurada que incluía:
- **47+ archivos de test** distribuidos en múltiples categorías
- **Configuración Jest + React Testing Library** para unit/integration tests
- **Test factories** para generar datos de prueba
- **Providers de testing** para simular contextos
- **Scripts de testing automatizados** para flujos E2E
- **Coverage configuration** con umbrales de cobertura del 70%

## 🏗️ Arquitectura de Testing

### Configuración Principal

#### Jest Configuration (`jest.config.cjs`)
```javascript
// Configuración Jest optimizada para Next.js 15 + React 19
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  // Module mapping completo con todos los aliases
  moduleNameMapper: {
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@shared/(.*)$': '<rootDir>/src/libs/shared/$1',
    '^@ui/(.*)$': '<rootDir>/src/libs/presentation/components/$1',
    // ... todos los aliases del proyecto
  },
  
  // Coverage thresholds
  coverageThreshold: {
    global: { branches: 70, functions: 70, lines: 70, statements: 70 }
  },
  
  // SWC transform para mejor performance
  transform: { '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest', { /* config */ }] }
}
```

#### Package.json Scripts
```json
{
  "test": "jest --config jest.config.cjs",
  "test:watch": "jest --config jest.config.cjs --watch", 
  "test:coverage": "jest --config jest.config.cjs --coverage",
  "test:ci": "jest --config jest.config.cjs --ci --coverage --watchAll=false --passWithNoTests",
  "test:integration": "jest --config jest.config.cjs --testPathPattern=integration",
  "test:performance": "jest --config jest.config.cjs --testPathPattern=performance"
}
```

### Estructura de Directorios

```
src/__tests__/
├── README.md                          # Documentación de testing
├── TESTING_GUIDE.md                   # Guía completa de testing
├── index.ts                           # Exports principales
│
├── __mocks__/                         # Mocks globales
│   └── fileMock.js                    # Mock para archivos estáticos
│
├── factories/                         # Factories para datos de prueba
│   ├── index.ts                       # Exports de factories
│   ├── types.ts                       # Tipos para factories
│   ├── utils.ts                       # Utilidades comunes
│   ├── apiFactory.ts                  # Factory para responses API
│   ├── authFactory.ts                 # Factory para datos auth
│   ├── businessFactory.ts             # Factory para business data
│   ├── emailFactory.ts                # Factory para emails
│   ├── paymentFactory.ts              # Factory para pagos/Stripe
│   ├── reservationFactory.ts          # Factory para reservas
│   ├── serviceFactory.ts              # Factory para servicios
│   ├── userFactory.ts                 # Factory para usuarios
│   └── venueFactory.ts                # Factory para venues
│
├── providers/                         # Test providers y wrappers
│   ├── index.ts                       # Exports de providers
│   ├── types.ts                       # Tipos para providers
│   ├── TestProviders.tsx              # Provider principal combinado
│   ├── renderWithProviders.tsx        # Helper para render con providers
│   ├── AuthTestProvider.tsx           # Provider para auth context
│   ├── I18nTestProvider.tsx           # Provider para i18n
│   ├── MockServiceProvider.tsx        # Provider para services mockeados
│   ├── ReduxTestProvider.tsx          # Provider para Redux store
│   ├── RouterTestProvider.tsx         # Provider para Next.js routing
│   ├── StripeTestProvider.tsx         # Provider para Stripe testing
│   └── ThemeTestProvider.tsx          # Provider para styled-components theme
│
├── hooks/                             # Testing utilities para hooks
│   ├── index.ts                       # Exports para hook testing
│   ├── types.ts                       # Tipos para hook testing
│   └── renderHook.tsx                 # Custom renderHook wrapper
│
├── forms/                             # Utilities para testing de forms
│   ├── index.ts                       # Exports para form testing
│   └── formTestHelpers.ts             # Helpers para testing forms
│
├── setup/                             # Configuración global de testing
│   ├── jest-env.ts                    # Configuración environment Jest
│   ├── test-globals.ts                # Variables globales para tests
│   └── custom-matchers.ts             # Matchers personalizados Jest
│
├── utils/                             # Utilidades generales testing
│   ├── mock-data.ts                   # Data mockeada común
│   └── test-utils.tsx                 # Testing utilities generales
│
├── unit/                              # Unit tests
│   ├── payment-api-validation.test.ts # Tests validación API pagos
│   └── payment-logic.test.ts          # Tests lógica pagos
│
└── integration/                       # Integration tests
    ├── README.md                      # Documentación integration tests
    ├── auth-workflow.test.tsx         # Tests workflow autenticación
    ├── business-registration.test.tsx # Tests registro business completo
    ├── business-registration-flow.test.tsx # Tests flujo registration
    ├── business-registration-simple.test.tsx # Tests registration simple
    ├── multi-component-integration.test.tsx # Tests integración componentes
    ├── payment-workflow.test.tsx      # Tests workflow pagos
    ├── performance-integration.test.tsx # Tests performance
    ├── provider-integration.test.tsx  # Tests integración providers
    └── user-workflow-integration.test.tsx # Tests workflow usuarios
```

### Tests en Módulos

Además de la carpeta central, cada módulo tenía sus propios tests:

#### Módulo mod-auth
```
src/modules/mod-auth/
├── data/repositories/__tests__/
│   ├── AuthRepository.test.ts
│   └── ServerAuthRepository.test.ts
├── domain/use-cases/__tests__/
│   ├── LoginUseCase.test.ts
│   ├── RegisterUseCase.test.ts
│   └── UserManagementUseCase.test.ts
└── presentation/components/__tests__/
    ├── LoginPage.test.tsx
    ├── RegisterPage.test.tsx
    └── UserRegisterPage.test.tsx
```

#### Módulo mod-landing
```
src/modules/mod-landing/presentation/components/__tests__/
├── BusinessPage.test.tsx
├── ContactPage.test.tsx
├── LandingIntegration.test.tsx
├── LandingPage.test.tsx
└── ServicesPage.test.tsx
```

#### Libs - Presentation Hooks
```
src/libs/presentation/hooks/__tests__/
├── useAuth.test.ts
├── useConfirm.test.ts
├── useEmail.test.ts
├── useLocalStorage.test.ts
├── useMediaQuery.test.ts
├── useRedux.test.ts
├── useReservationService.test.ts
├── useUI.test.ts
└── useUserService.test.ts
```

#### Libs - UI Components
```
src/libs/ui/components/__tests__/
├── Breadcrumbs.test.tsx
├── Button.comprehensive.test.tsx
├── Card.test.tsx
├── ConfirmDialog.test.tsx
├── ErrorBoundary.test.tsx
├── LoadingSpinner.test.tsx
├── PublicHeader.test.tsx
├── TextField.test.tsx
├── index.test.md                      # Documentación tests componentes
└── test-utils.tsx                     # Utils específicos componentes
```

#### Libs - Services
```
src/libs/services/__tests__/setup/
├── jest.services.config.js            # Config Jest para services
├── jest.setup.js                      # Setup para services testing
├── testMocks.ts                       # Mocks centralizados services
└── mocks/                             # Mocks específicos
    ├── axios.mock.js
    ├── cloudinary.mock.js
    ├── fileMock.js
    ├── nextjs.mock.js
    ├── prisma.mock.js
    ├── resend.mock.js
    └── stripe.mock.js

src/libs/services/api/__tests__/
├── authService.test.ts
├── serviceService.test.ts
├── userService.test.ts
└── venueService.test.ts

src/libs/services/*//__tests__/         # Tests por servicio
├── auth/__tests__/
│   ├── authMiddleware.test.ts
│   └── jwtService.test.ts
├── cloudinary/__tests__/
│   └── cloudinaryService.test.ts
├── email/__tests__/
│   └── resendService.test.ts
├── http/__tests__/
│   ├── buildURL.test.ts
│   ├── defaultErrorHandling.test.ts
│   ├── handleRequest.test.ts
│   └── injectAuthorizationHeader.test.ts
└── stripe/__tests__/
    └── stripeService.test.ts
```

## 🧪 Test Factories

### Ejemplo de Factory Pattern
```typescript
// factories/userFactory.ts
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  role: UserRoleEnum.USER,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// factories/businessFactory.ts  
export const createMockBusiness = (overrides?: Partial<Business>): Business => ({
  id: faker.datatype.uuid(),
  name: faker.company.name(),
  description: faker.company.catchPhrase(),
  category: faker.helpers.arrayElement(Object.values(BusinessCategory)),
  ...overrides,
});
```

### Factories Disponibles
- **apiFactory**: Responses API, errors, metadata
- **authFactory**: Usuarios, sesiones, tokens JWT
- **businessFactory**: Businesses, categorías, configuraciones
- **emailFactory**: Templates email, datos SMTP
- **paymentFactory**: Pagos Stripe, métodos pago, facturas
- **reservationFactory**: Reservas, estados, fechas
- **serviceFactory**: Servicios, precios, disponibilidad  
- **userFactory**: Usuarios, perfiles, roles
- **venueFactory**: Venues, ubicaciones, servicios

## 🏗️ Test Providers

### TestProviders Master Component
```tsx
// providers/TestProviders.tsx - Provider combinado
export const TestProviders: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => (
  <ReduxTestProvider>
    <I18nTestProvider>
      <ThemeTestProvider>
        <AuthTestProvider>
          <StripeTestProvider>
            <RouterTestProvider>
              <MockServiceProvider>
                {children}
              </MockServiceProvider>
            </RouterTestProvider>
          </StripeTestProvider>
        </AuthTestProvider>
      </ThemeTestProvider>
    </I18nTestProvider>
  </ReduxTestProvider>
);
```

### renderWithProviders Helper
```tsx
// providers/renderWithProviders.tsx
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: RenderOptions
) => render(ui, {
  wrapper: TestProviders,
  ...options,
});
```

## 🚀 Scripts de Testing Automatizado

### Scripts E2E en Raíz del Proyecto

#### test-business-registration.sh
```bash
#!/bin/bash
# Test completo flujo registro business
# - Registro usuario business
# - Configuración perfil business  
# - Validación endpoints business
# - Integración con Stripe
```

#### test-reservation-flow.sh  
```bash
#!/bin/bash
# Test flujo completo reservas
# - Búsqueda venues disponibles
# - Selección fechas y servicios
# - Creación reserva
# - Modificación/cancelación
```

#### test-reservation-with-payments.sh
```bash
#!/bin/bash
# Test flujo reservas + pagos
# - Flujo reserva completo
# - Integración Stripe payments
# - Confirmación/rechazo pagos
# - Webhooks y notificaciones
```

#### test-user-registration.sh
```bash
#!/bin/bash  
# Test registro usuarios básicos
# - Registro usuario estándar
# - Validación email/datos
# - Login y autenticación
# - Gestión perfil
```

## 📊 Coverage Configuration

### Umbrales de Cobertura
```javascript
coverageThreshold: {
  global: {
    branches: 70,     // 70% cobertura branches
    functions: 70,    // 70% cobertura funciones  
    lines: 70,        // 70% cobertura líneas
    statements: 70,   // 70% cobertura statements
  },
}
```

### Archivos Incluidos/Excluidos
```javascript
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}',           // Incluir todo src/
  '!src/**/*.d.ts',                     // Excluir definitions
  '!src/**/*.stories.{js,jsx,ts,tsx}',  // Excluir Storybook
  '!src/**/*.config.{js,ts}',           // Excluir configs
  '!src/**/index.{js,ts,tsx}',          // Excluir exports
  '!src/app/**/*.{js,jsx,ts,tsx}',      // Excluir Next.js app router
  '!src/**/__tests__/**/*',             // Excluir tests
  '!src/**/__mocks__/**/*',             // Excluir mocks
]
```

## 🔧 Configuración Testing Environment

### Jest Setup Global
```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Global test configuration
global.ResizeObserver = ResizeObserver;
global.fetch = fetch;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));
```

### Custom Matchers
```typescript
// setup/custom-matchers.ts
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidEmail(): R;
      toHaveValidApiResponse(): R;
      toBeAuthenticatedUser(): R;
    }
  }
}
```

## 📚 Testing Patterns Utilizados

### 1. AAA Pattern (Arrange-Act-Assert)
```typescript
describe('AuthService', () => {
  it('should authenticate user successfully', async () => {
    // Arrange
    const mockUser = createMockUser();
    const credentials = { email: mockUser.email, password: 'password123' };
    
    // Act  
    const result = await authService.login(credentials);
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.user).toEqual(mockUser);
  });
});
```

### 2. Integration Testing Pattern
```tsx
describe('Business Registration Flow', () => {
  it('should complete business registration end-to-end', async () => {
    // Render component tree completo
    renderWithProviders(<BusinessRegistrationPage />);
    
    // Simular interacciones usuario
    await userEvent.type(screen.getByLabelText('Business Name'), 'Test Business');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    
    // Verificar resultado
    await waitFor(() => {
      expect(screen.getByText('Registration successful')).toBeInTheDocument();
    });
  });
});
```

### 3. Mock Service Pattern
```typescript
// providers/MockServiceProvider.tsx
const mockServices = {
  authService: {
    login: jest.fn(),
    register: jest.fn(), 
    logout: jest.fn(),
  },
  paymentService: {
    createPayment: jest.fn(),
    processPayment: jest.fn(),
  },
};

export const MockServiceProvider = ({ children }) => (
  <ServiceContext.Provider value={mockServices}>
    {children}  
  </ServiceContext.Provider>
);
```

## 🎯 Tipos de Tests Implementados

### Unit Tests
- **Components**: Render, props, interactions, state changes
- **Hooks**: Input/output, side effects, error handling
- **Services**: API calls, data transformation, error handling  
- **Utils**: Pure functions, calculations, validations

### Integration Tests
- **Workflows**: Auth flow, reservation flow, payment flow
- **Component Integration**: Parent-child communication
- **Provider Integration**: Context + components
- **API Integration**: Service + repository integration

### Performance Tests  
- **Component Rendering**: Mount/unmount times
- **API Response Times**: Service call performance
- **Memory Usage**: Component memory leaks
- **Bundle Size**: Code splitting effectiveness

## 🚫 Archivos Eliminados

Durante la limpieza se eliminaron aproximadamente **150+ archivos** incluyendo:

### Directorios Completos Eliminados
- `src/__tests__/` (47+ archivos)
- `src/**/__tests__/` (scattered test files)
- `testing/` (si existía)

### Archivos de Configuración Conservados
- `jest.config.cjs` ✅ (conservado)
- `jest.setup.js` ✅ (conservado)  
- Scripts en `package.json` ✅ (conservados)

### Scripts Shell Eliminados
- `test-business-registration.sh`
- `test-reservation-flow.sh`
- `test-reservation-with-payments.sh`
- `test-user-registration.sh`

## 🔄 Plan de Reimplementación

### Fase 1: Setup Básico
1. Restaurar `src/__tests__/setup/`
2. Configurar factories básicos
3. Setup providers de testing

### Fase 2: Unit Tests Críticos  
1. Services (auth, payments, reservations)
2. Hooks principales (useAuth, useReservation)
3. Components core (forms, modals)

### Fase 3: Integration Tests
1. Auth workflows
2. Reservation flows  
3. Payment flows
4. Business registration

### Fase 4: E2E/Performance
1. Scripts automatizados
2. Performance benchmarks
3. Coverage completo 70%+

## 📝 Notas Importantes

- **Todos los mocks y factories estaban completamente implementados**
- **Coverage configuration estaba configurada al 70%**
- **47+ archivos de test distribuidos en toda la aplicación**
- **Integración completa con Jest + React Testing Library + SWC**
- **Providers de testing para todos los contextos (Auth, i18n, Redux, Stripe, etc.)**

Esta infraestructura representaba **cientos de horas de desarrollo** y estaba **lista para uso inmediato** una vez que el MVP se estabilice.

---

> 💡 **Para reimplementar**: Usar esta documentación como guía y recrear la estructura paso a paso una vez que el build esté 100% estable y sin errores.