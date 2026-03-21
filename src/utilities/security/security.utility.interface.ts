export interface ISecurityUtility {
  verifyPassword(plainText: string, hash: string): Promise<boolean>;
  generateToken(memberId: number): string;
  hashPassword(plainText: string): Promise<string>;
  generateRefreshToken(): string;
  hashToken(token: string): string;
  getAccessTokenExpiration(): string;
  getRefreshTokenExpiration(): string;
  getRefreshTokenExpirationDate(): Date;
}
