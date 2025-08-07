# 🔧 Backend Architecture & API Documentation

Complete backend documentation for ReservApp's comprehensive reservation ecosystem platform.

## 📋 Overview

ReservApp uses a **serverless backend architecture** built on Next.js API Routes, providing a unified API for both web and mobile applications. The backend manages the entire service ecosystem for Guadalajara's hospitality venues.

### **Core Backend Features**
- 🏗️ **Serverless Architecture** with Next.js API Routes
- 🗄️ **Prisma ORM** with MySQL database
- 🔐 **JWT Authentication** with bcrypt password hashing
- 💳 **Stripe Payment Integration** with webhooks
- 📧 **Resend Email Service** with HTML templates
- ☁️ **Cloudinary Image Management**
- 🌐 **CORS Configuration** for mobile API consumption
- 📊 **Comprehensive Data Models** for multi-service reservations

---

## 🏗️ Backend Architecture

### **Technology Stack**
```
📱 Frontend (Next.js Client)
    ↕️ HTTP/JSON
🌐 API Layer (Next.js API Routes)
    ↕️ Prisma Client
🗄️ Database (MySQL on Railway)
    ↕️ External Services
💳 Stripe | 📧 Resend | ☁️ Cloudinary
```

### **Database Schema Overview**

#### **Core Models**
- **`User`** - User authentication and profiles
- **`Venue`** - Service locations (restaurants, spas, accommodations, etc.)
- **`Service`** - Bookable items (accommodations, tours, treatments, etc.)
- **`Reservation`** - Booking records with status tracking
- **`Payment`** - Payment transactions via Stripe
- **`SystemConfig`** - Application configuration

#### **Key Relationships**
```
User 1:N Reservation N:1 Venue
User 1:N Payment     N:1 Service
Venue 1:N Service
Reservation 1:N Payment
```

---

## 📁 Backend Directory Structure

```
src/
├── app/api/                        # Next.js API Routes
│   ├── auth/                       # Authentication endpoints
│   │   ├── login/route.ts         # POST /api/auth/login
│   │   ├── logout/route.ts        # POST /api/auth/logout
│   │   └── register/route.ts      # POST /api/auth/register
│   ├── venues/                     # Venue management
│   │   ├── [id]/route.ts          # GET/PUT/DELETE /api/venues/:id
│   │   └── route.ts               # GET/POST /api/venues
│   ├── services/                   # Service management
│   │   ├── [id]/route.ts          # GET/PUT/DELETE /api/services/:id
│   │   ├── availability/route.ts  # GET /api/services/availability
│   │   └── route.ts               # GET/POST /api/services
│   ├── reservations/               # Booking management
│   │   ├── [id]/
│   │   │   ├── cancel/route.ts    # POST /api/reservations/:id/cancel
│   │   │   ├── checkin/route.ts   # POST /api/reservations/:id/checkin
│   │   │   ├── checkout/route.ts  # POST /api/reservations/:id/checkout
│   │   │   └── route.ts           # GET/PUT/DELETE /api/reservations/:id
│   │   └── route.ts               # GET/POST /api/reservations
│   ├── payments/                   # Payment processing
│   │   ├── create-intent/route.ts # POST /api/payments/create-intent
│   │   ├── confirm/route.ts       # POST /api/payments/confirm
│   │   ├── refund/route.ts        # POST /api/payments/refund
│   │   ├── webhook/route.ts       # POST /api/payments/webhook (Stripe)
│   │   └── customers/route.ts     # Stripe customer management
│   ├── emails/                     # Email notifications
│   │   ├── reservation-confirmation/route.ts
│   │   ├── reservation-cancellation/route.ts
│   │   ├── payment-confirmation/route.ts
│   │   ├── checkin-reminder/route.ts
│   │   └── send/route.ts          # Generic email sender
│   ├── users/                      # User management
│   │   ├── [id]/route.ts          # GET/PUT/DELETE /api/users/:id
│   │   └── route.ts               # GET/POST /api/users
│   ├── upload/                     # File upload
│   │   └── image/route.ts         # POST /api/upload/image
│   ├── health/route.ts             # GET /api/health
│   └── swagger/route.ts            # GET /api/swagger (API docs)
│
├── libs/services/                  # Backend Services Layer
│   ├── auth/                       # Authentication services
│   │   ├── jwtService.ts          # JWT token management
│   │   └── authMiddleware.ts      # API route protection
│   ├── database/                   # Database services
│   │   └── prismaService.ts       # Prisma client singleton
│   ├── email/                      # Email services
│   │   ├── resendService.ts       # Resend integration
│   │   └── constants.ts           # Email templates & config
│   ├── stripe/                     # Payment services
│   │   ├── stripeService.ts       # Stripe integration
│   │   ├── config.ts              # Stripe configuration
│   │   └── constants.ts           # Payment constants
│   ├── cloudinary/                 # Image services
│   │   └── cloudinaryService.ts   # Image upload/management
│   └── http/                       # HTTP utilities
│       ├── handleRequest.ts       # Universal HTTP client
│       ├── AppError.ts            # Custom error handling
│       └── buildURL.ts            # URL construction
│
├── libs/data/repositories/         # Data Access Layer
│   ├── UserRepository.ts          # User data operations
│   ├── VenueRepository.ts         # Venue data operations
│   ├── ServiceRepository.ts       # Service data operations
│   ├── ReservationRepository.ts   # Reservation data operations
│   └── PaymentRepository.ts       # Payment data operations
│
└── modules/*/data/repositories/    # Module-specific repositories
    └── mod-auth/data/repositories/
        └── AuthRepository.ts       # Authentication data layer
```

---

## 🔐 Authentication System

### **JWT Implementation**
```typescript
// JWT Service Features
- Password hashing with bcrypt (12 salt rounds)
- Token generation with configurable expiration (7d default)
- Token validation and user extraction
- Role-based authorization middleware
```

### **Authentication Flow**
1. **Registration/Login** → Password hashed with bcrypt
2. **JWT Generation** → Token with user data and expiration
3. **Token Storage** → Client stores in localStorage
4. **Request Authentication** → Bearer token in Authorization header
5. **Token Validation** → Middleware verifies and extracts user data

### **Demo Users** (password: `password123`)
```typescript
- admin@reservapp.com    (ADMIN)
- manager@reservapp.com  (MANAGER)
- employee@reservapp.com (EMPLOYEE)
- user@reservapp.com     (USER)
```

---

## 🗄️ Database Models

### **User Model**
```typescript
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String
  lastName  String
  phone     String?
  isActive  Boolean  @default(true)
  role      UserRole @default(USER)
  stripeCustomerId String? @unique

  // Relations
  reservations Reservation[]
  payments     Payment[]
}

enum UserRole {
  USER, EMPLOYEE, MANAGER, ADMIN
}
```

### **Venue Model**
```typescript
model Venue {
  id          String     @id @default(cuid())
  name        String
  description String?    @db.Text
  category    VenueType
  address     String
  city        String     @default("Guadalajara")
  state       String     @default("Jalisco")
  country     String     @default("México")
  zipCode     String?
  phone       String?
  email       String?
  website     String?
  latitude    Decimal?   @db.Decimal(10, 8)
  longitude   Decimal?   @db.Decimal(11, 8)
  rating      Decimal?   @db.Decimal(2, 1)
  checkInTime String?    @default("15:00")
  checkOutTime String?   @default("11:00")
  isActive    Boolean    @default(true)

  // Relations
  services     Service[]
  reservations Reservation[]
}

enum VenueType {
  ACCOMMODATION, RESTAURANT, SPA, TOUR_OPERATOR, EVENT_CENTER, ENTERTAINMENT
}
```

### **Service Model**
```typescript
model Service {
  id               String      @id @default(cuid())
  name             String
  description      String?     @db.Text
  category         ServiceType
  subcategory      String?
  price            Decimal     @db.Decimal(10, 2)
  currency         String      @default("MXN")
  duration         Int?        // Duration in minutes
  capacity         Int         @default(1)
  isActive         Boolean     @default(true)
  requiresApproval Boolean     @default(false)
  cancellationPolicy String?   @db.Text
  images           Json?       // Array of image URLs
  amenities        Json?       // Array of amenities/features
  availability     Json?       // Availability schedule
  metadata         Json?       // Additional flexible data

  // Relations
  venue        Venue         @relation(fields: [venueId], references: [id])
  venueId      String
  reservations Reservation[]
}

enum ServiceType {
  ACCOMMODATION, DINING, SPA_WELLNESS,
  TOUR_EXPERIENCE, EVENT_MEETING, TRANSPORTATION, ENTERTAINMENT
}
```

### **Reservation Model**
```typescript
model Reservation {
  id             String            @id @default(cuid())
  confirmationId String            @unique @default(cuid())
  status         ReservationStatus @default(PENDING)
  checkInDate    DateTime
  checkOutDate   DateTime
  guests         Int               @default(1)
  totalAmount    Decimal           @db.Decimal(10, 2)
  currency       String            @default("MXN")
  notes          String?           @db.Text
  specialRequests String?          @db.Text
  metadata       Json?             // Flexible additional data
  
  // Relations
  user      User      @relation(fields: [userId], references: [id])
  userId    String
  venue     Venue     @relation(fields: [venueId], references: [id])
  venueId   String
  service   Service   @relation(fields: [serviceId], references: [id])
  serviceId String
  payments  Payment[]
}

enum ReservationStatus {
  PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW
}
```

---

## 🌐 API Endpoints

### **Authentication Endpoints**
```
POST /api/auth/login         # User login with JWT
POST /api/auth/register      # User registration
POST /api/auth/logout        # User logout (token invalidation)
```

### **Venue Management**
```
GET    /api/venues           # List all venues with filters
POST   /api/venues           # Create new venue (admin)
GET    /api/venues/:id       # Get venue details
PUT    /api/venues/:id       # Update venue (admin)
DELETE /api/venues/:id       # Delete venue (admin)
```

### **Service Management**
```
GET    /api/services                # List all services with filters
POST   /api/services                # Create new service (admin)
GET    /api/services/:id            # Get service details
PUT    /api/services/:id            # Update service (admin)
DELETE /api/services/:id            # Delete service (admin)
GET    /api/services/availability   # Check service availability
```

### **Reservation Management**
```
GET    /api/reservations            # List reservations (filtered by user/admin)
POST   /api/reservations            # Create new reservation
GET    /api/reservations/:id        # Get reservation details
PUT    /api/reservations/:id        # Update reservation
DELETE /api/reservations/:id        # Cancel reservation
POST   /api/reservations/:id/cancel # Cancel with reason
POST   /api/reservations/:id/checkin  # Check-in process
POST   /api/reservations/:id/checkout # Check-out process
```

### **Payment Processing**
```
POST   /api/payments/create-intent  # Create Stripe payment intent
POST   /api/payments/confirm        # Confirm payment
POST   /api/payments/refund         # Process refund
POST   /api/payments/webhook        # Stripe webhook handler
GET    /api/payments/customers      # List Stripe customers
POST   /api/payments/customers      # Create Stripe customer
```

### **Email Notifications**
```
POST   /api/emails/send                        # Generic email sender
POST   /api/emails/reservation-confirmation    # Send booking confirmation
POST   /api/emails/reservation-cancellation    # Send cancellation notice
POST   /api/emails/payment-confirmation        # Send payment receipt
POST   /api/emails/checkin-reminder           # Send check-in reminder
```

### **User Management**
```
GET    /api/users           # List users (admin only)
POST   /api/users           # Create user (admin only)
GET    /api/users/:id       # Get user profile
PUT    /api/users/:id       # Update user profile
DELETE /api/users/:id       # Deactivate user (admin only)
```

### **Utility Endpoints**
```
GET    /api/health          # Health check
POST   /api/upload/image    # Upload images to Cloudinary
GET    /api/swagger         # API documentation
```

---

## 📊 API Response Format

All API endpoints follow a standardized response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

// Success Response Example
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "id": "res_abc123",
    "confirmationId": "CONF-2024-001",
    "status": "CONFIRMED",
    // ... reservation data
  },
  "timestamp": "2024-08-05T20:30:00.000Z"
}

// Error Response Example
{
  "success": false,
  "message": "Insufficient capacity for requested guests",
  "error": "CAPACITY_EXCEEDED",
  "timestamp": "2024-08-05T20:30:00.000Z"
}
```

---

## 🔧 Backend Services

### **JWT Service** (`libs/services/auth/jwtService.ts`)
```typescript
class JWTService {
  // Password hashing with bcrypt
  static async hashPassword(password: string): Promise<string>
  static async comparePassword(password: string, hash: string): Promise<boolean>
  
  // JWT token management
  static generateToken(payload: TokenPayload): string
  static verifyToken(token: string): TokenPayload
  static extractTokenFromHeader(authHeader: string): string | null
  
  // Token utilities
  static getTokenExpiration(token: string): Date | null
  static isTokenExpired(token: string): boolean
  
  // User credential validation
  static validateCredentials(credentials: UserCredentials): ValidationResult
}
```

### **Resend Email Service** (`libs/services/email/resendService.ts`)
```typescript
class ResendService {
  // Email control
  static isEmailEnabled(): boolean
  
  // Email sending methods
  static async sendReservationConfirmation(data: ReservationEmailData): Promise<EmailResponse>
  static async sendReservationCancellation(data: CancellationEmailData): Promise<EmailResponse>
  static async sendPaymentConfirmation(data: PaymentEmailData): Promise<EmailResponse>
  static async sendCheckInReminder(data: CheckInEmailData): Promise<EmailResponse>
  
  // Generic email sender
  static async sendEmail(params: EmailParams): Promise<EmailResponse>
  
  // HTML template generators (Spanish)
  private static generateReservationConfirmationHTML(data: ReservationEmailData): string
  private static generateCancellationHTML(data: CancellationEmailData): string
  private static generatePaymentConfirmationHTML(data: PaymentEmailData): string
}
```

### **Stripe Service** (`libs/services/stripe/stripeService.ts`)
```typescript
class StripeService {
  // Payment intents
  static async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent>
  static async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentIntent>
  
  // Customer management
  static async createCustomer(params: CreateCustomerParams): Promise<Customer>
  static async getCustomer(customerId: string): Promise<Customer>
  
  // Refunds
  static async createRefund(params: CreateRefundParams): Promise<Refund>
  
  // Webhooks
  static async handleWebhook(payload: string, signature: string): Promise<Event>
}
```

### **Cloudinary Service** (`libs/services/cloudinary/cloudinaryService.ts`)
```typescript
class CloudinaryService {
  // Image upload
  static async uploadImage(file: File, folder?: string): Promise<CloudinaryUploadResult>
  
  // Image transformation
  static getOptimizedImageUrl(publicId: string, transforms?: TransformOptions): string
  
  // Image management
  static async deleteImage(publicId: string): Promise<DeletionResult>
}
```

---

## 🛡️ Security & Middleware

### **Authentication Middleware** (`libs/services/auth/authMiddleware.ts`)
```typescript
class AuthMiddleware {
  // Token verification
  static async verifyToken(request: NextRequest): Promise<User>
  
  // Route protection
  static withAuth<T>(handler: AuthenticatedHandler<T>): RouteHandler
  
  // Role-based authorization
  static withRole(allowedRoles: string[], handler: AuthenticatedHandler): RouteHandler
  
  // Optional authentication
  static extractUserFromToken(request: NextRequest): User | null
}
```

### **Error Handling** (`libs/services/http/AppError.ts`)
```typescript
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number = 500)
  
  // Static factory methods
  static badRequest(message: string): AppError
  static unauthorized(message: string = 'Unauthorized'): AppError
  static forbidden(message: string = 'Forbidden'): AppError
  static notFound(message: string = 'Not found'): AppError
  static conflict(message: string): AppError
  static validationError(message: string): AppError
}
```

---

## 🔄 Data Flow Examples

### **Reservation Creation Flow**
```
1. Frontend → POST /api/reservations
2. API Route → Validate request body
3. API Route → Check service availability
4. API Route → Calculate total amount
5. API Route → Create reservation in database
6. API Route → Create Stripe payment intent
7. API Route → Send confirmation email
8. API Route → Return reservation + payment data
```

### **Payment Webhook Flow**
```
1. Stripe → POST /api/payments/webhook
2. Webhook → Verify Stripe signature
3. Webhook → Parse event data
4. Webhook → Update payment status
5. Webhook → Update reservation status
6. Webhook → Send payment confirmation email
7. Webhook → Send reservation confirmation email
8. Webhook → Return success response
```

### **Authentication Flow**
```
1. Frontend → POST /api/auth/login
2. API Route → Validate credentials
3. API Route → Hash password comparison
4. API Route → Generate JWT token
5. API Route → Return user data + token
6. Frontend → Store token in localStorage
7. Future requests → Include Bearer token
8. Middleware → Verify token on protected routes
```

---

## 🚀 Environment Configuration

### **Required Environment Variables**
```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@reservapp.com
RESEND_FROM_NAME=ReservApp - Casa Salazar

# Cloudinary Images
CLOUDINARY_URL=cloudinary://...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Application Settings
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ENABLE_MOCKS=false
NEXT_PUBLIC_ENABLE_EMAILS=true
NEXT_PUBLIC_DEBUG_MODE=true

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,capacitor://localhost
```

---

## 📈 Performance & Monitoring

### **Database Optimization**
- Prisma connection pooling
- Indexed queries on frequently accessed fields
- Optimized relations with `include` and `select`
- Database query logging in development

### **API Performance**
- Next.js serverless function optimization
- Response caching where appropriate
- Efficient error handling
- Request/response logging

### **Monitoring Points**
- API response times
- Database query performance
- Email delivery rates
- Payment success rates
- Error rates by endpoint

---

## 🧪 Testing & Development

### **Database Seeding**
```bash
# Populate with real Guadalajara data
yarn db:seed

# Reset and re-seed
yarn db:reset

# View data in browser
yarn db:studio
```

### **API Testing**
- Swagger documentation at `/api/swagger`
- Health check at `/api/health`
- Comprehensive error handling
- Mock data for development

### **Development Tools**
- Prisma Studio for database visualization
- Real-time API logs in development
- Email preview in development mode
- Stripe test mode for payments

---

This backend architecture provides a robust, scalable foundation for ReservApp's comprehensive reservation ecosystem serving Guadalajara's hospitality venues.