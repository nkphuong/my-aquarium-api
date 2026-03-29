import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ISessionManager } from '@subsystems/membership/contracts/session.manager.interface';

export function createJwtStrategy(name: string) {
  @Injectable()
  class DynamicJwtStrategy extends PassportStrategy(Strategy, name) {
    constructor(
      @Inject('ISessionManager')
      public readonly sessionManager: ISessionManager,
      configService: ConfigService,
    ) {
      const provider = configService.get<string>(
        `auth.guards.${name}.provider`,
      );
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey:
          configService.get<string>(`auth.providers.${provider}.secret`) ?? '',
      });
    }

    async validate(
      payload: Record<string, unknown>,
    ): Promise<Record<string, unknown>> {
      return await this.sessionManager.validateToken(payload, name);
    }
  }
  return DynamicJwtStrategy;
}
