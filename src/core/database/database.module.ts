import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Global()
@Module({
  imports: [MikroOrmModule.forRoot()],
  providers: [],
})
export class DatabaseModule {}
