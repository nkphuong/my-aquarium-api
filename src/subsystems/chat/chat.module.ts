import { Module } from '@nestjs/common';
import { AquariumModule } from '@subsystems/aquarium/aquarium.module';

// Engines
import { ChatGuardrailEngine } from './engines/chat-guardrail.engine';
import { ChatPromptEngine } from './engines/chat-prompt.engine';
import { InsightPromptEngine } from './engines/insight-prompt.engine';

// Accessors
import { ChatContextAccessor } from './accessors/chat-context.accessor';
import { ChatAiAccessor } from './accessors/chat-ai.accessor';
import { CHAT_CONTEXT_ACCESSOR } from './contracts/chat-context.accessor.interface';
import { CHAT_AI_ACCESSOR } from './contracts/chat-ai.accessor.interface';

// Managers
import { ChatManager } from './managers/chat.manager';
import { InsightManager } from './managers/insight.manager';
import { CHAT_MANAGER } from './contracts/chat.manager.interface';
import { INSIGHT_MANAGER } from './contracts/insight.manager.interface';

@Module({
  imports: [AquariumModule],
  providers: [
    // Engines — pure business logic
    ChatGuardrailEngine,
    ChatPromptEngine,
    InsightPromptEngine,

    // Accessors — data access / AI I/O
    { provide: CHAT_CONTEXT_ACCESSOR, useClass: ChatContextAccessor },
    { provide: CHAT_AI_ACCESSOR, useClass: ChatAiAccessor },

    // Managers — orchestration
    { provide: CHAT_MANAGER, useClass: ChatManager },
    { provide: INSIGHT_MANAGER, useClass: InsightManager },
  ],
  exports: [CHAT_MANAGER, INSIGHT_MANAGER],
})
export class ChatModule {}
