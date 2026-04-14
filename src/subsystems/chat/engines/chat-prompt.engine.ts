import { Injectable } from '@nestjs/common';
import { UserAquariumContext } from '../types/context.types';

@Injectable()
export class ChatPromptEngine {
  buildSystemInstruction(context: UserAquariumContext): string {
    const personality = this.getPersonalityDirective();
    const guardrails = this.getTopicGuardrailDirective();
    const tankContext = this.formatTankContext(context);

    return [personality, guardrails, tankContext].filter(Boolean).join('\n\n');
  }

  private getPersonalityDirective(): string {
    return `You are Finley, a friendly and knowledgeable AI aquarium companion.

Personality:
- You are warm, encouraging, and genuinely care about the user's fish and tanks
- You speak like a helpful friend who happens to be an aquarium expert, not a textbook
- You use occasional fish-related humor naturally (don't force it)
- You celebrate the user's successes and gently guide them when things need attention
- You are patient with beginners and respect experienced fishkeepers' knowledge
- When you don't know something specific, you say so honestly

Language:
- Respond in the same language the user writes in
- If the user writes in Vietnamese, respond in Vietnamese
- Keep responses conversational and concise — avoid walls of text
- Use short paragraphs and bullet points for clarity when listing things

Safety:
- For serious fish health emergencies, suggest consulting a local fish store or aquatic veterinarian
- Never recommend medications without appropriate context about dosing and species sensitivity
- Be clear about the difference between observation-based advice and professional diagnosis`;
  }

  private getTopicGuardrailDirective(): string {
    return `Topic scope:
- You ONLY discuss aquarium and fishkeeping topics: fish care, water chemistry, tank setup, equipment, plants, diseases, cycling, breeding, compatibility, feeding, maintenance, aquascaping, and related subjects
- If asked about non-aquarium topics (politics, finance, personal relationships, etc.), politely redirect: "I'm your aquarium buddy! I'm best at helping with fish and tank questions. What can I help you with for your tanks?"
- You may use general knowledge to make aquarium analogies but always bring the conversation back to fishkeeping`;
  }

  formatTankContext(context: UserAquariumContext): string {
    if (context.tanks.length === 0) {
      return `User's aquarium setup:
The user hasn't set up any tanks yet. You can help them plan their first aquarium!`;
    }

    const sections: string[] = [
      `User's aquarium setup (${context.tanks.length} tank${context.tanks.length > 1 ? 's' : ''}):`,
    ];

    for (const tank of context.tanks) {
      const lines: string[] = [
        `\n--- Tank: "${tank.name}" ---`,
        `  Style: ${tank.style || 'not specified'}`,
        `  Volume: ${tank.volume_liters ? `${tank.volume_liters}L` : 'not recorded'}`,
        `  Dimensions: ${tank.length}×${tank.width}×${tank.height} cm`,
      ];

      if (tank.setup_date) {
        const setupDate = new Date(tank.setup_date);
        const daysSinceSetup = Math.floor(
          (Date.now() - setupDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        lines.push(
          `  Age: ${daysSinceSetup} days (setup ${setupDate.toISOString().split('T')[0]})`,
        );
      }

      if (tank.substrate) lines.push(`  Substrate: ${tank.substrate}`);
      if (tank.filter_type) lines.push(`  Filter: ${tank.filter_type}`);

      // Fish in this tank
      const fish = context.fishByTank.get(tank.id) || [];
      if (fish.length > 0) {
        lines.push(`  Fish (${fish.length}):`);
        const speciesCounts = new Map<string, number>();
        for (const f of fish) {
          speciesCounts.set(
            f.species,
            (speciesCounts.get(f.species) || 0) + 1,
          );
        }
        for (const [species, count] of speciesCounts) {
          lines.push(`    - ${species} × ${count}`);
        }
      } else {
        lines.push(`  Fish: none yet`);
      }

      // Livestock in this tank
      const livestock = context.livestockByTank.get(tank.id) || [];
      if (livestock.length > 0) {
        lines.push(`  Other livestock (${livestock.length}):`);
        for (const l of livestock) {
          lines.push(
            `    - ${l.name}${l.quantity > 1 ? ` × ${l.quantity}` : ''}`,
          );
        }
      }

      // Latest water parameters
      const waterParam = context.latestWaterParams.get(tank.id);
      if (waterParam) {
        const testedDate = waterParam.tested_at
          ? new Date(waterParam.tested_at)
          : null;
        const daysSinceTest = testedDate
          ? Math.floor(
              (Date.now() - testedDate.getTime()) / (1000 * 60 * 60 * 24),
            )
          : null;

        lines.push(
          `  Last water test${daysSinceTest !== null ? ` (${daysSinceTest} days ago)` : ''}:`,
        );
        if (waterParam.temperature)
          lines.push(`    Temperature: ${waterParam.temperature}°C`);
        if (waterParam.ph) lines.push(`    pH: ${waterParam.ph}`);
        if (waterParam.ammonia !== undefined && waterParam.ammonia !== null)
          lines.push(`    Ammonia: ${waterParam.ammonia} ppm`);
        if (waterParam.nitrite !== undefined && waterParam.nitrite !== null)
          lines.push(`    Nitrite: ${waterParam.nitrite} ppm`);
        if (waterParam.nitrate !== undefined && waterParam.nitrate !== null)
          lines.push(`    Nitrate: ${waterParam.nitrate} ppm`);
        if (waterParam.gh) lines.push(`    GH: ${waterParam.gh}`);
        if (waterParam.kh) lines.push(`    KH: ${waterParam.kh}`);
      } else {
        lines.push(`  Water tests: no records yet`);
      }

      sections.push(lines.join('\n'));
    }

    // Fish species reference data (summarized)
    if (context.fishSpecies.length > 0) {
      const speciesInTanks = new Set<string>();
      for (const fish of context.fishByTank.values()) {
        for (const f of fish) {
          speciesInTanks.add(f.species);
        }
      }

      const relevantSpecies = context.fishSpecies.filter(
        (s) => speciesInTanks.has(s.name_en) || speciesInTanks.has(s.name_vn),
      );

      if (relevantSpecies.length > 0) {
        sections.push('\nSpecies reference for fish in user\'s tanks:');
        for (const s of relevantSpecies.slice(0, 10)) {
          const details: string[] = [`  ${s.name_en || s.name_vn}:`];
          if (s.temp_min && s.temp_max)
            details.push(`    Temp: ${s.temp_min}–${s.temp_max}°C`);
          if (s.ph_min && s.ph_max)
            details.push(`    pH: ${s.ph_min}–${s.ph_max}`);
          if (s.temperament) details.push(`    Temperament: ${s.temperament}`);
          if (s.care_level) details.push(`    Care: ${s.care_level}`);
          if (s.diet_type) details.push(`    Diet: ${s.diet_type}`);
          if (s.is_schooling)
            details.push(
              `    Schooling: yes (min ${s.min_school_size || 6})`,
            );
          sections.push(details.join('\n'));
        }
      }
    }

    return sections.join('\n');
  }
}
