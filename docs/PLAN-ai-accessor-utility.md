# PLAN: AI Accessor Utility Refactoring

## 1. Context & Objective
**Objective:** Unify AI configuration across multiple accessors while supporting divergent AI usage patterns (Structured Output, Function Calling, Search Grounding).
**Architecture:** IDesign (Utilities for cross-cutting infrastructure, Accessors for domain-specific data access).
**Principles:** SOLID (Single Responsibility Principle, Dependency Inversion), DRY.

## 2. Current State vs Future State
- **Current:** `SetupTankAccessor`, `FishSpeciesAccessor` each instantiate `GoogleGenAI` directly, duplicating API key, default model, and core config logic.
- **Future:** A central `AiClientUtility` handles SDK instantiation and core config. Accessors inject this utility and only provide the prompt and their specific overrides (e.g., `responseJsonSchema` or `tools`).

## 3. Task Breakdown

### Phase 1: Create the AI Utility (Infrastructure)
- [ ] **Create Interface:** `src/shared/ai/interfaces/ai-client.utility.interface.ts`
  - Define `IAiClientUtility` with `generateContent(prompt, specificConfig?)`.
  - Export injection token `AI_CLIENT_UTILITY_TOKEN`.
- [ ] **Create Implementation:** `src/shared/ai/ai-client.utility.ts`
  - Implement `AiClientUtility`.
  - Initialize `GoogleGenAI` with `process.env.GEMINI_API_KEY`.
  - Provide base config (temperature, topK, default model).
  - Merge `specificConfig` with base config before calling the SDK.
- [ ] **Register Utility:** `src/shared/shared.module.ts` (or equivalent global module).
  - Provide `AiClientUtility` using the `AI_CLIENT_UTILITY_TOKEN`.
  - Export the provider so `AccessorsModule` can use it.

### Phase 2: Refactor Accessors (Domain)
- [ ] **Update `SetupTankAccessor`:** `src/accessors/ai/setup-tank.accessor.ts`
  - Remove direct `GoogleGenAI` dependency.
  - Inject `AI_CLIENT_UTILITY_TOKEN`.
  - Update execution logic to use the utility.
- [ ] **Update `FishSpeciesAccessor`:** `src/accessors/ai/fish-species.accessor.ts`
  - Remove direct `GoogleGenAI` dependency.
  - Inject `AI_CLIENT_UTILITY_TOKEN`.
  - Update execution logic to use the utility.
- [ ] **Update `AccessorsModule`:** `src/accessors/accessors.module.ts`
  - Ensure the utility is available to the accessors.

### Phase 3: Verification
- [ ] **Dependency Injection Check:** Ensure NestJS boots properly.
- [ ] **Code Quality:** Ensure no duplicated SDK initialization remains.

## 4. Agent Assignments
- **Backend Specialist:** Will execute this plan, focusing on clean TypeScript code adhering to NestJS and IDesign best practices.
