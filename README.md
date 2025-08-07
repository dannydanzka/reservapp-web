# ReservApp

**Comprehensive reservation ecosystem platform** for hospitality and service venues in **Guadalajara, Jalisco, Mexico**.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Setup database with real Guadalajara data
yarn db:push
yarn db:seed

# Start development server
yarn dev
```

Visit `http://localhost:3000` to see the application.

### Demo Accounts
- **Admin**: `admin@reservapp.com` / `password123`
- **User**: `user@reservapp.com` / `password123`

## 🌮 What We Offer

- **🏨 Accommodation**: Suites, apartments
- **🍽️ Dining**: Restaurant tables, culinary experiences  
- **💆 Wellness**: Spa treatments, massage services
- **🎯 Experiences**: Cultural tours, tequila experiences
- **🎉 Events**: Meeting spaces, celebration venues

## 📚 Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - Technical architecture and patterns
- **[Business Model](docs/BUSINESS_MODEL.md)** - Business context and strategy
- **[Structure](docs/STRUCTURE.md)** - Project structure and organization
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment guide and configuration

## 🛠️ Tech Stack

- **Next.js 15** + React 19 + TypeScript
- **Prisma ORM** + MySQL database
- **Styled Components** with design system
- **JWT Authentication** with bcrypt
- **Stripe** payments + **Resend** emails
- **Clean Architecture** principles

## 📝 Commands

```bash
# Development
yarn dev                    # Start development server
yarn build                  # Build for production

# Database  
yarn db:seed               # Populate with Guadalajara data
yarn db:reset              # Reset and re-seed database
yarn db:studio             # Open database browser

# Quality
yarn lint                  # Run linting
yarn type-check           # TypeScript validation
yarn test                 # Run tests
```

---

## 📄 License

This project is private and proprietary.