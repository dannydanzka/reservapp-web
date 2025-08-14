# ReservApp - Guía Técnica Completa

> 📖 **Referencia Principal**: Para comandos esenciales y contexto del proyecto, consulta siempre [`CLAUDE.md`](../CLAUDE.md) en la raíz del proyecto.

**🚀 VERSIÓN ACTUALIZADA - ENERO 2025**

## 🔗 Enlaces Rápidos
- **Comandos Esenciales**: [`CLAUDE.md`](../CLAUDE.md#essential-commands)
- **Arquitectura Completa**: [`CLAUDE.md`](../CLAUDE.md#quick-architecture-reference)
- **Estado de Producción**: [`CLAUDE.md`](../CLAUDE.md#current-production-status)
- **API Documentación**: [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)
- **Modelo de Negocio**: [`BUSSINESS_MODEL.md`](./BUSSINESS_MODEL.md)

## 📋 Arquitectura del Sistema (2025)

### 🏗️ Arquitectura API-First (Actualizada)
ReservApp implementa **Clean Architecture** con enfoque **API-First** y separación total entre frontend y backend:

```
src/
├── app/                    # Next.js 15 App Router (SOLO rutas)
│   ├── admin/             # Dashboard React (consume APIs HTTP)
│   ├── api/               # 25+ API Routes serverless
│   ├── auth/              # Autenticación JWT
│   ├── about/             # Páginas informativas
│   ├── help/              # Centro de ayuda
│   ├── privacy/           # Políticas de privacidad
│   └── terms/             # Términos y condiciones
├── modules/               # Módulos Clean Architecture
│   ├── mod-auth/          # JWT + bcrypt + middleware
│   ├── mod-admin/         # Dashboard HTTP API-first
│   └── mod-landing/       # Páginas públicas
└── libs/                  # Capas arquitectónicas
    ├── presentation/      # Componentes UI + Hooks
    ├── infrastructure/    # Services + Repositories  
    ├── services/          # API clients + integrations
    └── shared/            # Utils + constants + types
```

### 🔄 Principios de Arquitectura API-First
1. **Zero Prisma en Frontend**: Admin dashboard usa SOLO HTTP APIs
2. **Service Layer Mandatory**: Todo pasa por service layer (`src/libs/services/api/`)
3. **Custom Hooks Pattern**: Lógica de negocio en hooks (`src/libs/presentation/hooks/`)
4. **Type-Safe APIs**: Response types en (`src/libs/services/api/types/`)
5. **Error Handling Centralizado**: `ApiResponse<T>` pattern en todos los servicios

---

## 🛠️ Stack Tecnológico (Enero 2025)

### Frontend Moderno
- **Next.js 15**: App Router, React Server Components, Edge Runtime
- **React 19**: Suspense boundaries, Concurrent Features, Modern component patterns
- **TypeScript 5.6**: Strict mode habilitado, 0 errores de compilación
- **Styled Components 6.1**: CSS-in-JS con theme provider
- **Lucide React**: 1,500+ iconos optimizados y consistentes
- **Component Architecture**: Parameter defaults pattern (no defaultProps)

### Backend & Database
- **Prisma ORM 6.13**: Type-safe queries con 15+ modelos relacionales
- **MySQL 8.0**: Base de datos optimizada con índices y constraints
- **JWT Authentication**: Stateless tokens + bcrypt hashing
- **25+ API Routes**: Serverless functions con middleware compartido
- **Audit Logging**: Sistema completo de trazabilidad

### Servicios Críticos Implementados
- **AuthorizationService**: Permisos granulares por rol y venue
- **SystemLoggingService**: Logs categorizados con metadata
- **ContactService**: Workflow completo con notificaciones
- **AdminStatsService**: Métricas en tiempo real
- **ResendService**: Templates profesionales de email

### Integraciones & APIs
- **Stripe API**: Pagos automáticos + webhooks + suscripciones
- **Resend**: Email delivery con templates profesionales
- **Google Places API**: Geocoding para venues
- **Vercel Edge**: Deployment con CDN global

### Testing Completo
- **Jest**: 47+ test files con configuración optimizada
- **React Testing Library**: Component testing patterns
- **Playwright**: E2E testing con escenarios reales
- **Perfect ESLint Score**: Cero warnings, calidad garantizada

---

## 🗄️ Modelo de Datos (15+ Modelos)

### 🎯 Sistema de Autenticación

```typescript
// Usuario principal del sistema
model User {
  id                String         @id @default(cuid())
  email            String         @unique
  firstName        String
  lastName         String
  phone            String?
  isActive         Boolean        @default(true)
  role             UserRoleEnum   @default(USER)
  stripeCustomerId String?        @unique
  profileImageUrl  String?
  emailVerifiedAt  DateTime?
  lastLoginAt      DateTime?
  
  // Configuración de seguridad
  passwordHash     String
  refreshToken     String?
  refreshTokenExp  DateTime?
  twoFactorSecret  String?
  twoFactorEnabled Boolean        @default(false)

  // Relaciones
  reservations     Reservation[]
  payments         Payment[]
  notifications    Notification[]
  userSettings     UserSettings?
  reviews          Review[]
  receipts         Receipt[]
  adminActions     AdminAuditLog[]
  userRoles        UserRoleAssignment[]
  contactForms     ContactForm[]  // Nueva relación
}

// Configuración personalizada por usuario
model UserSettings {
  id                    String   @id @default(cuid())
  userId               String   @unique
  language             String   @default("es")
  timezone             String   @default("America/Mexico_City")
  emailNotifications   Boolean  @default(true)
  pushNotifications    Boolean  @default(true)
  marketingEmails      Boolean  @default(false)
  
  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

### 🏨 Gestión de Venues y Servicios

```typescript
// Venue (establecimiento/local)
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
  
  // Configuración operativa
  maxCapacity      Int       @default(1)
  pricePerGuest    Decimal   @db.Decimal(10, 2)
  cancellationFee  Decimal   @default(0) @db.Decimal(10, 2)
  
  // Información de contacto
  phone            String?
  email            String?
  website          String?
  
  // Media y marketing
  imageUrls        Json?     // Array de URLs de imágenes
  amenities        Json?     // Array de amenidades
  tags             Json?     // Tags para búsqueda

  // Timestamps
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  // Relaciones
  services         Service[]
  reservations     Reservation[]
  reviews          Review[]
  userRoles        UserRoleAssignment[]
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
  
  // Configuración avanzada
  requiresAdvanceBooking Boolean   @default(false)
  advanceBookingHours    Int?      // Horas de antelación requeridas
  maxBookingsPerDay      Int?      // Límite diario de reservas
  
  // Disponibilidad
  availableDays          Json?     // Array de días disponibles (0=Domingo)
  availableHours         Json?     // Horarios disponibles
  blackoutDates          Json?     // Fechas no disponibles

  // Timestamps
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  // Relaciones
  venue                  Venue         @relation(fields: [venueId], references: [id])
  venueId                String
  reservations           Reservation[]
}

### 📅 Sistema de Reservaciones

```typescript
// Reservación completa
model Reservation {
  id            String            @id @default(cuid())
  checkIn       DateTime
  checkOut      DateTime
  guests        Int               @default(1)
  totalAmount   Decimal           @db.Decimal(10, 2)
  status        ReservationStatus @default(PENDING)
  
  // Información adicional
  specialRequests String?         @db.Text
  notes          String?          @db.Text
  confirmationCode String?        @unique
  
  // Política de cancelación
  cancelledAt    DateTime?
  cancellationReason String?     @db.Text
  refundAmount   Decimal?        @db.Decimal(10, 2)
  
  // Timestamps
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  // Relaciones
  user           User            @relation(fields: [userId], references: [id])
  userId         String
  venue          Venue           @relation(fields: [venueId], references: [id])
  venueId        String
  service        Service         @relation(fields: [serviceId], references: [id])
  serviceId      String
  payments       Payment[]
  reviews        Review[]
}

### 💳 Sistema de Pagos y Facturación

```typescript
// Pago procesado con Stripe
model Payment {
  id                String        @id @default(cuid())
  amount           Decimal       @db.Decimal(10, 2)
  currency         String        @default("MXN")
  status           PaymentStatus @default(PENDING)
  paymentMethod    String?       // "card", "transfer", "cash"
  
  // Integración Stripe
  stripePaymentId  String?       @unique
  stripeCustomerId String?
  stripeInvoiceId  String?
  stripeFeeAmount  Decimal?      @db.Decimal(10, 2)
  
  // Metadata financiera
  platformFee      Decimal       @default(0) @db.Decimal(10, 2)
  venueFee         Decimal       @default(0) @db.Decimal(10, 2)
  taxAmount        Decimal       @default(0) @db.Decimal(10, 2)
  
  // Gestión de errores
  failureReason    String?
  attemptCount     Int           @default(1)
  lastAttemptAt    DateTime?
  
  // Timestamps
  processedAt      DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  // Relaciones
  user             User          @relation(fields: [userId], references: [id])
  userId           String
  reservation      Reservation?  @relation(fields: [reservationId], references: [id])
  reservationId    String?
  receipts         Receipt[]
}

// Recibo generado automáticamente
model Receipt {
  id              String   @id @default(cuid())
  receiptNumber   String   @unique
  issueDate       DateTime @default(now())
  totalAmount     Decimal  @db.Decimal(10, 2)
  taxAmount       Decimal  @default(0) @db.Decimal(10, 2)
  
  // Información fiscal
  customerName    String
  customerEmail   String
  customerAddress String?
  customerTaxId   String?  // RFC en México
  
  // Detalles del servicio
  serviceDetails  Json     // Desglose detallado
  
  // URLs de archivos
  pdfUrl          String?
  xmlUrl          String?  // Para facturación electrónica MX
  
  // Relaciones
  payment         Payment  @relation(fields: [paymentId], references: [id])
  paymentId       String
}
```

### 🔐 Sistema de Roles y Permisos (Granular)

```typescript
// Roles del sistema con permisos granulares
model Role {
  id              String           @id @default(cuid())
  name            String           @unique
  description     String?
  isSystemRole    Boolean          @default(false)
  isActive        Boolean          @default(true)
  
  // Configuración de acceso
  canManageUsers  Boolean          @default(false)
  canManageVenues Boolean          @default(false)
  canViewReports  Boolean          @default(false)
  canAccessAdmin  Boolean          @default(false)

  permissions     RolePermission[]
  userRoles       UserRoleAssignment[]
  
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

// Permisos específicos por módulo y acción
model Permission {
  id            String         @id @default(cuid())
  name          String         @unique // e.g., "dashboard:read", "venues:write"
  description   String?
  module        String         // "dashboard", "venues", "payments", "users"
  action        String         // "read", "write", "delete", "export"
  resource      String?        // "own", "all", "assigned"
  isSystemPerm  Boolean        @default(true)
  
  roles         RolePermission[]
}

// Tabla de unión roles-permisos
model RolePermission {
  id          String     @id @default(cuid())
  roleId      String
  permissionId String
  
  role        Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission  Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  
  @@unique([roleId, permissionId])
}

// Asignación de roles por usuario y venue
model UserRoleAssignment {
  id            String      @id @default(cuid())
  userId        String
  roleId        String
  venueId       String?     // Rol específico para un venue
  grantedBy     String?     // Quién otorgó el rol
  grantedAt     DateTime    @default(now())
  expiresAt     DateTime?   // Roles temporales
  isActive      Boolean     @default(true)
  
  // Metadata de asignación
  notes         String?     @db.Text
  conditions    Json?       // Condiciones especiales

  user          User        @relation("UserRoles", fields: [userId], references: [id], onDelete: Cascade)
  role          Role        @relation(fields: [roleId], references: [id])
  venue         Venue?      @relation("VenueRoles", fields: [venueId], references: [id])
  grantor       User?       @relation("GrantedRoles", fields: [grantedBy], references: [id])
}
```

### 📋 Audit Trail y Sistema de Logs

```typescript
// Log completo de auditoría para el sistema
model AdminAuditLog {
  id             String              @id @default(cuid())
  adminUserId    String
  action         AdminAuditAction    // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
  resourceType   AdminResourceType   // USER, VENUE, SERVICE, RESERVATION
  resourceId     String?
  
  // Datos del cambio
  oldValues      Json?               // Estado anterior
  newValues      Json?               // Estado nuevo
  
  // Metadata contextual
  metadata       Json?               // Información adicional
  ipAddress      String?
  userAgent      String?
  endpoint       String?             // API endpoint utilizado
  
  // Categorización
  severity       LogSeverity         @default(INFO)
  category       String              @default("admin")
  
  // Timestamps
  createdAt      DateTime           @default(now())

  admin          User               @relation("AdminActions", fields: [adminUserId], references: [id])
}

// Formularios de contacto con workflow completo
model ContactForm {
  id            String            @id @default(cuid())
  name          String
  email         String
  subject       String
  message       String            @db.Text
  
  // Clasificación automática
  category      ContactCategory   @default(GENERAL)
  priority      ContactPriority   @default(MEDIUM)
  status        ContactStatus     @default(PENDING)
  
  // Información del navegador
  userAgent     String?
  ipAddress     String?
  referrer      String?
  
  // Gestión de seguimiento
  assignedTo    String?           // Usuario asignado
  responseText  String?           @db.Text
  respondedAt   DateTime?
  resolvedAt    DateTime?
  
  // Timestamps
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  // Relaciones
  assignee      User?             @relation("AssignedContacts", fields: [assignedTo], references: [id])
}

// Notificaciones del sistema
model Notification {
  id            String              @id @default(cuid())
  title         String
  message       String              @db.Text
  type          NotificationType    @default(INFO)
  category      String              @default("system")
  
  // Estado de lectura
  isRead        Boolean             @default(false)
  readAt        DateTime?
  
  // Metadata
  metadata      Json?               // Datos adicionales
  actionUrl     String?             // URL de acción
  
  // Timestamps
  createdAt     DateTime            @default(now())
  expiresAt     DateTime?           // Notificaciones temporales

  // Relaciones
  user          User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId        String
}
```

---

## ⚛️ Patrones de Desarrollo API-First (2025)

### 🚀 Arquitectura de Componentes React 19+

ReservApp implementa **patrones modernos de React 19+** con **arquitectura API-First** que elimina completamente `defaultProps` y uso directo de Prisma en el frontend.

#### ✅ Patrón API-First + Parameter Defaults

```typescript
// ✅ CORRECTO - Componente admin usa SOLO HTTP APIs
interface AdminUserManagerProps {
  initialFilters?: UserFilters;
  pageSize?: number;
  showActions?: boolean;
  onUserSelect?: (user: User) => void;
}

export const AdminUserManager = ({
  initialFilters = {},
  pageSize = 10,
  showActions = true,
  onUserSelect = undefined
}: AdminUserManagerProps) => {
  // ✅ Custom hook con service layer
  const { 
    users, 
    loading, 
    error, 
    pagination,
    createUser,
    updateUser,
    deleteUser 
  } = useUsers({ 
    filters: initialFilters, 
    pageSize 
  });

  return (
    <UserManagerContainer>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      
      <UserTable 
        users={users}
        onEdit={updateUser}
        onDelete={deleteUser}
        showActions={showActions}
      />
      
      <Pagination {...pagination} />
    </UserManagerContainer>
  );
};

// ✅ Custom Hook que usa Service Layer
function useUsers({ filters, pageSize }: UseUsersParams) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // ✅ SOLO HTTP API calls - NO Prisma directo
    const result = await UserService.getUsers({ filters, pageSize });
    
    if (result.success) {
      setUsers(result.data.users);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [filters, pageSize]);

  return { users, loading, error, fetchUsers };
}

// ✅ Service Layer maneja comunicación HTTP
class UserService {
  static async getUsers(params: GetUsersParams): Promise<ApiResponse<UsersData>> {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      return handleApiResponse<UsersData>(response);
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
}
```

#### ❌ Patrones Obsoletos (Eliminados)

```typescript
// ❌ PROHIBIDO - Prisma directo en componentes
import { prisma } from '@/libs/infrastructure/services/core/database/prismaService';

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // ❌ MAL - Prisma en frontend
    const fetchUsers = async () => {
      const users = await prisma.user.findMany();
      setUsers(users);
    };
    fetchUsers();
  }, []);
};

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

// ❌ PROHIBIDO - Fetch directo sin service layer
const Component = () => {
  useEffect(() => {
    fetch('/api/users')  // ❌ Sin abstracción, sin error handling
      .then(res => res.json())
      .then(setUsers);
  }, []);
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

## 🔐 Sistema de Autenticación JWT (2025)

### 🔑 Implementación JWT con Middleware

```typescript
// JWT Token Structure (Actualizada)
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRoleEnum;
  firstName: string;
  lastName: string;
  isActive: boolean;
  iat: number;
  exp: number;
  venue?: string;  // Para roles específicos por venue
}

// AuthorizationService principal
class AuthorizationService {
  static generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutos
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!);
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static async validateToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      // Verificar que el usuario siga activo
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { isActive: true, role: true }
      });

      if (!user?.isActive) {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async checkPermission(
    userId: string,
    module: string,
    action: string,
    resourceId?: string
  ): Promise<boolean> {
    // Verificar permisos específicos en base de datos
    const userRoles = await prisma.userRoleAssignment.findMany({
      where: {
        userId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    return userRoles.some(userRole => 
      userRole.role.permissions.some(rolePermission => {
        const permission = rolePermission.permission;
        return permission.module === module && 
               permission.action === action &&
               (permission.resource === 'all' || !resourceId);
      })
    );
  }
}
```

### 🛡️ Middleware de Autenticación (src/middleware.ts)

```typescript
// Middleware principal de autenticación
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('auth-token')?.value;

  if (!token) {
    return unauthorizedResponse('Token required');
  }

  try {
    const payload = await AuthorizationService.validateToken(token);
    
    if (!payload) {
      return unauthorizedResponse('Invalid or expired token');
    }

    // Verificar permisos específicos para rutas admin
    if (pathname.startsWith('/admin')) {
      const hasAdminAccess = await AuthorizationService.checkPermission(
        payload.userId,
        'admin',
        'access'
      );

      if (!hasAdminAccess) {
        return NextResponse.json(
          { error: 'Insufficient permissions' }, 
          { status: 403 }
        );
      }
    }

    // Agregar información del usuario al contexto
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);
    requestHeaders.set('x-user-email', payload.email);

    return NextResponse.next({
      request: { headers: requestHeaders }
    });

  } catch (error) {
    await SystemLoggingService.logError('AUTH_MIDDLEWARE_ERROR', {
      error: error.message,
      pathname,
      userAgent: request.headers.get('user-agent')
    });

    return unauthorizedResponse('Authentication failed');
  }
}

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/landing',
    '/about',
    '/contact',
    '/help',
    '/privacy',
    '/terms',
    '/auth/login',
    '/auth/register',
    '/auth/user-register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/contact',
    '/api/health'
  ];

  return publicRoutes.some(route => pathname.startsWith(route));
}

function unauthorizedResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 401 });
}

// Configuración de rutas protegidas
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/users/:path*',
    '/api/venues/:path*',
    '/api/reservations/:path*',
    '/api/payments/:path*'
  ]
};
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

## ⚠️ REGLA CRÍTICA: Alias Paths (NUNCA QUITAR)

### 🚨 REGLA DE ORO - ALIAS OBLIGATORIOS

**❌ PROHIBIDO**: Quitar alias paths y usar rutas relativas
**✅ OBLIGATORIO**: Siempre arreglar configuración de alias

```typescript
// ❌ MAL - Ruta relativa
import { prisma } from '../../../libs/infrastructure/services/core/database/prismaService';

// ❌ MAL - Ruta absoluta sin alias  
import { prisma } from '/src/libs/infrastructure/services/core/database/prismaService';

// ✅ CORRECTO - Usar alias configurado
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';
```

### 🔧 Configuración de Alias (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@libs/*": ["./src/libs/*"],
      "@ui/*": ["./src/libs/presentation/components/*"],
      "@core/*": ["./src/libs/shared/*"],
      "@mod-auth/*": ["./src/modules/mod-auth/*"],
      "@mod-admin/*": ["./src/modules/mod-admin/*"],
      "@mod-landing/*": ["./src/modules/mod-landing/*"]
    }
  }
}
```

### 🚨 Si Alias Fallan - Solución Inmediata

1. **Verificar tsconfig.json**: Confirmar que los alias estén configurados
2. **Reiniciar TypeScript**: `Cmd+Shift+P` > "TypeScript: Restart TS Server"
3. **Verificar next.config.ts**: Confirmar configuración de webpack
4. **NUNCA usar rutas relativas** como solución temporal

```javascript
// next.config.ts - Configuración webpack
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@libs': path.resolve(__dirname, 'src/libs'),
      '@ui': path.resolve(__dirname, 'src/libs/presentation/components'),
      '@core': path.resolve(__dirname, 'src/libs/shared'),
    };
    return config;
  }
};
```

---

## 🔧 Development Workflow (2025)

### Comandos Esenciales (Actualizados)

```bash
# Desarrollo
yarn dev                     # Servidor desarrollo con hot reload (Next.js 15)
yarn build                   # Build optimizado para producción (99.8 kB)
yarn start                   # Servidor de producción
yarn preview                 # Preview del build local

# Base de datos y datos
yarn db:generate            # Generar Prisma client (15+ modelos)
yarn db:push               # Aplicar schema changes sin migración
yarn db:seed               # Popular con 6 meses de datos realistas
yarn db:studio             # Abrir Prisma Studio
yarn db:reset              # Reset completo + seed automático

# Calidad de código (Perfect Score)
yarn lint                   # ESLint + Stylelint + custom rules (0 warnings)
yarn lint:fix               # Auto-fix issues
yarn type-check            # TypeScript strict validation (0 errors)
yarn format                # Prettier formatting

# Testing completo
yarn test                   # Unit tests con Jest (47+ test files)
yarn test:watch            # Tests en modo watch para desarrollo
yarn test:coverage         # Coverage report con umbral 80%
yarn test:e2e              # Playwright E2E tests con escenarios reales
yarn test:ci               # CI/CD test execution con reports

# Deployment y producción
yarn vercel:deploy         # Deploy directo a Vercel
yarn analyze               # Bundle analyzer y optimización
yarn clean                 # Limpiar cache, builds y node_modules

# Desarrollo específico
yarn studio:dev            # Prisma Studio en modo desarrollo
yarn logs:dev              # Ver logs del sistema en desarrollo
yarn emails:test           # Test de templates de email
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

## 📧 Sistema de Emails (Resend + Templates)

### 🚀 Implementación Completa de Emails

ReservApp incluye un sistema completo de emails automáticos con templates profesionales usando Resend:

```typescript
// ResendService - Servicio principal de emails
class ResendService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendContactNotification(contactData: ContactFormData): Promise<EmailResult> {
    // Email al admin
    const adminEmail = await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TARGET_EMAIL!,
      subject: `Nuevo contacto: ${contactData.subject}`,
      html: this.generateContactAdminTemplate(contactData)
    });

    // Email de confirmación al usuario
    const userEmail = await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: contactData.email,
      subject: 'Hemos recibido tu mensaje - ReservApp',
      html: this.generateContactUserTemplate(contactData)
    });

    return { adminEmail, userEmail };
  }

  async sendWelcomeEmail(user: User, type: 'user' | 'business'): Promise<void> {
    const template = type === 'business' 
      ? this.generateBusinessWelcomeTemplate(user)
      : this.generateUserWelcomeTemplate(user);

    await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: user.email,
      subject: type === 'business' 
        ? 'Bienvenido al ecosistema ReservApp - Tu panel empresarial está listo'
        : 'Bienvenido a ReservApp - Eres pionero de nuestro ecosistema',
      html: template
    });
  }

  async sendReservationConfirmation(reservation: ReservationWithDetails): Promise<void> {
    const template = this.generateReservationTemplate(reservation);

    await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: reservation.user.email,
      subject: `Reservación confirmada - ${reservation.venue.name}`,
      html: template
    });
  }
}
```

### 🎨 Templates de Email Implementados

#### 1. **Formulario de Contacto**
- **Admin**: Recibe notificación con todos los detalles del contacto
- **Usuario**: Confirmación de recepción con información de seguimiento

#### 2. **Registro de Usuarios** 
- **Template morado/naranja**: Beneficios de pionero, descuentos exclusivos
- **Información de la plataforma**: Qué pueden hacer en ReservApp

#### 3. **Registro de Negocios**
- **Template verde**: Información empresarial y acceso al panel admin
- **Guía de primeros pasos**: Cómo configurar su establecimiento

#### 4. **Confirmación de Reservas**
- **Template profesional**: Todos los detalles de la reservación
- **Información del venue**: Dirección, contacto, instrucciones especiales

### ⚙️ Configuración de Emails

```bash
# .env.local - Configuración para MVP
RESEND_API_KEY="re_..."                           # API key de Resend
RESEND_FROM_EMAIL="onboarding@resend.dev"        # Email verificado
RESEND_TARGET_EMAIL="danny.danzka21@gmail.com"   # Todos los emails van aquí
NEXT_PUBLIC_ENABLE_EMAILS="true"                 # Activar sistema de emails
```

### 🔍 Flujo de Verificación de Emails

```bash
# 1. Verificar configuración
echo "RESEND_API_KEY: ${RESEND_API_KEY:0:10}..."
echo "RESEND_FROM_EMAIL: $RESEND_FROM_EMAIL"
echo "NEXT_PUBLIC_ENABLE_EMAILS: $NEXT_PUBLIC_ENABLE_EMAILS"

# 2. Test de envío (desarrollo)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test"}'

# 3. Verificar logs
tail -f ./logs/email.log
```

### 🚨 Errores Comunes y Soluciones

**Error: "Domain not verified"**
- ✅ Usar `onboarding@resend.dev` en desarrollo
- ✅ Configurar `RESEND_TARGET_EMAIL` para recibir todos los emails

**Error: "API key invalid"**
- ✅ Verificar `RESEND_API_KEY` en variables de entorno
- ✅ Confirmar que la key no haya expirado

**Emails no llegan:**
- ✅ Verificar carpeta de spam
- ✅ Confirmar `NEXT_PUBLIC_ENABLE_EMAILS=true`
- ✅ Revisar logs del servidor

### 📋 Checklist de Testing de Emails

- [ ] **Contacto**: Email al admin y confirmación al usuario
- [ ] **Registro User**: Template morado con beneficios pionero
- [ ] **Registro Business**: Template verde con info empresarial
- [ ] **Reservación**: Confirmación con todos los detalles
- [ ] **Formato responsivo**: Templates se ven bien en móvil
- [ ] **Enlaces funcionales**: Todos los botones y enlaces funcionan

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

## 🚀 Estado de Producción (Enero 2025)

### ✅ En Producción - https://reservapp-web.vercel.app

**Métricas de Calidad:**
- **Build Status**: ✅ Successful (16 segundos, Node.js 22.x)
- **Bundle Size**: 99.8 kB optimizado (First Load JS)
- **TypeScript**: 0 errores de compilación (strict mode)
- **ESLint Score**: Perfecto - 0 warnings
- **Test Coverage**: 47+ test files disponibles
- **API Endpoints**: 25+ endpoints documentados

**Funcionalidades Live:**
- ✅ Autenticación JWT completa con roles granulares
- ✅ Panel admin HTTP API-first (sin Prisma directo)
- ✅ Sistema de emails automático (Resend + templates)
- ✅ Gestión completa de venues, servicios y reservaciones
- ✅ Integración de pagos con Stripe
- ✅ Sistema de audit logs y trazabilidad
- ✅ Dashboard con métricas en tiempo real
- ✅ Internacionalización completa (750+ keys)
- ✅ Diseño responsive moderno (Lucide icons + Styled Components)

**Cuentas Demo Disponibles:**
- `admin@reservapp.com` - SUPER_ADMIN (ve todo el sistema)
- `admin.salazar@reservapp.com` - ADMIN (solo sus venues)
- `gestor.salazar@reservapp.com` - MANAGER (gestión específica)
- `juan.perez@gmail.com` - USER (cliente final)

**Contraseña universal**: `password123`

---

*Guía Técnica ReservApp - Versión 3.0 - Enero 2025*
*Sistema API-First con Clean Architecture - Producción Ready*