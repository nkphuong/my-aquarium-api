import type { MustVerifyEmail } from '../contracts/must-verify-email.interface';

/**
 * Runtime type guard — checks whether an entity implements the MustVerifyEmail contract.
 * TS interfaces are erased at runtime, so we duck-type the two required methods.
 */
export function mustVerifyEmail(entity: unknown): entity is MustVerifyEmail {
  const obj = entity as Record<string, unknown>;
  return (
    typeof obj?.hasVerifiedEmail === 'function' &&
    typeof obj?.markEmailAsVerified === 'function'
  );
}
