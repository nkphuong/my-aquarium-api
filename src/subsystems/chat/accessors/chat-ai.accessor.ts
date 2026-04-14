import { Injectable, Inject } from '@nestjs/common';
import { Chat } from '@google/genai';
import { IChatAiAccessor } from '../contracts/chat-ai.accessor.interface';
import {
  AI_CLIENT_UTILITY_TOKEN,
  type IAiClientUtility,
} from '../../../shared/ai/interfaces/ai-client.utility.interface';

@Injectable()
export class ChatAiAccessor implements IChatAiAccessor {
  private readonly sessions = new Map<number, Chat>();

  constructor(
    @Inject(AI_CLIENT_UTILITY_TOKEN)
    private readonly aiClient: IAiClientUtility,
  ) {}

  getOrCreateSession(userId: number, systemInstruction: string): void {
    if (!this.sessions.has(userId)) {
      const chat = this.aiClient.createChatSession(systemInstruction, {
        temperature: 0.8,
      });
      this.sessions.set(userId, chat);
    }
  }

  async *sendMessageStream(
    userId: number,
    message: string,
  ): AsyncGenerator<string, void, unknown> {
    const session = this.sessions.get(userId);
    if (!session) {
      throw new Error('Chat session not initialized');
    }

    const response = await session.sendMessageStream({ message });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }

  clearSession(userId: number): void {
    this.sessions.delete(userId);
  }
}
