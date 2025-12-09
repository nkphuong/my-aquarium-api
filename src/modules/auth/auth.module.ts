import { Module } from '@nestjs/common';
import { AuthController } from '@presentation/controllers/auth.controller';
import { AuthService } from '@application/services/auth.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { SupabaseAuthService } from '@infrastructure/auth/supabase-auth.service';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { SupabaseModule } from '@supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [
    // Service
    AuthService,

    // Infrastructure
    UserRepository,
    SupabaseAuthService,

    // Guard
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, AuthService], // Export for other modules
})
export class AuthModule {}
