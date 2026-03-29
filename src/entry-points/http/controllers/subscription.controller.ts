import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CurrentServiceTier } from '../decorators/current-service-tier.decorator';
import type { ISubscriptionManager } from '@subsystems/subscription/contracts/subscription.manager.interface';
import { SUBSCRIPTION_MANAGER } from '@subsystems/subscription/contracts/subscription.manager.interface';
import { ServiceTier } from '@subsystems/subscription/dtos/service-tier.dto';

class SubscribeDto {
  packageSlug!: string;
}

@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    @Inject(SUBSCRIPTION_MANAGER)
    private readonly subscriptionManager: ISubscriptionManager,
  ) {}

  @Get('my-tier')
  async getMyTier(
    @CurrentUser() user: { userId: number },
    @CurrentServiceTier() tier: ServiceTier,
  ) {
    if (!tier.packageSlug) {
      const resolved = await this.subscriptionManager.resolveUserServiceTier(
        user.userId,
      );
      return {
        packageSlug: resolved.packageSlug,
        features: Object.fromEntries(resolved.features),
      };
    }
    return {
      packageSlug: tier.packageSlug,
      features: Object.fromEntries(tier.features),
    };
  }

  @Post('subscribe')
  async subscribe(
    @CurrentUser() user: { userId: number },
    @Body() dto: SubscribeDto,
  ) {
    return this.subscriptionManager.subscribe(user.userId, dto.packageSlug);
  }

  @Delete('cancel')
  async cancel(@CurrentUser() user: { userId: number }) {
    return this.subscriptionManager.cancelSubscription(user.userId);
  }
}
