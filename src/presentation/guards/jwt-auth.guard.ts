import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException, // ← NestJS built-in exception
} from '@nestjs/common';
import { AuthService } from '@application/services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided'); // ← Returns HTTP 401
    }

    try {
      const user = await this.authService.validateToken(token);
      request.user = user; // Attach user to request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token'); // ← Returns HTTP 401
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
