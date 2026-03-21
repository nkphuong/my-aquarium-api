import { GenerateContentConfig, GenerateContentResponse } from '@google/genai';

export const AI_CLIENT_UTILITY_TOKEN = 'IAiClientUtility';

export interface IAiClientUtility {
  /**
   * Executes an AI request, merging global base configs with specific accessor configs.
   * @param prompt The user prompt
   * @param specificConfig Any specific config for this accessor (e.g. tools, schema)
   */
  generateContent(
    prompt: string,
    specificConfig?: GenerateContentConfig & { model?: string },
  ): Promise<GenerateContentResponse>;
}
