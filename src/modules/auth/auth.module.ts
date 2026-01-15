import { Module } from '@nestjs/common';
import { AuthController } from '@presentation/controllers/auth.controller';
import { AuthService } from '@application/services/auth.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';
import { ACCESS_TOKEN_EXPIRES_IN } from '@application/services/auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secretKey', // TODO: Use env
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
