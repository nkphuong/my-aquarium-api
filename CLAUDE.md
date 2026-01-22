# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS-based API for an aquarium management system built with Clean Architecture principles, following Domain-Driven Design (DDD) and Hexagonal Architecture patterns. It uses TypeScript, NestJS framework, Prisma ORM, and Supabase PostgreSQL as the database provider.

## Development Commands

### Installation
```bash
pnpm install
```

### Running the Application
```bash
# Development with hot-reload
pnpm run start:dev

# Production mode
pnpm run start:prod

# Debug mode with watch
pnpm run start:debug
```

### Build
```bash
pnpm run build
```

### Code Quality
```bash
# Lint and auto-fix
pnpm run lint

# Format code
pnpm run format
```

### Testing
```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run e2e tests
pnpm run test:e2e

# Generate test coverage
pnpm run test:cov

# Debug tests
pnpm run test:debug
```

### Database (Prisma)
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Pull schema from existing database
npx prisma db pull

# Push schema to database without migrations (dev only)
npx prisma db push
```

## Architecture

> **CRITICAL**: The detailed architecture documentation has been moved to **[ARCHITECTURE.md](./ARCHITECTURE.md)**.
>
> Please refer to that file for:
> *   Hybrid Lowy + Laravel Architecture
> *   Manager / Accessor / Engine Patterns
> *   Cross-Module Interactions

### Project Layout
- `src/`: Application source code
  - `core/`: Shared components and Mixins
  - `modules/`: Feature modules (Vertical Slices)
- `prisma/`: Database schema
- `test/`: E2E tests

### TypeScript Configuration
- Target: ES2023
- Module system: NodeNext with ESM interop
- Decorators enabled (required for NestJS)
- Strict null checks enabled
- Source maps generated for debugging

### Testing Setup
- **Unit tests**: Jest with ts-jest transformer, placed alongside source files as `*.spec.ts`
- **E2E tests**: Located in `test/` directory with separate Jest config
- Test files use `.spec.ts` extension
- Coverage reports generated in `coverage/` directory

## ESLint Configuration

The project uses TypeScript ESLint with the following notable rules:
- `@typescript-eslint/no-explicit-any`: Disabled
- `@typescript-eslint/no-floating-promises`: Warning only
- `@typescript-eslint/no-unsafe-argument`: Warning only
- Prettier integration for consistent formatting (single quotes, trailing commas)

## Database Configuration

### Environment Variables
Managed via `.env` file (not committed to git):
- `DATABASE_URL`: PostgreSQL connection string
  - Format: `postgresql://user:password@localhost:5432/db_name`
- `PORT`: Application port (default: 3000)

See [.env.example](.env.example) for the template.

### Prisma ORM
This project uses Prisma as the database ORM, which provides:
- Type-safe database queries
- Automatic migrations
- Schema-first development
- Excellent TypeScript support

The Prisma client is generated in `generated/prisma/` and accessed through `PrismaService`.

## Adding New Features

> **STOP**: Do NOT follow the "Use Case" / "Repository" pattern.
>
> 1.  Read **[ARCHITECTURE.md](./ARCHITECTURE.md)** to understand the **Manager / Accessor** flow.
> 2.  **Define Entity** in `src/modules/<feature>/entities/` (Extend `Model`).
> 3.  **Create/Update Request** in `src/modules/<feature>/requests/`.
> 4.  **Create/Update Accessor** in `src/modules/<feature>/accessors/` (Extend `Accessor`).
> 5.  **Create/Update Manager** in `src/modules/<feature>/managers/`.
> 6.  **Wire it up** in `src/modules/<feature>/<feature>.module.ts`.

## Coding Conventions

### Naming Standards

| Type | Pattern | Example |
|------|---------|---------|
| Entity | `<Name>` | `Tank`, `Fish` |
| Request | `<Name>Request` | `CreateTankRequest` |
| Accessor | `<Name>Accessor` | `TankAccessor` |
| Manager | `<Name>Manager` | `TankManager` |
| Engine | `<Name>Engine` | `CompatibilityEngine` |
| Controller | `<Name>Controller` | `TankController` |

- Database fields: `snake_case`
- TypeScript properties: `camelCase` (Models auto-mapped)

### Entity Design
- Extend `Model<PrismaType>()`.
- Use `fill()` method for data population.
- Contain logic methods (e.g., `assignToUser()`).

### Manager Patterns
- Inject Accessors via Interface tokens (e.g., `ITankAccessor`).
- Return Entities directly.
- Use `Engine` for complex logic.

### Controller Patterns
- Use `Manager` to handle logic.
- Wrap responses in standard format if needed (or rely on Interceptors).


### Testing Guidelines

- Test files use `.spec.ts` extension
- Place tests in `__tests__` subdirectory of each layer
- Unit tests: mock repositories for service tests
- E2E tests: located in `/test` directory
- Run tests: `pnpm run test`
- Coverage: `pnpm run test:cov`
