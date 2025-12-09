import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { SupabaseModule } from '@supabase/supabase.module';
import { FishModule } from '@modules/fish/fish.module';
import { AuthModule } from '@modules/auth/auth.module';
import { TankModule } from '@modules/tank/tank.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    SupabaseModule,
    FishModule,
    AuthModule,
    TankModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
