import { Module } from '@nestjs/common';
import { AuthController } from '@presentation/controllers/auth.controller';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { ValidateTokenUseCase } from '@application/use-cases/auth/validate-token.use-case';
import { GetCurrentUserUseCase } from '@application/use-cases/auth/get-current-user.use-case';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { SupabaseAuthService } from '@infrastructure/auth/supabase-auth.service';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { SupabaseModule } from '@supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [
    // Use Cases
    RegisterUseCase,
    LoginUseCase,
    ValidateTokenUseCase,
    GetCurrentUserUseCase,

    // Infrastructure
    UserRepository,
    SupabaseAuthService,

    // Guard
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, ValidateTokenUseCase], // Export for other modules
})
export class AuthModule {}
