export interface ISecurityUtility {
  hashPassword(plainText: string): Promise<string>;
  verifyPassword(plainText: string, hash: string): Promise<boolean>;
  signJwt(payload: Record<string, unknown>, secret: string, expiresIn: string): string;
  generateRefreshToken(): string;
  hashToken(token: string): string;
}
