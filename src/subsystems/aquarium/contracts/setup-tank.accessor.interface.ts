export interface GenerateContentConfig {
  jsonSchema: object;
  systemInstruction?: string;
}

export interface ISetupTankAccessor {
  generateContent(
    prompt: string,
    config: GenerateContentConfig,
  ): Promise<string>;
}

export const SETUP_TANK_ACCESSOR = Symbol('ISetupTankAccessor');
