# IDesign Refactoring Implementation Plan

## Goal

Refactor codebase to align with Righting Software / IDesign principles:
- Create 3 Engines (BioloadEngine, CompatibilityEngine, WaterQualityEngine)
- Consolidate 7 Managers → 3 Managers

---

## Phase 1: Create Engines ✅

### 1.1 Create Engine Directory & Base Setup

- [x] Create `src/engines/` directory
- [x] Create `src/engines/__tests__/` for tests
- [x] Create `src/engines/engines.module.ts`

**Verify**: `ls src/engines/` shows structure

---

### 1.2 Implement BioloadEngine

- [x] Create `src/engines/bioload.engine.ts`
  - `calculateFishBioload(fish, species): number`
  - `calculateMaxBioload(tank): number`
  - `calculateCurrentBioload(fishList, speciesMap): number`
  - `validateTankCapacity(tank, currentFish, newSpecies, speciesMap): BioloadValidation`
  - `assessBioloadHealth(tank, currentFish, speciesMap): HealthStatus`

- [x] Create `src/engines/__tests__/bioload.engine.spec.ts` (12 tests passing)

**Verify**: `npm test -- --testPathPattern=bioload.engine.spec`

---

### 1.3 Implement CompatibilityEngine

- [ ] Create `src/engines/compatibility.engine.ts`
  - `areSpeciesCompatible(species1, species2): CompatibilityResult`
  - `validateNewFishCompatibility(newSpecies, existingFish, speciesMap): ValidationResult`

- [ ] Create `src/engines/__tests__/compatibility.engine.spec.ts`

**Verify**: `npm test -- --testPathPattern=compatibility.engine.spec`

---

### 1.4 Implement WaterQualityEngine

- [ ] Create `src/engines/water-quality.engine.ts`
  - `analyzeWaterHealth(params, species[]): WaterAnalysis`
  - `predictNextWaterChange(recentParams, tankVolume): Prediction`

- [ ] Create `src/engines/__tests__/water-quality.engine.spec.ts`

**Verify**: `npm test -- --testPathPattern=water-quality.engine.spec`

---

### 1.5 Register Engines Module

- [ ] Export all engines from `engines.module.ts`
- [ ] Import `EnginesModule` in `app.module.ts`

**Verify**: `npm run build` passes

---

## Phase 2: Integrate Engines into AquariumManager

### 2.1 Expand AquariumApplicationManager

- [ ] Inject 3 Engines into `AquariumApplicationManager`
- [ ] Add `addFishToTank(dto)` using BioloadEngine + CompatibilityEngine
- [ ] Add `logWaterParameters(dto)` using WaterQualityEngine
- [ ] Add `getTankDashboard(tankId)` combining all data

**Verify**: `npm run build` passes

---

### 2.2 Update Controllers

- [ ] Update `TankController` to use expanded `AquariumManager`
- [ ] Add new endpoints if needed for dashboard/analysis

**Verify**: Manual test: `curl http://localhost:3000/tanks/{id}/dashboard`

---

## Phase 3: Deprecate Old Managers (BREAKING)

> ⚠️ This phase removes code. Complete Phase 1-2 testing first.

- [ ] Deprecate `FishManager` methods (mark as deprecated, delegate)
- [ ] Deprecate `WaterParameterManager` methods
- [ ] Update module exports

**Verify**: `npm test` all tests pass

---

## Phase 4: Verification

- [ ] Run all tests: `npm test`
- [ ] Build check: `npm run build`
- [ ] Lint check: `npm run lint`
- [ ] Update `ARCHITECTURE.md` with new Engine section

---

## Done When

- [ ] 3 Engines exist with unit tests
- [ ] `AquariumManager` uses Engines for business logic
- [ ] All tests pass (`npm test`)
- [ ] Build passes (`npm run build`)
