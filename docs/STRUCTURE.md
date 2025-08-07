# 📁 Estructura del Proyecto ReservApp

## 🏗️ Arquitectura de Ecosistema de Servicios

ReservApp utiliza Clean Architecture adaptada para un **ecosistema de reservas multi-servicio** en Guadalajara.

```
reservapp-web/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── admin/                     # Rutas administrativas
│   │   │   ├── page.tsx              # Dashboard principal
│   │   │   ├── reservations/         # Gestión de reservaciones
│   │   │   └── users/                # Gestión de usuarios
│   │   ├── auth/                      # Rutas de autenticación
│   │   │   ├── login/                # Página de login
│   │   │   └── register/             # Página de registro
│   │   ├── landing/                   # Landing page
│   │   ├── api/                       # API Routes públicas
│   │   │   ├── health/               # Health check
│   │   │   └── auth/                 # Endpoints de auth
│   │   ├── layout.tsx                # Layout raíz
│   │   └── page.tsx                  # Página principal
│   │
│   ├── modules/                       # Módulos de funcionalidad
│   │   ├── mod-auth/                  # Módulo de autenticación
│   │   │   ├── app/                  # Next.js específico
│   │   │   ├── core/                 # Utilidades del módulo
│   │   │   ├── data/                 # Repositorios y datos
│   │   │   │   └── repositories/     # Implementaciones de repositorios
│   │   │   ├── domain/               # Lógica de negocio
│   │   │   │   ├── interfaces/       # Contratos del dominio
│   │   │   │   └── use-cases/        # Casos de uso
│   │   │   ├── presentation/         # Componentes de presentación
│   │   │   │   └── components/       # Componentes React
│   │   │   ├── services/             # Servicios externos
│   │   │   ├── store/                # Estado del módulo
│   │   │   └── ui/                   # UI específica del módulo
│   │   │
│   │   ├── mod-admin/                 # Módulo administrativo
│   │   │   ├── app/                  # Next.js específico
│   │   │   ├── core/                 # Utilidades del módulo
│   │   │   ├── data/                 # Repositorios y datos
│   │   │   ├── domain/               # Lógica de negocio
│   │   │   ├── presentation/         # Componentes de presentación
│   │   │   │   └── components/       # Componentes React
│   │   │   ├── services/             # Servicios externos
│   │   │   ├── store/                # Estado del módulo
│   │   │   └── ui/                   # UI específica del módulo
│   │   │
│   │   └── mod-landing/               # Módulo de landing
│   │       ├── app/                  # Next.js específico
│   │       ├── core/                 # Utilidades del módulo
│   │       ├── data/                 # Repositorios y datos
│   │       ├── domain/               # Lógica de negocio
│   │       ├── presentation/         # Componentes de presentación
│   │       │   └── components/       # Componentes React
│   │       ├── services/             # Servicios externos
│   │       ├── store/                # Estado del módulo
│   │       └── ui/                   # UI específica del módulo
│   │
│   └── shared/                        # Recursos compartidos
│       ├── core/                      # Utilidades core
│       │   ├── config/               # Configuraciones
│       │   ├── errors/               # Manejo de errores
│       │   └── validation/           # Validaciones
│       │
│       ├── data/                      # Capa de datos compartida
│       │   ├── mappers/              # Mapeadores de datos
│       │   ├── models/               # Modelos de datos
│       │   └── repositories/         # Repositorios base
│       │
│       ├── domain/                    # Lógica de negocio compartida
│       │
│       ├── presentation/              # Capa de presentación compartida
│       │
│       ├── services/                  # Servicios externos compartidos
│       │
│       ├── types/                     # Tipos TypeScript compartidos
│       │
│       └── ui/                        # Componentes UI compartidos
│           ├── components/            # Componentes reutilizables
│           ├── layouts/               # Layouts de la aplicación
│           ├── providers/             # Proveedores de contexto
│           └── styles/                # Estilos y tema
│
├── public/                            # Archivos estáticos
│   ├── images/                        # Imágenes
│   └── icons/                         # Iconos
│
├── package.json                       # Dependencias y scripts
├── next.config.ts                     # Configuración de Next.js
├── tsconfig.json                      # Configuración de TypeScript
├── eslint.config.js                   # Configuración de ESLint
├── .prettierrc                        # Configuración de Prettier
├── .stylelintrc.js                    # Configuración de Stylelint
├── styled.d.ts                        # Tipos para Styled Components
├── next-env.d.ts                      # Tipos de Next.js
└── README.md                          # Documentación del proyecto
```

## 🎯 Principios de Organización

### ✅ **Clean Architecture por Módulo**

Cada módulo sigue la estructura de Clean Architecture:

- **Domain**: Entidades, interfaces y casos de uso
- **Data**: Repositorios y fuentes de datos
- **Presentation**: Componentes React y hooks
- **Services**: Servicios externos

### ✅ **Separación de Responsabilidades**

- **app/**: Solo rutas y configuración de Next.js
- **modules/**: Lógica de negocio específica por módulo
- **shared/**: Recursos reutilizables entre módulos

### ✅ **Escalabilidad**

- Fácil agregar nuevos módulos
- Estructura consistente en todos los módulos
- Recursos compartidos bien organizados

### ✅ **Mantenibilidad**

- Código bien organizado y fácil de navegar
- Responsabilidades claramente definidas
- Fácil testing por capas

## 🚀 Ventajas de esta Estructura

1. **Modular**: Cada módulo es independiente
2. **Escalable**: Fácil agregar nuevas funcionalidades
3. **Mantenible**: Código bien organizado
4. **Testeable**: Separación clara de responsabilidades
5. **Reutilizable**: Componentes y lógica compartida
6. **Type-Safe**: TypeScript en toda la aplicación

## 📋 Convenciones de Nomenclatura

- **Módulos**: `mod-{nombre}` (ej: `mod-auth`)
- **Carpetas**: `kebab-case` (ej: `use-cases`)
- **Archivos**: `PascalCase` para componentes, `camelCase` para utilidades
- **Tipos**: `PascalCase` con sufijo descriptivo (ej: `UserInterface`)

Esta estructura optimizada elimina la duplicación y mantiene una organización clara y escalable para el proyecto ReservApp.
