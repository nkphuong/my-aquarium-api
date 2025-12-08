import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ValidateTokenUseCase } from '@application/use-cases/auth/validate-token.use-case';
import { UnauthorizedException } from '@domain/exceptions/auth.exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly validateTokenUseCase: ValidateTokenUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const user = await this.validateTokenUseCase.execute({
        accessToken: token,
      });
      request.user = user; // Attach user to request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
