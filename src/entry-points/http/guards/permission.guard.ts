import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import type { IAuthorizationManager } from '@subsystems/authorization/contracts/authorization.manager.interface';
import { AUTHORIZATION_MANAGER } from '@subsystems/authorization/contracts/authorization.manager.interface';
import { REQUIRES_PERMISSION_KEY } from '../decorators/requires-permission.decorator';
import { PermissionDeniedException } from '@subsystems/authorization/exceptions/permission-denied.exception';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTHORIZATION_MANAGER)
    private readonly authorizationManager: IAuthorizationManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      REQUIRES_PERMISSION_KEY,
      context.getHandler(),
    );
    if (!requiredPermission) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { userId: number } }>();
    const adminId = request.user?.userId;
    if (!adminId) return false;

    const allowed = await this.authorizationManager.hasPermission(
      adminId,
      requiredPermission,
    );
    if (!allowed) {
      throw new PermissionDeniedException(requiredPermission);
    }

    return true;
  }
}
