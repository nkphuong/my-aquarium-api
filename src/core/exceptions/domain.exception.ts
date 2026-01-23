import { HttpStatus } from '@nestjs/common';

/**
 * Base class for all domain exceptions
 * Each exception must define its code and HTTP status
 */
export abstract class DomainException extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get additional details for error response
   * Override in subclasses to provide context-specific data
   */
  getDetails(): Record<string, unknown> | undefined {
    return undefined;
  }
}

/**
 * Entity not found in database
 * HTTP 404
 */
export class EntityNotFoundException extends DomainException {
  readonly code = 'ENTITY_NOT_FOUND';
  readonly httpStatus = HttpStatus.NOT_FOUND;

  constructor(
    public readonly entity: string,
    public readonly id: number | string,
  ) {
    super(`${entity} with id ${id} not found`);
  }

  getDetails() {
    return { entity: this.entity, id: this.id };
  }
}

/**
 * Validation error from request
 * HTTP 400
 */
export class ValidationException extends DomainException {
  readonly code = 'VALIDATION_ERROR';
  readonly httpStatus = HttpStatus.BAD_REQUEST;

  constructor(
    message: string,
    public readonly violations?: Array<{ field: string; message: string }>,
  ) {
    super(message);
  }

  getDetails() {
    return this.violations ? { violations: this.violations } : undefined;
  }
}

/**
 * Database transaction failed
 * HTTP 500
 */
export class TransactionException extends DomainException {
  readonly code = 'TRANSACTION_FAILED';
  readonly httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(
    public readonly originalError: string,
  ) {
    super(`Transaction failed: ${originalError}`);
  }

  getDetails() {
    return { originalError: this.originalError };
  }
}
