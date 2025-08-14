# ReservApp Routes and Sitemap Documentation

**Generated:** August 14, 2025
**Platform:** ReservApp Web Platform
**Framework:** Next.js 15 with App Router
**Status:** Production Ready - Live at https://reservapp-web.vercel.app

## Overview

This document provides a comprehensive overview of all routes in the ReservApp platform, including web pages, API endpoints, authentication requirements, user role permissions, and SEO metadata.

## Table of Contents

1. [Web Routes](#web-routes)
2. [API Routes](#api-routes)
3. [Visual Sitemap](#visual-sitemap)
4. [Authentication & Authorization](#authentication--authorization)
5. [SEO & Metadata](#seo--metadata)
6. [Route Summary](#route-summary)

---

## Web Routes

### Public Routes (No Authentication Required)

| Route | Description | Purpose | Layout | SEO Features |
|-------|-------------|---------|---------|--------------|
| `/` | Landing Page | Platform homepage and marketing | Default | Full SEO metadata, OpenGraph |
| `/about` | About Us | Company information and mission | Default | Brand storytelling |
| `/business` | Business Page | Business registration and onboarding | Default | B2B conversion |
| `/contact` | Contact Page | Contact form and company info | Default | Contact information |
| `/help` | Help Center | FAQ and support information | Default | Support resources |
| `/privacy` | Privacy Policy | Data protection and privacy terms | Default | Legal compliance |
| `/terms` | Terms of Service | Platform usage terms and conditions | Default | Legal compliance |

### Authentication Routes

| Route | Description | Purpose | Layout | User Types |
|-------|-------------|---------|---------|------------|
| `/auth/login` | User Login | Authentication for all user types | Auth Layout | All roles (USER, ADMIN, MANAGER, SUPER_ADMIN) |
| `/auth/register` | Business Registration | New business account creation | Auth Layout | Creates business USER accounts |
| `/auth/user-register` | User Registration | End-user account creation | Auth Layout | Creates individual USER accounts |

### Protected Routes (Authentication Required)

#### Admin Routes (Role-Based Access)

| Route | Description | Purpose | Minimum Role | Specific Access |
|-------|-------------|---------|--------------|-----------------|
| `/admin` | Admin Dashboard | Main administrative interface | ADMIN | Role-based content |
| `/admin/users` | User Management | CRUD operations for users | SUPER_ADMIN | Full user management |
| `/admin/venues` | Venue Management | CRUD operations for venues | ADMIN | Own venues (ADMIN), All venues (SUPER_ADMIN) |
| `/admin/services` | Service Management | CRUD operations for services | ADMIN | Venue-scoped services |
| `/admin/reservations` | Reservation Management | View and manage reservations | ADMIN | Venue-scoped reservations |
| `/admin/payments` | Payment Management | View payment history and transactions | ADMIN | Own business payments |
| `/admin/system-logs` | System Logs | Application logs and monitoring | SUPER_ADMIN | System administration |
| `/admin/contact-forms` | Contact Forms | Manage contact form submissions | SUPER_ADMIN | Customer communications |
| `/admin/business-account` | Business Account | Individual business account management | ADMIN | Own business only |
| `/admin/business-accounts` | Business Accounts | Multi-business management | SUPER_ADMIN | All businesses |
| `/admin/reports` | Reports Dashboard | Analytics and business intelligence | ADMIN | Role-scoped data |

---

## API Routes

### Authentication Endpoints

| Method | Endpoint | Description | Authentication | Purpose | Response |
|--------|----------|-------------|----------------|---------|----------|
| `POST` | `/api/auth/login` | User authentication | None | Login with email/password | JWT token + user data |
| `POST` | `/api/auth/register` | Business registration | None | Create new business account | User account + welcome email |
| `POST` | `/api/auth/logout` | User logout | JWT Token | Invalidate session | Success confirmation |

### Admin Management Endpoints (HTTP API-First Architecture)

#### User Management
| Method | Endpoint | Description | Authentication | Role Required | Features |
|--------|----------|-------------|----------------|---------------|----------|
| `GET` | `/api/admin/users` | List users with pagination/filters | JWT Token | SUPER_ADMIN | Search, pagination, role filters |
| `POST` | `/api/admin/users` | Create new user | JWT Token | SUPER_ADMIN | Full user creation |
| `GET` | `/api/admin/users/[id]` | Get user by ID | JWT Token | SUPER_ADMIN | User details |
| `PUT` | `/api/admin/users/[id]` | Update user | JWT Token | SUPER_ADMIN | Profile and role updates |
| `DELETE` | `/api/admin/users/[id]` | Soft delete user | JWT Token | SUPER_ADMIN | Safe deletion |

#### Venue Management
| Method | Endpoint | Description | Authentication | Role Required | Features |
|--------|----------|-------------|----------------|---------------|----------|
| `GET` | `/api/venues` | List venues with pagination | JWT Token | ADMIN+ | Search, filters, pagination |
| `POST` | `/api/venues` | Create new venue | JWT Token | ADMIN+ | Google Places integration |
| `GET` | `/api/venues/[id]` | Get venue by ID | JWT Token | ADMIN+ | Full venue details |
| `PUT` | `/api/venues/[id]` | Update venue | JWT Token | ADMIN+ | Complete venue updates |
| `DELETE` | `/api/venues/[id]` | Soft delete venue | JWT Token | ADMIN+ | Safe deletion |

#### Service Management
| Method | Endpoint | Description | Authentication | Role Required | Features |
|--------|----------|-------------|----------------|---------------|----------|
| `GET` | `/api/services` | List services with filters | JWT Token | ADMIN+ | Venue filtering, search |
| `POST` | `/api/services` | Create new service | JWT Token | ADMIN+ | Service creation |
| `GET` | `/api/services/[id]` | Get service by ID | JWT Token | ADMIN+ | Service details |
| `PUT` | `/api/services/[id]` | Update service | JWT Token | ADMIN+ | Service updates |
| `DELETE` | `/api/services/[id]` | Delete service | JWT Token | ADMIN+ | Service removal |

#### Reservation Management
| Method | Endpoint | Description | Authentication | Role Required | Features |
|--------|----------|-------------|----------------|---------------|----------|
| `GET` | `/api/reservations` | List reservations | JWT Token | ADMIN+ | Status filters, date ranges |
| `POST` | `/api/reservations` | Create new reservation | JWT Token | Any authenticated | Automatic payment processing |
| `GET` | `/api/reservations/[id]` | Get reservation by ID | JWT Token | ADMIN+ | Reservation details |
| `PUT` | `/api/reservations/[id]` | Update reservation | JWT Token | ADMIN+ | Status and detail updates |
| `DELETE` | `/api/reservations/[id]` | Cancel reservation | JWT Token | ADMIN+ | Cancellation handling |

### Contact & Communication

| Method | Endpoint | Description | Authentication | Role Required | Features |
|--------|----------|-------------|----------------|---------------|----------|
| `POST` | `/api/contact` | Submit contact form | None | Public | Automatic email notifications |
| `GET` | `/api/admin/contact-forms` | List contact submissions | JWT Token | SUPER_ADMIN | Admin management |

### Payment Processing (Stripe Integration)

| Method | Endpoint | Description | Authentication | Role Required | Features |
|--------|----------|-------------|----------------|---------------|----------|
| `POST` | `/api/payments/subscription` | Process subscription payment | JWT Token | Any authenticated | Stripe integration |
| `GET` | `/api/payments/history` | Payment history | JWT Token | ADMIN+ | Transaction records |

### System & Health Monitoring

| Method | Endpoint | Description | Authentication | Purpose | Features |
|--------|----------|-------------|----------------|---------|----------|
| `GET` | `/api/health` | Health check | None | System status monitoring | Database connectivity |
| `GET` | `/api/swagger` | API Documentation | None | Interactive API docs | Complete endpoint docs |

### Mobile-Ready Features

All API endpoints support:
- **Pagination**: `?page=1&limit=10`
- **Search**: `?search=query`
- **Filtering**: `?status=active&role=ADMIN`
- **Sorting**: `?sortBy=createdAt&sortOrder=desc`
- **Error Handling**: Consistent error response format
- **Rate Limiting**: Built-in request limiting
- **CORS**: Cross-origin resource sharing enabled

---

## Visual Sitemap

```
ReservApp Platform (https://reservapp-web.vercel.app)
│
├── 🌐 Public Area (No Authentication Required)
│   ├── / (Landing Page - Homepage & Marketing)
│   ├── /about (About Us - Company Mission)
│   ├── /business (Business Registration & B2B)
│   ├── /contact (Contact Form & Information)
│   ├── /help (Help Center & FAQ)
│   ├── /privacy (Privacy Policy - Legal)
│   └── /terms (Terms of Service - Legal)
│
├── 🔐 Authentication Area
│   ├── /auth/login (Universal Login - All Roles)
│   ├── /auth/register (Business Registration)
│   └── /auth/user-register (Individual User Registration)
│
├── 👑 Admin Dashboard (Role-Based Access)
│   ├── /admin (Main Dashboard - Role-Specific Content)
│   ├── /admin/users (User Management - SUPER_ADMIN only)
│   ├── /admin/venues (Venue Management - Own/All based on role)
│   ├── /admin/services (Service Management - Venue-scoped)
│   ├── /admin/reservations (Reservation Management - Venue-scoped)
│   ├── /admin/payments (Payment Management - Business-scoped)
│   ├── /admin/system-logs (System Logs - SUPER_ADMIN only)
│   ├── /admin/contact-forms (Contact Forms - SUPER_ADMIN only)
│   ├── /admin/business-account (Own Business Management - ADMIN)
│   ├── /admin/business-accounts (All Businesses - SUPER_ADMIN)
│   └── /admin/reports (Analytics & Reports - Role-scoped)
│
└── 🔌 API Endpoints (25+ REST APIs)
    ├── 🔑 Authentication
    │   ├── POST /api/auth/login
    │   ├── POST /api/auth/register
    │   └── POST /api/auth/logout
    │
    ├── 👥 Admin Management (HTTP API-First)
    │   ├── /api/admin/users/* (User CRUD - SUPER_ADMIN)
    │   ├── /api/venues/* (Venue CRUD - Role-based)
    │   ├── /api/services/* (Service CRUD - Venue-scoped)
    │   ├── /api/reservations/* (Reservation CRUD - Business-scoped)
    │   └── /api/admin/contact-forms/* (Contact Management)
    │
    ├── 💳 Payment Processing
    │   ├── POST /api/payments/subscription (Stripe Integration)
    │   └── GET /api/payments/history (Transaction Records)
    │
    ├── 📧 Communication
    │   └── POST /api/contact (Public Contact Form)
    │
    └── 🔧 System
        ├── GET /api/health (Health Check)
        └── GET /api/swagger (API Documentation)
```

### User Role Navigation Patterns

```
🔴 SUPER_ADMIN (admin@reservapp.com)
├── ✅ Access: ALL routes and APIs
├── 👥 Manages: All users, businesses, and system
└── 🎯 Dashboard: Complete system overview

🟠 ADMIN (admin.salazar@reservapp.com, admin.restaurant@reservapp.com)  
├── ✅ Access: Own business management routes
├── 🏨 Manages: Own venues, services, reservations
└── 🎯 Dashboard: Business-specific metrics

🟡 MANAGER (gestor.salazar@reservapp.com, gestor.restaurant@reservapp.com)
├── ✅ Access: Limited management routes  
├── 🎯 Manages: Specific venue operations
└── 📊 Dashboard: Venue-specific data

🟢 USER (juan.perez@gmail.com, maria.lopez@gmail.com)
├── ✅ Access: Profile and booking routes
├── 📅 Manages: Own reservations and profile
└── 🛍️ Dashboard: Personal booking history
```

---

## Authentication & Authorization

### Authentication Methods

- **JWT Tokens**: All protected routes use JWT authentication with bcrypt password hashing
- **Bearer Token**: API endpoints expect `Authorization: Bearer <token>` header
- **Session Duration**: 7 days expiration (configurable)
- **Auto-redirect**: Unauthenticated users redirected to `/auth/login`
- **Password Security**: bcrypt hashing with salt rounds
- **Middleware Protection**: Automatic route protection via Next.js middleware

### User Role Hierarchy (4 Levels)

#### 🔴 SUPER_ADMIN Role
- **Demo Account**: `admin@reservapp.com` (password: password123)
- **Access**: ALL routes and API endpoints
- **Permissions**: Complete system administration
- **Special Features**: 
  - User management across all businesses
  - System logs and monitoring
  - Business account management for all companies
  - Contact form submissions
  - Complete platform oversight

#### 🟠 ADMIN Role  
- **Demo Accounts**: `admin.salazar@reservapp.com`, `admin.restaurant@reservapp.com`
- **Access**: Own business management routes
- **Permissions**: Full CRUD on own business resources
- **Special Features**:
  - Own venue management
  - Own service and reservation management  
  - Business-specific payment history
  - Team member management
  - Business analytics and reports

#### 🟡 MANAGER Role
- **Demo Accounts**: `gestor.salazar@reservapp.com`, `gestor.restaurant@reservapp.com` 
- **Access**: Limited management routes for assigned venues
- **Permissions**: Venue-specific operations
- **Special Features**:
  - Assigned venue operations
  - Reservation management for specific locations
  - Limited reporting access
  - Customer interaction management

#### 🟢 USER Role
- **Demo Accounts**: `juan.perez@gmail.com`, `maria.lopez@gmail.com`
- **Access**: Profile and booking-related routes only
- **Permissions**: Own data management and reservation creation
- **Special Features**:
  - Personal profile management
  - Reservation booking and history
  - Service browsing
  - Payment processing for bookings

### Route Protection Patterns

#### Public Routes (7 routes)
- **Authentication**: None required
- **Access**: All visitors (unauthenticated and authenticated)
- **Purpose**: Marketing, legal pages, contact forms
- **SEO**: Full metadata optimization for search engines

#### Authentication Routes (3 routes)
- **Smart Redirect**: Authenticated users automatically redirected to appropriate dashboard
- **Multi-Role Support**: Single login handles all user types with role-based redirection
- **Registration Types**: Separate flows for individual users vs. businesses

#### Protected Routes (11 admin routes)
- **JWT Required**: All routes require valid authentication token
- **Role Enforcement**: Automatic permission checking via layouts and middleware
- **API Integration**: All admin functionality uses HTTP APIs (no direct Prisma access)
- **Mobile Ready**: Complete API support for future mobile apps

### Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **Token Validation**: JWT signature verification on every request
- **Role-Based Access Control (RBAC)**: Four-tier permission system
- **API Rate Limiting**: Request throttling to prevent abuse
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Comprehensive request validation and sanitization

---

## SEO & Metadata

### Page-Specific SEO Implementation

#### Landing Page (/)
- **Title**: "ReservApp - Plataforma de Reservas para Hoteles"
- **Description**: "Solución integral para pequeños hoteles con menor comisión y pagos rápidos"
- **Keywords**: "reservas hoteles, gestión hotelera, booking platform"
- **OpenGraph**: Full social media optimization
- **Structured Data**: LocalBusiness, Organization schema

#### About Page (/about)
- **Title**: "Sobre Nosotros - ReservApp"
- **Description**: "Conoce la misión de ReservApp como partner de crecimiento hotelero"
- **Focus**: Brand storytelling and company values

#### Business Page (/business)
- **Title**: "Para Negocios - ReservApp"
- **Description**: "Únete a ReservApp y transforma tu negocio hotelero"
- **Focus**: B2B conversion optimization

#### Contact Page (/contact)
- **Title**: "Contacto - ReservApp"
- **Description**: "Ponte en contacto con el equipo de ReservApp"
- **Schema**: ContactPage structured data

#### Help Center (/help)
- **Title**: "Centro de Ayuda - ReservApp"
- **Description**: "Encuentra respuestas a tus preguntas sobre ReservApp"
- **Focus**: Support and FAQ optimization

#### Legal Pages (/privacy, /terms)
- **Privacy Policy**: Complete GDPR and data protection compliance
- **Terms of Service**: Platform usage terms and conditions
- **SEO**: Legal compliance and trust signals

### Technical SEO Features

- **Next.js App Router**: Automatic static generation for public routes
- **Metadata API**: Dynamic metadata generation
- **Sitemap Generation**: Automatic XML sitemap creation
- **Robots.txt**: Search engine crawling configuration
- **Core Web Vitals**: Optimized loading performance
- **Mobile-First**: Responsive design across all pages
- **Structured Data**: JSON-LD implementation for rich snippets

### Performance Optimizations

- **Bundle Size**: 99.8 kB optimized JavaScript
- **Image Optimization**: Next.js automatic image optimization
- **Font Loading**: Optimized Montserrat and Lato font loading
- **Code Splitting**: Route-based code splitting
- **Static Generation**: Build-time page generation for speed

---

## Route Summary

### Statistics

- **Total Web Routes**: 21
  - Public Routes: 7 (Landing, About, Business, Contact, Help, Privacy, Terms)
  - Authentication Routes: 3 (Login, Business Register, User Register)
  - Admin Routes: 11 (Dashboard + 10 management pages)

- **Total API Endpoints**: 25+
  - Authentication: 3 endpoints
  - Admin Management: 15+ endpoints (User, Venue, Service, Reservation CRUD)
  - Contact & Communication: 2 endpoints
  - Payment Processing: 2 endpoints
  - System & Health: 3+ endpoints

### User Journey Flows

#### Business Owner Journey
1. **Discovery**: `/` → `/business` (Learn about B2B features)
2. **Registration**: `/auth/register` → Account creation + welcome email
3. **Login**: `/auth/login` → Role-based redirect to `/admin`
4. **Management**: Full admin dashboard with role-specific features

#### Individual User Journey  
1. **Discovery**: `/` → `/about` → `/contact` (Learn about platform)
2. **Registration**: `/auth/user-register` → Account creation + welcome email
3. **Login**: `/auth/login` → Currently redirects to landing (booking flow future)
4. **Support**: `/help` for questions and `/privacy`/`terms` for legal

#### System Admin Journey (SUPER_ADMIN)
1. **Direct Access**: `/auth/login` with super admin credentials
2. **System Management**: Access to ALL routes and functionalities
3. **Multi-Business**: Manage all businesses through `/admin/business-accounts`
4. **Monitoring**: System logs, contact forms, complete oversight

### Platform Architecture Highlights

#### 🏗️ **HTTP API-First Architecture**
- **Zero Direct Database Access**: All admin functionality uses REST APIs
- **Mobile-Ready**: Complete API infrastructure for future mobile apps
- **Scalable**: Microservice-ready architecture with clean separation

#### 🔐 **Advanced Authentication System**
- **4-Tier Role System**: SUPER_ADMIN → ADMIN → MANAGER → USER
- **JWT + bcrypt**: Industry-standard security implementation
- **Smart Redirects**: Role-based dashboard routing
- **Demo Accounts**: Complete testing infrastructure with realistic data

#### 🎯 **Production Features**
- **Live Platform**: https://reservapp-web.vercel.app (Vercel deployment)
- **Perfect Code Quality**: Zero TypeScript errors, ESLint compliance
- **Multi-Language**: Spanish localization with 750+ translation keys
- **Payment Integration**: Stripe-powered subscription and reservation payments
- **Email System**: Automated notifications for registrations and bookings

#### 📱 **Mobile & API Readiness**
- **RESTful APIs**: Complete CRUD operations for all entities
- **Pagination & Filtering**: Advanced query capabilities (`?page=1&search=query`)
- **Error Handling**: Consistent API response format
- **Rate Limiting**: Built-in request throttling protection

### Current Production Status

**✅ PRODUCTION READY (January 11, 2025)**
- **Build Status**: Successful with zero critical errors
- **Bundle Size**: 99.8 kB optimized JavaScript
- **Route Coverage**: 31 total routes (26 static + 5 dynamic)
- **API Coverage**: 25+ REST endpoints with full documentation
- **Testing**: 47+ test files with comprehensive coverage

### Next Development Priorities

1. **User Dashboard**: Dedicated booking interface for end users
2. **Public Venue Browsing**: Search and browse venues without login
3. **Advanced Booking Flow**: Complete reservation process for public users
4. **Mobile Application**: Native iOS/Android apps using existing APIs
5. **Analytics Dashboard**: Enhanced reporting and business intelligence

---

**Documentation Status**: Updated August 14, 2025
**Platform Version**: Production v1.0 - Live at https://reservapp-web.vercel.app
**API Documentation**: Available at `/api/swagger` endpoint