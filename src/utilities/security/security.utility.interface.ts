export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export interface HashedToken {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface ISecurityUtility {
  hashPassword(plainText: string): Promise<string>;
  verifyPassword(plainText: string, hash: string): Promise<boolean>;
  signJwt(
    payload: Record<string, unknown>,
    secret: string,
    expiresIn: string,
  ): string;
  generateRefreshToken(): string;
  hashToken(token: string): string;
  generateAuthTokenPair(
    type: string,
    payload: Record<string, unknown>,
  ): AuthTokenPair;
  generateTimedToken(expireInHours: number): HashedToken;
  generateToken(): string;
}
