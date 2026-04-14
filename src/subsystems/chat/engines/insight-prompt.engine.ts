import { Injectable } from '@nestjs/common';
import { UserAquariumContext, AIInsight } from '../types/context.types';

@Injectable()
export class InsightPromptEngine {
  getInsightSystemInstruction(): string {
    return `You are Finley, a friendly AI aquarium companion generating personalized insights for a user's dashboard.

Rules:
- Generate exactly 3 insights as a JSON array
- Insights should be gentle observations and helpful tips, NOT task lists or demands
- Tone: warm, encouraging, like a knowledgeable friend noticing something
- Prioritize insights based on what would genuinely help the user's fish thrive
- Each insight should feel personal to their specific setup
- If tanks are new (< 30 days), focus on cycling and patience
- If water params exist, comment on trends or good maintenance
- If no data exists, give encouraging starter tips

Priority levels:
- "critical": immediate fish health risk (rare, only if data shows danger)
- "warning": something to keep an eye on soon
- "suggestion": helpful tip to improve something
- "info": positive observation or fun fact about their setup

Respond ONLY with a valid JSON array, no markdown or explanation.`;
  }

  buildInsightPrompt(context: UserAquariumContext): string {
    const parts: string[] = [];

    if (context.tanks.length === 0) {
      parts.push(
        'The user has no tanks set up yet. Generate 3 encouraging insights for someone starting their aquarium journey.',
      );
      return parts.join('\n');
    }

    parts.push(
      `The user has ${context.tanks.length} tank(s). Here is their current setup:`,
    );

    for (const tank of context.tanks) {
      const tankLines: string[] = [`\nTank: "${tank.name}"`];

      if (tank.style) tankLines.push(`Style: ${tank.style}`);
      if (tank.volume_liters) tankLines.push(`Volume: ${tank.volume_liters}L`);

      if (tank.setup_date) {
        const daysSince = Math.floor(
          (Date.now() - new Date(tank.setup_date).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        tankLines.push(`Age: ${daysSince} days`);
      }

      const fish = context.fishByTank.get(tank.id) || [];
      if (fish.length > 0) {
        const speciesCounts = new Map<string, number>();
        for (const f of fish) {
          speciesCounts.set(
            f.species,
            (speciesCounts.get(f.species) || 0) + 1,
          );
        }
        tankLines.push(
          `Fish: ${[...speciesCounts.entries()].map(([s, c]) => `${s} ×${c}`).join(', ')}`,
        );
      } else {
        tankLines.push('Fish: none');
      }

      const waterParam = context.latestWaterParams.get(tank.id);
      if (waterParam) {
        const params: string[] = [];
        if (waterParam.temperature)
          params.push(`temp=${waterParam.temperature}°C`);
        if (waterParam.ph) params.push(`pH=${waterParam.ph}`);
        if (waterParam.ammonia !== undefined && waterParam.ammonia !== null)
          params.push(`NH3=${waterParam.ammonia}`);
        if (waterParam.nitrite !== undefined && waterParam.nitrite !== null)
          params.push(`NO2=${waterParam.nitrite}`);
        if (waterParam.nitrate !== undefined && waterParam.nitrate !== null)
          params.push(`NO3=${waterParam.nitrate}`);
        tankLines.push(`Latest water params: ${params.join(', ')}`);

        if (waterParam.tested_at) {
          const daysSinceTest = Math.floor(
            (Date.now() - new Date(waterParam.tested_at).getTime()) /
              (1000 * 60 * 60 * 24),
          );
          tankLines.push(`Days since last test: ${daysSinceTest}`);
        }
      }

      parts.push(tankLines.join('\n'));
    }

    // Current month for seasonal context
    const month = new Date().toLocaleString('en', { month: 'long' });
    parts.push(`\nCurrent month: ${month}`);

    parts.push(
      '\nGenerate 3 personalized insights based on this data. Include the tankName field when an insight relates to a specific tank.',
    );

    return parts.join('\n');
  }

  getInsightJsonSchema(): object {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          priority: {
            type: 'string',
            enum: ['info', 'suggestion', 'warning', 'critical'],
          },
          title: { type: 'string' },
          description: { type: 'string' },
          tankName: { type: 'string' },
          actionLabel: { type: 'string' },
        },
        required: ['id', 'priority', 'title', 'description', 'actionLabel'],
      },
    };
  }

  parseInsights(rawJson: string): AIInsight[] {
    const parsed = JSON.parse(rawJson);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .slice(0, 3)
      .map((item: Record<string, unknown>, index: number) => ({
        id: String(item.id || `insight-${index + 1}`),
        priority: this.validatePriority(item.priority),
        title: String(item.title || ''),
        description: String(item.description || ''),
        tankName: item.tankName ? String(item.tankName) : undefined,
        actionLabel: String(item.actionLabel || 'Learn more'),
      }));
  }

  private validatePriority(
    value: unknown,
  ): 'info' | 'suggestion' | 'warning' | 'critical' {
    const validPriorities = ['info', 'suggestion', 'warning', 'critical'];
    if (typeof value === 'string' && validPriorities.includes(value)) {
      return value as 'info' | 'suggestion' | 'warning' | 'critical';
    }
    return 'info';
  }
}
