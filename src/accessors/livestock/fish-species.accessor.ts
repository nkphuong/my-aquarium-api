import { Injectable, Inject, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Accessor } from '@core/mixins/accessor.mixin';
import { FishSpecies } from '@entities/fish-species.entity';
import { IFishSpeciesAccessor } from './interfaces/fish-species.accessor.interface';
import { GenerateContentConfig } from './interfaces/fish-species.accessor.interface';

import { AI_CLIENT_UTILITY_TOKEN } from '@shared/ai/interfaces/ai-client.utility.interface';
import type { IAiClientUtility } from '@shared/ai/interfaces/ai-client.utility.interface';
@Injectable()
export class FishSpeciesAccessor
  extends Accessor(FishSpecies)
  implements IFishSpeciesAccessor {
  private readonly logger = new Logger(FishSpeciesAccessor.name);

  constructor(
    private readonly _em: EntityManager,
    @Inject(AI_CLIENT_UTILITY_TOKEN)
    private readonly aiClient: IAiClientUtility
  ) { super(_em) }

  async findAll(keyword?: string): Promise<FishSpecies[]> {
    const filters: any[] = [];

    if (keyword) {
      const like = `%${keyword}%`;
      filters.push({ name_en: { $ilike: like } });
      filters.push({ name_vn: { $ilike: like } });
      filters.push({ scientific_name: { $ilike: like } });
      // For array contains in Postgres with MikroORM
      filters.push({ aliases: { $contains: [keyword] } });
    }

    const where = filters.length > 0 ? { $or: filters } : {};

    return this.repository.find(where, {
      orderBy: { name_en: 'asc' },
    });
  }

  // Override save to handle upsert by name
  override async save(entity: FishSpecies): Promise<FishSpecies> {
    if (entity.exists) {
      return this.update(entity.id, entity);
    }

    // Check for existing by name_en before creating
    const existing = await this.repository.findOne({ name_en: entity.name_en });

    if (existing) {
      // Logic for upsert: update existing if found by name
      // Use wrap(existing).assign(entity) but skip ID and timestamps if needed
      // entity is a new instance with data.
      // We want to merge entity's data into existing.
      // Using assign(entity) might copy undefined props if strict?
      // MikroORM assign is usually smart.

      // However, entity passed in is an Entity object, not a POJO.
      // Converting to POJO first might be safer if assign expects DTO.
      const data = entity.toJSON(); // assuming toJSON returns clean data
      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;

      // Re-assign entity props to existing
      this.em.assign(existing, data);
      await this.em.flush();
      return existing;
    }

    return this.create(entity);
  }

  async generateContent(prompt: string, config: GenerateContentConfig): Promise<string> {

    const groundingTool = {
      googleSearch: {},
    }
    // console.log(prompt, config)
    const response = await this.aiClient.generateContent(prompt, {
      systemInstruction: config.systemInstruction,
      responseMimeType: 'application/json',
      responseJsonSchema: config.jsonSchema,
      tools: [
        groundingTool
      ]
    });

    if (!response.text) {
      throw new Error('AI model returned empty response');
    }
    if (response.candidates && response.candidates.length > 0) {

      this.logger.log(response.candidates[0]);
    }
    return response.text;
  }
}
