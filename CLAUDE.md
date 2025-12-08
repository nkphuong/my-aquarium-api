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

This project implements **Clean Architecture** using **Domain-Driven Design (DDD)** principles. The architecture enforces separation of concerns and dependency inversion, making the codebase maintainable, testable, and independent of frameworks and external services.

### Architectural Layers

The application is organized into four main layers, with dependencies flowing **inward** (outer layers depend on inner layers, never the reverse):

```
Presentation Layer (Controllers, DTOs)
         ↓
Application Layer (Use Cases, DTOs)
         ↓
Domain Layer (Entities, Value Objects, Exceptions)
         ↑
Infrastructure Layer (Prisma, Repositories, External Services)
```

#### 1. Domain Layer (`src/domain/`)
The **core** of the application, containing business logic and rules. This layer has **no dependencies** on other layers or external frameworks.

- **`entities/`**: Rich domain entities with business logic
  - `base.entity.ts`: Base class for all entities with id, timestamps
  - `fish.entity.ts`: Example Fish aggregate with business methods
  - `user.entity.ts`: User entity
- **`value-objects/`**: Immutable objects representing domain concepts
  - `base.value-object.ts`: Base class for value objects with equality comparison
  - `email.value-object.ts`: Email value object with validation
- **`exceptions/`**: Domain-specific exceptions
  - `domain.exception.ts`: DomainException, EntityNotFoundException, ValidationException
  - `auth.exception.ts`: Authentication and authorization exceptions

#### 2. Application Layer (`src/application/`)
Contains **use cases** (application business logic) that orchestrate domain entities and infrastructure services.

- **`use-cases/`**: Application use cases implementing business workflows
  - `base.use-case.ts`: UseCase interface defining execute contract
  - `fish/create-fish.use-case.ts`: Example use case for creating fish
  - `fish/get-all-fish.use-case.ts`: Example use case for retrieving all fish
  - `auth/register.use-case.ts`: User registration use case
  - `auth/login.use-case.ts`: User login use case
  - `auth/validate-token.use-case.ts`: Token validation use case
  - `auth/get-current-user.use-case.ts`: Get current user use case
- **`dtos/`**: Data Transfer Objects for application layer
  - `base.dto.ts`: Base DTO with common fields
  - `fish.dto.ts`: Fish DTOs (FishDto, CreateFishDto, UpdateFishDto)
  - `auth.dto.ts`: Auth DTOs (RegisterDto, LoginDto, AuthResponseDto, UserDto)

#### 3. Infrastructure Layer (`src/infrastructure/`)
Contains framework-specific implementations and external service integrations. Repositories and services are injected directly into use cases.

- **`database/`**: Database connection and ORM setup
  - `prisma.service.ts`: Prisma client service with lifecycle management
  - `database.module.ts`: Global module exporting PrismaService
- **`repositories/`**: Concrete repository implementations
  - `base.repository.ts`: Base repository with Prisma dependency
  - `fish.repository.ts`: Fish repository implementation using Prisma
  - `user.repository.ts`: User repository implementation using Prisma
- **`auth/`**: Authentication services
  - `supabase-auth.service.ts`: Supabase authentication service
  - `auth.types.ts`: Auth-related types (AuthResult, SupabaseUser)

#### 4. Presentation Layer (`src/presentation/`)
HTTP/REST API layer handling requests and responses. Maps between DTOs and HTTP formats.

- **`controllers/`**: NestJS controllers handling HTTP endpoints
  - `fish.controller.ts`: Fish REST API endpoints
- **`dto/`**: HTTP-specific DTOs
  - `response.dto.ts`: Standardized API response wrapper
- **`presenters/`**: Transform domain entities to presentation DTOs
  - `base.presenter.ts`: Base presenter interface

#### Feature Modules (`src/modules/`)
Feature modules wire together all layers using **dependency injection**:

- **`fish/fish.module.ts`**: Fish feature module
  - Registers controllers, use cases, and repositories
  - Provides concrete implementations directly
- **`auth/auth.module.ts`**: Auth feature module
  - Registers auth controllers, use cases, repositories, and services
  - Exports guards for use in other modules

### Project Layout
- `src/`: Application source code (layered architecture)
  - `domain/`: Domain layer (core business logic)
  - `application/`: Application layer (use cases)
  - `infrastructure/`: Infrastructure layer (Prisma, external services)
  - `presentation/`: Presentation layer (controllers)
  - `modules/`: Feature modules (DI wiring)
  - `main.ts`: Application entry point
  - `app.module.ts`: Root module importing all feature modules
- `prisma/`: Prisma schema and migrations
  - `schema.prisma`: Database schema definition
  - `migrations/`: Database migration files
- `generated/prisma/`: Generated Prisma client (git-ignored)
- `test/`: E2E tests
- `dist/`: Build output

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
- `DATABASE_URL`: PostgreSQL connection string for Supabase
  - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- `PORT`: Application port (default: 3000)

See [.env.example](.env.example) for the template.

### Prisma ORM
This project uses Prisma as the database ORM, which provides:
- Type-safe database queries
- Automatic migrations
- Schema-first development
- Excellent TypeScript support

The Prisma client is generated in `generated/prisma/` and accessed through `PrismaService`.

## Adding New Features (Clean Architecture)

Follow these steps when implementing new features:

### 1. Define Domain Model
Start in the **Domain Layer**:

```typescript
// src/domain/entities/tank.entity.ts
export class Tank extends BaseEntity {
  constructor(
    id: string,
    private _name: string,
    private _capacity: number,
  ) {
    super(id);
  }

  get name(): string { return this._name; }
  get capacity(): number { return this._capacity; }

  // Business logic methods
  updateCapacity(newCapacity: number): void {
    if (newCapacity <= 0) {
      throw new ValidationException('Capacity must be positive');
    }
    this._capacity = newCapacity;
    this.touch();
  }
}
```

### 2. Create Prisma Schema
Update `prisma/schema.prisma`:

```prisma
model Tank {
  id        String   @id @default(uuid())
  name      String   @unique
  capacity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("tanks")
}
```

Then run:
```bash
npx prisma generate
npx prisma migrate dev --name add_tank_table
```

### 3. Implement Repository
In the **Infrastructure Layer**:

```typescript
// src/infrastructure/repositories/tank.repository.ts
@Injectable()
export class TankRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Tank | null> {
    const tank = await this.prisma.tank.findUnique({ where: { id } });
    return tank ? this.toDomain(tank) : null;
  }

  async findByName(name: string): Promise<Tank | null> {
    const tank = await this.prisma.tank.findUnique({ where: { name } });
    return tank ? this.toDomain(tank) : null;
  }

  async save(entity: Tank): Promise<Tank> {
    const tank = await this.prisma.tank.create({
      data: {
        id: entity.id,
        name: entity.name,
        capacity: entity.capacity,
      },
    });
    return this.toDomain(tank);
  }

  private toDomain(prismaTank: any): Tank {
    return new Tank(
      prismaTank.id,
      prismaTank.name,
      prismaTank.capacity,
      prismaTank.createdAt,
      prismaTank.updatedAt,
    );
  }
}
```

### 4. Create Application DTOs
In the **Application Layer**:

```typescript
// src/application/dtos/tank.dto.ts
export class TankDto extends BaseDto {
  name: string;
  capacity: number;
}

export class CreateTankDto {
  name: string;
  capacity: number;
}
```

### 5. Implement Use Cases
In the **Application Layer**:

```typescript
// src/application/use-cases/tank/create-tank.use-case.ts
import { Injectable } from '@nestjs/common';
import { UseCase } from '@application/use-cases/base.use-case';
import { CreateTankDto, TankDto } from '@application/dtos/tank.dto';
import { TankRepository } from '@infrastructure/repositories/tank.repository';
import { Tank } from '@domain/entities/tank.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateTankUseCase implements UseCase<CreateTankDto, TankDto> {
  constructor(
    private readonly tankRepository: TankRepository,
  ) {}

  async execute(input: CreateTankDto): Promise<TankDto> {
    const tank = new Tank(randomUUID(), input.name, input.capacity);
    const savedTank = await this.tankRepository.save(tank);

    return {
      id: savedTank.id,
      name: savedTank.name,
      capacity: savedTank.capacity,
      createdAt: savedTank.createdAt,
      updatedAt: savedTank.updatedAt,
    };
  }
}
```

### 6. Create Controller
In the **Presentation Layer**:

```typescript
// src/presentation/controllers/tank.controller.ts
@Controller('tanks')
export class TankController {
  constructor(private readonly createTankUseCase: CreateTankUseCase) {}

  @Post()
  async create(@Body() dto: CreateTankDto) {
    const tank = await this.createTankUseCase.execute(dto);
    return ResponseDto.success(tank, 'Tank created successfully');
  }
}
```

### 7. Wire with Dependency Injection
Create a **Feature Module**:

```typescript
// src/modules/tank/tank.module.ts
import { Module } from '@nestjs/common';
import { TankController } from '@presentation/controllers/tank.controller';
import { CreateTankUseCase } from '@application/use-cases/tank/create-tank.use-case';
import { TankRepository } from '@infrastructure/repositories/tank.repository';

@Module({
  controllers: [TankController],
  providers: [
    CreateTankUseCase,
    TankRepository,
  ],
})
export class TankModule {}
```

### 8. Register in AppModule
```typescript
// src/app.module.ts
@Module({
  imports: [
    // ... other imports
    TankModule,
  ],
})
export class AppModule {}
```

## Key Principles

### Dependency Rule
- **Domain layer** depends on nothing (no imports from other layers)
- **Application layer** depends on domain and infrastructure (for concrete implementations)
- **Infrastructure** depends on domain for entities and value objects
- **Presentation** depends on application for use cases and DTOs
- Use **dependency injection** to provide concrete implementations

### Repository Pattern
- Repositories live in the **infrastructure layer**
- Use cases inject repositories directly (concrete classes)
- Repositories handle data persistence and mapping to domain entities
- Keep repository methods focused on data access

### Use Cases
- Each use case represents a single business operation
- Use cases orchestrate domain entities and repositories
- Keep use cases focused and testable
- Inject concrete repositories and services directly

### Entity Business Logic
- Put business rules in domain entities
- Entities should protect their invariants
- Use methods to modify state, not direct property access
- Keep entities independent of infrastructure concerns
