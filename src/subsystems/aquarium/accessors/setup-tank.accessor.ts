import { Injectable, Inject } from '@nestjs/common';
import {
  ISetupTankAccessor,
  GenerateContentConfig,
} from '../contracts/setup-tank.accessor.interface';
import { AI_CLIENT_UTILITY_TOKEN } from '../../../shared/ai/interfaces/ai-client.utility.interface';
import type { IAiClientUtility } from '../../../shared/ai/interfaces/ai-client.utility.interface';

@Injectable()
export class SetupTankAccessor implements ISetupTankAccessor {
  constructor(
    @Inject(AI_CLIENT_UTILITY_TOKEN)
    private readonly aiClient: IAiClientUtility,
  ) {}

  async generateContent(
    prompt: string,
    config: GenerateContentConfig,
  ): Promise<string> {
    const response = await this.aiClient.generateContent(prompt, {
      systemInstruction: config.systemInstruction,
      responseMimeType: 'application/json',
      responseJsonSchema: config.jsonSchema,
    });

    if (!response.text) {
      throw new Error('AI model returned empty response');
    }

    return response.text;
  }
}
