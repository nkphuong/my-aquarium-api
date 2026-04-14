import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
// import { FishSpeciesController } from './controllers/fish-species.controller';
// import { LivestockController } from './controllers/livestock.controller';
import { PassportModule } from '@nestjs/passport';
import { MembershipModule } from '@subsystems/membership/membership.module';
import { SubscriptionModule } from '@subsystems/subscription/subscription.module';
import { AuthorizationModule } from '@subsystems/authorization/authorization.module';
import { AquariumModule } from '@subsystems/aquarium/aquarium.module';
import { ChatModule } from '@subsystems/chat/chat.module';
import { ChatController } from './controllers/chat.controller';
import { createJwtStrategy } from './strategies/dynamic-jwt.strategy';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TransformInterceptor } from './transform.interceptor';
import { HttpExceptionFilter } from './http-exception.filter';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminPackageController } from './controllers/admin-package.controller';
import { AdminRoleController } from './controllers/admin-role.controller';
import { AdminUserManageController } from './controllers/admin-user-manage.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { ChangePasswordController } from './controllers/change-password.controller';
import { VerifyAccountController } from './controllers/verify-account.controller';
import { CompatibilityController } from './controllers/compatibility.controller';

const UserJwtStrategy = createJwtStrategy('user');
const AdminJwtStrategy = createJwtStrategy('admin');

@Module({
  controllers: [
    AuthController,
    AdminAuthController,
    AdminPackageController,
    AdminRoleController,
    AdminUserManageController,
    SubscriptionController,
    ChangePasswordController,
    VerifyAccountController,
    ChatController,
    CompatibilityController,
    // FishSpeciesController,
    // LivestockController,
  ],
  imports: [
    MembershipModule,
    SubscriptionModule,
    AuthorizationModule,
    AquariumModule,
    ChatModule,
    PassportModule,
  ],
  providers: [
    UserJwtStrategy,
    AdminJwtStrategy,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class HTTPModule {}
