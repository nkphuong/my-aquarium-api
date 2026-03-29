export interface IAuthConfigUtility {
  getSecret(type?: string): string;
  getAccessTokenExpiration(type?: string): string;
  getRefreshTokenExpiration(type?: string): string;
  getAccessTokenExpirationDate(type?: string): Date;
  getRefreshTokenExpirationDate(type?: string): Date;
  getAccountVerificationExpireInHours(): number;
  getPasswordResetExpireInHours(): number;
  getGuardType(type?: string): string;
}
