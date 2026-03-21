import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
// import { FishSpeciesController } from './controllers/fish-species.controller';
// import { LivestockController } from './controllers/livestock.controller';
import { PassportModule } from '@nestjs/passport';
import { MembershipModule } from '@subsystems/membership/membership.module';
import { createJwtStrategy } from './strategies/dynamic-jwt.strategy';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TransformInterceptor } from './transform.interceptor';
import { HttpExceptionFilter } from './http-exception.filter';

const UserJwtStrategy = createJwtStrategy('user');
const AdminJwtStrategy = createJwtStrategy('admin');

@Module({
  controllers: [
    AuthController,
    // FishSpeciesController,
    // LivestockController,
  ],
  imports: [MembershipModule, PassportModule],
  providers: [
    UserJwtStrategy,
    AdminJwtStrategy,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class HTTPModule {}
