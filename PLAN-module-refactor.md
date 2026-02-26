# Module Refactor Plan (Hybrid IDesign)

## Overview
Refactoring the NestJS module structure to resolve the "1 Entity = 1 Module" anti-pattern. Currently, the project has many single-entity modules (e.g., `livestock`, `fish`, `water-parameter`). The goal is to consolidate these into **Data Subsystem Modules** (containing entities and accessors) and **Application Workflow Modules** (containing managers and controllers), aligning with the Hybrid IDesign architecture.

## Project Type
**BACKEND** (NestJS API)

## Success Criteria
1. Zero single-entity NestJS Modules remaining.
2. Controllers are co-located with their respective Managers in `src/application/*`.
3. Accessors are grouped by aggregate root/subsystem in `src/modules/*`.
4. The system compiles successfully and all unit/integration tests pass.
5. No circular dependency warnings during the NestJS bootstrap process.

## Tech Stack
- NestJS (Dependency Injection, Routing)
- MikroORM (Entities, Data Access)
- TypeScript

## Target File Structure
```
src/
├── application/                     # Process Volatility (Workflow Modules)
│   ├── inventory/                   # e.g., InventoryManagerModule
│   │   ├── controllers/             # e.g., LivestockController, FishController
│   │   ├── managers/                # e.g., InventoryManager
│   │   └── inventory.module.ts
│   ├── aquarium/
│   └── water-lab/
├── modules/                         # Data Volatility (Data Subsystem Modules)
│   ├── livestock-data/              # e.g., LivestockDataModule
│   │   ├── accessors/               # FishAccessor, LivestockAccessor
│   │   ├── entities/                # Fish, Livestock
│   │   └── livestock-data.module.ts
│   ├── environment-data/
│   └── ecosystem-data/
```

## Task Breakdown

### Task 1: Map Entities to Data Subsystems
- **INPUT**: Current `src/modules/` directory contents.
- **ACTION**: Analyze the 77+ modules and categorize them into 5-10 logical subsystems (e.g., `LivestockData`, `EcosystemData`, `UserData`, `CommerceData`).
- **OUTPUT**: A documented mapping of which entities belong to which new Data Subsystem Module.
- **VERIFY**: Review mapping to ensure related Accessors belong to the same module to prevent circular dependencies.

### Task 2: Create Data Subsystem Modules
- **INPUT**: The subsystem mapping from Task 1.
- **ACTION**: Create the new generic Data Modules (e.g., `src/modules/livestock-data/livestock-data.module.ts`). Move the `entities` and `accessors` directories from the old individual modules into the new subsystem module.
- **OUTPUT**: New subsystem folders containing multiple entities and accessors.
- **VERIFY**: The new module correctly exports all included accessors (`exports: [FishAccessor, LivestockAccessor]`).

### Task 3: Migrate Application Modules and Controllers
- **INPUT**: Existing Controllers located within `src/modules/*` and Managers located in `src/application/*`.
- **ACTION**: Move Controllers to the `src/application/{domain}/controllers/` directory corresponding to the Manager they use. Update the Application Module to import the necessary Data Subsystem Modules instead of the old individual entity modules.
- **OUTPUT**: Controllers are correctly associated with their workflow modules.
- **VERIFY**: `src/modules/*` should no longer contain any `*Controller` classes.

### Task 4: Clean Up Imports and Delete Old Modules
- **INPUT**: The refactored folder structure with broken import paths.
- **ACTION**: Globally update import paths to reference the new subsystem folders. Delete the old single-entity module files (e.g., `livestock.module.ts`, `fish.module.ts`).
- **OUTPUT**: Clean codebase with correct imports.
- **VERIFY**: Run `pnpm tsc --noEmit` and ensure there are zero import errors.

## ✅ Phase X: Verification Checkout
- [ ] **Lint and Types Check**: Run `pnpm run lint` and `npx tsc --noEmit`. Must pass with 0 errors.
- [ ] **Dependency Audit**: Run `python .agent/scripts/checklist.py .` to ensure architectural compliance.
- [ ] **Build Validation**: Run `pnpm run build` to ensure NestJS compiles modules without Circular Dependency exceptions.
- [ ] **Test Execution**: Run `pnpm run test` (and E2E tests if available) to ensure Manager orchestrations still work flawlessly.
- [ ] **Manual Sanity Check**: Start the dev server (`pnpm start:dev`) and perform basic local API requests.
