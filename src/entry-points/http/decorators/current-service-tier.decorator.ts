import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ServiceTier } from '@subsystems/subscription/dtos/service-tier.dto';

export const CurrentServiceTier = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ServiceTier => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { serviceTier?: ServiceTier }>();
    return request.serviceTier ?? ServiceTier.free();
  },
);
