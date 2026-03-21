/**
 * Implement this interface on authenticatable entities that require
 * email verification before access is granted (like Laravel's MustVerifyEmail).
 *
 * Entities that do NOT implement this interface will skip verification entirely.
 */
export interface MustVerifyEmail {
  email: string;
  verifiedAt?: Date;

  hasVerifiedEmail(): boolean;
  markEmailAsVerified(): void;
}
