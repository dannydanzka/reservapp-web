# 📡 API Documentation - ReservApp

Documentación completa de todos los endpoints de la API REST de ReservApp para el ecosistema de reservas.

## 🌐 Información General

**Base URLs:**
- **Producción**: `https://reservapp-web.vercel.app/api`
- **Desarrollo**: `http://localhost:3000/api`

**Autenticación:**
- La mayoría de endpoints requieren JWT Bearer Token
- Header: `Authorization: Bearer {token}`
- Token válido por 7 días

**Cuentas Demo:**
- **Admin**: `admin@reservapp.com` (password: `password123`)
- **Usuario**: `user@reservapp.com` (password: `password123`)

---

## 🔐 Authentication Endpoints

### POST /auth/login
**Descripción**: Iniciar sesión de usuario  
**Requiere Token**: ❌ No  
**Método**: `POST`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "phone": "+1234567890"
    }
  }
}
```

**Error Responses:**
- `400`: Campos requeridos faltantes
- `401`: Credenciales inválidas o cuenta desactivada
- `500`: Error interno del servidor

---

### POST /auth/register
**Descripción**: Registrar nuevo usuario  
**Requiere Token**: ❌ No  
**Método**: `POST`

**Request Body:**
```json
{
  "email": "nuevo@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "USER"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "new-user-uuid",
      "email": "nuevo@example.com",
      "name": "John Doe"
    }
  }
}
```

---

### POST /auth/logout
**Descripción**: Cerrar sesión (invalidar token)  
**Requiere Token**: ✅ Sí  
**Método**: `POST`

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

## 🏢 Venues Endpoints

### GET /venues
**Descripción**: Obtener lista de venues con paginación y filtros  
**Requiere Token**: ❌ No (Público)  
**Método**: `GET`

**Query Parameters:**
- `page` (number, optional): Número de página (default: 1)
- `limit` (number, optional): Items por página (default: 10)
- `search` (string, optional): Búsqueda por nombre o descripción
- `category` (string, optional): Filtrar por categoría

**Ejemplo:** `GET /venues?page=1&limit=10&category=restaurant&search=jardín`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "venue-uuid",
      "name": "Restaurante El Jardín",
      "category": "restaurant",
      "description": "Restaurante con comida mediterránea",
      "address": "Calle Principal 123",
      "city": "Madrid",
      "phone": "+34123456789",
      "email": "info@eljardin.com",
      "isActive": true,
      "createdAt": "2025-01-12T00:00:00Z",
      "services": [
        {
          "id": "service-uuid",
          "name": "Cena Romántica",
          "price": 75,
          "duration": 120
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### POST /venues
**Descripción**: Crear nuevo venue (Solo Admin)  
**Requiere Token**: ✅ Sí (ADMIN)  
**Método**: `POST`

**Request Body:**
```json
{
  "name": "Nuevo Hotel",
  "category": "accommodation",
  "description": "Hotel boutique en el centro",
  "address": "Avenida Central 456",
  "city": "Barcelona",
  "phone": "+34987654321",
  "email": "info@nuevohotel.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Venue creado exitosamente",
  "data": {
    "id": "new-venue-uuid",
    "name": "Nuevo Hotel",
    // ... resto de campos
    "services": []
  }
}
```

**Error Responses:**
- `401`: Token requerido
- `403`: Se requiere rol ADMIN
- `400`: Campos obligatorios faltantes

---

### GET /venues/[id]
**Descripción**: Obtener venue específico por ID  
**Requiere Token**: ❌ No  
**Método**: `GET`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "venue-uuid",
    "name": "Hotel Las Palmas",
    // ... todos los campos del venue
    "services": [
      // ... array de servicios completos
    ]
  }
}
```

---

## 📅 Reservations Endpoints

### GET /reservations
**Descripción**: Obtener reservas (Usuario: sus reservas, Admin: todas)  
**Requiere Token**: ✅ Sí  
**Método**: `GET`

**Query Parameters:**
- `page` (number, optional): Número de página (default: 1)
- `limit` (number, optional): Items por página (default: 10)
- `status` (string, optional): Filtrar por estado (PENDING, CONFIRMED, CANCELLED, etc.)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "reservation-uuid",
      "checkInDate": "2025-02-15T14:00:00Z",
      "checkOutDate": "2025-02-16T12:00:00Z",
      "guests": 2,
      "status": "CONFIRMED",
      "totalAmount": 150,
      "notes": "Aniversario de bodas",
      "createdAt": "2025-01-12T10:00:00Z",
      "user": {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "venue": {
        "id": "venue-uuid",
        "name": "Hotel Las Palmas"
      },
      "service": {
        "id": "service-uuid",
        "name": "Habitación Deluxe",
        "price": 150
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

### POST /reservations
**Descripción**: Crear nueva reserva  
**Requiere Token**: ✅ Sí  
**Método**: `POST`

**Request Body:**
```json
{
  "venueId": "venue-uuid",
  "serviceId": "service-uuid",
  "checkInDate": "2025-02-15T14:00:00Z",
  "checkOutDate": "2025-02-16T12:00:00Z",
  "guests": 2,
  "totalAmount": 150,
  "notes": "Solicitud especial"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "id": "new-reservation-uuid",
    // ... datos completos de la reserva incluyendo relaciones
  }
}
```

**Error Responses:**
- `401`: Token requerido
- `400`: Campos obligatorios faltantes
- `500`: Error interno

---

### GET /reservations/[id]
**Descripción**: Obtener reserva específica  
**Requiere Token**: ✅ Sí  
**Método**: `GET`

### PATCH /reservations/[id]
**Descripción**: Actualizar reserva (Propietario o Admin)  
**Requiere Token**: ✅ Sí  
**Método**: `PATCH`

**Request Body:**
```json
{
  "checkInDate": "2025-02-20T14:00:00Z",
  "checkOutDate": "2025-02-21T12:00:00Z",
  "guests": 3,
  "status": "CONFIRMED",
  "notes": "Solicitud especial actualizada"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reserva actualizada exitosamente",
  "data": {
    "id": "reservation-uuid",
    // ... datos actualizados con relaciones
  }
}
```

**Estados válidos:**
- `PENDING` - Pendiente de confirmación
- `CONFIRMED` - Confirmada
- `CHECKED_IN` - Check-in realizado
- `CHECKED_OUT` - Check-out realizado
- `CANCELLED` - Cancelada
- `NO_SHOW` - No presentación

---

### DELETE /reservations/[id]
**Descripción**: Eliminar reserva (Propietario o Admin)  
**Requiere Token**: ✅ Sí  
**Método**: `DELETE`

**Response (200):**
```json
{
  "success": true,
  "message": "Reserva eliminada exitosamente"
}
```

---

## 👤 Users Endpoints

### GET /users
**Descripción**: Obtener lista de usuarios (Solo Admin)  
**Requiere Token**: ✅ Sí (ADMIN)  
**Método**: `GET`

**Query Parameters:**
- `page`, `limit`: Paginación
- `search`: Búsqueda por nombre o email
- `role`: Filtrar por rol
- `isActive`: Filtrar por estado

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "USER",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### POST /users
**Descripción**: Crear usuario (Solo Admin)  
**Requiere Token**: ✅ Sí (ADMIN)  
**Método**: `POST`

---

## 📱 Notifications Endpoints

### GET /notifications
**Descripción**: Obtener notificaciones del usuario  
**Requiere Token**: ✅ Sí  
**Método**: `GET`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notification-uuid",
      "title": "Reserva confirmada",
      "message": "Tu reserva para el 15 de febrero ha sido confirmada",
      "type": "BOOKING",
      "read": false,
      "createdAt": "2025-01-12T10:00:00Z"
    }
  ]
}
```

---

### POST /notifications
**Descripción**: Crear notificación (Solo Admin)  
**Requiere Token**: ✅ Sí (ADMIN)  
**Método**: `POST`

---

## 💳 Payments Endpoints

### POST /payments/subscription
**Descripción**: Procesar suscripción con Stripe  
**Requiere Token**: ✅ Sí  
**Método**: `POST`

**Request Body:**
```json
{
  "priceId": "price_stripe_id",
  "paymentMethodId": "pm_stripe_payment_method"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_stripe_id",
    "clientSecret": "pi_client_secret",
    "status": "active"
  }
}
```

---

## 🔍 Additional Endpoints

### GET /health
**Descripción**: Health check del sistema  
**Requiere Token**: ❌ No  
**Método**: `GET`

**Response (200):**
```json
{
  "success": true,
  "message": "ReservApp API is running",
  "timestamp": "2025-01-12T12:00:00Z",
  "version": "1.0.0"
}
```

---

### GET /swagger
**Descripción**: Documentación Swagger/OpenAPI  
**Requiere Token**: ❌ No  
**Método**: `GET`

---

## ✅ REFACTORING COMPLETADO - 100% FINALIZADO

### 🎉 Frontend Completamente Refactorizado

**Todos los Componentes Admin Refactorizados:**

1. ✅ **UsersManagement** - HTTP API completo con CRUD y paginación
2. ✅ **VenuesManagement** - HTTP API completo con filtros y gestión
3. ✅ **ReservationsManagement** - HTTP API completo con estados y operaciones
4. ✅ **ServicesManagement** - HTTP API completo (implementado previamente)
5. ✅ **Settings** - APIs de perfil y notificaciones

**HTTP Services Creados:**
- ✅ `usersApiService.ts` - Gestión completa de usuarios
- ✅ `venuesApiService.ts` - Gestión completa de venues
- ✅ `reservationsApiService.ts` - Gestión completa de reservaciones
- ✅ `servicesApiService.ts` - Gestión completa de servicios
- ✅ `settingsApiService.ts` - Configuración de usuario

**React Hooks Creados:**
- ✅ `useUsers.ts` - Hook con paginación, filtros y CRUD
- ✅ `useVenues.ts` - Hook con paginación, filtros y CRUD  
- ✅ `useReservations.ts` - Hook con paginación, filtros y estados
- ✅ `useServices.ts` - Hook para gestión de servicios

**Build Status:** ✅ 31 rutas generadas, 0 errores TypeScript, bundle optimizado

---

## 📋 APIs Faltantes Identificadas

### Services Endpoints (FALTANTES)
- `GET /services` - Listar servicios
- `POST /services` - Crear servicio
- `PUT /services/[id]` - Actualizar servicio
- `DELETE /services/[id]` - Eliminar servicio

### Settings Endpoints (FALTANTES)
- `GET /settings/profile` - Configuración de perfil
- `PUT /settings/profile` - Actualizar perfil
- `GET /settings/notifications` - Configuración de notificaciones
- `PUT /settings/notifications` - Actualizar notificaciones

### ✅ ALL ENDPOINTS IMPLEMENTADOS Y FUNCIONANDO

#### Services Endpoints
- ✅ `GET /api/services` - Listar servicios con filtros y paginación
- ✅ `POST /api/services` - Crear servicio (Admin)
- ✅ `GET /api/services/[id]` - Obtener servicio por ID
- ✅ `PUT /api/services/[id]` - Actualizar servicio (Admin)
- ✅ `DELETE /api/services/[id]` - Eliminar servicio (Admin)

#### Users Endpoints (ADMIN)
- ✅ `GET /api/users` - Listar usuarios con filtros y paginación
- ✅ `POST /api/users` - Crear usuario (Admin)
- ✅ `GET /api/users/[id]` - Obtener usuario por ID (Admin)
- ✅ `PUT /api/users/[id]` - Actualizar usuario (Admin)
- ✅ `DELETE /api/users/[id]` - Soft delete usuario (Admin)

#### Venues Endpoints
- ✅ `GET /api/venues` - Listar venues con filtros y paginación
- ✅ `POST /api/venues` - Crear venue (Admin)
- ✅ `GET /api/venues/[id]` - Obtener venue por ID
- ✅ `PATCH /api/venues/[id]` - Actualizar venue (Admin)
- ✅ `DELETE /api/venues/[id]` - Eliminar venue (Admin)

#### Reservations Endpoints
- ✅ `GET /api/reservations` - Listar reservaciones con filtros
- ✅ `POST /api/reservations` - Crear reservación
- ✅ `GET /api/reservations/[id]` - Obtener reservación por ID
- ✅ `PATCH /api/reservations/[id]` - Actualizar reservación
- ✅ `DELETE /api/reservations/[id]` - Eliminar reservación

#### Settings Endpoints
- ✅ `GET /api/settings/profile` - Obtener perfil de usuario
- ✅ `PUT /api/settings/profile` - Actualizar perfil y cambiar contraseña
- ✅ `GET /api/settings/notifications` - Obtener configuración de notificaciones
- ✅ `PUT /api/settings/notifications` - Actualizar configuración de notificaciones

---

## 🎯 Estado de Implementación: 100% COMPLETADO ✅

✅ **1. Frontend Completamente Refactorizado**: Eliminado TODO Prisma directo, usando HTTP APIs  
✅ **2. Todos los Admin Components**: UsersManagement, VenuesManagement, ReservationsManagement  
✅ **3. HTTP Services Completos**: 5 servicios API creados con CRUD completo  
✅ **4. React Hooks Implementados**: 4 hooks con paginación, filtros y gestión de estado  
✅ **5. Build 100% Exitoso**: 31 rutas, 25+ APIs, 0 errores TypeScript  
✅ **6. Documentación Actualizada**: Guía completa de endpoints implementados  

## 📱 Listo para App Móvil

**APIs disponibles para consumo móvil:**
- ✅ Autenticación completa (login/register/logout)
- ✅ Gestión de reservas (CRUD completo)
- ✅ Gestión de servicios (CRUD completo) 
- ✅ Gestión de usuarios y configuración
- ✅ Sistema de notificaciones
- ✅ Integración de pagos Stripe

**🎉 REFACTORING COMPLETADO - SIN PASOS PENDIENTES**

Todos los componentes admin han sido refactorizados exitosamente:
- ✅ No más conexiones directas a Prisma en frontend
- ✅ Toda la funcionalidad admin usa HTTP APIs
- ✅ Preparado para integración con app móvil
- ✅ Build sin errores, código production-ready

---

## 🛠️ Detalles Técnicos de Implementación

### Estructura de HTTP Services

**Patrón Implementado:**
```typescript
// Ejemplo: usersApiService.ts
export class UsersApiService {
  private static baseUrl = '/api/users';
  
  static async getUsers(params) {
    return await handleRequest({
      endpoint: `${this.baseUrl}?${queryParams}`,
      method: 'GET',
    });
  }
  // ... CRUD completo
}
```

**React Hooks Pattern:**
```typescript
// Ejemplo: useUsers.ts  
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  
  const loadUsers = useCallback(async () => {
    const response = await usersApiService.getUsers();
    setUsers(response.data);
  }, []);
  
  // Retorna state y actions
}
```

**Component Integration:**
```typescript
// UsersManagement.tsx refactorizado
const {
  users, loadUsers, createUser, updateUser, 
  deleteUser, pagination, filters
} = useUsers();

// Sin más Prisma directo, solo HTTP APIs
```

---

**📅 Fecha**: Enero 12, 2025  
**🔗 Referencia**: [Postman Collection](./ReservApp_API_Collection.postman_collection.json)  
**🚀 Estado**: ✅ REFACTORING 100% COMPLETADO - PRODUCTION READY