# Architecture Documentation

## Clean Architecture with DDD and Hexagonal Pattern

This document provides an overview of the architectural patterns used in this project.

## Layers Overview

```
┌─────────────────────────────────────────────┐
│      Presentation Layer (Controllers)      │
│  - HTTP/REST API                            │
│  - Request/Response handling                │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      Application Layer (Use Cases)         │
│  - Business workflows                       │
│  - Orchestrates domain entities             │
│  - Defines ports (interfaces)               │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Domain Layer (Core)                │
│  - Entities (rich domain models)            │
│  - Value Objects                            │
│  - Repository Interfaces                    │
│  - Domain Events & Exceptions               │
│  - NO dependencies on other layers          │
└─────────────────△───────────────────────────┘
                  │
┌─────────────────┴───────────────────────────┐
│    Infrastructure Layer (Adapters)         │
│  - Prisma repositories                      │
│  - Database implementation                  │
│  - External services                        │
└─────────────────────────────────────────────┘
```

## Dependency Flow

- **Inward only**: Outer layers depend on inner layers
- **Domain** has zero dependencies
- **Application** depends only on Domain
- **Infrastructure** & **Presentation** depend on Domain & Application
- Dependencies are inverted using **interfaces** and **dependency injection**

## Directory Structure

```
src/
├── domain/                    # Core business logic (innermost layer)
│   ├── entities/              # Rich domain models with business logic
│   │   ├── base.entity.ts
│   │   └── fish.entity.ts
│   ├── value-objects/         # Immutable domain concepts
│   │   └── base.value-object.ts
│   ├── repositories/          # Repository interfaces (contracts)
│   │   ├── base.repository.interface.ts
│   │   └── fish.repository.interface.ts
│   ├── events/                # Domain events
│   └── exceptions/            # Domain exceptions
│       └── domain.exception.ts
│
├── application/               # Use cases & application logic
│   ├── use-cases/             # Business workflows
│   │   ├── base.use-case.ts
│   │   └── fish/
│   │       ├── create-fish.use-case.ts
│   │       └── get-all-fish.use-case.ts
│   ├── dtos/                  # Data transfer objects
│   │   ├── base.dto.ts
│   │   └── fish.dto.ts
│   └── ports/                 # Interfaces for infrastructure
│       └── repository.port.ts
│
├── infrastructure/            # External adapters
│   ├── database/              # Database setup
│   │   ├── prisma.service.ts
│   │   └── database.module.ts
│   └── repositories/          # Repository implementations
│       ├── base.repository.ts
│       └── fish.repository.ts
│
├── presentation/              # HTTP/API layer
│   ├── controllers/           # NestJS controllers
│   │   └── fish.controller.ts
│   ├── dto/                   # HTTP response wrappers
│   │   └── response.dto.ts
│   └── presenters/            # Entity to DTO transformation
│       └── base.presenter.ts
│
├── modules/                   # Feature modules (DI wiring)
│   └── fish/
│       └── fish.module.ts
│
├── app.module.ts              # Root module
└── main.ts                    # Application entry point
```

## Key Patterns

### 1. Repository Pattern
- **Interface in Domain**: `IFishRepository` (what operations)
- **Implementation in Infrastructure**: `FishRepository` (how to do them)
- **Binding**: Symbol tokens in DI container

```typescript
// Domain Layer - Interface
export interface IFishRepository {
  findById(id: string): Promise<Fish | null>;
}
export const FISH_REPOSITORY = Symbol('FISH_REPOSITORY');

// Infrastructure Layer - Implementation
@Injectable()
export class FishRepository implements IFishRepository {
  constructor(private prisma: PrismaService) {}
  // ... implementation
}

// Feature Module - Binding
@Module({
  providers: [{
    provide: FISH_REPOSITORY,
    useClass: FishRepository,
  }]
})
```

### 2. Use Case Pattern
- Each use case = one business operation
- Implements `UseCase<Input, Output>` interface
- Receives dependencies via constructor injection

```typescript
@Injectable()
export class CreateFishUseCase implements UseCase<CreateFishDto, FishDto> {
  constructor(
    @Inject(FISH_REPOSITORY) private repo: IFishRepository
  ) {}

  async execute(input: CreateFishDto): Promise<FishDto> {
    // Business logic here
  }
}
```

### 3. Domain Entity Pattern
- Rich domain models with behavior
- Encapsulate business rules
- Protect invariants
- Private properties with getters
- Public methods for state changes

```typescript
export class Fish extends BaseEntity {
  private _name: string;

  get name(): string { return this._name; }

  updateName(newName: string): void {
    // Validate business rules
    if (!newName) throw new ValidationException('Name required');
    this._name = newName;
    this.touch(); // Update timestamp
  }
}
```

## Benefits

1. **Testability**: Each layer can be tested independently
2. **Maintainability**: Clear separation of concerns
3. **Flexibility**: Easy to swap implementations (e.g., different database)
4. **Framework Independence**: Domain logic doesn't depend on NestJS or Prisma
5. **Business Logic Clarity**: Domain entities express business rules clearly

## Adding a New Aggregate

Follow this checklist:

- [ ] Define entity in `domain/entities/`
- [ ] Create repository interface in `domain/repositories/`
- [ ] Add Prisma model in `prisma/schema.prisma`
- [ ] Implement repository in `infrastructure/repositories/`
- [ ] Create DTOs in `application/dtos/`
- [ ] Implement use cases in `application/use-cases/`
- [ ] Create controller in `presentation/controllers/`
- [ ] Wire everything in feature module `modules/`
- [ ] Register module in `app.module.ts`

See [CLAUDE.md](CLAUDE.md) for detailed step-by-step instructions.
