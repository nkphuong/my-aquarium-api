export interface IChatAiAccessor {
  getOrCreateSession(userId: number, systemInstruction: string): void;

  sendMessageStream(
    userId: number,
    message: string,
  ): AsyncGenerator<string, void, unknown>;

  clearSession(userId: number): void;
}

export const CHAT_AI_ACCESSOR = Symbol('IChatAiAccessor');
