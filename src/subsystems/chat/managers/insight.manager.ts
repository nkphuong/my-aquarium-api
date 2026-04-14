import { Injectable, Inject } from '@nestjs/common';
import { IInsightManager } from '../contracts/insight.manager.interface';
import { InsightPromptEngine } from '../engines/insight-prompt.engine';
import type { IChatContextAccessor } from '../contracts/chat-context.accessor.interface';
import { CHAT_CONTEXT_ACCESSOR } from '../contracts/chat-context.accessor.interface';
import {
  AI_CLIENT_UTILITY_TOKEN,
  type IAiClientUtility,
} from '../../../shared/ai/interfaces/ai-client.utility.interface';
import { AIInsight } from '../types/context.types';

interface CachedInsights {
  insights: AIInsight[];
  cachedAt: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class InsightManager implements IInsightManager {
  private readonly cache = new Map<number, CachedInsights>();

  constructor(
    private readonly insightPromptEngine: InsightPromptEngine,
    @Inject(CHAT_CONTEXT_ACCESSOR)
    private readonly contextAccessor: IChatContextAccessor,
    @Inject(AI_CLIENT_UTILITY_TOKEN)
    private readonly aiClient: IAiClientUtility,
  ) {}

  async getInsights(userId: number): Promise<AIInsight[]> {
    // Check cache
    const cached = this.cache.get(userId);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return cached.insights;
    }

    // Gather user context
    const context = await this.contextAccessor.gatherUserContext(userId);

    // Build prompts
    const systemInstruction =
      this.insightPromptEngine.getInsightSystemInstruction();
    const prompt = this.insightPromptEngine.buildInsightPrompt(context);

    // Call AI with structured JSON output
    const response = await this.aiClient.generateContent(prompt, {
      systemInstruction,
      responseMimeType: 'application/json',
      responseJsonSchema: this.insightPromptEngine.getInsightJsonSchema(),
    });

    if (!response.text) {
      return [];
    }

    // Parse and validate
    const insights = this.insightPromptEngine.parseInsights(response.text);

    // Cache the result
    this.cache.set(userId, {
      insights,
      cachedAt: Date.now(),
    });

    return insights;
  }
}
