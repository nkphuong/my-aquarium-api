import { Injectable, Inject } from '@nestjs/common';
import { IChatManager } from '../contracts/chat.manager.interface';
import { ChatGuardrailEngine } from '../engines/chat-guardrail.engine';
import { ChatPromptEngine } from '../engines/chat-prompt.engine';
import type { IChatContextAccessor } from '../contracts/chat-context.accessor.interface';
import { CHAT_CONTEXT_ACCESSOR } from '../contracts/chat-context.accessor.interface';
import type { IChatAiAccessor } from '../contracts/chat-ai.accessor.interface';
import { CHAT_AI_ACCESSOR } from '../contracts/chat-ai.accessor.interface';

@Injectable()
export class ChatManager implements IChatManager {
  constructor(
    private readonly guardrailEngine: ChatGuardrailEngine,
    private readonly promptEngine: ChatPromptEngine,
    @Inject(CHAT_CONTEXT_ACCESSOR)
    private readonly contextAccessor: IChatContextAccessor,
    @Inject(CHAT_AI_ACCESSOR)
    private readonly aiAccessor: IChatAiAccessor,
  ) {}

  async *sendMessage(
    userId: number,
    message: string,
  ): AsyncGenerator<string, void, unknown> {
    // 1. Check topic guardrails
    const topicCheck = this.guardrailEngine.isTopicAllowed(message);
    if (!topicCheck.allowed) {
      yield topicCheck.redirectMessage!;
      return;
    }

    // 2. Gather user's aquarium context
    const context = await this.contextAccessor.gatherUserContext(userId);

    // 3. Build system instruction with user context
    const systemInstruction =
      this.promptEngine.buildSystemInstruction(context);

    // 4. Ensure chat session exists
    this.aiAccessor.getOrCreateSession(userId, systemInstruction);

    // 5. Stream AI response
    yield* this.aiAccessor.sendMessageStream(userId, message);
  }

  clearSession(userId: number): void {
    this.aiAccessor.clearSession(userId);
  }
}
