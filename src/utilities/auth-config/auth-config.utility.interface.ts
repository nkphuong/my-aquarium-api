export interface IAuthConfigUtility {
  getSecret(type?: string): string;
  getAccessTokenExpiration(type?: string): string;
  getRefreshTokenExpiration(type?: string): string;
  getRefreshTokenExpirationDate(type?: string): Date;
}
