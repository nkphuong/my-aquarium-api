import { Module, Global } from '@nestjs/common';
import { AiClientUtility } from './ai-client.utility';
import { AI_CLIENT_UTILITY_TOKEN } from './interfaces/ai-client.utility.interface';

@Global()
@Module({
  providers: [
    {
      provide: AI_CLIENT_UTILITY_TOKEN,
      useClass: AiClientUtility,
    },
  ],
  exports: [AI_CLIENT_UTILITY_TOKEN],
})
export class AiModule {}
