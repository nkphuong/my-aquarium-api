import { Injectable } from '@nestjs/common';
import {
  GoogleGenAI,
  GenerateContentConfig,
  GenerateContentResponse,
} from '@google/genai';
import { IAiClientUtility } from './interfaces/ai-client.utility.interface';

@Injectable()
export class AiClientUtility implements IAiClientUtility {
  private readonly ai: GoogleGenAI;
  private readonly defaultModel: string;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    // Centralized default model
    this.defaultModel =
      process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';
  }

  async generateContent(
    prompt: string,
    specificConfig?: GenerateContentConfig & { model?: string },
  ): Promise<GenerateContentResponse> {
    // This is the global configuration every request gets by default
    const baseConfig: GenerateContentConfig = {
      temperature: 0.7, // Global default
      topK: 40,
    };

    const { model, ...configOverrides } = specificConfig || {};

    // Merge the global base config with whatever the Accessor passed in
    const finalConfig = {
      ...baseConfig,
      ...configOverrides,
    };

    return await this.ai.models.generateContent({
      model: model || this.defaultModel,
      contents: prompt,
      config: finalConfig,
    });
  }
}
