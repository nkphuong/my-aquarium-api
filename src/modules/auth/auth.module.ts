import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthManager } from './managers/auth.manager';
import { UserAccessor } from './accessors/user.accessor';
import { USER_ACCESSOR } from './accessors/user.accessor.interface';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretKey', // TODO: Use env
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthManager,
    {
      provide: USER_ACCESSOR,
      useClass: UserAccessor,
    },
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [USER_ACCESSOR, AuthManager, JwtAuthGuard, JwtModule],
})
export class AuthModule { }
