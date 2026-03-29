import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import type { ISubscriptionManager } from '@subsystems/subscription/contracts/subscription.manager.interface';
import { SUBSCRIPTION_MANAGER } from '@subsystems/subscription/contracts/subscription.manager.interface';
import { ServiceTier } from '@subsystems/subscription/dtos/service-tier.dto';
import { REQUIRES_FEATURE_KEY } from '../decorators/requires-feature.decorator';
import { FeatureNotAvailableException } from '@subsystems/subscription/exceptions/feature-not-available.exception';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(SUBSCRIPTION_MANAGER)
    private readonly subscriptionManager: ISubscriptionManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature = this.reflector.get<string>(
      REQUIRES_FEATURE_KEY,
      context.getHandler(),
    );
    if (!requiredFeature) return true;

    const request = context
      .switchToHttp()
      .getRequest<
        Request & { user?: { userId: number }; serviceTier?: ServiceTier }
      >();
    const userId = request.user?.userId;
    if (!userId) return false;

    if (!request.serviceTier) {
      request.serviceTier =
        await this.subscriptionManager.resolveUserServiceTier(userId);
    }

    if (!request.serviceTier.hasFeature(requiredFeature)) {
      throw new FeatureNotAvailableException(requiredFeature);
    }

    return true;
  }
}
