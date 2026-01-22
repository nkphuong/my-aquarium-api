# Architecture Documentation

> **Note**: This document reflects the actual implemented architecture of the `my-aquarium-api` project, which differs from the theoretical structure described in `CLAUDE.md`.

## 1. Architectural Style: Hybrid IDesign (Lowy) + Laravel

The project implements a **Modular Monolith** architecture heavily inspired by Juval Lowy's "Righting Software" (IDesign) Method, blended with Laravel's Developer Experience (DX) patterns.

### Core Philosophy: Volatility-Based Decomposition
The system is decomposed based on **volatility** (what changes), not functionality.

1.  **Accessors (Data Volatility)**: Encapsulate *how* and *where* data is stored. If the DB changes, only Accessors change.
2.  **Engines (Logic Volatility)**: Encapsulate *complex business rules*. If the formula for "Fish Compatibility" changes, only the Engine changes.
3.  **Managers (Process Volatility)**: Encapsulate the *workflow/sequence*. If the user journey changes (e.g., "Send email after registration" -> "Send SMS"), only the Manager changes.

---

## 2. Directory Structure

```
src/
├── core/                  # Shared utilities, base classes, and mixins
│   ├── accessors/         # Base Accessor interfaces/mixins
│   ├── contracts/         # Global interfaces
│   ├── entities/          # Base Entity definitions
│   └── mixins/            # Core Mixin factories (Model, Accessor)
│
├── modules/               # Feature Modules
│   ├── fish-care/
│   │   ├── accessors/     # Data Access Layer
│   │   ├── engines/       # Business Logic Layer (Complex Rules) <-- NEW
│   │   ├── managers/      # Process/Workflow Layer
│   │   ├── entities/      # Domain Layer (Rich Models)
│   │   ├── requests/      # Input Validation
│   │   └── fish-care.module.ts
```

---

## 3. Key Components & Patterns

### A. Entities (The "Model")
**Role**: Rich domain objects, state holders.
**Pattern**: Extends `Model<PrismaType>()`.
- **Auto-Mapping**: Properties inferred from Prisma.
- **Rich Behavior**: Handles internal state consistency (e.g., `assignToUser`).

### B. Accessors (Data Access)
**Role**: Encapsulate volatile **Data Access**.
**Pattern**: Extends `Accessor(Entity)`.
- Replaces "Repositories".
- **Rule**: Managers/Engines must NEVER access Prisma directly. They must use Accessors.

### C. Engines (Business Logic)
**Role**: Encapsulate volatile **Business Logic** & Rules.
**Pattern**: Pure(ish) logic classes.
- **Responsibility**: "How to calculate X", "Is Y allowed", "Algorithm Z".
- **Rule**: Engines do NOT call other Engines (usually). Engines do NOT handle HTTP/Requests.

```typescript
// Example: src/modules/fish/engines/compatibility.engine.ts
@Injectable()
export class CompatibilityEngine {
    calculateStressLevel(fish: Fish, tank: Tank): number {
        // Complex logic: Bioload + Param mismatch + Aggression
        if (tank.volume < fish.minVolume) return 100;
        return 0;
    }
}
```

### D. Managers (Process/Workflow)
**Role**: Encapsulate volatile **Use Cases / Workflow**.
**Pattern**: The entry point for features.
- **Responsibility**: Orchestration. "First do A, then check B (Engine), then save C (Accessor)".
- **Rule**: Managers utilize Engines for logic and Accessors for data.

```typescript
// src/modules/fish/managers/fish.manager.ts
@Injectable()
export class FishManager {
    constructor(
        private accessor: IFishAccessor,
        private compatibilityEngine: CompatibilityEngine // Inject Engine
    ) {}

    async addFishToTank(request: AddFishRequest): Promise<Fish> {
        const fish = new Fish().fill(request);
        const tank = await this.tankAccessor.findById(request.tankId);

        // Delegate complex logic to Engine
        if (this.compatibilityEngine.calculateStressLevel(fish, tank) > 50) {
            throw new DomainException("Fish incompatible");
        }

        return this.accessor.save(fish);
    }
}
```

### E. Requests (Input)
**Role**: Define and validate incoming data.
**Pattern**: Laravel-style Form Requests.
- Extends `BaseRequest`.

---

## 4. Flow of Control (The "Call Chain")

```mermaid
graph TD
    %% Nodes
    C[Controller]:::presentation
    M[Manager]:::business
    E[Engine]:::logic
    A[Accessor]:::data
    DB[(Database)]:::infra
    EV[Event Bus]:::event
    L[Listener]:::sideeffect
    EXT[External Service]:::infra

    %% Styles
    classDef presentation fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef business fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef logic fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef data fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef infra fill:#eceff1,stroke:#455a64,stroke-width:2px;
    classDef event fill:#ffebee,stroke:#c62828,stroke-width:2px,stroke-dasharray: 5 5;
    classDef sideeffect fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;

    %% Flows
    C -->|1. Request| M
    
    subgraph Core Logic [Synchronous Interaction]
        M -->|2. Decision?| E
        E -->|3. Result| M
        M -->|4. Save Data| A
        A -->|5. SQL| DB
        DB -->|6. Data| A
        A -->|7. Entity| M
    end

    subgraph Side Effects [Asynchronous / Fire & Forget]
        M -.->|8. Emit Event| EV
        EV -.->|9. Notify| L
        L -->|10. Send Email| EXT
    end

    M -->|11. Response| C
```

1.  **Controller**: Receives HTTP -> Calls Manager.
2.  **Manager**:
    *   orchestrates flow.
    *   calls **Engine** for decisions/calculations.
    *   calls **Accessor** for data I/O.
3.  **Engine**:
    *   executes pure business rules.
    *   returns result to Manager.
4.  **Accessor**:
    *   executes DB query.
    *   returns **Entity** to Manager.
5.  **Manager**: Returns Entity/Result to Controller.

---

## 5. Cross-Module Interaction (The "Glue")

In this Hybrid architecture, Modules are not completely isolated silos. Managers often need data or logic from other modules.

**Rule**: Managers can inject **Accessors** or **Engines** from other modules.
*   **Do NOT** inject other Managers (avoids circular dependency hell).
*   **Do NOT** access other modules' database tables directly (use their Accessor).

### Example: `FishManager` (Module A) uses components from `Tank` & `Species` (Modules B & C)

```typescript
// src/modules/fish/managers/fish.manager.ts
@Injectable()
export class FishManager {
    constructor(
        // 1. Own Module Accessor
        @Inject(FISH_ACCESSOR)
        private readonly fishAccessor: IFishAccessor,

        // 2. EXTERNAL Module Accessor (Checking Tank capacity)
        @Inject(TANK_ACCESSOR)
        private readonly tankAccessor: ITankAccessor,

        // 3. EXTERNAL Module Engine (Checking Species compatibility)
        private readonly speciesCompatibilityEngine: SpeciesCompatibilityEngine
    ) {}

    async addFish(userId: number, request: AddFishRequest): Promise<Fish> {
        // Step 1: Use External Accessor to validate Tank exists & check capacity
        const tank = await this.tankAccessor.findById(request.tankId);
        if (!tank) throw new EntityNotFoundException('Tank', request.tankId);
        
        // Step 2: Use External Engine to check logic
        const isCompatible = this.speciesCompatibilityEngine.canCoexist(
            request.speciesId, 
            tank.inhabitants
        );
        if (!isCompatible) throw new DomainException('Incompatible Species');

        // Step 3: Perform Local Logic
        const fish = new Fish().fill(request).assignToUser(userId);

        // Step 4: Save
        return this.fishAccessor.save(fish);
    }
}
```

---

## 6. Event-Driven Side Effects (Hybrid Pattern)

While core business logic is **Synchronous** (Manager -> Engine -> Accessor), we use **Events (Pub/Sub)** for "Fire and Forget" side effects that are not critical to the immediate transaction.

### Rules of Engagement
1.  **Core Logic (Synchronous)**: "Must happen now or fail." (e.g., Saving to DB, Validating Rules).
2.  **Side Effects (Asynchronous)**: "Nice to have, or can happen later." (e.g., Sending Emails, Analytics, Cache Invalidation).

### Real-Life Scenario: "Welcome Email"
**Goal**: When a user creates their first tank, send them a "Getting Started" email.
**Constraint**: The API response should be fast; don't make the user wait for the email service.

#### 1. The Publisher (Manager)
The Manager focuses on the *core task* (saving the tank) and just announces what happened.

```typescript
// src/modules/tank/managers/tank.manager.ts
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TankManager {
    constructor(
        private accessor: ITankAccessor,
        private eventEmitter: EventEmitter2 // Inject NestJS Event Emitter
    ) {}

    async createTank(userId: number, request: CreateTankRequest): Promise<Tank> {
        // 1. Core Logic (Synchronous) - fast & transactional
        const tank = new Tank().fill(request).assignToUser(userId);
        const savedTank = await this.accessor.save(tank);

        // 2. Publish Domain Event (Fire & Forget)
        // usage: emit('event.name', payload)
        this.eventEmitter.emit(
            'tank.created', 
            new TankCreatedEvent(savedTank)
        );

        return savedTank;
    }
}
```

#### 2. The Subscriber (Listener)
A separate Listener handles the side effect. This code runs in the background (asynchronously) and does not block the Manager.

```typescript
// src/modules/notifications/listeners/tank-created.listener.ts
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TankCreatedListener {
    constructor(
        private emailService: EmailService
    ) {}

    // Listens for 'tank.created' event
    @OnEvent('tank.created', { async: true }) 
    async handleTankCreatedEvent(event: TankCreatedEvent) {
        const { tank } = event;
        
        // Side Effect Implementation
        console.log(`Sending welcome email for Tank: ${tank.name}`);
        await this.emailService.sendWelcomeEmail(tank.user_id, tank.name);
    }
}
```
