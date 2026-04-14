export interface IChatManager {
  sendMessage(
    userId: number,
    message: string,
  ): AsyncGenerator<string, void, unknown>;

  clearSession(userId: number): void;
}

export const CHAT_MANAGER = Symbol('IChatManager');
