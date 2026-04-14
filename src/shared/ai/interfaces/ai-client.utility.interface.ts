import {
  GenerateContentConfig,
  GenerateContentResponse,
  Chat,
} from '@google/genai';

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

  /**
   * Creates a multi-turn chat session with system instruction.
   * @param systemInstruction The system-level instruction for the conversation
   * @param specificConfig Optional config overrides (temperature, model, etc.)
   * @returns A Chat instance supporting sendMessage and sendMessageStream
   */
  createChatSession(
    systemInstruction: string,
    specificConfig?: GenerateContentConfig & { model?: string },
  ): Chat;
}
