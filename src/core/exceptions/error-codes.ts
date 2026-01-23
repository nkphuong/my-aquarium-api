/**
 * Centralized error code catalog
 * Use these codes in frontend for programmatic error handling
 */
export const ErrorCodes = {
    // ====== HTTP 400 - Bad Request ======
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_REQUEST: 'INVALID_REQUEST',

    // ====== HTTP 401 - Unauthorized ======
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',

    // ====== HTTP 403 - Forbidden ======
    FORBIDDEN: 'FORBIDDEN',
    ACCESS_DENIED: 'ACCESS_DENIED',

    // ====== HTTP 404 - Not Found ======
    ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND',
    TANK_NOT_FOUND: 'TANK_NOT_FOUND',
    FISH_NOT_FOUND: 'FISH_NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',

    // ====== HTTP 409 - Conflict ======
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',

    // ====== HTTP 422 - Unprocessable Entity (Business Rules) ======
    BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
    TANK_OVERCAPACITY: 'TANK_OVERCAPACITY',
    FISH_INCOMPATIBLE: 'FISH_INCOMPATIBLE',
    WATER_PARAM_OUT_OF_RANGE: 'WATER_PARAM_OUT_OF_RANGE',
    TEMPERAMENT_CONFLICT: 'TEMPERAMENT_CONFLICT',
    TERRITORY_CONFLICT: 'TERRITORY_CONFLICT',

    // ====== HTTP 500 - Internal Server Error ======
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    TRANSACTION_FAILED: 'TRANSACTION_FAILED',
    DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
