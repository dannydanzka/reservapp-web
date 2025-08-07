# 🏗️ Architecture Reference

Technical architecture and design patterns for ReservApp - a comprehensive reservation ecosystem platform for Guadalajara's hospitality and service venues.

## 📋 **Project Structure Comparison**

### **Jafra Monorepo (NX) vs ReservApp (Monolith)**

```
🏢 Jafra (Monorepo)              🏠 ReservApp (Monolith)
├── apps/                        ├── src/app/              # Next.js App Router
│   ├── mod-auth/               │   ├── auth/             # Auth routes
│   ├── mod-home/               │   ├── admin/            # Admin routes
│   └── mod-*/                  │   └── landing/          # Landing routes
├── libs/                        ├── src/modules/          # Feature modules
│   ├── core/                   │   ├── mod-auth/         # Auth module
│   ├── data/                   │   ├── mod-admin/        # Admin module
│   ├── domain/                 │   └── mod-landing/      # Landing module
│   ├── presentation/           └── src/libs/             # Shared libraries (renamed from shared)
│   ├── services/                   ├── core/             # Core utilities
│   └── ui/                         ├── data/             # Data layer
                                    ├── domain/           # Business logic
                                    ├── presentation/     # Presentation layer
                                    ├── services/         # External services (handleRequest pattern)
                                    │   ├── http/         # handleRequest implementation  
                                    │   └── api/          # API services and mocks
                                    ├── types/            # Shared types
                                    └── ui/               # UI components & layouts
```

## 🎯 **Adopted Patterns from Jafra**

### **1. Clean Architecture Layers**

```typescript
// Each module follows the same structure
mod-{feature}/
├── core/                    # Module-specific utilities
├── data/                    # Repositories & data sources
├── domain/                  # Entities, interfaces, use cases
├── presentation/            # Components & hooks
├── services/                # External service integrations
├── store/                   # State management
└── ui/                      # UI components specific to module
```

### **2. Libs Structure (Shared Resources)**

```typescript
libs/
├── core/                    # Global utilities, constants, classes
│   ├── constants/           # App-wide constants
│   ├── classes/             # Shared classes (AppError, etc.)
│   └── state/               # Global state management
├── data/                    # Data layer abstractions
│   ├── config/              # Configuration management
│   ├── mappers/             # Data transformation
│   └── mocks/               # Mock data for testing
├── domain/                  # Business logic abstractions
│   ├── interfaces/          # Shared interfaces
│   └── utils/               # Business logic utilities
├── presentation/            # Presentation layer abstractions
│   ├── hooks/               # Custom hooks
│   ├── hocs/                # Higher-order components
│   └── providers/           # Context providers
├── services/                # External service contracts
│   ├── http/                # HandleRequest implementation (from Jafra)
│   │   ├── handleRequest.ts # Universal HTTP client with simulation support
│   │   ├── buildURL.ts      # URL builder with query params
│   │   ├── AppError.ts      # Custom error class with status codes
│   │   ├── defaultErrorHandling.ts # Error standardization
│   │   └── injectAuthorizationHeader.ts # JWT token injection
│   └── api/                 # API services and configurations
│       ├── authService.ts   # Authentication service with mock support
│       ├── config.ts        # API endpoints and configuration
│       ├── mocks/           # Mock responses for development
│       │   └── authMocks.ts # Mock user accounts and responses
│       └── utils/           # API utilities
│           └── handleApiRequest.ts # API request wrapper
└── ui/                      # Design system & components
    ├── theme/               # Design tokens
    ├── components/          # Reusable components
    ├── layouts/             # Layout components
    └── styled/              # Styled components
```

### **3. Design System Architecture**

```typescript
// Updated theme system with new color scheme
theme/
├── colors.ts               # Purple primary, orange secondary palette
├── spacing.ts              # Spacing scale (4px grid)
├── typography.ts           # Font families, sizes, weights
├── breakpoints.ts          # Responsive breakpoints
├── borderRadius.ts         # Border radius scale
├── elevations.ts           # Shadow system
└── defaultTheme.ts         # Combined theme object

// Current Color Scheme (Updated)
colors: {
  primary: '#8B5CF6',      // Purple
  secondary: '#F97316',    // Orange
  success: '#10B981',      // Green
  error: '#EF4444',        // Red
  warning: '#F59E0B',      // Amber
  info: '#3B82F6'          // Blue
}
```

### **4. HandleRequest Pattern Implementation**

```typescript
// Implemented Jafra's handleRequest pattern
export const handleRequest = async ({
  body, method = 'GET', url, endpoint, simulate = false, 
  mockedResponse, timeout = 30000, headers = {}, ...options
}: HandleRequestParams): Promise<any> => {
  // Simulation mode for development
  if (simulate) {
    return await new Promise((resolve) => {
      setTimeout(() => {
        const response = typeof mockedResponse === 'function' 
          ? mockedResponse() : mockedResponse;
        resolve(response);
      }, 1000);
    });
  }
  
  // Full axios implementation with auth injection
  const finalUrl = url || buildURL({ endpoint, ...options });
  const config = {
    method, url: finalUrl, data: body, timeout,
    headers: injectAuthorizationHeader(headers)
  };
  
  return await axios(config)
    .then(response => response.data)
    .catch(defaultErrorHandling);
};

// Authentication Service Implementation
export const authService = {
  login: (credentials) => handleRequest({
    endpoint: API_ENDPOINTS.AUTH.LOGIN,
    method: 'POST', body: credentials,
    simulate: true, // Using mocks for MVP
    mockedResponse: () => authMocks.mockLogin(credentials)
  }),
  
  register: (userData) => handleRequest({
    endpoint: API_ENDPOINTS.AUTH.REGISTER,
    method: 'POST', body: userData,
    simulate: true,
    mockedResponse: () => authMocks.mockRegister(userData)
  })
};
```

### **5. Testing Strategy**

```typescript
// Jafra's testing setup per module/lib
├── babel-jest.config.json  # Babel configuration for Jest
├── jest.config.ts         # Jest configuration
├── setupTests.ts          # Test setup utilities
└── __mocks__/             # Mock implementations
    ├── @core/
    ├── @data/
    ├── @domain/
    └── @presentation/
```

## 🛠️ **Key Technologies & Tools**

### **Dependencies from Jafra**

```json
{
  "react": "^19.0.0",
  "next": "^15.1.4",
  "styled-components": "^6.1.14",
  "typescript": "~5.6.2",
  "@typescript-eslint/eslint-plugin": "^8.30.1",
  "@typescript-eslint/parser": "^8.30.1"
}
```

### **UI Dependencies Worth Adopting**

```json
{
  "@fontsource/inter": "^5.1.1", // Better font loading
  "framer-motion": "^12.4.3", // Animations
  "polished": "^4.3.1", // Styled-components utilities
  "react-number-format": "^5.4.4", // Number input formatting
  "styled-normalize": "^8.1.1", // CSS normalize
  "stylis": "^4.3.6" // CSS preprocessor
}
```

## 📚 **Development Practices**

### **1. Module Creation Pattern**

```bash
# Jafra uses automated scripts for consistency
tools/create-module.sh         # Creates new module with full structure
tools/create-library.sh        # Creates new library
tools/create-clean-architecture.sh  # Sets up Clean Architecture
```

### **2. Configuration Per Module**

- Each module has its own `package.json`
- Individual `jest.config.ts` and `eslint.config.js`
- Dedicated `docker-compose.yml` for development
- Module-specific `next.config.ts`

### **3. Storybook Integration**

```json
// Per-library Storybook setup
"storybook:ui": "cd libs/ui && npx storybook dev",
"build-storybook:ui": "cd libs/ui && npx storybook build"
```

## 🔧 **Adaptation for ReservApp**

### **Changes Made:**

1. ✅ Renamed `shared/` → `libs/` for consistency
2. ✅ Updated all path aliases (`@shared/` → `@libs/`)
3. ✅ Maintained Clean Architecture per module
4. ✅ Adopted Jafra's ESLint configuration patterns
5. ✅ Implemented complete handleRequest pattern from Jafra
6. ✅ Created authentication system with mocked responses
7. ✅ Updated color scheme to purple/orange design
8. ✅ Configured Vercel deployment with API integration
9. ✅ Added comprehensive mock system for development
10. ✅ Implemented JWT token injection and error handling

### **Future Considerations:**

- **Database Integration**: Replace mocks with real Prisma + MySQL
- **Framer Motion**: Add for enhanced animations
- **Real Authentication**: Implement JWT with backend
- **Payment Integration**: Add Stripe payment processing
- **Email Service**: Integrate Resend for notifications
- **Image Management**: Add Cloudinary integration
- **Testing Strategy**: Expand test coverage with real API tests
- **Module Generation**: Create automated module creation scripts
- **Performance**: Implement React Query for data fetching
- **Mobile App**: Prepare API structure for React Native integration

## 🚀 **Deployment & Infrastructure**

### **Vercel Configuration**

```json
// vercel.json
{
  "buildCommand": "yarn build",
  "outputDirectory": ".next",
  "installCommand": "yarn install",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api).*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

### **Environment Configuration**

- **Development**: `.env.local` with local API endpoints
- **Production**: `.env.production` with Vercel deployment URLs
- **API Token**: Configured with `IxaRWKJhrt2h2IfrZmpIL5Z7`

### **Mock Authentication System**

```typescript
// Available test accounts
const mockUsers = {
  admin: {
    email: 'admin@reservapp.com',
    password: 'password123',
    role: 'admin'
  },
  manager: {
    email: 'manager@reservapp.com', 
    password: 'password123',
    role: 'manager'
  },
  employee: {
    email: 'employee@reservapp.com',
    password: 'password123', 
    role: 'employee'
  }
};
```

## 📖 **References**

- **Jafra Project**: `/Users/dramirez/Documents/jafra/web/jf-frontend-web`
- **Architecture Docs**: Jafra's `tools/README-create-clean-architecture.md`
- **UI Library**: Comprehensive design system in `libs/ui/`
- **Service Layer**: Complete handleRequest pattern implementation
- **Deployment Guide**: See `DEPLOYMENT.md` for detailed instructions
- **Verification Script**: `scripts/verify-deployment.cjs` for pre-deployment checks
