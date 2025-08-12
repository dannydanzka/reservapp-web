# ReservApp - Guía Técnica Completa

> 📖 **Referencia Principal**: Para comandos esenciales y contexto del proyecto, consulta siempre [`CLAUDE.md`](../CLAUDE.md) en la raíz del proyecto.

## 🔗 Enlaces Rápidos
- **Comandos Esenciales**: [`CLAUDE.md`](../CLAUDE.md#essential-commands)
- **Arquitectura Completa**: [`CLAUDE.md`](../CLAUDE.md#quick-architecture-reference)
- **Estado de Producción**: [`CLAUDE.md`](../CLAUDE.md#current-production-status)

## 📋 Arquitectura del Sistema

### 🏗️ Arquitectura General
ReservApp sigue principios de **Clean Architecture** con separación clara de responsabilidades:

```
src/
├── app/                    # Next.js App Router (rutas únicamente)
│   ├── admin/             # Dashboard administrativo
│   ├── api/               # API Routes serverless
│   ├── auth/              # Autenticación
│   └── (public)/          # Rutas públicas
├── modules/               # Módulos de negocio
│   ├── mod-auth/          # Autenticación y autorización
│   ├── mod-admin/         # Dashboard administrativo
│   └── mod-landing/       # Páginas públicas
└── libs/                  # Bibliotecas compartidas
    ├── ui/                # Componentes UI reutilizables
    ├── core/              # Configuración y estado global
    ├── services/          # Servicios de integración
    ├── data/              # Acceso a datos y repositorios
    └── i18n/              # Internacionalización
```

### 🔄 Principios de Clean Architecture
1. **Independencia de Frameworks**: Lógica de negocio independiente de Next.js
2. **Testeable**: Cada capa puede probarse independientemente
3. **Independiente de UI**: Cambios en UI no afectan lógica de negocio
4. **Independiente de DB**: Fácil cambio de base de datos
5. **Independiente de Servicios Externos**: Abstracciones para integraciones

---

## 🛠️ Stack Tecnológico Detallado

### Frontend
- **Next.js 15.4.5**: App Router, Server Components, ISR
- **React 19**: Concurrent Features, Suspense, Error Boundaries, Modern Component Patterns
- **TypeScript 5.6**: Strict mode, zero errors policy
- **Styled Components 6**: CSS-in-JS con theming
- **Lucide React**: Iconografía consistente y optimizada
- **Component Architecture**: Parameter defaults, no defaultProps, React 19+ compatibility

### Backend
- **Prisma ORM 6.13**: Type-safe queries, migrations
- **MySQL 8.0**: Base de datos relacional optimizada
- **Next.js API Routes**: Serverless functions
- **JWT**: Stateless authentication con refresh tokens
- **bcrypt**: Password hashing seguro

### Integraciones
- **Stripe API**: Payments, webhooks, subscriptions
- **Resend**: Email delivery con templates
- **Google Places API**: Geocoding y geolocation
- **Cloudinary**: Image optimization y CDN
- **Vercel**: Deployment, analytics, edge functions

### Testing
- **Jest 29**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing automatizado
- **Testing Library/jest-dom**: DOM testing utilities

---

## 🗄️ Modelo de Datos

### Entidades Principales

```typescript
// Usuario del sistema
model User {
  id                String         @id @default(cuid())
  email            String         @unique
  firstName        String
  lastName         String
  phone            String?
  isActive         Boolean        @default(true)
  role             UserRoleEnum   @default(USER)
  stripeCustomerId String?        @unique

  // Relaciones
  reservations     Reservation[]
  payments         Payment[]
  notifications    Notification[]
  userSettings     UserSettings?
  reviews          Review[]
  receipts         Receipt[]
  adminActions     AdminAuditLog[]
  userRoles        UserRoleAssignment[]
}

// Venue (local/establecimiento)
model Venue {
  id          String    @id @default(cuid())
  name        String
  description String?   @db.Text
  address     String
  city        String    @default("Guadalajara")
  state       String    @default("Jalisco")
  country     String    @default("Mexico")
  latitude    Float?
  longitude   Float?
  rating      Decimal   @default(0) @db.Decimal(3, 2)
  category    VenueType @default(RESTAURANT)
  isActive    Boolean   @default(true)

  // Configuración
  maxCapacity      Int       @default(1)
  pricePerGuest    Decimal   @db.Decimal(10, 2)
  cancellationFee  Decimal   @default(0) @db.Decimal(10, 2)

  // Relaciones
  services     Service[]
  reservations Reservation[]
  reviews      Review[]
  userRoles    UserRoleAssignment[]
}

// Servicio ofrecido por un venue
model Service {
  id          String      @id @default(cuid())
  name        String
  description String?     @db.Text
  price       Decimal     @db.Decimal(10, 2)
  duration    Int         // en minutos
  capacity    Int         @default(1)
  type        ServiceType @default(ACCOMMODATION)
  isActive    Boolean     @default(true)

  // Relaciones
  venue        Venue         @relation(fields: [venueId], references: [id])
  venueId      String
  reservations Reservation[]
}

// Reservación
model Reservation {
  id          String            @id @default(cuid())
  checkIn     DateTime
  checkOut    DateTime
  guests      Int               @default(1)
  totalAmount Decimal           @db.Decimal(10, 2)
  status      ReservationStatus @default(PENDING)

  // Relaciones
  user     User      @relation(fields: [userId], references: [id])
  userId   String
  venue    Venue     @relation(fields: [venueId], references: [id])
  venueId  String
  service  Service   @relation(fields: [serviceId], references: [id])
  serviceId String
  payments Payment[]
  reviews  Review[]
}

// Pago procesado
model Payment {
  id                String        @id @default(cuid())
  amount           Decimal       @db.Decimal(10, 2)
  currency         String        @default("MXN")
  status           PaymentStatus @default(PENDING)
  paymentMethod    String?       // "card", "cash", etc.
  stripePaymentId  String?       @unique
  stripeCustomerId String?

  // Relaciones
  user         User         @relation(fields: [userId], references: [id])
  userId       String
  reservation  Reservation? @relation(fields: [reservationId], references: [id])
  reservationId String?
  receipts     Receipt[]
}
```

### Sistema de Roles y Permisos

```typescript
model Role {
  id              String           @id @default(cuid())
  name            String           @unique
  description     String?
  isSystemRole    Boolean          @default(false)
  isActive        Boolean          @default(true)

  permissions     RolePermission[]
  userRoles       UserRoleAssignment[]
}

model Permission {
  id            String         @id @default(cuid())
  name          String         @unique // e.g., "dashboard:read"
  description   String?
  module        String         // e.g., "dashboard", "payments"
  action        String         // e.g., "read", "write", "delete"
  resource      String?        // e.g., "own", "all"
  isSystemPerm  Boolean        @default(true)

  roles         RolePermission[]
}

model UserRoleAssignment {
  id            String      @id @default(cuid())
  userId        String
  roleId        String
  venueId       String?     // Para roles específicos por venue
  grantedBy     String?
  grantedAt     DateTime    @default(now())
  expiresAt     DateTime?
  isActive      Boolean     @default(true)

  user          User        @relation("UserRoles", fields: [userId], references: [id])
  role          Role        @relation(fields: [roleId], references: [id])
  venue         Venue?      @relation("VenueRoles", fields: [venueId], references: [id])
  grantor       User?       @relation("GrantedRoles", fields: [grantedBy], references: [id])
}
```

### Audit Trail y Logs

```typescript
model AdminAuditLog {
  id             String              @id @default(cuid())
  adminUserId    String
  action         AdminAuditAction
  resourceType   AdminResourceType
  resourceId     String?
  oldValues      Json?
  newValues      Json?
  metadata       Json?
  ipAddress      String?
  userAgent      String?
  createdAt      DateTime           @default(now())

  admin          User               @relation("AdminActions", fields: [adminUserId], references: [id])
}
```

---

## ⚛️ Patrones Modernos de React

### Arquitectura de Componentes React 19+

ReservApp implementa patrones modernos de React 19+ eliminando completamente `defaultProps` en favor de parameter defaults, preparando la aplicación para futuras versiones de React.

#### ✅ Patrón Moderno (Implementado)

```typescript
// ✅ CORRECTO - Parameter defaults modernos
interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'contained',        // Default explícito
    size = 'medium',              // Default explícito
    disabled = false,             // Default explícito
    loading = false,              // Default explícito
    onClick = undefined,          // Default explícito para opcionales
    ...rest
  }, ref) => {
    return (
      <StyledButton
        disabled={disabled || loading}
        ref={ref}
        size={size}
        variant={variant}
        {...rest}
        onClick={onClick}
      >
        {loading ? <Spinner /> : children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
```

#### ❌ Patrón Obsoleto (Eliminado)

```typescript
// ❌ OBSOLETO - defaultProps (deprecated en React 18+)
const Button = ({ children, variant, size, disabled, loading }) => {
  return <StyledButton>{children}</StyledButton>;
};

Button.defaultProps = {
  variant: 'contained',
  size: 'medium',
  disabled: false,
  loading: false
};
```

### Componentes Modernizados

Los siguientes componentes han sido actualizados a patrones modernos:

#### UI Components Core
- **Button**: Parameter defaults para `variant`, `size`, `disabled`, `loading`, etc.
- **TextField**: Defaults para `actionIcon`, `errorText`, `helperText`, `label`, etc.
- **Card**: Defaults para `actions`, `badge`, `header`, `href`, `target`, etc.
- **Modal**: Defaults para `isOpen`, `maxWidth`, `onClose`, `title`
- **LoadingSpinner**: Default optimizado para `color` con simplificación de lógica

#### Layout Components
- **DatePicker**: Defaults para `className`, `error`, `helperText`, todos los props opcionales
- **Breadcrumbs**: Defaults para `className`, `items`
- **ProgressBar**: Defaults para `currentStep`, `index`, `label`, `totalSteps`
- **Badge**: Default para `className`

#### Dialog Components
- **ConfirmDialog**: Defaults para `isOpen`, `message`, `onClose`, `onConfirm`, `title`

### Benefits de la Modernización

#### ✅ React 19+ Compatibility
```typescript
// Preparado para React 19+ donde defaultProps será removido
const Component = ({
  requiredProp,           // Sin default - requerido
  optionalProp = 'default', // Con default - opcional
  callbackProp = undefined  // Callback opcional con default explícito
}) => {
  // Implementation
};
```

#### ✅ Better TypeScript Integration
```typescript
// TypeScript puede inferir mejor los tipos con parameter defaults
interface Props {
  size?: 'sm' | 'md' | 'lg';    // Opcional por el default
  required: string;              // Requerido - sin default
}

const Component = ({
  size = 'md',    // TypeScript sabe que nunca será undefined
  required        // TypeScript sabe que es requerido
}: Props) => {
  // size es siempre 'sm' | 'md' | 'lg', nunca undefined
  console.log(size.toUpperCase()); // ✅ Safe
};
```

#### ✅ Better Performance
```typescript
// Evita re-renders innecesarios al tener defaults consistentes
const Component = ({
  onClick = useCallback(() => {}, []) // Default estable
}) => {
  // No re-render por cambio de default
};
```

### Custom ESLint Rule

ReservApp incluye una regla ESLint custom `require-default-props` que garantiza que todos los props destructured tengan valores por defecto explícitos:

```json
// eslint.config.js
{
  "rules": {
    "custom/require-default-props": "warn"
  }
}
```

Esta regla ayuda a:
- **Prevenir undefined props** en componentes
- **Garantizar consistencia** en toda la aplicación
- **Facilitar refactoring** a React 19+
- **Mejorar DX** con mejor intellisense

### Migration Pattern

Para migrar componentes existentes:

```typescript
// 1. Identificar props sin defaults
const Component = ({ prop1, prop2, prop3 }) => {};

// 2. Agregar defaults explícitos
const Component = ({
  prop1 = undefined,      // Para props opcionales
  prop2 = 'defaultValue', // Para props con valor por defecto
  prop3                   // Para props requeridos (sin default)
}) => {};

// 3. Actualizar tipos si es necesario
interface Props {
  prop1?: string;    // Opcional
  prop2?: string;    // Opcional con default
  prop3: string;     // Requerido
}
```

---

## 🔐 Sistema de Autenticación

### JWT Implementation

```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRoleEnum;
  iat: number;
  exp: number;
}

// Token Management
class AuthService {
  generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutos
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!);
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}
```

### Middleware de Autenticación

```typescript
export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Agregar usuario al contexto de la request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role);

    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

### Sistema de Permisos

```typescript
interface AuthorizationContext {
  userId: string;
  userRole: UserRoleEnum;
  venueId?: string;
}

class AuthorizationService {
  async checkPermission(
    context: AuthorizationContext,
    module: string,
    action: string,
    resource?: string
  ): Promise<boolean> {
    // Super admin tiene todos los permisos
    if (context.userRole === 'SUPER_ADMIN') return true;

    // Verificar permisos específicos en base de datos
    return await userRoleRepository.checkUserPermission(
      context.userId,
      module,
      action,
      context.venueId,
      resource
    );
  }
}

// HOC para componentes con permisos
export function withPermission(
  Component: React.ComponentType<any>,
  requiredPermission: string
) {
  return function ProtectedComponent(props: any) {
    const { user } = useAuth();
    const hasPermission = usePermission(requiredPermission);

    if (!hasPermission) {
      return <UnauthorizedMessage />;
    }

    return <Component {...props} />;
  };
}
```

---

## 💳 Sistema de Pagos

### Integración con Stripe

```typescript
// Stripe Service Implementation
class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(amount: number, currency = 'mxn'): Promise<PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: 'reservapp-web'
      }
    });
  }

  async processReservationPayment(
    reservationId: string,
    userId: string,
    amount: number
  ): Promise<Payment> {
    // 1. Crear Payment Intent en Stripe
    const paymentIntent = await this.createPaymentIntent(amount);

    // 2. Crear registro de pago en DB
    const payment = await prisma.payment.create({
      data: {
        amount,
        currency: 'MXN',
        status: 'PENDING',
        stripePaymentId: paymentIntent.id,
        userId,
        reservationId,
      }
    });

    return payment;
  }
}
```

### Webhook Handler

```typescript
// Webhook para sincronizar estados con Stripe
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailure(failedPayment);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Actualizar estado de pago en DB
  await prisma.payment.update({
    where: { stripePaymentId: paymentIntent.id },
    data: { status: 'COMPLETED' }
  });

  // Confirmar reservación automáticamente
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId: paymentIntent.id },
    include: { reservation: true }
  });

  if (payment?.reservation) {
    await prisma.reservation.update({
      where: { id: payment.reservation.id },
      data: { status: 'CONFIRMED' }
    });

    // Enviar email de confirmación
    await emailService.sendReservationConfirmation(payment.reservation);
  }
}
```

---

## 📊 Sistema de Reportes

### Service de Generación

```typescript
class ReportsService {
  async generateRevenueAnalysis(parameters: ReportParameters): Promise<RevenueAnalysisData> {
    const { dateFrom, dateTo, venueIds } = parameters;

    // Query optimizada con joins
    const payments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: new Date(dateFrom), lte: new Date(dateTo) },
        ...(venueIds?.length && {
          reservation: {
            service: { venueId: { in: venueIds } }
          }
        })
      },
      include: {
        reservation: {
          include: {
            service: {
              include: { venue: { select: { id: true, name: true } } }
            }
          }
        }
      }
    });

    // Agregaciones y cálculos
    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalTransactions = payments.length;
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Análisis por venue
    const venueBreakdown = this.calculateVenueBreakdown(payments, totalRevenue);

    // Series temporales
    const timeSeriesData = await this.generateTimeSeriesData(
      payments,
      new Date(dateFrom),
      new Date(dateTo),
      parameters.groupBy || 'day'
    );

    return {
      summary: {
        totalRevenue,
        totalTransactions,
        averageTransactionValue,
        revenueGrowth: await this.calculateGrowthRate(dateFrom, dateTo),
        topPaymentMethods: await this.getTopPaymentMethods(payments)
      },
      timeSeriesData,
      venueBreakdown,
      serviceBreakdown: this.calculateServiceBreakdown(payments)
    };
  }
}
```

### Export a PDF

```typescript
class ReportExportService {
  async exportToPDF(
    reportId: string,
    reportType: ReportType,
    data: ReportData,
    insights: ReportInsight[]
  ): Promise<string> {
    // Generar HTML con template profesional
    const html = this.generateHTMLReport(reportType, data, insights);

    // En producción usaríamos Puppeteer o similar
    // Por ahora retornamos URL mock
    return `/api/reports/${reportId}/download.pdf`;
  }

  private generateHTMLReport(
    reportType: ReportType,
    data: any,
    insights: ReportInsight[]
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${this.getReportTitle(reportType)}</title>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 30px; text-align: center; }
            .section { margin: 30px 0; background: white; padding: 20px; border-radius: 8px; }
            .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
            .metric-card { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
            .metric-value { font-size: 28px; font-weight: bold; color: #2563eb; }
            .insight { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${this.getReportTitle(reportType)}</h1>
            <div>ReservApp - Generado el: ${new Date().toLocaleDateString('es-MX')}</div>
          </div>

          ${this.generateInsightsSection(insights)}
          ${this.generateReportContent(reportType, data)}
        </body>
      </html>
    `;
  }
}
```

---

## 🧪 Testing Strategy

### Unit Testing

```typescript
// Ejemplo de test de servicio
describe('ReservationService', () => {
  let reservationService: ReservationService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    reservationService = new ReservationService(mockPrisma);
  });

  describe('createReservation', () => {
    it('should create reservation with payment processing', async () => {
      // Arrange
      const reservationData = {
        serviceId: 'service-1',
        userId: 'user-1',
        checkIn: new Date('2025-02-01T10:00:00Z'),
        checkOut: new Date('2025-02-01T12:00:00Z'),
        guests: 2
      };

      mockPrisma.service.findUnique.mockResolvedValue(mockService);
      mockPrisma.reservation.create.mockResolvedValue(mockReservation);

      // Act
      const result = await reservationService.createReservation(reservationData);

      // Assert
      expect(result).toBeDefined();
      expect(result?.status).toBe('PENDING');
      expect(mockPrisma.reservation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: reservationData.userId,
          serviceId: reservationData.serviceId,
        })
      });
    });
  });
});
```

### Integration Testing

```typescript
// Test de API endpoint completo
describe('/api/reservations', () => {
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
    testUser = await createTestUser();
    authToken = generateTestToken(testUser);
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/reservations', () => {
    it('should create reservation and process payment', async () => {
      const reservationData = {
        serviceId: 'test-service-id',
        checkIn: '2025-02-01T10:00:00Z',
        checkOut: '2025-02-01T12:00:00Z',
        guests: 2,
        paymentMethodId: 'pm_card_visa' // Stripe test token
      };

      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reservationData)
        .expect(201);

      expect(response.body.reservation).toBeDefined();
      expect(response.body.payment).toBeDefined();
      expect(response.body.payment?.status).toBe('PENDING');
    });
  });
});
```

### E2E Testing con Playwright

```typescript
// Test del flujo completo de reservación
test('complete reservation flow with payment', async ({ page }) => {
  // 1. Navegar a servicios
  await page.goto('/services');
  await expect(page).toHaveTitle(/Servicios/);

  // 2. Seleccionar un servicio
  await page.click('[data-testid="service-card"]:first-child');

  // 3. Configurar reservación
  await page.fill('[data-testid="checkin-date"]', '2025-02-01');
  await page.fill('[data-testid="checkout-date"]', '2025-02-01');
  await page.selectOption('[data-testid="guests-select"]', '2');

  // 4. Hacer login
  await page.click('[data-testid="reserve-button"]');
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.click('[data-testid="login-button"]');

  // 5. Procesar pago (usando Stripe test mode)
  await page.fill('[data-testid="card-number"]', '4242424242424242');
  await page.fill('[data-testid="card-expiry"]', '12/25');
  await page.fill('[data-testid="card-cvc"]', '123');
  await page.click('[data-testid="pay-button"]');

  // 6. Verificar confirmación
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  await expect(page.locator('[data-testid="reservation-id"]')).toBeVisible();
});
```

---

## 🚀 Deployment y DevOps

### Vercel Configuration

```javascript
// vercel.json
{
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret",
    "STRIPE_SECRET_KEY": "@stripe-secret",
    "STRIPE_PUBLISHABLE_KEY": "@stripe-publishable"
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
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
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
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run type checking
        run: yarn type-check

      - name: Run linting
        run: yarn lint

      - name: Run unit tests
        run: yarn test --coverage

      - name: Run E2E tests
        run: yarn test:e2e

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment Variables

```bash
# .env.local (development)
DATABASE_URL="mysql://user:password@localhost:3306/reservapp"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@reservapp.com"

# Google Places
GOOGLE_PLACES_API_KEY="your-google-places-key"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Database Management

```bash
# Prisma commands para producción
npx prisma generate           # Generar cliente
npx prisma db push           # Aplicar schema a DB
npx prisma db seed           # Popular con data inicial
npx prisma studio            # GUI para DB
npx prisma migrate deploy    # Aplicar migraciones en prod
```

---

## 📊 Monitoring y Observabilidad

### Error Tracking

```typescript
// Error boundary para React
class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    console.error('Global error caught:', error, errorInfo);

    // En producción enviaríamos a Sentry o similar
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
```

### Performance Monitoring

```typescript
// Web Vitals tracking
export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case 'FCP':
      console.log('First Contentful Paint:', metric.value);
      break;
    case 'LCP':
      console.log('Largest Contentful Paint:', metric.value);
      break;
    case 'CLS':
      console.log('Cumulative Layout Shift:', metric.value);
      break;
    case 'FID':
      console.log('First Input Delay:', metric.value);
      break;
    case 'TTFB':
      console.log('Time to First Byte:', metric.value);
      break;
  }

  // En producción enviaríamos a analytics
  if (process.env.NODE_ENV === 'production') {
    gtag('event', metric.name, {
      custom_map: { metric_value: 'value' },
      value: metric.value,
      event_label: metric.id,
      non_interaction: true,
    });
  }
}
```

---

## 🔧 Development Workflow

### Comandos Esenciales

```bash
# Desarrollo
yarn dev                     # Servidor desarrollo con hot reload
yarn build                   # Build optimizado para producción
yarn start                   # Servidor de producción

# Base de datos
yarn db:generate            # Generar Prisma client
yarn db:push               # Aplicar schema changes
yarn db:seed               # Popular con data de Guadalajara
yarn db:studio             # Abrir Prisma Studio
yarn db:reset              # Reset completo + seed

# Calidad de código
yarn lint                   # ESLint + Stylelint (incluye custom require-default-props rule)
yarn lint:fix               # Auto-fix issues
yarn type-check            # TypeScript validation
yarn format                # Prettier formatting

# Testing
yarn test                   # Unit tests con Jest
yarn test:watch            # Tests en modo watch
yarn test:coverage         # Coverage report
yarn test:e2e              # Playwright E2E tests

# Utilidades
yarn analyze:exports        # Análisis de exports
yarn clean                  # Limpiar cache y builds
```

### Git Workflow

```bash
# Feature development
git checkout -b feature/nueva-funcionalidad
git add .
git commit -m "feat: implementar nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Create PR, get review, merge to dev
# Deploy to staging for testing
# Merge to main for production deployment
```

### Code Style Guide

```typescript
// Nomenclatura
const ComponentName = () => {}           // PascalCase para componentes
const variableName = 'value';           // camelCase para variables
const CONSTANT_VALUE = 'constant';      // UPPER_CASE para constantes
interface UserData {}                   // PascalCase para interfaces
type PaymentStatus = 'pending' | 'completed';  // PascalCase para types

// Imports order
import React from 'react';              // 1. React/Next
import { NextPage } from 'next';
import styled from 'styled-components'; // 2. Third party
import { Button } from '@ui/Button';    // 3. Internal components
import { useAuth } from '@/hooks';      // 4. Internal hooks/utils
import type { User } from '@/types';    // 5. Types (with 'type' prefix)

// React Component Patterns
const Component = ({
  required,                             // Props requeridos sin default
  optional = 'defaultValue',           // Props opcionales con default explícito
  callback = undefined                 // Callbacks opcionales con default
}) => {};

// Exports
export { ComponentName };               // Named exports preferred
export default ComponentName;          // Default only when required
```

---

## 📚 Recursos y Referencias

### Documentación Oficial
- **Next.js 15**: https://nextjs.org/docs
- **React 19**: https://react.dev/
- **Prisma**: https://www.prisma.io/docs
- **Stripe API**: https://stripe.com/docs/api
- **TypeScript**: https://www.typescriptlang.org/docs

### Herramientas de Desarrollo
- **VS Code Extensions**: ES7+ React snippets, Prisma, TypeScript
- **Browser DevTools**: React DevTools, Redux DevTools
- **Database GUI**: Prisma Studio, phpMyAdmin
- **API Testing**: Postman collection incluida

### Performance Benchmarks
- **Lighthouse Score**: 95+ en todas las categorías
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size**: < 100KB JavaScript inicial
- **API Response**: < 200ms promedio

---

## 🗺️ Rutas y Endpoints Disponibles

### Páginas (App Router)

#### Rutas Públicas
- **`/`** - Landing page principal (367 B)
- **`/landing`** - Página de inicio detallada (4.31 kB)
- **`/services`** - Catálogo de servicios (1.31 kB)
- **`/business`** - Información para negocios (1.31 kB)
- **`/contact`** - Formulario de contacto (596 B)

#### Autenticación
- **`/auth/login`** - Inicio de sesión (3.69 kB)
- **`/auth/register`** - Registro de negocios (9.06 kB)
- **`/auth/user-register`** - Registro de usuarios (3.94 kB)

#### Panel Administrativo
- **`/admin`** - Dashboard principal (1.56 kB)
- **`/admin/users`** - Gestión de usuarios (157 B)
- **`/admin/venues`** - Gestión de establecimientos (157 B)
- **`/admin/services`** - Gestión de servicios (156 B)
- **`/admin/reservations`** - Gestión de reservaciones (156 B)
- **`/admin/payments`** - Gestión de pagos (157 B)
- **`/admin/reports`** - Reportes y análisis (157 B)

### API Endpoints (Serverless Functions)

#### Autenticación
- **`POST /api/auth/login`** - Iniciar sesión
- **`POST /api/auth/register`** - Registrar usuario/negocio
- **`POST /api/auth/logout`** - Cerrar sesión

#### Venues (Establecimientos)
- **`GET /api/venues`** - Listar venues
- **`GET /api/venues/[id]`** - Obtener venue específico
- **`POST /api/venues`** - Crear venue (requiere auth)
- **`PATCH /api/venues/[id]`** - Actualizar venue (requiere auth)
- **`DELETE /api/venues/[id]`** - Eliminar venue (requiere auth)

#### Reservaciones
- **`GET /api/reservations`** - Listar reservaciones
- **`GET /api/reservations/[id]`** - Obtener reservación
- **`POST /api/reservations`** - Crear reservación
- **`PATCH /api/reservations/[id]`** - Actualizar reservación

#### Pagos
- **`POST /api/payments/subscription`** - Gestionar suscripciones

#### Notificaciones
- **`GET /api/notifications`** - Obtener notificaciones
- **`POST /api/notifications`** - Crear notificación

#### Usuarios
- **`GET /api/users`** - Listar usuarios (admin)
- **`PATCH /api/users/[id]`** - Actualizar usuario

#### Sistema
- **`GET /api/health`** - Health check del sistema
- **`GET /api/swagger`** - Documentación OpenAPI

### Métricas de Build

```
Total de rutas: 28
- Páginas estáticas (○): 21
- API dinámicas (ƒ): 7

Bundle Size:
- First Load JS compartido: 99.8 kB
- Chunk principal: 54.1 kB
- Chunks secundarios: 43.7 kB
- Otros chunks: 1.95 kB

Tiempo de build: ~16 segundos
```

---

*Guía Técnica ReservApp - Versión 2.1 - Enero 2025*